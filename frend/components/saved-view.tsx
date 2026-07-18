"use client";

import React from "react";
import { Calendar, Users, DollarSign, ExternalLink } from "lucide-react";

export default function SavedView() {
  const trips = [
    {
      id: 1,
      destination: "Cairo & The Pyramids",
      dates: "Nov 12 - Nov 19, 2026",
      travelers: 2,
      price: "$3,200",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      destination: "Amalfi Coast Escape",
      dates: "Jun 20 - Jun 27, 2026",
      travelers: 3,
      price: "$4,600",
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      destination: "Kyoto Autumn Temple Tour",
      dates: "Oct 15 - Oct 22, 2026",
      travelers: 2,
      price: "$3,800",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      destination: "Tokyo Cyberpunk & Neon",
      dates: "Apr 02 - Apr 09, 2025",
      travelers: 1,
      price: "$2,850",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Upcoming":
      default:
        return "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20";
    }
  };

  const handleViewTrip = (dest: string) => {
    alert(`📂 Opening details for saved trip to: ${dest}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
          <select className="bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-yellow-400/50">
            <option>All Trips</option>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="glass-panel rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top Half (Image) */}
            <div className="h-44 relative overflow-hidden shrink-0">
              <img
                src={trip.image}
                alt={trip.destination}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(trip.status)}`}>
                  {trip.status}
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
                    <span>{trip.dates}</span>
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
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Total Price</span>
                  <span className="text-base font-bold text-slate-50 flex items-center">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    {trip.price.replace("$", "")}
                  </span>
                </div>

                <button
                  onClick={() => handleViewTrip(trip.destination)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md shadow-yellow-400/5 hover:shadow-yellow-400/10 active:scale-[0.99]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Trip</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
