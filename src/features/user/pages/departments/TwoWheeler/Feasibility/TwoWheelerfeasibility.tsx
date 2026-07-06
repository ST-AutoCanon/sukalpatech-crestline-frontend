import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewTwoWheeler from "../Business/ViewTwoWheelerpage"; // Card component for 2W BRs
import TwoWheelerHome from "../Business/TwoWheelerHome"; // Modal form for creating 2W BRs

const TwoWheelerFeasibility: React.FC = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];

  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  // Fetch 2W data
  useEffect(() => {
    const fetch2W = async () => {
      setLoading(true);
      try {
        const res = await api.get("/business-development/2w/list");
        console.log("2W API response:", res.data);

        // Make sure we always assign an array
        const resData = res.data;

        if (!resData.success) {
          setPrs([]);
          return;
        }

        setPrs(Array.isArray(resData.data) ? resData.data : []);
      } catch (err) {
        console.error("Fetch 2W error:", err);
        setPrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetch2W();
  }, [refreshList]);

  // Update a single BR after edit
  const handleUpdateSuccess = (updated: any) => {
    setPrs((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };


  useEffect(() => {
    const fetch2W = async () => {
      setLoading(true);
      try {
        const status =
          activeFilter === "All PR"
            ? "ALL"
            : activeFilter.toUpperCase();

        const res = await api.get(
          `/business-development/2w/list?status=${status}`
        );

        if (res.data.success) {
          setPrs(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setPrs([]);
        }
      } catch (err) {
        console.error(err);
        setPrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetch2W();
  }, [refreshList, activeFilter]);
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
        <p className="text-white">Loading 2W BRs...</p>
      ) : prs.length === 0 ? (
        <p className="text-white">No 2W business requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prs.map((pr, i) => (
            <ViewTwoWheeler
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
        <TwoWheelerHome
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

export default TwoWheelerFeasibility;