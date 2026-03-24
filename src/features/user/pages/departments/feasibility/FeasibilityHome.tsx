
import React, { useState } from "react";
import FeasibilityPage from "./FeasibilityPage";
import Feasibility from "../Businessdevelopment/BusinessFeasibility";
import TwoWheelerFeasibility from "../TwoWheeler/TwoWheelerfeasibility";
import ThreeWheelerFeasibility from "../ThreeWheeler/ThreeWheelerfeasibility";
import FoodBusinessFeasibility from "../FoodBusiness/FoodBusinessfeasibility";
import GoldBusinessFeasibility from "../gold_business/goldbusinessfeasibility";
import OthersPage from "./others/others";

// Map businessType to its component
const businessComponents = {
  bd: Feasibility,
  "2w": TwoWheelerFeasibility,
  "3w": ThreeWheelerFeasibility,
  food: FoodBusinessFeasibility,
  gold: GoldBusinessFeasibility,
};

// Define a dynamic list for rendering buttons
const businessTypes = [
  { key: "bd", label: "BD" },
  { key: "2w", label: "2 Wheeler" },
  { key: "3w", label: "3 Wheeler" },
  { key: "food", label: "Food" },
  { key: "gold", label: "Gold" },
];

const FeasibilityHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feasibility" | "others">("feasibility");
  const [requestType, setRequestType] = useState<"procurement" | "business">("procurement");
  const [businessType, setBusinessType] = useState<keyof typeof businessComponents>("bd");

  // Decide which component to render dynamically
  const BusinessComponent = businessComponents[businessType];

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">

      {/* TABS */}
<div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
  <div className="flex flex-wrap gap-4 relative">

    {/* Main Tabs */}
    <button
      onClick={() => {
        setActiveTab("feasibility");
        setRequestType("procurement");
      }}
      className={`px-4 py-2 rounded-full ${
        activeTab === "feasibility" && requestType === "procurement"
          ? "bg-white text-purple-700 shadow"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      Procurement Request
    </button>

    <button
      onClick={() => {
        setActiveTab("feasibility");
        setRequestType("business");
      }}
      className={`px-4 py-2 rounded-full ${
        activeTab === "feasibility" && requestType === "business"
          ? "bg-white text-purple-700 shadow"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      Business Request
    </button>

    <button
      onClick={() => setActiveTab("others")}
      className={`px-4 py-2 rounded-full ${
        activeTab === "others"
          ? "bg-white text-purple-700 shadow"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      Others
    </button>
  </div>

  {/* Subtabs (Directly below Business Request) */}
  {activeTab === "feasibility" && requestType === "business" && (
    <div className="flex flex-wrap gap-2 mt-8">
      {businessTypes.map((b) => (
        <button
          key={b.key}
          onClick={() => setBusinessType(b.key as keyof typeof businessComponents)}
          className={`px-3 py-1 rounded-full ${
            businessType === b.key
              ? "bg-white text-purple-700 shadow"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  )}
</div>

    
      {/* TAB CONTENT */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb-10">
        {activeTab === "feasibility" && requestType === "procurement" && <FeasibilityPage />}
        {activeTab === "feasibility" && requestType === "business" && <BusinessComponent />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FeasibilityHome;