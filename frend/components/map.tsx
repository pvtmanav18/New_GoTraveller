"use client";

import React, { useEffect, useRef } from "react";
import { ActivitySpot } from "./planner-layout";

interface MapProps {
  centerLat: number;
  centerLng: number;
  spots: ActivitySpot[];
  transportMode?: "walking" | "driving" | "flight" | "train" | "bus";
  showAttractions: boolean;
  showHotels: boolean;
  showRestaurants: boolean;
  showRoute: boolean;
  mapStyle: "dark" | "satellite";
  resetTrigger: number;
  roadCoordinates?: [number, number][];
}

export default function Map({
  centerLat,
  centerLng,
  spots,
  transportMode = "driving",
  showAttractions,
  showHotels,
  showRestaurants,
  showRoute,
  mapStyle,
  resetTrigger,
  roadCoordinates = []
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const pathLinesRef = useRef<any[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (isInitialized.current) return;
    isInitialized.current = true;

    let L: any;

    (async () => {
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current!).setView([centerLat, centerLng], 12);
      mapInstanceRef.current = map;

      const tileUrl =
        mapStyle === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

      const layer = L.tileLayer(tileUrl, {
        attribution:
          mapStyle === "satellite"
            ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }).addTo(map);
      tileLayerRef.current = layer;

      setTimeout(() => map.invalidateSize(), 300);
    })();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);

  // Update map center when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([centerLat, centerLng], 13, {
      animate: true,
      duration: 1.5
    });
  }, [centerLat, centerLng, resetTrigger]);

  // Handle Map Style switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    import("leaflet").then((LModule) => {
      const L = LModule.default;
      map.removeLayer(tileLayerRef.current);

      const tileUrl =
        mapStyle === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

      const newLayer = L.tileLayer(tileUrl, {
        attribution:
          mapStyle === "satellite"
            ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }).addTo(map);

      tileLayerRef.current = newLayer;
    });
  }, [mapStyle]);

  // Render activity markers and paths dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    pathLinesRef.current.forEach((pl) => pl.remove());
    pathLinesRef.current = [];

    if (spots.length === 0) return;

    import("leaflet").then((LModule) => {
      const L = LModule.default;

      const getCategoryTheme = (cat: string) => {
        switch (cat) {
          case "hotel":
            return { bg: "bg-blue-500", text: "🏨", visible: showHotels };
          case "restaurant":
            return { bg: "bg-orange-500", text: "🍣", visible: showRestaurants };
          case "museum":
            return { bg: "bg-purple-500", text: "🏛️", visible: showAttractions };
          case "attraction":
            return { bg: "bg-yellow-500", text: "🗼", visible: showAttractions };
          case "nature":
            return { bg: "bg-emerald-500", text: "🏔️", visible: showAttractions };
          case "nightlife":
            return { bg: "bg-pink-500", text: "🍸", visible: showRestaurants };
          case "hidden":
          default:
            return { bg: "bg-cyan-500", text: "✨", visible: showAttractions };
        }
      };

      const pathCoords: [number, number][] = [];

      spots.forEach((spot) => {
        const theme = getCategoryTheme(spot.category);
        if (!theme.visible) return;

        pathCoords.push([spot.lat, spot.lng]);

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-8 w-8 rounded-full bg-yellow-400/20 animate-ping opacity-60"></span>
              <div class="w-7 h-7 rounded-full ${theme.bg} border-2 border-slate-950 flex items-center justify-center text-xs shadow-lg shadow-black/50 select-none transform hover:scale-110 active:scale-95 transition-transform duration-200">
                ${theme.text}
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const popupContent = `
          <div class="w-60 font-sans p-1 bg-[#0b101d] text-slate-200 rounded-xl overflow-hidden border border-slate-800">
            <img src="${spot.photo}" alt="${spot.name}" class="w-full h-24 object-cover rounded-t-lg mb-2" />
            <div class="px-2 space-y-1.5">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-xs text-white leading-tight">${spot.name}</h4>
                <div class="flex items-center gap-0.5 bg-yellow-400/10 px-1 rounded text-yellow-400 text-[10px] font-bold">
                  ★ ${spot.rating}
                </div>
              </div>
              <p class="text-[10px] text-slate-400 leading-normal line-clamp-2">${spot.description}</p>
              <div class="grid grid-cols-2 gap-1.5 text-[9px] text-slate-500 border-t border-slate-850 pt-1.5">
                <div>🕒 ${spot.openingHours}</div>
                <div>🎫 ${spot.entryFee}</div>
                <div>🍂 Best: ${spot.bestTime}</div>
                <div>⏳ Stay: ${spot.visitTime}</div>
              </div>
              <div class="flex gap-2 pt-2 border-t border-slate-850">
                <button onclick="alert('💾 Saved to vault!')" class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-1 rounded text-[9px] transition-colors">
                  Save Place
                </button>
                <button onclick="alert('📍 Calculating directions...')" class="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 py-1 rounded text-[9px] transition-colors">
                  Directions
                </button>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 300,
            className: "leaflet-dark-popup"
          });

        markersRef.current.push(marker);
      });

      // 3. Draw routes between spots
      const getLineStyle = (mode: string) => {
        switch (mode) {
          case "walking":
            return { color: "#f97316", dashArray: "5, 5", weight: 3 };
          case "flight":
            return { color: "#3b82f6", dashArray: "1, 10", weight: 4 };
          case "train":
            return { color: "#eab308", dashArray: "10, 10", weight: 3.5 };
          case "bus":
            return { color: "#8b5cf6", dashArray: "5, 5", weight: 3 };
          case "driving":
          default:
            return { color: "#06b6d4", dashArray: "", weight: 3 };
        }
      };

      if (showRoute) {
        const coordsToDraw = roadCoordinates && roadCoordinates.length > 0
          ? roadCoordinates
          : pathCoords;

        if (coordsToDraw.length > 1) {
          const style = getLineStyle(transportMode);
          const polyline = L.polyline(coordsToDraw, style).addTo(map);
          pathLinesRef.current.push(polyline);

          const bounds = L.latLngBounds(coordsToDraw);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    });
  }, [spots, transportMode, showAttractions, showHotels, showRestaurants, showRoute, roadCoordinates]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: #0b101d !important;
          border: 1px solid #1e293b !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          border-radius: 14px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          top: 6px !important;
          right: 6px !important;
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
