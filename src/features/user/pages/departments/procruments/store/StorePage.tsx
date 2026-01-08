


import React, { useState } from "react";
import UpdatePRStore from "../store/UpdatePRstore";
import ViewItems from "../store/ViewPRstore";
import EmployeeDashboard from "../procrumentHome"; // import the component
import AddCategories from "./AddCategories";
import AddItems from "./additems";

const StorePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "add" | "view" | "AddCategories" | "AddItems"
  >("add");
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmployeeDashboard />; // render dashboard directly
  }
  return (
    <div className="px-6 py-6">
      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        {/* LEFT : ALL STORES */}
        <p
          onClick={() => setSelectedTab("view")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "view"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          All Stores
        </p>
        <p
          onClick={() => setSelectedTab("AddCategories")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "AddCategories"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          Add Categories
        </p>
        <p
          onClick={() => setSelectedTab("AddItems")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "AddItems"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          Add Items
        </p>

        <div className="flex items-center gap-4">


          {/* ADD STORE BUTTON */}
          <button
            onClick={() => setSelectedTab("add")}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
          >
            + Update PR
          </button>
        </div>
      </div>

      {/* Page Content Below */}
      {selectedTab === "add" && <UpdatePRStore />}
      {selectedTab === "view" && <ViewItems />}
      {selectedTab === "AddCategories" && <AddCategories />}
      {selectedTab === "AddItems" && <AddItems />}
    </div>
  );
};

export default StorePage;
