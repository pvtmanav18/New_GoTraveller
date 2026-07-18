"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/sidebar";
import DashboardView from "../components/dashboard-view";
import PlannerView from "../components/planner-view";
import SavedView from "../components/saved-view";
import ProfileView from "../components/profile-view";
import LiveView from "../components/live-view";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "plan":
        return <PlannerView key="plan" />;
      case "saved":
        return <SavedView key="saved" />;
      case "live":
        return <LiveView key="live" />;
      case "profile":
        return <ProfileView key="profile" />;
      case "home":
      default:
        return (
          <DashboardView
            // key="home"
            onPlanTrip={() => setActiveTab("plan")}
            onViewSaved={() => setActiveTab("saved")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex relative overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto px-6 md:px-10 py-10 scrollbar-thin">
        {/* Animated view transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
