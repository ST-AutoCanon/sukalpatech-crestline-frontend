import React, { useState } from "react";
import FeasibilityPage from "./FeasibilityPage";
import Feasibility from "../Businessdevelopment/BusinessFeasibility";
import OthersPage from "./others/others";

const FeasibilityHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feasibility" | "others">(
    "feasibility"
  );
  const [requestType, setRequestType] = useState<
    "procurement" | "business"
  >("procurement");


  return (
    <div
      className="
        w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white
      "
    >
      {/* TABS */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
        <div className="mt-4 md:mt-6 flex flex-wrap gap-4 sm:gap-4">
          <button
            onClick={() => {
              setActiveTab("feasibility");
              setRequestType("procurement");
            }}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
      ${activeTab === "feasibility" && requestType === "procurement"
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
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
      ${activeTab === "feasibility" && requestType === "business"
                ? "bg-white text-purple-700 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
          >
            Business Request
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
              ${activeTab === "others"
                ? "bg-white text-purple-700 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >
            Others
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb-10">
        {activeTab === "feasibility" && requestType === "procurement" && (
          <FeasibilityPage />
        )}

        {activeTab === "feasibility" && requestType === "business" && (
          <Feasibility />
        )}

        {activeTab === "others" && <OthersPage />}
      </div>

    </div>
  );
};

export default FeasibilityHome;

