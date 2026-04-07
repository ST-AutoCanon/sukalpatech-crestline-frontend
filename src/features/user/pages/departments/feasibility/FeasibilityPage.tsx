// import React, { useState } from "react";
// import AllPRs from "../req_pages/requestpages";
// import UpdateFeasibility from "./UpdateFeasibility";
// import Viewfeasibility from "./ViewFeasibilityReq";

// const filters = ["All PR's", "Pending", "Rejected", "Completed"] as const;
// type FilterType = (typeof filters)[number];
// type TabType = "allPR" | "updatePR";

// const FeasibilityPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>("allPR");
//   const [activeFilter, setActiveFilter] = useState<FilterType>("All PR's");
//   const [search, setSearch] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   return (
//     <div className="px-4 sm:px-6 pb-6 w-full">
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 mt-6 sm:mt-9">

//         {/* FILTER TABS */}
//         <div className="flex gap-4 sm:gap-7 text-sm font-medium text-white overflow-x-auto no-scrollbar">
//           {filters.map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setActiveFilter(filter)}
//               className={`pb-1 whitespace-nowrap ${
//                 activeFilter === filter
//                   ? "border-b-2 border-white text-white"
//                   : "text-white/70 hover:text-white"
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>

//         {/* UPDATE PR BUTTON */}
//         <button
//           onClick={() => setActiveTab("updatePR")}
//           className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold text-white ${
//             activeTab === "updatePR" ? "bg-purple-700" : "bg-purple-500"
//           }`}
//         >
//           + Update PR
//         </button>
//       </div>

//       {/* ================= PR LIST / UPDATE ================= */}

//       {/* <Viewfeasibility
//         filter={activeFilter}
//         search={search}
//         refreshKey={refreshKey}
//         editable={true}
//       /> */}

//       {activeTab === "allPR" && (
//         <AllPRs
//           filter={activeFilter}
//           search={search}
//           refreshKey={refreshKey}
//         />
//       )}

//       {activeTab === "updatePR" && (
//         <UpdateFeasibility filter={activeFilter} />
//       )}
//     </div>
//   );
// };

// export default FeasibilityPage;


import React, { useState } from "react";
// import AllPRs from "../req_pages/requestpages";
import UpdateFeasibility from "./UpdateFeasibility";
import ViewPRPage from "./ViewFeasibilityReq";


const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
type TabType = "allPR" | "updatePR";


const FeasibilityPage: React.FC = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All PR");

  const [openCreatePR, setOpenCreatePR] = useState(false);
  const [showUpdatePage, setShowUpdatePage] = useState(false);

  const [selectedPR, setSelectedPR] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 IMPORTANT


  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 px-6 py-4">
        <div className="flex flex-wrap sm:flex-nowrap sm:justify-between sm:items-center gap-2 sm:gap-0">

          {/* FILTER TABS */}
          <div className="flex flex-wrap gap-3 sm:gap-7 text-sm font-medium text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowUpdatePage(false);
                }}
                className={`pb-1 ${activeFilter === filter
                  ? "border-b-2 border-white text-white"
                  : "text-white/70"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => {
                setShowUpdatePage(true);
              }}
              className="w-full sm:w-auto px-4 py-2  text-sm font-semibold text-white bg-purple-600"
            >
               Update PR
            </button>


          </div>



        </div>
      </div>



      {/* ================= PR LIST ================= */}
      {!showUpdatePage && (
        <ViewPRPage
          filter={activeFilter}
          search={search}
          refreshKey={refreshKey}
        />
      )}

      {/* UPDATE PAGE */}
      {showUpdatePage && (
        <UpdateFeasibility
          onClose={() => setShowUpdatePage(false)}
        />
      )}



    </>
  );
};

export default FeasibilityPage;


