"use client";

import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

interface BudgetSliderProps {
  onChange: (value: number) => void;
  initialValue?: number;
}

export default function BudgetSlider({ onChange, initialValue = 15000 }: BudgetSliderProps) {
  const [budget, setBudget] = useState(initialValue);

  const min = 5000;
  const max = 250000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBudget(val);
    onChange(val);
  };

  const getPercentage = () => {
    return ((budget - min) / (max - min)) * 100;
  };

  const formatCurrency = (val: number) => {
    if (val >= max) {
      return "₹2,50,000+";
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-4">
      {/* Slider Header */}
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Estimated Budget (INR)
        </label>
        <span className="text-sm font-bold text-yellow-400 flex items-center bg-yellow-400/5 px-2.5 py-1 rounded-lg border border-yellow-400/10">
          <IndianRupee className="w-3.5 h-3.5 shrink-0 text-yellow-400/80 mr-0.5" />
          {formatCurrency(budget)}
        </span>
      </div>

      {/* Styled Slider Track Container */}
      <div className="relative pt-2 pb-6">
        <div className="relative w-full h-1.5 bg-slate-800 rounded-full">
          {/* Active portion */}
          <div
            className="absolute top-0 left-0 h-1.5 bg-yellow-400 rounded-full"
            style={{ width: `${getPercentage()}%` }}
          />
          {/* Native range input overlapping the styled track */}
          <input
            type="range"
            min={min}
            max={max}
            step="1000"
            value={budget}
            onChange={handleChange}
            className="absolute top-0 left-0 w-full h-1.5 opacity-0 cursor-pointer"
          />
          {/* Custom Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-yellow-400 shadow-md shadow-yellow-450/40 pointer-events-none"
            style={{ left: `calc(${getPercentage()}% - 8px)` }}
          />
        </div>

        {/* Ticks & Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-sans mt-3">
          <span>₹5,000</span>
          <span>₹75,000</span>
          <span>₹1,50,000</span>
          <span>₹2,50,000+</span>
        </div>
      </div>
    </div>
  );
}
