"use client";

import React from "react";
import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";

export default function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex relative overflow-hidden w-full">
      {/* Sidebar Navigation */}
      {!isAuthPage && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen overflow-y-auto px-4 md:px-10 py-16 md:py-10 scrollbar-thin ${isAuthPage ? "ml-0" : "md:ml-64 ml-0"}`}>
        {children}
      </main>
    </div>
  );
}
