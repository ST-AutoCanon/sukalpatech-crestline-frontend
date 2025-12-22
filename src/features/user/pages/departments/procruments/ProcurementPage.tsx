import React, { useState } from "react";
import Procurement from "./Procurement"; // Create PR
import AllPRs from "./getAll_procurements"; // View PRs
import EmployeeDashboard from "./procrumentHome"; // import the component

const ProcurementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"newPR" | "allPRs">("newPR");
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmployeeDashboard />; // render dashboard directly
  }
  return (
    <div className="p-10 max-w-4xl mx-auto">
          <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => setShowDashboard(true)} // show dashboard
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
        Procurement Requests
      </h1>

      {/* --------- TOP BUTTONS ---------- */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "newPR"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("newPR")}
        >
          Create New PR
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "allPRs"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("allPRs")}
        >
          View All PRs
        </button>
      </div>

      {/* ---------- CONTENT SECTION BELOW ---------- */}
      <div className="mt-4">
        {activeTab === "newPR" && <Procurement />}
        {activeTab === "allPRs" && <AllPRs />}
      </div>
    </div>
  );
};

export default ProcurementPage;
