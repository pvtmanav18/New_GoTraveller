"use client";

import React from "react";
import { Home, Compass, Bookmark, Navigation, User, Plane } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "plan", label: "Plan Trip", icon: Compass },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "live", label: "Live Trip", icon: Navigation },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-full border-r border-slate-800 bg-[#070b16] flex flex-col z-20">
      {/* Top Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <Plane className="w-5 h-5 text-slate-950 transform -rotate-45" />
        </div>
        <div>
          <span className="font-serif text-lg font-bold tracking-wide text-slate-100">
            Go<span className="text-yellow-400 font-sans font-extrabold">Traveller</span>
          </span>
          <span className="block text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
            AI Concierge
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
                isActive
                  ? "text-yellow-400 bg-slate-900/50 border-l-4 border-yellow-400 pl-3"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border-l-4 border-transparent pl-3"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-yellow-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              <span>{item.label}</span>
              
              {/* Subtle hover background highlight */}
              <span
                className={`absolute inset-0 rounded-lg -z-10 bg-gradient-to-r from-yellow-400/5 to-transparent transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer / Account status */}
      <div className="p-4 border-t border-slate-800 bg-[#050810]/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-yellow-400">
            RS
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Rudra Suthar</div>
            <div className="text-[10px] text-yellow-400/90 font-medium">Elite Voyager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
