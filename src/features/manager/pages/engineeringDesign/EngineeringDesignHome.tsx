import React, { useState } from "react";
import EngineeringDesignPage from "./EngineeringDesignPage";


const EngineeringDesignHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"engineering">(
    "engineering",
  );
  const [requestType, setRequestType] = useState<"drawings">(
    "drawings",
  );

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">
      {/* Tabs */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
        <div className="mt-4 md:mt-6 flex flex-wrap gap-4 sm:gap-4">
          <button
            onClick={() => {
              setActiveTab("engineering");
              setRequestType("drawings");
            }}
            className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition
              ${
                activeTab === "engineering" && requestType === "drawings"
                  ? "bg-white text-purple-700 shadow"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
          >
            Drawings
          </button>




        </div>
      </div>

      {/* Tab Content */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb-10">
        {activeTab === "engineering" && requestType === "drawings" && (
          <EngineeringDesignPage type="drawings" />
        )}
      </div>
    </div>
  );
};

export default EngineeringDesignHome;
