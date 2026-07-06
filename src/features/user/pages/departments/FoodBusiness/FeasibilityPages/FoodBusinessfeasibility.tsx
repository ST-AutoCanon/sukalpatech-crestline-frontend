import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewFood from "../FoodPages/ViewFoodpage"; // Card component for 2W BRs
import FoodBusinessHome from "../FoodPages/FoodBusinessHome"; // Modal form for creating 2W BRs

const FoodFeasibility: React.FC = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);


  // Fetch Food data
  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("All PR");

  useEffect(() => {
    const fetchGold = async () => {
      setLoading(true);

      try {
        const status =
          activeFilter === "All PR"
            ? "ALL"
            : activeFilter.toUpperCase();

        console.log("Status:", status);

        const res = await api.get(
          `/business-development/food/list?status=${status}`
        );

        console.log("food Response:", res.data);

        if (res.data.success) {
          const dataArray = Array.isArray(res.data.data)
            ? res.data.data
            : res.data?.data?.data || [];

          setPrs(dataArray);
        } else {
          setPrs([]);
        }
      } catch (err) {
        console.error("Fetch food error:", err);
        setPrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGold();
  }, [refreshList, activeFilter]);
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
              onClick={() => {
                setActiveFilter(filter);
                setActiveTab("all");
              }}
              className={`pb-1 text-sm font-medium ${activeFilter === filter
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
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm text-white ${activeTab === "update"
            ? "bg-purple-700"
            : "bg-purple-500"
            }`}
        >
          + Update BR
        </button>

      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-white">Loading Food BRs...</p>
      ) : prs.length === 0 ? (
        <p className="text-white">No Food business requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prs
            .filter((pr, i) => pr != null)
            .map((pr) => (
              <ViewFood
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
        <FoodBusinessHome
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setRefreshList((prev) => !prev);
          }}
        />
      )}
    </div>
  );
};

export default FoodFeasibility;