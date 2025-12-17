import React, { useState } from "react";
import UpdateFeasibility from "./UpdateFeasibility"; // Form/page to update feasibility
import ViewFeasibilityRequests from "./ViewFeasibilityReq"; // Page to view PRs

const FeasibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"update" | "view">("update");

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => window.location.reload()}
      >
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
        Feasibility Requests
      </h1>

      {/* --------- TOP BUTTONS ---------- */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "update"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("update")}
        >
          Update Feasibility
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "view"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Feasibility Requests
        </button>
      </div>

      {/* ---------- CONTENT SECTION BELOW ---------- */}
      <div className="mt-4">
        {activeTab === "update" && <UpdateFeasibility />}
        {activeTab === "view" && <ViewFeasibilityRequests />}
      </div>
    </div>
  );
};

export default FeasibilityPage;
