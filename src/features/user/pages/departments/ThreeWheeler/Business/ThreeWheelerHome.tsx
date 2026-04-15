import { useState } from "react";
import ThreeWheelerList from "../Business/ThreeWheelerlist";
import ThreeWheelerPage from "./CreateThreeWheelerPage";
import UpdatedThreeWheelerRequests from "../Feasibility/UpdatedFeasibilityPage"; // <- import the updated requests page

const ThreeWheelerHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [showUpdatedRequests, setShowUpdatedRequests] = useState(false);

  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

  const handleSuccess = () => setRefreshList(prev => !prev);

  // If "Updated Requests" is clicked, render the updated requests page
  if (showUpdatedRequests) {
    return (
      <UpdatedThreeWheelerRequests
        onBack={() => setShowUpdatedRequests(false)} // go back to main page
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6">

      {/* HEADER */}
     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

  {/* LEFT TITLE */}
  <button className="bg-white text-purple-700 px-4 py-2 rounded-full text-sm sm:text-base w-full sm:w-auto text-center">
    3W Business Requests
  </button>

  {/* RIGHT BUTTONS */}
  <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">

    {/* CREATE */}
    <button
      onClick={() => setShowModal(true)}
      className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 rounded-md text-white text-sm sm:text-base whitespace-nowrap"
    >
      + Create Request
    </button>

    {/* UPDATE */}
    <button
      onClick={() => setShowUpdatedRequests(true)}
      className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 rounded-md text-white text-sm sm:text-base whitespace-nowrap"
    >
      Updated Request
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
              activeFilter === filter ? "border-b-2 border-white" : "text-white/70"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* LIST */}
      <ThreeWheelerList
        refresh={refreshList}
        filter={activeFilter === "All PR" ? "ALL" : activeFilter.toUpperCase()}
      />

      {/* CREATE MODAL */}
      {showModal && (
  <ThreeWheelerPage
    onClose={() => setShowModal(false)}
    onSuccess={() => {
      handleSuccess();
      setShowModal(false);
    }}
  />
)}
    </div>
  );
};

export default ThreeWheelerHome;