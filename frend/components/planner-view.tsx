"use client";

import React, { useState, useEffect } from "react";
import LiveTripNavigation from "./live-view";
import { Sparkles, Calendar, DollarSign, Users, Compass, AlertCircle, Check, Star } from "lucide-react";

export default function PlannerView() {
  // State variables for inputs
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookingStatus, setBookingStatus] = useState<{[key: string]: 'idle' | 'booking' | 'booked'}>({});
  const [startDate, setStartDate] = useState("2026-10-15");
  const [endDate, setEndDate] = useState("2026-10-22");
  const [budget, setBudget] = useState(3500);
  const [travelers, setTravelers] = useState(2);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([
    "Cultural",
    "Nature",
    "Luxury",
  ]);

  const [loading, setLoading] = useState(false);
  const [tripResult, setTripResult] = useState("");

  // Insights state
  const [insights, setInsights] = useState({
    bestSeason: "Autumn (Oct - Nov)",
    avgTemp: "15°C / 59°F",
    crowdLevel: "Moderate to High",
    advisory: "Kyoto is famous for fall foliage. Plan temple visits in the early mornings. Consider booking bullet train passes at least 30 days in advance.",
  });

  const preferencesList = [
    "Adventure",
    "Nature",
    "Food",
    "Luxury",
    "Cultural",
    "Nightlife",
    "Relaxing",
    "Historical",
  ];

  // Dynamic updates based on destination input
  useEffect(() => {
    const dest = destination.toLowerCase().trim();
    if (dest.includes("paris")) {
      setInsights({
        bestSeason: "Spring (Apr - May)",
        avgTemp: "14°C / 57°F",
        crowdLevel: "High (Peak season)",
        advisory: "Paris museum pass is highly recommended. Book Eiffel Tower summit tickets 60 days early. Expect light evening showers.",
      });
    } else if (dest.includes("cairo")) {
      setInsights({
        bestSeason: "Winter (Nov - Feb)",
        avgTemp: "22°C / 72°F",
        crowdLevel: "Moderate",
        advisory: "Perfect desert weather. Respect local dress codes. Fridays are holy days, so shops may open late. pyramids are best seen at sunrise.",
      });
    } else if (dest.includes("oslo")) {
      setInsights({
        bestSeason: "Summer (Jun - Aug)",
        avgTemp: "18°C / 64°F",
        crowdLevel: "Low to Moderate",
        advisory: "Extremely safe and walkable. High living costs—pre-book cards for transport. Visit the Vigeland Park during long daylight hours.",
      });
    } else if (dest.includes("tokyo")) {
      setInsights({
        bestSeason: "Spring (Mar - Apr)",
        avgTemp: "16°C / 61°F",
        crowdLevel: "Very High",
        advisory: "Cherry blossom season brings extreme crowds. Carry cash as some older shops don't accept cards. Purchase Suica/Pasmo transit cards early.",
      });
    } else if (dest.includes("london")) {
      setInsights({
        bestSeason: "Late Spring (May - Jun)",
        avgTemp: "17°C / 63°F",
        crowdLevel: "High",
        advisory: "Carry a light umbrella regardless of forecast. The Underground is the fastest transport. Museums are mostly free, but book slots online.",
      });
    } else {
      // Default fallback fallback
      setInsights({
        bestSeason: "Spring / Autumn",
        avgTemp: "19°C / 66°F",
        crowdLevel: "Moderate",
        advisory: `AI suggests preparing for multi-layered outfits. Pre-booking accommodation for ${destination || "your destination"} is recommended at least 45 days in advance.`,
      });
    }
  }, [destination]);

  const togglePreference = (pref: string) => {
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== pref));
    } else {
      setSelectedPrefs([...selectedPrefs, pref]);
    }
  };

  const handleCreateJourney = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setTripResult("");
      setHotels([]);

      const response = await fetch(
        "http://localhost:8000/plan-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            place: destination,
            start_date: startDate,
            end_date: endDate,
            budget: budget,
            travelers: travelers,
            preferences: selectedPrefs,
          }),
        }
      );

      const data = await response.json();

      setTripResult(data.itinerary);
      setHotels(data.hotels || []);
      setBookingStatus({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async (hotelName: string, price: string) => {
    setBookingStatus((prev) => ({ ...prev, [hotelName]: "booking" }));
    try {
      const response = await fetch("http://localhost:8000/api/book-hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotel_name: hotelName,
          destination: destination,
          price: price,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setBookingStatus((prev) => ({ ...prev, [hotelName]: "booked" }));
      } else {
        alert("Booking failed. Please try again.");
        setBookingStatus((prev) => ({ ...prev, [hotelName]: "idle" }));
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error connecting to booking agent.");
      setBookingStatus((prev) => ({ ...prev, [hotelName]: "idle" }));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-slate-50 font-bold tracking-tight mb-2">
          Tell me your dream journey
        </h1>
        <p className="text-slate-400 text-sm font-sans">
          Answer a few questions, and our travel algorithms will synthesize a custom itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Area (Left 2/3) */}
        <form
          onSubmit={handleCreateJourney}
          className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl space-y-6"
        >
          {/* Destination */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Destination Location
            </label>
            <div className="relative">
              <Compass className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Cairo, Egypt or Paris, France"
                className="w-full bg-[#050810] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Try typing "Paris", "Cairo", "Oslo", or "Tokyo" to see the AI Insights change live.
            </p>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#050810] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Return Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#050810] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Estimated Budget (USD)
              </label>
              <span className="text-sm font-bold text-yellow-400 flex items-center">
                <DollarSign className="w-4 h-4 shrink-0" />
                {budget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$500</span>
              <span>$7,500</span>
              <span>$15,000+</span>
            </div>
          </div>

          {/* Travelers Counter */}
          <div className="flex items-center justify-between p-4 bg-[#050810]/75 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <div>
                <span className="block text-sm font-bold text-slate-200">Travelers</span>
                <span className="block text-xs text-slate-500">Number of guests in reservation</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-200 w-4 text-center">
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => setTravelers(travelers + 1)}
                className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Travel Preferences
            </label>
            <div className="flex flex-wrap gap-2.5">
              {preferencesList.map((pref) => {
                const isSelected = selectedPrefs.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                      isSelected
                        ? "bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-md shadow-yellow-400/5"
                        : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create My Journey</span>
          </button>
        </form>

        {/* AI Insights Panel (Right 1/3) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-yellow-400 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-serif text-lg font-bold text-slate-100">
                AI Travel Insights
              </h3>
            </div>

            {/* Best Season */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Best Season to Visit
              </span>
              <div className="text-sm font-semibold text-slate-200">
                ☀️ {insights.bestSeason}
              </div>
            </div>

            {/* Avg Temp */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Avg. Temperature
              </span>
              <div className="text-sm font-semibold text-slate-200">
                🌡️ {insights.avgTemp}
              </div>
            </div>

            {/* Crowd Level */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Crowd Density
              </span>
              <div className="text-sm font-semibold text-slate-200">
                👥 {insights.crowdLevel}
              </div>
            </div>

            {/* Advisory */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-yellow-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>AI Travel Advisory</span>
              </div>
              <div className="bg-[#050810]/55 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
                {insights.advisory}
              </div>
            </div>
          </div>

          {/* Quick tip box */}
          <div className="bg-slate-900/20 border border-slate-800 p-4 rounded-xl flex gap-3 text-xs text-slate-400">
            <span className="text-lg">💡</span>
            <span>
              Insights are calculated based on climate data, global traveler reports, and upcoming seasonal holidays.
            </span>
          </div>
        </div>
      </div>
      {loading && (
  <div className="glass-panel p-6 rounded-2xl">
    <p className="text-slate-200">
      Generating your itinerary...
    </p>
  </div>
)}



{tripResult && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Itinerary Column */}
    <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl space-y-6">
      <h2 className="font-serif text-2xl font-bold text-yellow-400 mb-4">
        Your Customized Travel Itinerary
      </h2>
      <pre className="whitespace-pre-wrap text-slate-300 text-xs md:text-sm font-sans leading-relaxed">
        {tripResult}
      </pre>
      
      {/* Live navigation section */}
      <div className="pt-6 border-t border-slate-800">
        <LiveTripNavigation />
      </div>
    </div>

    {/* Booking Agent Hotel Options */}
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-yellow-400 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="font-serif text-lg font-bold text-slate-100">
            Booking Agent Matches
          </h3>
        </div>

        <div className="space-y-4">
          {hotels.map((hotel, idx) => {
            const status = bookingStatus[hotel.name] || 'idle';
            return (
              <div key={idx} className="bg-[#050810]/75 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-base font-bold text-slate-50 max-w-[70%] leading-snug">{hotel.name}</h4>
                  <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20 shrink-0">
                    {hotel.price}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{hotel.rating}</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  {hotel.description}
                </p>

                {hotel.amenities && (
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.map((a: string, i: number) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  {hotel.booking_link && (
                    <a
                      href={hotel.booking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-xs font-semibold text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-4 py-2.5 rounded-xl flex-1 transition-all"
                    >
                      Details
                    </a>
                  )}
                  
                  <button
                    disabled={status === 'booking' || status === 'booked'}
                    onClick={() => handleBookHotel(hotel.name, hotel.price)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex-1 flex items-center justify-center gap-1.5 transition-all ${
                      status === 'booked' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : status === 'booking'
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 cursor-wait'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 shadow-md shadow-yellow-400/5'
                    }`}
                  >
                    {status === 'booked' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Booked</span>
                      </>
                    ) : status === 'booking' ? (
                      <span>Booking...</span>
                    ) : (
                      <span>Book Hotel</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          {hotels.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No hotel recommendations found for this budget.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
