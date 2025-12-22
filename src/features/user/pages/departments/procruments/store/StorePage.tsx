import React, { useState } from "react";
import AddItem from "../store/AddItem";
import ViewItems from "../store/ViewItems";
import EmployeeDashboard from "../procrumentHome"; // import the component

const StorePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"add" | "view">("add");
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
        Store Management
      </h1>

      {/* Top Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded transition-all duration-200 ${
            selectedTab === "add"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedTab("add")}
        >
          Add Item
        </button>

        <button
          className={`px-4 py-2 rounded transition-all duration-200 ${
            selectedTab === "view"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedTab("view")}
        >
          View Items
        </button>
      </div>

      {/* Page Content Below */}
      <div className="border p-6 rounded-xl shadow-md bg-white mt-4">
        {selectedTab === "add" && <AddItem />}
        {selectedTab === "view" && <ViewItems />}
      </div>
    </div>
  );
};

export default StorePage;
