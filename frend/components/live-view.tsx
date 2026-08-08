// `use client`;

// import React, { useState } from "react";
// import { Send, MapPin, Navigation, Sparkles, CheckCircle2, Clock, CloudRain, ShieldAlert } from "lucide-react";

// export default function LiveView() {
//   const [chatInput, setChatInput] = useState("");
//   const [chatHistory, setChatHistory] = useState([
//     {
//       role: "assistant",
//       content: "Hello Rudra! I'm your Voya Guide. You're currently near Nishiki Market. Weather is looking slightly damp with light rain starting soon. Need a quick indoor route or lunch recommendation?",
//       time: "11:35 AM",
//     },
//   ]);

//   const timeline = [
//     { time: "09:30 AM", location: "Gion District Walk", status: "completed", desc: "Explored traditional Machiya houses." },
//     { time: "11:00 AM", location: "Yasaka Shrine Visit", status: "completed", desc: "Scenic temple walk and photography." },
//     { time: "01:30 PM", location: "Lunch at Nishiki Market", status: "active", desc: "Trying local street food skewers." },
//     { time: "04:30 PM", location: "Kiyomizu Sunset Tour", status: "upcoming", desc: "Enjoy panoramic hillside views." },
//   ];

//   const handleSendChat = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;

//     const userMessage = {
//       role: "user",
//       content: chatInput,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     setChatHistory((prev) => [...prev, userMessage]);
//     const userQuery = chatInput.toLowerCase();
//     setChatInput("");

//     // Simulate AI response after 1s
//     setTimeout(() => {
//       let aiReply = "I am checking live transport data. Kyoto city buses are running on schedule. Alternatively, you can take a 10-minute walk through Shijo-dori to reach Yasaka pagoda.";
      
//       if (userQuery.includes("rain") || userQuery.includes("weather") || userQuery.includes("umbrella")) {
//         aiReply = "☂️ Real-time Weather Update: Light drizzle expected in Kyoto for the next 45 minutes. I suggest exploring the covered arcade of Nishiki Market or taking refuge inside a traditional matcha tea shop.";
//       } else if (userQuery.includes("eat") || userQuery.includes("food") || userQuery.includes("restaurant") || userQuery.includes("lunch")) {
//         aiReply = "🍣 Food Recommendation: Near your current spot at Nishiki Market, try the grilled octopus skewers at 'Kai' or grab some fresh soy milk donuts. For a sit-down meal, 'Gyoza Hohei' in Gion is excellent.";
//       }

//       setChatHistory((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: aiReply,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         },
//       ]);
//     }, 1000);
//   };

//   return (
//     <div className="space-y-8 max-w-7xl mx-auto">
//       {/* CSS animations inline */}
//       <style>{`
//         @keyframes pulse-cyan {
//           0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
//           70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
//           100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
//         }
//         .pulse-cyan-dot {
//           animation: pulse-cyan 2s infinite;
//         }
//       `}</style>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="font-serif text-3xl md:text-4xl text-slate-50 font-bold tracking-tight mb-2">
//             Live Trip Navigation
//           </h1>
//           <p className="text-slate-400 text-sm font-sans">
//             Tracking your current journey: <span className="text-yellow-400">Kyoto Discovery Tour</span>.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
//           <Navigation className="w-3.5 h-3.5 animate-spin" />
//           <span>Live Tracking Active</span>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Node map (Left 2/3) */}
//         <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[500px] relative overflow-hidden bg-[#070b16]/75">
//           {/* Subtle Grid Background */}
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

//           {/* SVG Map Lines */}
//           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
//             {/* Completed Path */}
//             <path
//               d="M 120 120 Q 250 150 280 220"
//               stroke="#0284c7"
//               strokeWidth="4"
//               fill="none"
//               strokeLinecap="round"
//             />
//             {/* Current to Future Dotted Path */}
//             <path
//               d="M 280 220 C 230 310, 420 330, 460 400"
//               stroke="#334155"
//               strokeWidth="3"
//               fill="none"
//               strokeDasharray="6"
//               strokeLinecap="round"
//             />
//           </svg>

//           {/* Node 1: Gion District */}
//           <div className="absolute top-[80px] left-[60px] z-10 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full border border-sky-400 bg-slate-950 flex items-center justify-center text-sky-400">
//               <CheckCircle2 className="w-5 h-5 fill-sky-400/20" />
//             </div>
//             <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
//               <span className="block text-xs font-bold text-slate-200">Gion District</span>
//               <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Node 1 • Completed</span>
//             </div>
//           </div>

//           {/* Node 2: Yasaka Shrine */}
//           <div className="absolute top-[180px] left-[240px] z-10 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full border border-sky-400 bg-slate-950 flex items-center justify-center text-sky-400">
//               <CheckCircle2 className="w-5 h-5 fill-sky-400/20" />
//             </div>
//             <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
//               <span className="block text-xs font-bold text-slate-200">Yasaka Shrine</span>
//               <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Node 2 • Completed</span>
//             </div>
//           </div>

//           {/* Node 3: Nishiki Market (YOU ARE HERE) */}
//           <div className="absolute bottom-[200px] left-[150px] z-10 flex items-center gap-3">
//             {/* Glowing cyan dot */}
//             <div className="w-11 h-11 rounded-full bg-cyan-400/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 pulse-cyan-dot">
//               <MapPin className="w-5 h-5 fill-cyan-400/10" />
//             </div>
//             <div className="bg-slate-900/95 border border-cyan-500/40 p-3 rounded-lg shadow-xl shadow-cyan-500/5">
//               <div className="flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
//                 <span className="text-xs font-bold text-slate-100">Nishiki Market</span>
//               </div>
//               <span className="block text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">You are here</span>
//             </div>
//           </div>

//           {/* Node 4: Kiyomizu-dera (Future) */}
//           <div className="absolute bottom-[70px] right-[100px] z-10 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500">
//               <Clock className="w-5 h-5" />
//             </div>
//             <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
//               <span className="block text-xs font-bold text-slate-300">Kiyomizu Temple</span>
//               <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Node 4 • Up Next</span>
//             </div>
//           </div>

//           {/* Bottom HUD bar */}
//           <div className="mt-auto z-10 bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
//                 <CloudRain className="w-5 h-5" />
//               </div>
//               <div>
//                 <span className="block text-xs font-bold text-slate-200">Local Weather</span>
//                 <span className="block text-[10px] text-slate-400">Kyoto • Haze, 17°C • Rain in 30m</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
//                 <ShieldAlert className="w-5 h-5" />
//               </div>
//               <div>
//                 <span className="block text-xs font-bold text-slate-200">Advisory Alert</span>
//                 <span className="block text-[10px] text-slate-400">Umbrella required by 12:15 PM</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Side Panel (Right 1/3) */}
//         <div className="space-y-6 flex flex-col h-full justify-between">
//           {/* Today's Plan Timeline */}
//           <div className="glass-panel p-5 rounded-2xl space-y-4 bg-[#070b16]/75">
//             <h3 className="font-serif text-base font-bold text-slate-100 border-b border-slate-800/60 pb-2.5">
//               Today's Plan
//             </h3>
//             <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
//               {timeline.map((item, idx) => (
//                 <div key={idx} className="flex gap-4 items-start relative pl-1">
//                   {/* Status dot */}
//                   <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center z-10 shrink-0 mt-1 ${
//                     item.status === "completed"
//                       ? "bg-sky-500 border-sky-400 text-slate-950"
//                       : item.status === "active"
//                       ? "bg-[#0b1120] border-cyan-400 text-cyan-400"
//                       : "bg-[#0b1120] border-slate-700 text-slate-600"
//                   }`}>
//                     <span className={`w-1.5 h-1.5 rounded-full ${
//                       item.status === "completed" ? "bg-slate-950" : item.status === "active" ? "bg-cyan-400 animate-ping" : "bg-slate-700"
//                     }`} />
//                   </div>
//                   <div>
//                     <span className="block text-[10px] font-bold text-yellow-400">{item.time}</span>
//                     <span className="block text-xs font-bold text-slate-200 mt-0.5">{item.location}</span>
//                     <span className="block text-[10px] text-slate-400 mt-1">{item.desc}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Voya Guide Chat */}
//           <div className="glass-panel rounded-2xl flex flex-col justify-between h-[300px] overflow-hidden bg-[#070b16]/75">
//             {/* Chat header */}
//             <div className="px-4 py-3 bg-[#0b1120]/50 border-b border-slate-800/80 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Sparkles className="w-4 h-4 text-yellow-400" />
//                 <span className="text-xs font-bold text-slate-200">Voya Guide</span>
//               </div>
//               <span className="w-2 h-2 rounded-full bg-cyan-400" />
//             </div>

//             {/* Message log */}
//             <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
//               {chatHistory.map((msg, idx) => (
//                 <div key={idx} className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
//                   <div className={`inline-block px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
//                     msg.role === "user"
//                       ? "bg-blue-600 text-white rounded-tr-none"
//                       : "bg-slate-800/65 text-slate-200 border border-slate-700/50 rounded-tl-none"
//                   }`}>
//                     {msg.content}
//                   </div>
//                   <span className="block text-[8px] text-slate-500 font-bold px-1">{msg.time}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Input Form */}
//             <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800/80 bg-[#050810]/45 flex gap-2">
//               <input
//                 type="text"
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 placeholder="Ask about weather, routing..."
//                 className="w-full bg-[#050810] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-yellow-400/50"
//               />
//               <button
//                 type="submit"
//                 className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
//               >
//                 <Send className="w-3.5 h-3.5" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Navigation } from "lucide-react";

export default function LiveView() {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Live travel assistant ready.",
      time: "11:35 AM",
    },
  ]);

  const timeline = [
    { time: "09:30 AM", location: "Gion District Walk", status: "completed", desc: "Explored traditional Machiya houses." },
    { time: "11:00 AM", location: "Yasaka Shrine Visit", status: "completed", desc: "Scenic temple walk and photography." },
    { time: "01:30 PM", location: "Lunch at Nishiki Market", status: "active", desc: "Trying local street food skewers." },
    { time: "04:30 PM", location: "Kiyomizu Sunset Tour", status: "upcoming", desc: "Enjoy panoramic hillside views." },
  ];

  // ---------------- MAP REFS ----------------
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);

  const watchId = useRef<number | null>(null);
  const initialized = useRef(false);

  const [tracking, setTracking] = useState<boolean>(false);

  // ---------------- INIT MAP ----------------
  useEffect(() => {
    if (!mapRef.current) return;

    // 🔥 Prevent duplicate init (StrictMode safe)
    if (initialized.current) return;
    initialized.current = true;

    let L: any;
    let map: any;

    (async () => {
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // 🔥 FIX MARKER ICONS
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // 🔥 ALWAYS CLEAN BEFORE INIT (extra safety)
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = L.map(mapRef.current!).setView([23.0225, 72.5714], 12);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      setTimeout(() => map.invalidateSize(), 300);

      // ---------------- START TRACKING ----------------
      if (navigator.geolocation && tracking) {
        watchId.current = navigator.geolocation.watchPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          if (!mapInstance.current) return;

          mapInstance.current.setView([lat, lng], 14);

          if (!userMarker.current) {
            userMarker.current = L.marker([lat, lng])
              .addTo(mapInstance.current)
              .bindPopup("📍 You are here");
          } else {
            userMarker.current.setLatLng([lat, lng]);
          }
        });
      }
    })();

    // ---------------- CLEANUP ----------------
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      initialized.current = false;
    };
  }, []);

  // ---------------- TOGGLE TRACKING ----------------
  useEffect(() => {
    if (!mapInstance.current) return;

    const L = require("leaflet");

    if (!tracking) {
      // STOP GPS
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }

      // REMOVE MARKER
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
    } else {
      // START GPS AGAIN
      if (navigator.geolocation) {
        watchId.current = navigator.geolocation.watchPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          if (!mapInstance.current) return;

          mapInstance.current.setView([lat, lng], 14);

          if (!userMarker.current) {
            userMarker.current = L.marker([lat, lng])
              .addTo(mapInstance.current)
              .bindPopup("📍 You are here");
          } else {
            userMarker.current.setLatLng([lat, lng]);
          }
        });
      }
    }
  }, [tracking]);

  // ---------------- CHAT ----------------
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: chatInput,
        time: new Date().toLocaleTimeString(),
      },
      {
        role: "assistant",
        content: "Checking travel data...",
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setChatInput("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Live Trip Navigation
        </h1>

        <button
          onClick={() => setTracking((prev) => !prev)}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition
            ${
              tracking
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
        >
          {tracking ? "📍 Tracking ON" : "📍 Tracking OFF"}
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAP */}
        <div className="lg:col-span-2 bg-[#070b16] rounded-xl p-3">
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-xl overflow-hidden"
          />
        </div>

        {/* RIGHT PANEL */}
        {/* <div className="space-y-4">

          <div className="bg-[#070b16] p-4 rounded-xl text-white">
            <h2 className="font-bold mb-2">Today's Plan</h2>
            <p className="text-sm text-gray-400">
              Live itinerary panel
            </p>
          </div> */}

          {/* CHAT */}
          {/* <div className="bg-[#070b16] p-4 rounded-xl flex flex-col h-[300px]">

            <div className="flex-1 overflow-y-auto text-white text-xs space-y-2">
              {chatHistory.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`p-2 rounded w-fit ${
                      msg.role === "user"
                        ? "bg-blue-600 ml-auto"
                        : "bg-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 mt-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2 text-xs bg-black text-white rounded"
                placeholder="Ask..."
              />
              <button className="bg-yellow-400 px-3 rounded">
                <Send className="w-3 h-3" />
              </button>
            </form>

          </div>
        </div> */}
         {/* Side Panel (Right 1/3) */}
        <div className="space-y-6 flex flex-col h-full justify-between">
          {/* Today's Plan Timeline */}
          <div className="glass-panel p-5 rounded-2xl space-y-4 bg-[#070b16]/75">
            <h3 className="font-serif text-base font-bold text-slate-100 border-b border-slate-800/60 pb-2.5">
              Today's Plan
            </h3>
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative pl-1">
                  {/* Status dot */}
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center z-10 shrink-0 mt-1 ${
                    item.status === "completed"
                      ? "bg-sky-500 border-sky-400 text-slate-950"
                      : item.status === "active"
                      ? "bg-[#0b1120] border-cyan-400 text-cyan-400"
                      : "bg-[#0b1120] border-slate-700 text-slate-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === "completed" ? "bg-slate-950" : item.status === "active" ? "bg-cyan-400 animate-ping" : "bg-slate-700"
                    }`} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-yellow-400">{item.time}</span>
                    <span className="block text-xs font-bold text-slate-200 mt-0.5">{item.location}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voya Guide Chat */}
          <div className="glass-panel rounded-2xl flex flex-col justify-between h-[300px] overflow-hidden bg-[#070b16]/75">
            {/* Chat header */}
            <div className="px-4 py-3 bg-[#0b1120]/50 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <Sparkles className="w-4 h-4 text-yellow-400" /> */}
                <span className="text-xs font-bold text-slate-200">Voya Guide</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>

            {/* Message log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-800/65 text-slate-200 border border-slate-700/50 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="block text-[8px] text-slate-500 font-bold px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800/80 bg-[#050810]/45 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about weather, routing..."
                className="w-full bg-[#050810] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-yellow-400/50"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}