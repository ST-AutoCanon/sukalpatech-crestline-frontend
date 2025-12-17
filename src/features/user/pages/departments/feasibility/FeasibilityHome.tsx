import React, { useState } from "react";
import FeasibilityPage from "./FeasibilityPage";
import OthersPage from "./others/others"; // placeholder for other actions

const FeasibilityHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "home" | "feasibility" | "others"
  >("home");

  if (currentPage === "feasibility") return <FeasibilityPage />;
  if (currentPage === "others") return <OthersPage />;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feasibility Card */}
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("feasibility")}
        >
          <h2 className="text-xl font-semibold mb-2">Feasibility</h2>
          <p className="text-gray-600 text-center">
            Manage PR Feasibility Requests
          </p>
        </div>

        {/* Others Card */}
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("others")}
        >
          <h2 className="text-xl font-semibold mb-2">Others</h2>
          <p className="text-gray-600 text-center">Other Actions / Requests</p>
        </div>
      </div>
    </div>
  );
};

export default FeasibilityHome;
