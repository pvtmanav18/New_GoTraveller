"use client";

import React, { useState, useEffect } from "react";
import { Home, Compass, Bookmark, Navigation, User, Plane, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close sidebar on mobile when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "plan", label: "Plan Trip", icon: Compass, href: "/plan" },
    { id: "saved", label: "Saved", icon: Bookmark, href: "/saved" },
    { id: "live", label: "Live Trip", icon: Navigation, href: "/live" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (pathname === "/") return "home";
    if (pathname === "/plan") return "plan";
    if (pathname === "/saved") return "saved";
    if (pathname === "/live") return "live";
    if (pathname === "/profile") return "profile";
    return "home";
  };

  const currentActive = getActiveTab();

  return (
    <>
      {/* Mobile Floating Toggle Menu */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[9999] md:hidden p-2.5 rounded-xl bg-slate-900/90 border border-slate-850 text-slate-200 hover:text-white hover:bg-slate-800 shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <Menu className="w-4 h-4" />
        )}
      </button>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`w-64 fixed top-0 left-0 h-full border-r border-slate-800 bg-[#070b16] flex flex-col z-[9999] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
            const isActive = currentActive === item.id;

            const handleClick = (e: React.MouseEvent) => {
              if (setActiveTab) {
                e.preventDefault();
                setActiveTab(item.id);
              }
            };

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleClick}
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
              </Link>
            );
          })}
        </nav>

        {/* Footer / Account status */}
        <div className="p-4 border-t border-slate-800 bg-[#050810]/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-yellow-400 shrink-0 select-none">
                {user?.displayName 
                  ? user.displayName.split(" ").map(p => p[0]).join("").toUpperCase().substring(0, 2)
                  : user?.email 
                    ? user.email.substring(0, 2).toUpperCase() 
                    : "US"
                }
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[110px]">
                  {user?.displayName || user?.email?.split("@")[0] || "User Session"}
                </div>
                <div className="text-[10px] text-yellow-400/90 font-medium">Elite Voyager</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to sign out?")) {
                  logOut();
                }
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg border border-slate-850 bg-slate-900/60 text-slate-450 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
