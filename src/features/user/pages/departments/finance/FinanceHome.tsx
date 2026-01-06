



import React, { useState } from "react";
import FinancePage from "./FinancePage";
import OthersPage from "./others/others"; // placeholder for other actions

const FinanceHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Finance" | "others">(
    "Finance"
  );

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-900 to-blue-900 px-4 sm:px-8 py-6">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-6 sm:mb-10">
        Finance
      </h1>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap mt-8">
        <button
          onClick={() => setActiveTab("Finance")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "Finance"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Finance
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
      <div className="pt-6 sm:pt-10 w-full">
        {activeTab === "Finance" && <FinancePage />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FinanceHome;
