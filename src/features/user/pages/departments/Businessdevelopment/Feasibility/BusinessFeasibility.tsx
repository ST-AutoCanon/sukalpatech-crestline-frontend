import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import FeasibilityCard from "./Allfeasibility";

const FeasibilityPage = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");

  useEffect(() => {
    api.get("/business-development").then((res) => {
      setPrs(res.data.data); // ✅ FIX
    });
  }, []);

  const handleUpdateSuccess = (updated: any) => {
    setPrs((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="p-6 pt-12">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6 mt-9">
        {/* LEFT — CURRENT VIEW */}
        <div
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer text-white ${activeTab === "all" ? "bg-purple-700" : "bg-purple-300"
            }`}
        >
          All BRs
        </div>

        {/* RIGHT — ACTION */}
        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm text-white border-none cursor-pointer ${activeTab === "update" ? "bg-purple-700" : "bg-purple-300"
            }`}
        >
           Update BR
        </button>
      </div>

      {/* CARD GRID — ALWAYS SHOWN */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-5">
        {prs.map((pr) => (  // <-- add index here
          <FeasibilityCard
            key={pr.id}
            data={pr}
            mode={activeTab}
            onUpdate={handleUpdateSuccess}
          />
        ))}
      </div>
    </div>

  );
};

export default FeasibilityPage;