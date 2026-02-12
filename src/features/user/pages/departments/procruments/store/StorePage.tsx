import React, { useState } from "react";
import UpdatePRStore from "../store/UpdatePRstore";
import AddCategories from "./AddCategories";
import AddItems from "./additems";
import RequestedPages from "../../req_pages/requestpages";

// Filters same as Procurement
const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
type FilterType = (typeof filters)[number];

const StorePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "view" | "AddCategories" | "AddItems" | "add"
  >("AddCategories"); // default tab
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

  const tabs: { key: string; label: string }[] = [
    { key: "view", label: "All Request" },
    { key: "AddCategories", label: "Add Categories" },
    { key: "AddItems", label: "Add Items" },
  ];

  return (
    <div className="px-4 md:px-6 py-6 min-h-screen">
      {/* TOP ROW - Tabs + Update PR */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 mb-4 justify-between">
        {/* Tabs */}
        <div className="flex flex-1 flex-wrap md:flex-nowrap gap-10 md:gap-12 text-white font-medium text-lg">
          {tabs.map((tab) => (
            <p
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`cursor-pointer transition pb-1 ${selectedTab === tab.key
                ? "border-b-2 border-white"
                : "hover:text-white/80"
                }`}
            >
              {tab.label}
            </p>
          ))}
        </div>

        {/* Update PR button */}
        <button
          onClick={() => setSelectedTab("add")}
          className="bg-gradient-to-r from-sky-500 to-purple-500 text-white text-sm md:text-base font-medium px-3 md:px-4 py-2 rounded whitespace-nowrap w-full md:w-auto"
        >
          + Update PR
        </button>

      </div>

      {/* STATUS FILTERS - only for "All Request" */}
      {selectedTab === "view" && (
        <div className="flex gap-6 mb-6 flex-wrap">
          {filters.map((filter) => (
            <p
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`cursor-pointer text-white text-base font-medium pb-1 transition ${activeFilter === filter
                ? "border-b-2 border-white"
                : "hover:text-white/80"
                }`}
            >
              {filter}
            </p>
          ))}
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="w-full">
        {selectedTab === "add" && <UpdatePRStore />}
        {selectedTab === "view" && (
          <RequestedPages role="procurement" filter={activeFilter} />
        )}
        {selectedTab === "AddCategories" && <AddCategories />}
        {selectedTab === "AddItems" && <AddItems />}
      </div>
    </div>
  );
};

export default StorePage;
