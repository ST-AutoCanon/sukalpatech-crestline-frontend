import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewThreeWheeler from "../Business/ViewThreeWheelerpage"; // Card component for 2W BRs
import ThreeWheelerHome from "../Business/ThreeWheelerHome"; // Modal form for creating 2W BRs

const TwoWheelerFeasibility: React.FC = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  // Fetch 3W data
  useEffect(() => {
    const fetch3W = async () => {
      setLoading(true);
      try {
        const res = await api.get("/business-development/3w/list");
        console.log("3W API response:", res.data);

        // Make sure we always assign an array
        const dataArray = Array.isArray(res.data.data)
          ? res.data.data
          : res.data?.data?.data || [];
        setPrs(dataArray);
      } catch (err) {
        console.error("Fetch 3W error:", err);
        setPrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetch3W();
  }, [refreshList]);

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
        <div
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer text-white ${
            activeTab === "all" ? "bg-purple-700" : "bg-purple-300"
          }`}
        >
          All 3W BRs
        </div>
        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm text-white border-none cursor-pointer ${
            activeTab === "update" ? "bg-purple-700" : "bg-purple-300"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prs.map((pr,i) => (
            <ViewThreeWheeler
              key={pr.id}
              data={pr}
              mode={activeTab}
              onUpdate={handleUpdateSuccess}
               cardIndex={i}
            />
          ))}
        </div>
      )}

      {/* CREATE / MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-start bg-black/30 p-4 overflow-auto">
          <div className="w-full max-w-3xl relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            <ThreeWheelerHome
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                setRefreshList((prev) => !prev); // Refresh list after creation
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoWheelerFeasibility;