import React, { useState } from "react";
import AddVendor from "./AddVendor";
import AllVendors from "./AllVendors";
import EmployeeDashboard from "../procrumentHome"; // import the component

const VendorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"addVendor" | "allVendors">(
    "addVendor"
  );
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmployeeDashboard />; // render dashboard directly
  }
  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* Back Button */} 
      <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => setShowDashboard(true)} // show dashboard
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
        Vendor Management
      </h1>

      {/* Top Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded transition-all duration-200 ${
            activeTab === "addVendor"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("addVendor")}
        >
          Add Vendor
        </button>

        <button
          className={`px-4 py-2 rounded transition-all duration-200 ${
            activeTab === "allVendors"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("allVendors")}
        >
          View All Vendors
        </button>
      </div>

      {/* Content Below */}
      <div className="border p-6 rounded-xl shadow-md bg-white mt-4">
        {activeTab === "addVendor" && <AddVendor />}
        {activeTab === "allVendors" && <AllVendors />}
      </div>
    </div>
  );
};

export default VendorPage;
