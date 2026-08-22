"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Users, IndianRupee, ExternalLink, X, MapPin, Loader2, FileDown } from "lucide-react";
import { useAuth } from "./auth-provider";
import MarkdownFormatter from "./markdown-formatter";
import { exportItineraryToPDF } from "../lib/pdf-exporter";

interface SavedTrip {
  id: number;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  travelers: number;
  preferences: string;
  itinerary: string;
  created_at: string;
}

export default function SavedView() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);
  const [filter, setFilter] = useState("All Trips");

  useEffect(() => {
    async function fetchSavedTrips() {
      if (!user) return;
      try {
        const name = user.displayName || user.email?.split("@")[0] || "Guest User";
        const response = await fetch(`http://localhost:8000/api/saved-trips?user_name=${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error("Failed to load saved trips");
        }
        const data = await response.json();
        setTrips(data.trips || []);
      } catch (err: any) {
        console.error("Error loading saved trips:", err);
        setErrorMsg("Failed to retrieve your saved travel vault. Please ensure the backend is online.");
      } finally {
        setLoading(false);
      }
    }
    fetchSavedTrips();
  }, [user]);

  const getTripThumbnail = (destination: string) => {
    // Beautiful, static travel diary & map background for all curated plans
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";
  };

  const getTripDatesLabel = (start: string, end: string) => {
    if (!start || !end) return "Flexible Dates";
    try {
      const formatDate = (dateStr: string) => {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return dateStr;
      };
      return `${formatDate(start)} - ${formatDate(end)}, ${start.split("-")[0]}`;
    } catch {
      return `${start} - ${end}`;
    }
  };

  const getTripStatus = (startDateStr: string) => {
    if (!startDateStr) return "Upcoming";
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parts = startDateStr.split("-");
      if (parts.length === 3) {
        const start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (start < today) {
          return "Completed";
        }
      }
    } catch {}
    return "Upcoming";
  };

  const getStatusStyle = (status: string) => {
    if (status === "Completed") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    return "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20";
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter === "All Trips") return true;
    return getTripStatus(trip.start_date) === filter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto min-h-[70vh] pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-slate-50 font-bold tracking-tight mb-2">
            Your Travel Vault
          </h1>
          <p className="text-slate-400 text-sm font-sans">
            Access your curated itineraries, completed journeys, and upcoming expeditions.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg px-3 py-2 text-slate-350 focus:outline-none focus:border-yellow-400/50 cursor-pointer"
          >
            <option value="All Trips">All Trips</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex justify-between items-center animate-fade-in select-text">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg("")} className="font-bold hover:text-white transition-colors pl-2">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          <span className="text-xs text-slate-400">Loading your itineraries from PostgreSQL...</span>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-[#070b16]/30 border border-slate-800/60 rounded-2xl p-6 max-w-md mx-auto">
          <MapPin className="w-10 h-10 text-slate-650 mx-auto mb-4" />
          <h3 className="text-slate-100 font-serif font-bold text-base mb-1">No trips found</h3>
          <p className="text-slate-455 text-xs font-sans mb-5 leading-relaxed">
            {filter === "All Trips" 
              ? "You haven't planned any travels yet. Go to the planner page to create your first journey!" 
              : `You don't have any saved "${filter}" trips matching this filter.`}
          </p>
          {filter === "All Trips" && (
            <a
              href="/plan"
              className="inline-flex bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              Plan a Trip
            </a>
          )}
        </div>
      ) : (
        /* Grid of cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const status = getTripStatus(trip.start_date);
            return (
              <div
                key={trip.id}
                className="glass-panel rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Half (Image) */}
                <div className="h-44 relative overflow-hidden shrink-0">
                  <img
                    src={getTripThumbnail(trip.destination)}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Bottom Half */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5 bg-[#0b1120]/30">
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-bold text-slate-50 tracking-tight leading-snug">
                      {trip.destination}
                    </h3>
                    
                    {/* Details */}
                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{getTripDatesLabel(trip.start_date, trip.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>{trip.travelers} {trip.travelers === 1 ? "Traveler" : "Travelers"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & View Button */}
                  <div className="space-y-4 pt-3 border-t border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Estimated Budget</span>
                      <span className="text-base font-bold text-slate-50 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-yellow-400 mr-0.5" />
                        {Number(trip.budget).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md shadow-yellow-400/5 hover:shadow-yellow-400/10 active:scale-[0.99]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Trip</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Itinerary Modal View Overlay */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-hidden glass-panel flex flex-col rounded-2xl border border-slate-800 animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-[#070b16]/95">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100 leading-snug">
                  {selectedTrip.destination}
                </h3>
                <p className="text-[10px] text-slate-455 uppercase font-bold tracking-wider mt-0.5">
                  {getTripDatesLabel(selectedTrip.start_date, selectedTrip.end_date)} • {selectedTrip.travelers} {selectedTrip.travelers === 1 ? "Traveler" : "Travelers"}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-[#050810]/40 font-sans text-xs md:text-sm text-slate-300 leading-relaxed select-text">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Curated Plan ID</span>
                  <span className="font-mono text-[10px] text-yellow-400">#TRIP-{selectedTrip.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Trip Interests</span>
                  <span className="text-xs text-slate-200 capitalize">{selectedTrip.preferences.replace(/,/g, " • ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Allocated Budget</span>
                  <span className="text-xs font-bold text-slate-200 flex items-center">
                    <IndianRupee className="w-3 h-3 text-slate-400 mr-0.5" />
                    {Number(selectedTrip.budget).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Itinerary Contents */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-yellow-400 border-b border-slate-850 pb-2">
                  Curated Travel Itinerary
                </h4>
                <div className="max-w-full">
                  <MarkdownFormatter content={selectedTrip.itinerary || "No detailed itinerary text was logged for this trip plan."} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-850 bg-[#070b16]/95 flex justify-end gap-3">
              <button
                onClick={() => exportItineraryToPDF(selectedTrip.destination, selectedTrip.itinerary)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => setSelectedTrip(null)}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
