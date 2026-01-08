
import React, { useState } from "react";
import UpdateFeasibility from "./UpdateFeasibility";
import ViewFeasibilityRequests from "./ViewFeasibilityReq";

const FeasibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "update">("view");

  return (
    <div className="px-6 pb-6 w-full">
      {/* HEADER ROW */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        {/* LEFT */}
        <div className="flex gap-4">
          <h2
            onClick={() => setActiveTab("view")}
            className={`cursor-pointer text-lg font-semibold inline-block pb-1 ${activeTab === "view"
                ? "text-white border-b-2 border-white"
                : "text-gray-500"
              }`}
          >
            All Feasibility
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">


          <button
            onClick={() => setActiveTab("update")}
            className="h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 text-sm font-medium text-white hover:opacity-90 transition"
          >
            + Update Feasibility
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === "view" && <ViewFeasibilityRequests />}
      {activeTab === "update" && (
        <UpdateFeasibility onBack={() => setActiveTab("view")} />
      )}
    </div>
  );
};

export default FeasibilityPage;
