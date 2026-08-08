"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

export interface Destination {
  name: string;
  lat: number;
  lng: number;
  country: string;
  bestSeason: string;
  avgTemp: string;
  crowdLevel: string;
  advisory: string;
  safetyScore: number;
  currency: string;
  language: string;
  timezone: string;
}

export const popularDestinations: Destination[] = [
  {
    name: "Kyoto, Japan",
    lat: 35.0116,
    lng: 135.7681,
    country: "Japan",
    bestSeason: "Autumn (Oct - Nov)",
    avgTemp: "15°C / 59°F",
    crowdLevel: "Moderate to High",
    advisory: "Famous for fall foliage. Plan early morning temple visits.",
    safetyScore: 95,
    currency: "JPY (¥)",
    language: "Japanese",
    timezone: "GMT+9",
  },
  {
    name: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    country: "Japan",
    bestSeason: "Spring (Mar - Apr)",
    avgTemp: "16°C / 61°F",
    crowdLevel: "Very High",
    advisory: "Cherry blossoms bring high crowds. Carry cash for small vendors.",
    safetyScore: 94,
    currency: "JPY (¥)",
    language: "Japanese",
    timezone: "GMT+9",
  },
  {
    name: "Paris, France",
    lat: 48.8566,
    lng: 2.3522,
    country: "France",
    bestSeason: "Spring (Apr - May)",
    avgTemp: "14°C / 57°F",
    crowdLevel: "High (Peak season)",
    advisory: "Museum pass recommended. Book Eiffel Tower summit tickets early.",
    safetyScore: 82,
    currency: "EUR (€)",
    language: "French",
    timezone: "GMT+2",
  },
  {
    name: "Cairo, Egypt",
    lat: 30.0444,
    lng: 31.2357,
    country: "Egypt",
    bestSeason: "Winter (Nov - Feb)",
    avgTemp: "22°C / 72°F",
    crowdLevel: "Moderate",
    advisory: "Perfect desert weather. Pyramids are best seen at sunrise.",
    safetyScore: 78,
    currency: "EGP (E£)",
    language: "Arabic",
    timezone: "GMT+3",
  },
  {
    name: "Oslo, Norway",
    lat: 59.9139,
    lng: 10.7522,
    country: "Norway",
    bestSeason: "Summer (Jun - Aug)",
    avgTemp: "18°C / 64°F",
    crowdLevel: "Low to Moderate",
    advisory: "Extremely safe and walkable. Pre-book transport cards.",
    safetyScore: 92,
    currency: "NOK (kr)",
    language: "Norwegian",
    timezone: "GMT+2",
  },
  {
    name: "London, United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
    country: "United Kingdom",
    bestSeason: "Late Spring (May - Jun)",
    avgTemp: "17°C / 63°F",
    crowdLevel: "High",
    advisory: "Carry an umbrella. Underground is the fastest transport.",
    safetyScore: 85,
    currency: "GBP (£)",
    language: "English",
    timezone: "GMT+1",
  },
  {
    name: "Bali, Indonesia",
    lat: -8.4095,
    lng: 115.1889,
    country: "Indonesia",
    bestSeason: "Dry Season (May - Sep)",
    avgTemp: "28°C / 82°F",
    crowdLevel: "High",
    advisory: "Rent a scooter for flexibility. Wear modest clothing in temples.",
    safetyScore: 80,
    currency: "IDR (Rp)",
    language: "Indonesian",
    timezone: "GMT+8",
  },
  {
    name: "Rome, Italy",
    lat: 41.9028,
    lng: 12.4964,
    country: "Italy",
    bestSeason: "Spring (Apr - May)",
    avgTemp: "19°C / 66°F",
    crowdLevel: "Very High",
    advisory: "Book Colosseum tickets online in advance. Drink from city fountains.",
    safetyScore: 84,
    currency: "EUR (€)",
    language: "Italian",
    timezone: "GMT+2",
  },
  {
    name: "New York, United States",
    lat: 40.7128,
    lng: -74.006,
    country: "United States",
    bestSeason: "Autumn (Sep - Nov)",
    avgTemp: "18°C / 64°F",
    crowdLevel: "Extremely High",
    advisory: "Buy MetroCard for subway. Broadway shows are cheaper at TKTS booths.",
    safetyScore: 81,
    currency: "USD ($)",
    language: "English",
    timezone: "GMT-4",
  },
  {
    name: "Sydney, Australia",
    lat: -33.8688,
    lng: 151.2093,
    country: "Australia",
    bestSeason: "Spring (Sep - Nov)",
    avgTemp: "21°C / 70°F",
    crowdLevel: "Moderate",
    advisory: "Use sunscreen. Ferries are public transport with amazing views.",
    safetyScore: 90,
    currency: "AUD ($)",
    language: "English",
    timezone: "GMT+10",
  },
];

interface DestinationSearchProps {
  onSelect: (dest: Destination) => void;
  defaultValue?: string;
}

export default function DestinationSearch({ onSelect, defaultValue = "" }: DestinationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions dynamically from Geoapify via backend API
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    // Check if the query is an exact match to avoid refetching on click
    const isExactMatch = suggestions.some(d => d.name === query) || popularDestinations.some(d => d.name === query);
    if (isExactMatch) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/search-destination?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (dest: Destination) => {
    setQuery(dest.name);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(dest);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
        Destination Location
      </label>
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (query.trim().length > 0) {
              setShowDropdown(true);
            } else {
              // Show all options if empty
              setSuggestions(popularDestinations);
              setShowDropdown(true);
            }
          }}
          placeholder="Where do you want to go?"
          className="w-full bg-[#050810] border border-slate-800 rounded-xl py-3.5 pl-11 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all"
          required
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-30 w-full mt-1.5 bg-[#0b101d] border border-slate-800/80 rounded-xl shadow-2xl max-h-60 overflow-y-auto scrollbar-thin backdrop-blur-md">
          {suggestions.map((dest, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(dest)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm text-slate-300 hover:text-yellow-400 hover:bg-slate-900/40 border-b border-slate-800/30 last:border-0 transition-colors"
            >
              <MapPin className="w-4 h-4 shrink-0 text-yellow-400/80" />
              <div>
                <span className="font-semibold block">{dest.name}</span>
                <span className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">
                  {dest.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-[10px] text-slate-500">
        Try "Kyoto, Japan", "Bali, Indonesia" or "Paris, France" to trigger live maps and insights.
      </p>
    </div>
  );
}
