"use client";

import React from "react";
import { Compass, Palmtree, Landmark, Crown, Check } from "lucide-react";

interface TripType {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

const tripTypes: TripType[] = [
  { id: "adventure", title: "Adventure", icon: Compass },
  { id: "relaxation", title: "Relaxation", icon: Palmtree },
  { id: "cultural", title: "Culture", icon: Landmark },
  { id: "luxury", title: "Luxury", icon: Crown },
];

interface TripTypeCardsProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function TripTypeCards({ selectedIds, onChange }: TripTypeCardsProps) {
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Trip Types & Interests
      </label>
      <div className="grid grid-cols-4 gap-2">
        {tripTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedIds.includes(type.id);

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleToggle(type.id)}
              className={`group text-center p-2 rounded-xl border bg-[#050810]/55 hover:bg-[#070c18] transition-all relative flex flex-col items-center justify-center gap-1 min-h-[70px] select-none ${
                isSelected
                  ? "border-yellow-400 shadow-md shadow-yellow-400/5 bg-[#080d19]"
                  : "border-slate-800/80 hover:border-slate-700/60"
              }`}
            >
              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center">
                  <Check className="w-2 h-2 stroke-[3]" />
                </div>
              )}

              {/* Icon */}
              <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-yellow-400" : "text-slate-400 group-hover:text-yellow-400"}`} />
              </div>

              {/* Title */}
              <span className="text-[9px] font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">
                {type.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
