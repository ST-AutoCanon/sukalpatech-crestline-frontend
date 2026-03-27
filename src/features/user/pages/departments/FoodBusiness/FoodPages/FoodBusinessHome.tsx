// src/pages/businessDevFood/FoodBusinessHome.tsx
import { useState } from "react";
import FoodBusinessList from "./Foodlist";
import FoodBusinessPage from "./CraeteFoodBusiness";
import UpdatedFoodRequests from "../FeasibilityPages/UpdatedfeasibilityPage"; // create this like 3W




const FoodBusinessHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [showUpdatedRequests, setShowUpdatedRequests] = useState(false);

  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

  const handleSuccess = () => setRefreshList((prev) => !prev);

  // 👉 SHOW UPDATED REQUEST PAGE
  if (showUpdatedRequests) {
    return (
      <UpdatedFoodRequests
        onBack={() => setShowUpdatedRequests(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <button className="bg-white text-purple-700 px-4 py-2 rounded-full">
          Food Business Requests
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white"
          >
            + Create Request
          </button>

          <button
            onClick={() => setShowUpdatedRequests(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white"
          >
            Updated Requests
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 text-white mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`pb-1 ${
              activeFilter === filter
                ? "border-b-2 border-white"
                : "text-white/70"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* LIST */}
      <FoodBusinessList
        refresh={refreshList}
        filter={
          activeFilter === "All PR"
            ? "ALL"
            : activeFilter.toUpperCase()
        }
      />

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ×
            </button>

            <FoodBusinessPage
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                handleSuccess();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodBusinessHome;