"use client";

import React from "react";
import { Search, Compass, Bookmark, MapPin, Star, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardViewProps {
  onPlanTrip?: () => void;
  onViewSaved?: () => void;
}

export default function DashboardView({ onPlanTrip, onViewSaved }: DashboardViewProps) {
  const router = useRouter();

  const handlePlanTrip = () => {
    if (onPlanTrip) {
      onPlanTrip();
    } else {
      router.push("/plan");
    }
  };

  const handleViewSaved = () => {
    if (onViewSaved) {
      onViewSaved();
    } else {
      router.push("/saved");
    }
  };
  const recommendations = [
    {
      id: 1,
      title: "Kyoto, Japan",
      price: "$1,850",
      duration: "7 Days",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      tags: ["Cultural", "Hidden Gems", "Zen"],
    },
    {
      id: 2,
      title: "Santorini, Greece",
      price: "$2,400",
      duration: "5 Days",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      tags: ["Luxury", "Coastal", "Sunset Views"],
    },
    {
      id: 3,
      title: "Reykjavík, Iceland",
      price: "$2,100",
      duration: "6 Days",
      image: "https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=600&q=80",
      tags: ["Nature", "Adventure", "Northern Lights"],
    },
    {
      id: 4,
      title: "Amalfi Coast, Italy",
      price: "$2,950",
      duration: "8 Days",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
      tags: ["Romantic", "Luxury", "Foodie"],
    },
  ];

  const trending = [
    {
      id: 1,
      title: "Swiss Alps Scenic Journey",
      location: "Zermatt, Switzerland",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      rating: "4.9",
      reviews: "1.2k reviews",
      description: "Experience the ultimate alpine luxury and high-altitude hiking paths around the Matterhorn.",
    },
    {
      id: 2,
      title: "Bora Bora Lagoon Retreat",
      location: "French Polynesia",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: "4.8",
      reviews: "950 reviews",
      description: "Stay in premium overwater bungalows and snorkel with marine life in crystal clear turquoise lagoons.",
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header greeting */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl text-slate-50 font-bold tracking-tight mb-2">
          Ready, Rudra?
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-sans">
          Your AI Travel Concierge is primed. Let's design your next extraordinary escape.
        </p>
      </div>

      {/* Global Search */}
      <div className="relative max-w-3xl">
        <div className="flex items-center w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full py-2 pl-6 pr-2 shadow-2xl">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search destinations, travel themes, or itineraries..."
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-lg shadow-yellow-400/10 shrink-0">
            Explore
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left card: Plan Trip */}
        <button
          onClick={handlePlanTrip}
          className="group relative h-44 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-950 border border-blue-900/40 p-6 flex flex-col justify-between text-left overflow-hidden transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-100 mb-1 group-hover:text-yellow-400 transition-colors">
              Plan New Trip
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Use generative AI to configure bespoke day-by-day travel timelines.
            </p>
          </div>
        </button>

        {/* Right card: Saved Trips */}
        <button
          onClick={handleViewSaved}
          className="group relative h-44 rounded-2xl bg-gradient-to-r from-amber-950 to-slate-950 border border-amber-900/40 p-6 flex flex-col justify-between text-left overflow-hidden transition-all duration-300 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-100 mb-1 group-hover:text-yellow-400 transition-colors">
              Saved Trips
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Access your personal travel vault of past and upcoming journeys.
            </p>
          </div>
        </button>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            AI Personalized Recommendations
          </h2>
          <span className="text-xs text-yellow-400 font-semibold tracking-wider uppercase cursor-pointer hover:underline">
            See All
          </span>
        </div>
        
        {/* Horizontal Scrolling section */}
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="w-72 shrink-0 glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
            >
              {/* Card Image */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-700/50 text-yellow-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Card Details */}
              <div className="p-4 space-y-3 bg-[#0b1120]/45">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{item.title}</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-800/60 pt-3">
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500 mr-1" />
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex items-center text-sm font-bold text-slate-50">
                    <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{item.price.replace("$", "")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Destinations */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-slate-100 mb-6">
          Trending Journeys
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trending.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-slate-700 transition-colors duration-300 group"
            >
              {/* Left aspect image */}
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/20 sm:to-transparent" />
              </div>
              {/* Right contents */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400">
                      Trending Spot
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-slate-200">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-50 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span>📍 {item.location}</span>
                  <span className="text-[10px] text-slate-500">{item.reviews}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
