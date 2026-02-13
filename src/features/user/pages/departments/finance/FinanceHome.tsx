import React, { useState } from "react";
import FinancePage from "./FinancePage";
import OthersPage from "./others/others"; // placeholder for other actions

const FinanceHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Finance" | "others">(
    "Finance"
  );

  return (
    <div className=" w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">
      {/* TABS */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8 flex flex-wrap gap-4 sm:gap-4">
        <button
          onClick={() => setActiveTab("Finance")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "Finance"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Procrument Requests
        </button>

        <button
          onClick={() => setActiveTab("others")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "others"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Others
        </button>
      </div>

      {/* DYNAMIC TAB CONTENT */}
      {/* <div className="pt-6 sm:pt-10 w-full"> */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb- md:pb-10">
        {activeTab === "Finance" && <FinancePage />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FinanceHome;
