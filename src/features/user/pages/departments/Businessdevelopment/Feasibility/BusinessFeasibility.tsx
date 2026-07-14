import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import FeasibilityCard from "./Allfeasibility";

const FeasibilityPage = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];

  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");
  const [activeTab, setActiveTab] = useState<"all" | "update">("all");
  useEffect(() => {
    api.get("/business-development").then((res) => {
      setPrs(res.data.data); // ✅ FIX
    });
  }, []);

  const handleUpdateSuccess = (updated: any) => {
    setPrs((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const filteredPRs = prs.filter((pr) => {
    if (activeFilter === "All PR") return true;

    if (activeFilter === "Pending") return pr.feasibility_status === "PENDING";
    if (activeFilter === "Rejected") return pr.feasibility_status === "REJECTED";
    if (activeFilter === "Completed") return pr.feasibility_status === "APPROVED";

    return true;
  });

  return (
    <div className="p-6 pt-12">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-4 mt-2 text-white">

        {/* LEFT: FILTER TABS */}
       <div className="flex gap-6 text-white mb-5">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`pb-1 ${activeFilter === filter ? "border-b-2 border-white" : "text-white/70"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

        {/* RIGHT: UPDATE BUTTON */}
        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 py-2  text-sm font-semibold text-white ${activeTab === "update"
              ? "bg-purple-600"
              : "bg-purple-600/70"
            }`}
        >
          Update BR
        </button>

      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-5">
        {filteredPRs.map((pr) => (
          <FeasibilityCard
            key={pr.id}   // ✅ unique key
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