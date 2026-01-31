import React, { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import FeasibilityCard from "./Allfeasibility";

const UpdatedFeasibilityPage = () => {
  const [prs, setPrs] = useState<any[]>([]);

  useEffect(() => {
    fetchPRs();
  }, []);

  const fetchPRs = async () => {
    try {
      const res = await api.get("/business-development");
      const updatedPrs = res.data.data.filter((pr: any) => pr.feasibility_status);
      setPrs(updatedPrs);
    } catch (err) {
      console.error("Failed to fetch PRs", err);
    }
  };

  // Update a PR in state after BD update or Feasibility update
  const handleUpdate = (updatedPr: any) => {
    setPrs((prev) =>
      prev.map((pr) => (pr.id === updatedPr.id ? updatedPr : pr))
    );
  };

  return (
    <div className=" bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6 pt-12">
      <button
        className="
    px-4 sm:px-5
    py-2
    rounded-full
    font-medium
    text-sm sm:text-base
    whitespace-nowrap
    transition
    bg-white text-purple-700 shadow
  "
      >
        Updated Business BR
      </button>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {prs.map((pr) => (
          <FeasibilityCard
            key={pr.id}
            data={pr}
            mode="bd-update"
            onUpdate={handleUpdate}
          />

        ))}
      </div>
    </div>
  );
};

export default UpdatedFeasibilityPage;
