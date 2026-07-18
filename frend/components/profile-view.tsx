"use client";

import React from "react";
import { Globe, Map, Compass, ShieldCheck, Award, Heart, Sparkles } from "lucide-react";

export default function ProfileView() {
  const stats = [
    { label: "Countries Visited", value: "32", icon: Globe, color: "text-blue-400 bg-blue-500/10" },
    { label: "Cities Explored", value: "87", icon: Map, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Trips Logged", value: "41", icon: Compass, color: "text-amber-400 bg-amber-500/10" },
    { label: "Distance Traveled", value: "142k km", icon: ShieldCheck, color: "text-cyan-400 bg-cyan-500/10" },
  ];

  const achievements = [
    { title: "Peak Seeker", desc: "Climbed 5 mountains above 3000m altitude.", icon: "🏔️", date: "May 2024" },
    { title: "Food Hunter", desc: "Visited 20 Michelin-starred dining spots.", icon: "🍳", date: "Aug 2025" },
    { title: "Ancient Explorer", desc: "Visited 10 UNESCO World Heritage sites.", icon: "🏛️", date: "Nov 2025" },
    { title: "Deep Diver", desc: "Completed 15 scuba dives in open oceans.", icon: "🤿", date: "Jan 2026" },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Profile Info */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />
        
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full border-2 border-yellow-400 bg-slate-800 flex items-center justify-center font-serif text-3xl font-extrabold text-yellow-400 shadow-xl shadow-yellow-400/10 shrink-0">
          RS
        </div>
        
        {/* Details */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h1 className="font-serif text-3xl text-slate-50 font-bold tracking-tight">
              Rudra Suthar
            </h1>
            <span className="self-center md:self-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
              Elite Voyager
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-xl font-sans">
            Wanderer at heart, curious about culinary heritage, historical architecture, and luxury wellness escapes.
          </p>
          <div className="text-xs text-slate-500">
            Member since: September 2023 • Verified Explorer
          </div>
        </div>
      </div>

      {/* Stat Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl flex items-center gap-4 border border-slate-800/80 bg-[#0b1120]/15">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  {stat.label}
                </span>
                <span className="block text-xl font-extrabold text-slate-50 mt-0.5">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Persona */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl bg-gradient-to-r from-yellow-400/[0.02] via-[#0b1120]/60 to-[#050814]/10 border-l-4 border-l-yellow-400 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">AI Persona Summary</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-slate-100">
            Curious Luxury Explorer
          </h3>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-4xl">
            Rudra Suthar prioritizes deep cultural immersion, culinary history, and luxury wellness retreats. 
            He prefers blending high-end accommodations with experiential learning, such as archaeological expeditions 
            or organic farming masterclasses. Has a preference for off-the-beaten-path locations with high comfort indices, 
            moderate temperatures, and rich history.
          </p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <Award className="w-5 h-5 text-yellow-400" />
          <h2 className="font-serif text-xl font-bold text-slate-100">
            Explorer Milestones
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl bg-[#0b1120]/25 space-y-4 border border-slate-800/60 flex flex-col justify-between group hover:border-slate-700/80 transition-colors">
              <div className="space-y-2">
                <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(250,204,21,0.15)] group-hover:scale-110 transition-transform duration-300 w-fit">
                  {item.icon}
                </div>
                <h4 className="font-sans text-sm font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {item.desc}
                </p>
              </div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Earned {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
