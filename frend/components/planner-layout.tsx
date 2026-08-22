"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Navigation,
  Globe,
  Map,
  Compass,
  Car,
  Bus,
  Train,
  Plane,
  Building2,
  Palmtree,
  Tent,
  CheckCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bed,
  Home,
  Layers,
  Sun,
  User,
  Users,
  Star,
  Check,
  FileDown
} from "lucide-react";
import DestinationSearch, { Destination, popularDestinations } from "./destination-search";
import BudgetSlider from "./budget-slider";
import TripTypeCards from "./trip-type-cards";
import MapComponent from "./map";
import { useAuth } from "./auth-provider";
import MarkdownFormatter from "./markdown-formatter";
import { exportItineraryToPDF } from "../lib/pdf-exporter";

// Premium localized mock spots database supporting interactive modifications
const initialSpotsData: Record<string, ActivitySpot[]> = {
  "Kyoto, Japan": [
    {
      name: "The Thousand Kyoto",
      lat: 34.9875,
      lng: 135.7611,
      category: "hotel",
      rating: 4.8,
      description: "Zen-modern luxury retreat with sustainable architectural details.",
      photo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
      openingHours: "24/7 Check-in",
      entryFee: "$250/night",
      bestTime: "All Year",
      visitTime: "Overnight",
      distance: "0.2 km",
    },
    {
      name: "Gion Minami House",
      lat: 35.0021,
      lng: 135.7729,
      category: "hotel",
      rating: 4.4,
      description: "Cozy budget apartments in Kyoto's traditional Geisha district.",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      openingHours: "10:00 AM - 6:00 PM",
      entryFee: "$80/night",
      bestTime: "Spring",
      visitTime: "Overnight",
      distance: "0.4 km",
    },
    {
      name: "Ritz-Carlton Kyoto",
      lat: 35.0125,
      lng: 135.7725,
      category: "hotel",
      rating: 4.9,
      description: "Elite riverfront resort offering exceptional Japanese hospitality and luxury.",
      photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
      openingHours: "24/7 Check-in",
      entryFee: "$650/night",
      bestTime: "Autumn",
      visitTime: "Overnight",
      distance: "1.1 km",
    },
    {
      name: "Kinkaku-ji (Golden Pavilion)",
      lat: 35.0394,
      lng: 135.7292,
      category: "museum",
      rating: 4.9,
      description: "Zen temple covered in gold leaf overlooking mirror pond.",
      photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
      openingHours: "9:00 AM - 5:00 PM",
      entryFee: "¥500",
      bestTime: "Morning",
      visitTime: "1.5 hours",
      distance: "6.2 km",
    },
    {
      name: "Nishiki Market Street",
      lat: 35.005,
      lng: 135.7649,
      category: "restaurant",
      rating: 4.6,
      description: "Five blocks of shopping packed with local seafood and street skewers.",
      photo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
      openingHours: "10:00 AM - 6:00 PM",
      entryFee: "Free entry",
      bestTime: "12:00 PM",
      visitTime: "2 hours",
      distance: "0.8 km",
    },
    {
      name: "Kiyomizu-dera Temple",
      lat: 34.9949,
      lng: 135.785,
      category: "nature",
      rating: 4.9,
      description: "Scenic wooden temple set against lush green hillsides.",
      photo: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=400&q=80",
      openingHours: "6:00 AM - 6:00 PM",
      entryFee: "¥400",
      bestTime: "Sunset",
      visitTime: "2 hours",
      distance: "2.1 km",
    },
  ],
  "Tokyo, Japan": [
    {
      name: "Andaz Tokyo Toranomon Hills",
      lat: 35.6669,
      lng: 139.7486,
      category: "hotel",
      rating: 4.9,
      description: "Premium skyscraper luxury hotel with spectacular skyline views.",
      photo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
      openingHours: "24/7",
      entryFee: "$580/night",
      bestTime: "All Year",
      visitTime: "Overnight",
      distance: "Center",
    },
    {
      name: "Asakusa Capsule Inn",
      lat: 35.7118,
      lng: 139.7915,
      category: "hotel",
      rating: 4.2,
      description: "Sleek capsule design for budget-focused solo travelers.",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      openingHours: "24/7",
      entryFee: "$45/night",
      bestTime: "Summer",
      visitTime: "Overnight",
      distance: "5.1 km",
    },
    {
      name: "Senso-ji Temple",
      lat: 35.7148,
      lng: 139.7967,
      category: "museum",
      rating: 4.8,
      description: "Tokyo's oldest and most iconic ancient temple complex.",
      photo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
      openingHours: "6:00 AM - 5:00 PM",
      entryFee: "Free",
      bestTime: "Morning",
      visitTime: "1.5 hours",
      distance: "5.4 km",
    },
    {
      name: "Rokurinsha Ramen",
      lat: 35.6813,
      lng: 139.7678,
      category: "restaurant",
      rating: 4.7,
      description: "Famous dipping noodles in the heart of Tokyo Station.",
      photo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
      openingHours: "7:30 AM - 10:30 PM",
      entryFee: "¥1,300 Avg",
      bestTime: "Lunch",
      visitTime: "45 mins",
      distance: "Inside Station",
    },
  ],
};

export interface ActivitySpot {
  name: string;
  lat: number;
  lng: number;
  category: "hotel" | "restaurant" | "museum" | "attraction" | "nature" | "nightlife" | "hidden";
  rating: number;
  openingHours: string;
  entryFee: string;
  bestTime: string;
  description: string;
  photo: string;
  visitTime: string;
  distance: string;
}

export default function PlannerLayout() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Responsive design listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form State
  const [destination, setDestination] = useState<Destination>(popularDestinations[0]);
  const [startDate, setStartDate] = useState("2026-10-15");
  const [endDate, setEndDate] = useState("2026-10-22");
  
  // Travelers Stepper States
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelerDetails, setTravelerDetails] = useState({ adults: 1, children: 0, infants: 1 });

  const handleIncrementTraveler = (type: "adults" | "children" | "infants") => {
    setTravelerDetails((prev) => {
      const copy = { ...prev };
      if (type === "adults") copy.adults = Math.min(15, copy.adults + 1);
      if (type === "children") copy.children = Math.min(10, copy.children + 1);
      if (type === "infants") copy.infants = Math.min(5, copy.infants + 1);
      
      const tot = copy.adults + copy.children + copy.infants;
      setTravelersCount(tot);
      return copy;
    });
  };

  const handleDecrementTraveler = (type: "adults" | "children" | "infants") => {
    setTravelerDetails((prev) => {
      const copy = { ...prev };
      if (type === "adults") copy.adults = Math.max(0, copy.adults - 1);
      if (type === "children") copy.children = Math.max(0, copy.children - 1);
      if (type === "infants") copy.infants = Math.max(0, copy.infants - 1);

      const tot = copy.adults + copy.children + copy.infants;
      setTravelersCount(tot);
      return copy;
    });
  };

  const [budget, setBudget] = useState(15000);
  const [interests, setInterests] = useState<string[]>(["adventure", "cultural"]);
  const [duration, setDuration] = useState("7 Days");
  const [transport, setTransport] = useState<"walking" | "driving" | "flight" | "train" | "bus">("driving");
  const [accommodation, setAccommodation] = useState("Hotel");

  // Compact Filter Chips States
  const [activeChips, setActiveChips] = useState<string[]>([
    "Budget Friendly",
    "Hidden Gems"
  ]);

  const allChips = [
    "Budget Friendly",
    "Luxury",
    "Hidden Gems",
    "Avoid Crowds",
    "Nightlife",
    "Family Friendly",
    "Nature",
    "Food",
    "Photography",
    "Adventure",
    "Culture",
    "Shopping"
  ];

  const toggleChip = (chip: string) => {
    if (activeChips.includes(chip)) {
      setActiveChips(activeChips.filter(c => c !== chip));
    } else {
      setActiveChips([...activeChips, chip]);
    }
  };

  // Map Filter Overlay States
  const [showAttractions, setShowAttractions] = useState(true);
  const [showHotels, setShowHotels] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [mapStyle, setMapStyle] = useState<"dark" | "satellite">("dark");
  const [resetTrigger, setResetTrigger] = useState(0);

  // Generated Itinerary States
  const [loading, setLoading] = useState(false);
  const [spots, setSpots] = useState<ActivitySpot[]>([]);
  const [timelinePlan, setTimelinePlan] = useState<ActivitySpot[]>([]);
  const [tripResult, setTripResult] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [roadCoordinates, setRoadCoordinates] = useState<[number, number][]>([]);
  const [bookingStatus, setBookingStatus] = useState<{[key: string]: 'idle' | 'booking' | 'booked'}>({});
  const [errorMsg, setErrorMsg] = useState("");

  // Mobile View Toggles
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  // Month navigation: default to October 2026 (index 9)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const parseDate = (dStr: string) => {
    if (!dStr) return null;
    const parts = dStr.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || (start && end)) {
      setStartDate(formatDate(clickedDate));
      setEndDate("");
    } else if (clickedDate < start) {
      setStartDate(formatDate(clickedDate));
    } else {
      setEndDate(formatDate(clickedDate));
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calculateDaysCount = () => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (start && end) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 1;
  };

  const getDayClass = (day: number) => {
    const dateObj = new Date(currentYear, currentMonth, day);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (start && dateObj.getTime() === start.getTime()) {
      return "bg-yellow-400 text-slate-950 font-bold rounded-full relative z-10 shadow-md shadow-yellow-400/20";
    }
    if (end && dateObj.getTime() === end.getTime()) {
      return "bg-yellow-400 text-slate-950 font-bold rounded-full relative z-10 shadow-md shadow-yellow-400/20";
    }
    if (start && end && dateObj > start && dateObj < end) {
      return "bg-yellow-400/10 text-yellow-400 rounded-none hover:bg-yellow-400/20";
    }
    return "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100 rounded-full";
  };

  // Sync Initial Destination Center Coordinates
  useEffect(() => {
    if (tripResult) return;

    const mainSpot: ActivitySpot = {
      name: destination.name,
      lat: destination.lat,
      lng: destination.lng,
      category: "hidden",
      rating: 5.0,
      description: `Target center. Advisory: ${destination.advisory}`,
      photo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      openingHours: "24/7",
      entryFee: "N/A",
      bestTime: "Anytime",
      visitTime: "Full visit",
      distance: "0 km"
    };

    const filteredRecommendations = getInteractiveFilteredSpots();
    setSpots([mainSpot, ...filteredRecommendations]);
    setTimelinePlan([]);
  }, [destination, budget, interests, tripResult]);

  const getInteractiveFilteredSpots = (): ActivitySpot[] => {
    const list = initialSpotsData[destination.name] || [
      {
        name: `${destination.name} Palace`,
        lat: destination.lat + 0.003,
        lng: destination.lng - 0.002,
        category: "attraction",
        rating: 4.8,
        description: "Historic cultural building.",
        photo: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=400&q=80",
        openingHours: "9 AM - 5 PM",
        entryFee: "Free",
        bestTime: "Morning",
        visitTime: "2h",
        distance: "0.6 km",
      },
      {
        name: `Cozy Local Cafe`,
        lat: destination.lat - 0.002,
        lng: destination.lng + 0.003,
        category: "restaurant",
        rating: 4.6,
        description: "Fabulous local delicacies and tea.",
        photo: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80",
        openingHours: "8 AM - 8 PM",
        entryFee: "$15 Avg",
        bestTime: "Afternoon",
        visitTime: "1h",
        distance: "0.4 km",
      }
    ];

    const budgetFiltered = list.map(spot => {
      if (spot.category === "hotel") {
        if (budget < 1500) {
          return {
            ...spot,
            name: `${destination.name.split(",")[0]} Backpacker Inn`,
            entryFee: "$35/night",
            description: "Highly rated budget hostel lodging.",
            rating: 4.3
          };
        } else if (budget > 7500) {
          return {
            ...spot,
            name: `Aman ${destination.name.split(",")[0]}`,
            entryFee: "$950/night",
            description: "World-class luxury sanctuary.",
            rating: 5.0
          };
        }
      }
      return spot;
    });

    let filtered = budgetFiltered;
    if (interests.includes("adventure")) {
      filtered = [
        ...filtered,
        {
          name: `${destination.name.split(",")[0]} Outdoor Trails`,
          lat: destination.lat - 0.006,
          lng: destination.lng + 0.005,
          category: "nature",
          rating: 4.7,
          description: "Stunning forest trails with epic view overlooks.",
          photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
          openingHours: "Daylight Hours",
          entryFee: "Free",
          bestTime: "Sunrise",
          visitTime: "3 hours",
          distance: "4.2 km",
        }
      ];
    }

    return filtered.filter(spot => spot.category !== "hotel");
  };

  const handleCreateJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTripResult("");
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8000/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place: destination.name,
          start_date: startDate,
          end_date: endDate,
          budget: budget,
          travelers: travelersCount,
          preferences: interests,
          user_name: user?.displayName || user?.email?.split("@")[0] || "Guest User",
          user_email: user?.email || "guest@gotraveller.com"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setTripResult(data.itinerary);
      setHotels(data.hotels);

      // Map hotel results to ActivitySpot format for the interactive map
      const hotelSpots = data.hotels.map((hotel: any) => {
        let ratingNum = 4.5;
        if (hotel.rating && typeof hotel.rating === "string") {
          const match = hotel.rating.match(/[\d.]+/);
          if (match) ratingNum = parseFloat(match[0]);
        }

        return {
          name: hotel.name,
          lat: hotel.latitude || destination.lat,
          lng: hotel.longitude || destination.lng,
          category: "hotel" as const,
          rating: ratingNum,
          openingHours: "24/7 Check-in",
          entryFee: hotel.price,
          bestTime: "All Year",
          visitTime: "Overnight",
          description: hotel.description || "",
          photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
          distance: "Center",
          booking_link: hotel.booking_link
        };
      });

      const mainSpot = {
        name: destination.name,
        lat: destination.lat,
        lng: destination.lng,
        category: "hidden" as const,
        rating: 5.0,
        description: `Target center. Advisory: ${destination.advisory}`,
        photo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
        openingHours: "24/7",
        entryFee: "N/A",
        bestTime: "Anytime",
        visitTime: "Full visit",
        distance: "0 km"
      };

      // Map geocoded itinerary locations to ActivitySpot format
      const locationSpots = (data.locations || []).map((loc: any, index: number) => ({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
        category: "attraction" as const,
        rating: 4.8,
        openingHours: "9:00 AM - 6:00 PM",
        entryFee: "Free",
        bestTime: "Morning",
        visitTime: "2 hours",
        description: `Optimized Stop #${index + 1}. Source: ${loc.source}`,
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        distance: "En-route"
      }));

      // Parse road geometry coordinates if returned
      let roadPoints: [number, number][] = [];
      const features = data.route?.road?.features;
      if (features && features.length > 0) {
        const geometry = features[0].geometry;
        if (geometry.type === "LineString") {
          roadPoints = geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
        } else if (geometry.type === "MultiLineString") {
          roadPoints = geometry.coordinates.flat(1).map((c: any) => [c[1], c[0]] as [number, number]);
        }
      }
      setRoadCoordinates(roadPoints);

      setSpots([mainSpot, ...hotelSpots, ...locationSpots]);
      setTimelinePlan([...hotelSpots, ...locationSpots]);
    } catch (err: any) {
      console.error("Error generating trip plan:", err);
      setErrorMsg(err.message || "Failed to generate plan. Please verify the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async (hotelName: string, price: string) => {
    setBookingStatus((prev) => ({ ...prev, [hotelName]: 'booking' }));
    try {
      const response = await fetch("http://localhost:8000/api/book-hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_name: hotelName,
          destination: destination.name,
          price: price
        })
      });
      if (response.ok) {
        setBookingStatus((prev) => ({ ...prev, [hotelName]: 'booked' }));
      } else {
        setBookingStatus((prev) => ({ ...prev, [hotelName]: 'idle' }));
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingStatus((prev) => ({ ...prev, [hotelName]: 'idle' }));
    }
  };

  const handleTimelineClick = (spot: ActivitySpot) => {
    setResetTrigger((prev) => prev + 1);
    setDestination((prev) => ({
      ...prev,
      lat: spot.lat,
      lng: spot.lng
    }));
  };

  const resetMapView = () => {
    setResetTrigger((prev) => prev + 1);
  };

  // Generate calendar days grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

  const daysGrid = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    daysGrid.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push({ day: i, isCurrentMonth: true });
  }
  const remaining = 42 - daysGrid.length;
  for (let i = 1; i <= remaining; i++) {
    daysGrid.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="min-h-screen text-slate-150 flex flex-col md:flex-row relative bg-[#050814]">
          {/* 1. LEFT SIDE PLANNER PANEL (Static 60% width, naturally growing, scrollbar-free) */}
      <div className="w-full md:w-[60%] bg-[#050814] px-4 py-4 flex flex-col shrink-0 select-none">
        <div className="space-y-4 flex flex-col">
          {/* Header */}
          <div className="border-b border-slate-850/60 pb-1.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 font-sans">GoTraveller AI Engine</span>
              </div>
              <h2 className="text-base font-bold text-slate-100 font-serif mt-0.5">Planner Dashboard</h2>
            </div>
            <div className="text-[9px] text-slate-450 bg-[#0b1120] border border-slate-800 px-2 py-0.5 rounded-full">
              📍 Ahmedabad
            </div>
          </div>

          {/* Form / Results */}
          {!tripResult ? (
            <form onSubmit={handleCreateJourney} className="space-y-4 flex flex-col">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex justify-between items-center animate-fade-in select-text">
                  <span>{errorMsg}</span>
                  <button type="button" onClick={() => setErrorMsg("")} className="font-bold hover:text-white transition-colors pl-2">
                    ✕
                  </button>
                </div>
              )}
            
            {/* SECTION 1: Destination (Full Width) */}
            <div className="space-y-0.5">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Where to?
              </label>
              <DestinationSearch
                onSelect={(dest) => setDestination(dest)}
                defaultValue={destination.name}
              />
            </div>

            {/* SECTION 2 & 3: Calendar and Travelers Row as a single 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[58%_32%] gap-x-6 lg:gap-x-8 gap-y-3 justify-center items-stretch">
              
              {/* Left Column: Calendar Section */}
              <div className="space-y-2.5 flex flex-col justify-between">
                
                {/* Start Date & End Date Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Start Date */}
                  <div className="space-y-0.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Start Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2.5 top-2 w-3 h-3 text-slate-500" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-[#050810] border border-slate-800 rounded-lg py-1 pl-8 pr-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-400/50 h-[30px] leading-tight"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-0.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      End Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2.5 top-2 w-3 h-3 text-slate-500" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-[#050810] border border-slate-800 rounded-lg py-1 pl-8 pr-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-400/50 h-[30px] leading-tight"
                      />
                    </div>
                  </div>
                </div>

                {/* Calendar Card Grid */}
                <div className="bg-[#050810]/75 border border-slate-800/80 rounded-xl p-2.5 space-y-1.5 font-sans flex flex-col justify-between flex-1">
                  {/* Month navigation header */}
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">
                      {months[currentMonth]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 text-center">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                      <span key={dayName} className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">
                        {dayName}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 text-center gap-y-0.5">
                    {daysGrid.map((cell, idx) => {
                      if (!cell.isCurrentMonth) {
                        return (
                          <span
                            key={idx}
                            className="text-[9px] text-slate-850 py-0.5 flex items-center justify-center pointer-events-none select-none"
                          >
                            {cell.day}
                          </span>
                        );
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleDayClick(cell.day)}
                          className={`text-[9px] py-0.5 flex items-center justify-center transition-all ${getDayClass(
                            cell.day
                          )}`}
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Traveler Card */}
              <div className="bg-[#050810]/75 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between font-sans text-xs">
                {/* Dynamic Traveler Icon Container at the top */}
                <div className="flex flex-col items-center justify-center py-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={travelersCount}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-yellow-400 flex justify-center items-center h-8"
                    >
                      {travelersCount === 1 ? (
                        <User className="w-7 h-7 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]" />
                      ) : travelersCount === 2 ? (
                        <Users className="w-7 h-7 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]" />
                      ) : (
                        <div className="relative">
                          <Users className="w-7 h-7 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]" />
                          <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 text-[7px] font-black px-1 rounded-full border border-slate-950 leading-none">
                            {travelersCount}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1 text-center select-none">
                    Travelers Count
                  </span>
                </div>

                {/* Compact steppers for Kids, Men, and Women */}
                <div className="space-y-1.5 pt-1.5 border-t border-slate-850/60">
                  {/* Kids Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Kids</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDecrementTraveler("children")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-350 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-extrabold text-slate-100 w-3 text-center select-none">{travelerDetails.children}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrementTraveler("children")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-355 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Men Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Men</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDecrementTraveler("adults")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-355 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-extrabold text-slate-100 w-3 text-center select-none">{travelerDetails.adults}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrementTraveler("adults")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-355 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Women Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Women</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDecrementTraveler("infants")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-355 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-extrabold text-slate-100 w-3 text-center select-none">{travelerDetails.infants}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrementTraveler("infants")}
                        className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 text-slate-355 hover:text-white hover:border-slate-700 flex items-center justify-center text-[10px] transition-colors active:scale-90 shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Estimated Budget Slider */}
            <div className="space-y-0.5">
              <BudgetSlider onChange={(val) => setBudget(val)} />
            </div>

            {/* SECTION 5: Trip Types Row */}
            <TripTypeCards selectedIds={interests} onChange={(ids) => setInterests(ids)} />

            {/* SECTION 6: Transportation Preferences (3 options) */}
            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-450">
                Transportation Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "driving", label: "Car", icon: Car },
                  { id: "bus", label: "Bus / Train", icon: Bus },
                  { id: "flight", label: "Flight", icon: Plane },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = transport === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTransport(item.id as any)}
                      className={`p-2 rounded-xl border bg-[#050810]/55 flex flex-col items-center justify-center gap-1 text-center transition-all h-[48px] select-none ${
                        isSelected
                          ? "border-yellow-400 bg-yellow-400/5 text-yellow-400 font-bold"
                          : "border-slate-800 text-slate-450 hover:border-slate-700/60 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 7: AI Planning Filters (Compact chips) */}
            <div className="space-y-1 pt-1.5 border-t border-slate-850/50">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-450">
                AI Planning Filters
              </label>
              <div className="flex flex-wrap gap-1">
                {["Budget Friendly", "Family Friendly", "Adventure", "Luxury", "Nature", "Culture"].map((chip) => {
                  const isSelected = activeChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`px-2.5 py-1 rounded-full border text-[8px] font-bold select-none transition-all ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-400 text-slate-950 shadow-md shadow-yellow-400/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 8: Generate Button */}
            <div className="flex justify-center pt-1.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/30 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg shadow-yellow-400/15 active:scale-[0.98] h-[38px] select-none"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="text-[10px] uppercase tracking-wider font-bold">{loading ? "Generating Your Route..." : "Create My Journey"}</span>
              </button>
            </div>
          </form>
          ) : (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Reset/Back Button and Header */}
              <div className="flex justify-between items-center bg-[#070b16]/80 border border-slate-800 p-4 rounded-xl shadow-lg">
                <div>
                  <h3 className="font-serif text-base font-bold text-yellow-400">
                    Your Dream Trip to {destination.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                     {startDate} to {endDate} • {travelersCount} travelers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTripResult("");
                    setTimelinePlan([]);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-md shadow-yellow-400/5 select-none"
                >
                  Edit Trip Details
                </button>
              </div>

              {/* Grid or flex stack for Itinerary and Hotels */}
              <div className="space-y-6">
                {/* 1. ITINERARY SECTION */}
                <div className="bg-[#070b16]/75 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-2">
                    <h4 className="font-serif text-base font-bold text-yellow-400 flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      Trip Itinerary
                    </h4>
                    <button
                      onClick={() => exportItineraryToPDF(destination.name, tripResult)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                  <div className="max-w-full">
                    <MarkdownFormatter content={tripResult} />
                  </div>
                </div>

                {/* 2. HOTEL RECOMMENDATIONS SECTION */}
                <div className="bg-[#070b16]/75 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="font-serif text-base font-bold text-yellow-400 border-b border-slate-850 pb-2 flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Booking Agent Hotels (Budget Matched)
                  </h4>
                  <div className="space-y-4">
                    {hotels.map((hotel, idx) => {
                      const status = bookingStatus[hotel.name] || 'idle';
                      return (
                        <div key={idx} className="bg-[#050810]/80 border border-slate-850 rounded-lg p-4 space-y-3 shadow-md">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-sm font-bold text-slate-100 max-w-[70%] leading-snug">{hotel.name}</h5>
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
                              type="button"
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
                      <p className="text-xs text-slate-500 text-center py-4">No budget matches found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulated Itinerary Output */}
        {timelinePlan.length > 0 && !tripResult && (
          <div className="glass-panel p-2 rounded-xl border-l-4 border-l-yellow-400 space-y-1 mt-2.5 text-left bg-[#070b16]/90 border border-slate-800 shadow-lg shrink-0">
            <div className="flex items-center justify-between border-b border-slate-850/60 pb-1">
              <h3 className="font-serif text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                Generated Itinerary
              </h3>
              <span className="flex items-center gap-0.5 text-[8px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                <CheckCircle className="w-2 h-2" />
                <span>Ready</span>
              </span>
            </div>
            <div className="font-sans text-[9px] text-slate-350">
              <ul className="space-y-0.5">
                {timelinePlan.slice(0, 3).map((spot, idx) => (
                  <li key={idx} className="flex gap-1.5 truncate">
                    <span className="text-yellow-400 font-bold">Day {idx + 1}:</span>
                    <span className="truncate">Visit {spot.name} for {spot.visitTime}.</span>
                  </li>
                ))}
                {timelinePlan.length > 3 && (
                  <li className="text-slate-500 text-[8px] italic pl-7">
                    + {timelinePlan.length - 3} more days (see map routes)
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 2. RIGHT SIDE MAP PANEL (Static 40% width on desktop, inline height on mobile) */}
      <div className="w-full md:w-[40%] h-[350px] md:h-screen relative overflow-hidden bg-[#070b16] shrink-0">
        <MapComponent
          centerLat={destination.lat}
          centerLng={destination.lng}
          spots={spots}
          transportMode={transport}
          showAttractions={showAttractions}
          showHotels={showHotels}
          showRestaurants={showRestaurants}
          showRoute={showRoute}
          mapStyle={mapStyle}
          resetTrigger={resetTrigger}
          roadCoordinates={roadCoordinates}
        />

        {/* FLOATING QUICK ACTIONS (Bottom-Right of Map - Absolute Overlay) */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-[9999] flex flex-col gap-3 pointer-events-auto">
          {/* Map Style Toggle */}
          <button
            type="button"
            onClick={() => setMapStyle((prev) => (prev === "dark" ? "satellite" : "dark"))}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              mapStyle === "satellite"
                ? "bg-blue-500 border-blue-400 text-white"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title="Toggle Map Style"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Reset View Center */}
          <button
            type="button"
            onClick={resetMapView}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-colors"
            title="Reset Map Center"
          >
            <Navigation className="w-4 h-4 transform rotate-45" />
          </button>

          {/* Filter Attractions */}
          <button
            type="button"
            onClick={() => setShowAttractions((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              showAttractions
                ? "bg-yellow-400 border-yellow-300 text-slate-950 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Toggle Attractions"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Filter Hotels */}
          <button
            type="button"
            onClick={() => setShowHotels((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              showHotels
                ? "bg-blue-600 border-blue-500 text-white font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Toggle Hotels"
          >
            <Building2 className="w-4 h-4" />
          </button>

          {/* Filter Restaurants */}
          <button
            type="button"
            onClick={() => setShowRestaurants((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              showRestaurants
                ? "bg-orange-500 border-orange-400 text-white font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Toggle Restaurants"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Filter Route Path Lines */}
          <button
            type="button"
            onClick={() => setShowRoute((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all ${
              showRoute
                ? "bg-cyan-500 border-cyan-400 text-white font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
            title="Toggle Route Paths"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
