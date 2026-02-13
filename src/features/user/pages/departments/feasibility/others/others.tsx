import React, { useState } from "react";
import FesibilityDashboard from "../FeasibilityHome";
const Others: React.FC = () => {
    const [showDashboard, setShowDashboard] = useState(false);

    if (showDashboard) {
      return <FesibilityDashboard />; // render dashboard directly
    }
  return (
    <>
      <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-60 mb-5"
        onClick={() => setShowDashboard(true)} // show dashboard
      >
        Back to Dashboard
      </button>

      <div className="p-6 bg-white shadow rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Other Information
        </h2>

        <p className="text-gray-700 mb-3">
          This is the <strong>Others section</strong>. You can place any
          additional procurement-related data or notes here.
        </p>

        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Random note: Procurement guidelines updated on 12/01/2025.</li>
          <li>Upcoming features: Vendor Rating, PR Approval Flow.</li>
          <li>Temporary information can be shown here.</li>
          <li>Use this page for extra details.</li>
        </ul>
      </div>
    </>
  );
};

export default Others;
