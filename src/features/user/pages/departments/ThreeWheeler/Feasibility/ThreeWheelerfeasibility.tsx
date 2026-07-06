import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewThreeWheeler from "../Business/ViewThreeWheelerpage"; // Card component for 2W BRs
import ThreeWheelerHome from "../Business/ThreeWheelerHome"; // Modal form for creating 2W BRs

const TwoWheelerFeasibility: React.FC = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
   const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
    type FilterType = (typeof filters)[number];
    
    const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  

  // Fetch 3W data
  useEffect(() => {
  const fetch3W = async () => {
    try {
      setLoading(true);

      const status =
        activeFilter === "All PR"
          ? "ALL"
          : activeFilter.toUpperCase();

      const res = await api.get(
        `/business-development/3w/list?status=${status}`
      );

      console.log("Status:", status);
      console.log(res.data);

      if (res.data.success) {
  const list = Array.isArray(res.data.data?.data)
    ? res.data.data.data
    : [];

  setPrs(list);
} else {
  setPrs([]);
}
    } finally {
      setLoading(false);
    }
  };

  fetch3W();
}, [activeFilter, refreshList]);

  // Update a single BR after edit
  const handleUpdateSuccess = (updated: any) => {
    setPrs((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  

  return (
    <div className="p-6 pt-12 min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">
      {/* TOP BAR */}
     <div className="flex justify-between items-center mb-6 mt-3 flex-wrap gap-3">
  {/* Filters */}
  <div className="flex gap-6 flex-wrap">
    {filters.map((filter) => (
      <button
        key={filter}
        onClick={() => setActiveFilter(filter)}
        className={`pb-1 text-sm font-medium ${
          activeFilter === filter
            ? "border-b-2 border-white text-white"
            : "text-white/70"
        }`}
      >
        {filter}
      </button>
    ))}
  </div>

  {/* Update Button */}
  <button
    onClick={() => setActiveTab("update")}
    className={`px-4 py-2.5 rounded-xl font-semibold text-sm text-white ${
      activeTab === "update"
        ? "bg-purple-700"
        : "bg-purple-500"
    }`}
  >
    + Update BR
  </button>
</div>

      {/* LIST */}
      {loading ? (
        <p className="text-white">Loading 3W BRs...</p>
      ) : prs.length === 0 ? (
        <p className="text-white">No 3W business requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prs.map((pr) => (
            <ViewThreeWheeler
              key={pr.id}
              data={pr}
              mode={activeTab}
              onUpdate={handleUpdateSuccess}
               allowEdit={false}

            />
          ))}
        </div>
      )}

      {/* CREATE / MODAL FORM */}
      {showModal && (
        <ThreeWheelerHome
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setRefreshList(prev => !prev);
          }}
        />
      )}
    </div>
  );
};

export default TwoWheelerFeasibility;