// src/pages/businessDevGold/GoldBusinessFeasibility.tsx

import React, { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import ViewGold from "./viewgoldbusiness"; // Gold Card
import GoldBusinessHome from "./goldbusinessHome"; // Create Form

const GoldBusinessFeasibility: React.FC = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  /* ---------------- FETCH GOLD DATA ---------------- */
  useEffect(() => {
    const fetchGold = async () => {
      setLoading(true);
      try {
        const res = await api.get("/business-development/gold/list");

        console.log("Gold API response:", res.data);

        const dataArray = Array.isArray(res.data.data)
          ? res.data.data
          : res.data?.data?.data || [];

        setPrs(dataArray);
      } catch (err) {
        console.error("Fetch Gold error:", err);
        setPrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGold();
  }, [refreshList]);

  /* ---------------- UPDATE SINGLE ITEM ---------------- */
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
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer ${
            activeTab === "all" ? "bg-purple-700" : "bg-purple-300"
          }`}
        >
          All Gold BRs
        </div>

        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm border-none cursor-pointer ${
            activeTab === "update" ? "bg-purple-700" : "bg-purple-300"
          }`}
        >
          Update BR
        </button>

        
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading Gold BRs...</p>
      ) : prs.length === 0 ? (
        <p>No Gold business requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prs.map((pr,i) => (
            <ViewGold
              key={pr.id}
              data={pr}
              mode={activeTab}
              onUpdate={handleUpdateSuccess}
               cardIndex={i}
            />
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
     {showModal && (
  <GoldBusinessHome
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

export default GoldBusinessFeasibility;