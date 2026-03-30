// import React, { useEffect, useState } from "react";
// import { api } from "../../../../api/businessApi";
// import FeasibilityCard from "./Allfeasibility";
// import { useNavigate } from "react-router-dom";


// const UpdatedFeasibilityPage = () => {
//   const [prs, setPrs] = useState<any[]>([]);
//   const navigate = useNavigate();


//   useEffect(() => {
//     fetchPRs();
//   }, []);

//   //   const fetchPRs = async () => {
//   //   try {
//   //     const token = localStorage.getItem("token");

//   //     const res = await api.get("/business-development", {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });

//   //     const updatedPrs = res.data.data.filter(
//   //       (pr: any) => pr.feasibility_status
//   //     );

//   //     setPrs(updatedPrs);
//   //   } catch (err) {
//   //     console.error("Failed to fetch PRs", err);
//   //   }
//   // };


//   // Update a PR in state after BD update or Feasibility update

//   const fetchPRs = async () => {
//     try {
//       const res = await api.get("/business-development");

//       const updatedPrs = res.data.data.filter(
//         (pr: any) => pr.feasibility_status,
//       );

//       setPrs(updatedPrs);
//     } catch (err) {
//       console.error("Failed to fetch PRs", err);
//     }
//   };
//   const handleUpdate = (updatedPr: any) => {
//     setPrs((prev) =>
//       prev.map((pr) => (pr.id === updatedPr.id ? updatedPr : pr))
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6 pt-12">
//       <button
//         onClick={() => navigate(-1)}
//         className="text-white font-bold text-4xl mr-10"
//       >
//         ←
//       </button>


//       <button
//         className="
//     px-4 sm:px-5
//     py-2
//     rounded-full
//     font-medium
//     text-sm sm:text-base
//     whitespace-nowrap
//     transition
//     bg-white text-purple-700 shadow
//   "
//       >
//         Updated Business BR
//       </button>


//       <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
//         {prs.map((pr) => (  // <-- add index here
//           <FeasibilityCard
//             key={pr.id}
//             data={pr}
//             mode="bd-update"
//             onUpdate={handleUpdate}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UpdatedFeasibilityPage;

import React, { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import FeasibilityCard from "./Allfeasibility";

const UpdatedFeasibilityPage = () => {
  const [prs, setPrs] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];


  useEffect(() => {
    fetchPRs();
  }, []);

  const fetchPRs = async () => {
    try {
      const res = await api.get("/business-development");
      // Only keep PRs with feasibility_status for updated page
      const updatedPrs = res.data.data.filter(
        (pr: any) => pr.feasibility_status
      );
      setPrs(updatedPrs);
    } catch (err) {
      console.error("Failed to fetch PRs", err);
    }
  };

  // Filter PRs based on activeFilter
  const filteredPRs = prs.filter((pr) => {
    switch (activeFilter) {
      case "Pending":
        return pr.status === "Pending";
      case "Rejected":
        return pr.status === "Rejected";
      case "Completed":
        return pr.status === "Completed";
      case "All PR":
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6 pt-6">

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto gap-3 sm:gap-1 text-sm font-medium text-white w-full sm:w-auto mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`pb-1 px-2 sm:px-4 ${
              activeFilter === filter
                ? "border-b-2 border-white text-white"
                : "text-white/70"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* PR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPRs.map((pr) => (
          <FeasibilityCard
            key={pr.id}
            data={pr}
            mode="bd-update"
            onUpdate={(updatedPr: any) => {
              setPrs((prev) =>
                prev.map((p) => (p.id === updatedPr.id ? updatedPr : p))
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UpdatedFeasibilityPage;
