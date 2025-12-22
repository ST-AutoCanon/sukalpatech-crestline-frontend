import React, { useState } from "react";
import UpdateFinance from "./UpdateFinance"; // Form/page to update finance status
import ViewFinanceRequests from "./ViewFinanceRequests"; // Page to view finance PRs
import FinanceDashboard from "./FinanceHome"; // import the component

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"update" | "view">("update");
 const [showDashboard, setShowDashboard] = useState(false);

 if (showDashboard) {
   return <FinanceDashboard />; // render dashboard directly
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
        Finance PR Requests
      </h1>

      {/* --------- TOP BUTTONS ---------- */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "update"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("update")}
        >
          Update Finance
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "view"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Finance Requests
        </button>
      </div>

      {/* ---------- CONTENT SECTION BELOW ---------- */}
      <div className="mt-4">
        {activeTab === "update" && <UpdateFinance />}
        {activeTab === "view" && <ViewFinanceRequests />}
      </div>
    </div>
  );
};

export default FinancePage;
