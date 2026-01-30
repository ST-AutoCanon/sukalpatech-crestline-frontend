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
    <div className="p-6 pt-12">
      <h1 className="text-xl font-bold mb-6 text-purple-700">
        Updated Feasibility PRs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
