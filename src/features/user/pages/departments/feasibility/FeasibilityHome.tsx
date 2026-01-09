import React, { useState } from "react";
import FeasibilityPage from "./FeasibilityPage";
import OthersPage from "./others/others";

const FeasibilityHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feasibility" | "others">(
    "feasibility"
  );

  return (
    <div
      className="
        min-h-[calc(100vh-64px)]
        bg-gradient-to-br from-purple-900 to-blue-900
        px-4 sm:px-6 lg:px-8
        py-4 sm:py-6
      "
    >

      {/* TABS */}
      <div className="mt-4 overflow-x-auto mt-8">
        <div className="flex gap-3 w-max">
          <button
            onClick={() => setActiveTab("feasibility")}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
              ${
                activeTab === "feasibility"
                  ? "bg-white text-purple-700 shadow"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >
            Feasibility
          </button>

          <button
            onClick={() => setActiveTab("others")}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
              ${
                activeTab === "others"
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
      <div className="pt-6 sm:pt-8">
        {activeTab === "feasibility" && <FeasibilityPage />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FeasibilityHome;

