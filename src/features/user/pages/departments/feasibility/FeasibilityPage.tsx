import React, { useState } from "react";

import ViewFeasibilityRequests from "./ViewFeasibilityReq";
import UpdateFeasibility from "./UpdateFeasibility";


type TabType = "allPR" | "updatePR" | "allBD" | "updateBD";

const FeasibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("allPR");

  return (
    <div className="px-6 pb-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 mt-9">
        {/* LEFT — TABS */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("allPR")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white ${
              activeTab === "allPR" ? "bg-purple-700" : "bg-purple-400"
            }`}
          >
            All PRs
          </button>

         
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("updatePR")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white border-none cursor-pointer ${
              activeTab === "updatePR"
                ? "bg-purple-700"
                : "bg-purple-300"
            }`}
          >
            + Update PR
          </button>

          
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {/* FEASIBILITY */}
      {activeTab === "allPR" && <ViewFeasibilityRequests />}
      {activeTab === "updatePR" && <UpdateFeasibility />}

     
    </div>
  );
};

export default FeasibilityPage;
