// import React, { useState } from "react";

// import UpdateFeasibility from "./UpdateFeasibility";
// import ViewFeasibilityRequests from "./ViewFeasibilityReq";
// import Allfeasibility from "../Businessdevelopment/Allfeasibility";
// import feasibility from "../Businessdevelopment/Feasibility";

// const FeasibilityPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"view" | "update">("view");

//   return (
//     <div className="px-6 pb-6 w-full">
//       {/* HEADER ROW */}
//       <div className="relative z-10 flex items-center justify-between mb-6">
//         {/* LEFT */}
//         <div className="flex gap-4">
//           <h2
//             onClick={() => setActiveTab("view")}
//             className={`cursor-pointer text-lg font-semibold inline-block pb-1 ${activeTab === "view"
//               ? "text-white border-b-2 border-white"
//               : "text-gray-500"
//               }`}
//           >
//             All PR's
//           </h2>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">


//           <button
//             onClick={() => setActiveTab("update")}
//             className="h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 text-sm font-medium text-white hover:opacity-90 transition"
//           >
//             + Update PR
//           </button>
//         </div>
//       </div>

//       {/* CONTENT */}
//       {activeTab === "view" && <ViewFeasibilityRequests />}
//       {activeTab === "update" && (
//         <UpdateFeasibility onBack={() => setActiveTab("view")} />
//       )}
//     </div>
//   );
// };

// export default FeasibilityPage;


import React, { useState } from "react";

import ViewFeasibilityRequests from "./ViewFeasibilityReq";
import UpdateFeasibility from "./UpdateFeasibility";


type TabType = "allPR" | "updatePR" | "allBD" | "updateBD";

const FeasibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("allPR");

  return (
    <div className="px-6 pb-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 mt-9">
        {/* LEFT — TABS */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("allPR")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white ${
              activeTab === "allPR" ? "bg-purple-700" : "bg-purple-400"
            }`}
          >
            All PRs
          </button>

         
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("updatePR")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${
              activeTab === "updatePR"
                ? "bg-indigo-700"
                : "bg-indigo-500"
            }`}
          >
            + Update PR
          </button>

          
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {/* FEASIBILITY */}
      {activeTab === "allPR" && <ViewFeasibilityRequests />}
      {activeTab === "updatePR" && <UpdateFeasibility />}

     
    </div>
  );
};

export default FeasibilityPage;
