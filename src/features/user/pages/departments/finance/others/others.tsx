import React, { useState } from "react";
import FinanceDashboard from "../FinanceHome"; // import the component

const OthersFinance: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <FinanceDashboard />; // render dashboard directly
  }
  return (
    <>
      <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mb-5"
        onClick={() => setShowDashboard(true)} // show dashboard
      >
        Back to Dashboard
      </button>
      <div className="p-6 bg-white shadow rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Other Finance Information
        </h2>

        <p className="text-gray-700 mb-3">
          This is the <strong>Finance Others section</strong>. You can place any
          additional finance-related data or notes here.
        </p>

        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Random note: Finance guidelines updated on 12/01/2025.</li>
          <li>Upcoming features: Budget Approval Flow, PR Payment Tracking.</li>
          <li>Temporary information can be shown here.</li>
          <li>Use this page for extra finance details.</li>
        </ul>
      </div>
    </>
  );
};

export default OthersFinance;
