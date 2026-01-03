// import React, { useState } from "react";
// import Procurement from "./Procurement"; // Create PR
// import AllPRs from "./getAll_procurements"; // View PRs
// import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs"
// import EmployeeDashboard from "./procrumentHome"; // import the component

// const ProcurementPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<
//     "newPR" | "allPRs" | "FinanceApprovedPR"
//   >("newPR");
//   const [showDashboard, setShowDashboard] = useState(false);

//   if (showDashboard) {
//     return <EmployeeDashboard />; // render dashboard directly
//   }
//   return (
//     <div className="p-10 max-w-4xl mx-auto">
//       <button
//         className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         onClick={() => setShowDashboard(true)} // show dashboard
//       >
//         Back to Dashboard
//       </button>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
//         Procurement Requests
//       </h1>

//       {/* --------- TOP BUTTONS ---------- */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "newPR"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("newPR")}
//         >
//           Create New PR
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "allPRs"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("allPRs")}
//         >
//           View All PRs
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "FinanceApprovedPR"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("FinanceApprovedPR")}
//         >
//           Update PR
//         </button>
//       </div>

//       {/* ---------- CONTENT SECTION BELOW ---------- */}
//       <div className="mt-4">
//         {activeTab === "newPR" && <Procurement />}
//         {activeTab === "allPRs" && <AllPRs />}
//         {activeTab === "FinanceApprovedPR" && <FinanceApprovedPR />}
//       </div>
//     </div>
//   );
// };

// export default ProcurementPage;






// import React, { useState } from "react";
// import { Plus, Search } from "lucide-react";
// import AllPRs from "./getAll_procurements";
// import Procurement from "./Procurement";

// const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

// const ProcurementPage: React.FC = () => {
//   const [activeFilter, setActiveFilter] =
//     useState<(typeof filters)[number]>("PR Raised");
//   const [openPR, setOpenPR] = useState(false);
//   const [search, setSearch] = useState("");

//   return (
//     <>
//       {/* ================= FILTER BAR ================= */}
//       <div className="mt-6 px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* LEFT: FILTER TABS */}
//           <div className="flex gap-8 text-sm font-medium text-white">
//             {filters.map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`relative pb-1 transition-all ${activeFilter === filter
//                     ? "font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
//                     : "text-white/70 hover:text-white"
//                   }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>

//           {/* RIGHT: SEARCH + CREATE */}
//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <div className="relative w-56">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-9 w-full rounded-md border border-gray-300 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
//               />
//               <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>

//             {/* Create PR Button */}
//             <button
//               onClick={() => setOpenPR(true)}
//               className="
//                 flex items-center gap-2
//                 rounded-lg
//                 bg-gradient-to-r from-blue-500 to-purple-600
//                 px-5 py-2.5
//                 text-sm font-medium text-white
//                 shadow-md
//                 hover:from-blue-600 hover:to-purple-700
//                 transition
//               "
//             >
//               <Plus size={16} />
//               Create New PR
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= PR GRID ================= */}
//       <div className="mt-6">
//         <AllPRs filter={activeFilter} search={search} />
//       </div>

//       {/* ================= MODAL ================= */}
//       {openPR && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center ">
//           <Procurement onClose={() => setOpenPR(false)} />
//         </div>
//       )}
//     </>
//   );
// };

// export default ProcurementPage;


// import React, { useState } from "react";
// import { Plus, Search } from "lucide-react";
// import AllPRs from "./getAll_procurements";
// import Procurement from "./Procurement";
// import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs";

// const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

// const ProcurementPage: React.FC = () => {
//   const [activeFilter, setActiveFilter] =
//     useState<(typeof filters)[number]>("PR Raised");
//   const [openPR, setOpenPR] = useState(false);
//   const [openUpdatePR, setOpenUpdatePR] = useState(false);
//   const [search, setSearch] = useState("");

//   return (
//     <>
//       {/* ================= FILTER BAR ================= */}
//       <div className="mt-6 px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* LEFT: FILTER TABS */}
//           <div className="flex gap-8 text-sm font-medium text-white">
//             {filters.map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`relative pb-1 transition-all ${
//                   activeFilter === filter
//                     ? "font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
//                     : "text-white/70 hover:text-white"
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>

//           {/* RIGHT: SEARCH + BUTTONS */}
//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <div className="relative w-56">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-9 w-full rounded-md border border-gray-300 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
//               />
//               <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>

//             {/* Update PR Button */}
//             <button
//               onClick={() => setOpenUpdatePR(true)}
//               className="
//                 flex items-center gap-2
//                 rounded-lg
//                 bg-gradient-to-r from-green-500 to-emerald-600
//                 px-5 py-2.5
//                 text-sm font-medium text-white
//                 shadow-md
//                 hover:from-green-600 hover:to-emerald-700
//                 transition
//               "
//             >
//               Update PR
//             </button>

//             {/* Create PR Button */}
//             <button
//               onClick={() => setOpenPR(true)}
//               className="
//                 flex items-center gap-2
//                 rounded-lg
//                 bg-gradient-to-r from-blue-500 to-purple-600
//                 px-5 py-2.5
//                 text-sm font-medium text-white
//                 shadow-md
//                 hover:from-blue-600 hover:to-purple-700
//                 transition
//               "
//             >
//               <Plus size={16} />
//               Create New PR
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= PR GRID ================= */}
//       <div className="mt-6">
//         <AllPRs filter={activeFilter} search={search} />
//       </div>

//       {/* ================= CREATE MODAL ================= */}
//       {openPR && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <Procurement onClose={() => setOpenPR(false)} />
//         </div>
//       )}

//       {/* ================= UPDATE MODAL ================= */}
//       {openUpdatePR && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <FinanceApprovedPR onClose={() => setOpenUpdatePR(false)} />
//         </div>
//       )}
//     </>
//   );
// };

// export default ProcurementPage;


// import React, { useState } from "react";
// import { Plus, Search } from "lucide-react";
// import AllPRs from "./getAll_procurements";
// import Procurement from "./Procurement";
// import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs";

// const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

// const ProcurementPage: React.FC = () => {
//   const [activeFilter, setActiveFilter] =
//     useState<(typeof filters)[number]>("PR Raised");

//   const [openCreatePR, setOpenCreatePR] = useState(false);
//   const [showUpdatePage, setShowUpdatePage] = useState(false);
//   const [search, setSearch] = useState("");

//   return (
//     <>
//       {/* ================= FILTER BAR ================= */}
//       <div className="mt-6 px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* LEFT FILTERS */}
//           <div className="flex gap-8 text-sm font-medium text-white">
//             {filters.map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`relative pb-1 transition-all ${
//                   activeFilter === filter
//                     ? "font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
//                     : "text-white/70 hover:text-white"
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>

//           {/* RIGHT BUTTONS */}
//           <div className="flex items-center gap-4">
//             {/* SEARCH */}
//             <div className="relative w-56">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-9 w-full rounded-md border border-gray-300 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
//               />
//               <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>

//             {/* UPDATE PR PAGE BUTTON */}
//             <button
//               onClick={() => setShowUpdatePage(true)}
//               className="
//                 flex items-center gap-2
//                 rounded-lg
//                 bg-gradient-to-r from-green-500 to-emerald-600
//                 px-5 py-2.5
//                 text-sm font-medium text-white
//                 shadow-md
//                 hover:from-green-600 hover:to-emerald-700
//                 transition
//               "
//             >
//               Update PR
//             </button>

//             {/* CREATE NEW PR */}
//             <button
//               onClick={() => setOpenCreatePR(true)}
//               className="
//                 flex items-center gap-2
//                 rounded-lg
//                 bg-gradient-to-r from-blue-500 to-purple-600
//                 px-5 py-2.5
//                 text-sm font-medium text-white
//                 shadow-md
//                 hover:from-blue-600 hover:to-purple-700
//                 transition
//               "
//             >
//               <Plus size={16} />
//               Create New PR
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= MAIN CONTENT ================= */}

//       {/* SHOW VIEW ALL (DEFAULT) */}
//       {!showUpdatePage && (
//         <div className="mt-6">
//           <AllPRs filter={activeFilter} search={search} />
//         </div>
//       )}

//       {/* SHOW UPDATE PAGE (REPLACES VIEW ALL) */}
//       {showUpdatePage && (
//         <FinanceApprovedPR onClose={() => setShowUpdatePage(false)} />
//       )}

//       {/* ================= CREATE MODAL ================= */}
//       {openCreatePR && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <Procurement onClose={() => setOpenCreatePR(false)} />
//         </div>
//       )}
//     </>
//   );
// };

// export default ProcurementPage;


import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import AllPRs from "./getAll_procurements";
import Procurement from "./Procurement";
import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs";

const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

const ProcurementPage: React.FC = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("PR Raised");

  const [openCreatePR, setOpenCreatePR] = useState(false);
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT FILTERS */}
          <div className="flex gap-8 text-sm font-medium text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowUpdatePage(false); // <<< IMPORTANT FIX
                }}
                className={`relative pb-1 transition-all ${
                  activeFilter === filter
                    ? "font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative w-56">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* UPDATE PR PAGE BUTTON */}
            <button
              onClick={() => setShowUpdatePage(true)}
              className="
                flex items-center gap-2
                rounded-lg
                bg-gradient-to-r from-green-500 to-emerald-600
                px-5 py-2.5
                text-sm font-medium text-white
                shadow-md
                hover:from-green-600 hover:to-emerald-700
                transition
              "
            >
              Update PR
            </button>

            {/* CREATE NEW PR */}
            <button
              onClick={() => setOpenCreatePR(true)}
              className="
                flex items-center gap-2
                rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600
                px-5 py-2.5
                text-sm font-medium text-white
                shadow-md
                hover:from-blue-600 hover:to-purple-700
                transition
              "
            >
              <Plus size={16} />
              Create New PR
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      {/* VIEW ALL PRs */}
      {!showUpdatePage && (
        <div className="mt-6">
          <AllPRs filter={activeFilter} search={search} />
        </div>
      )}

      {/* UPDATE PAGE */}
      {showUpdatePage && (
        <FinanceApprovedPR onClose={() => setShowUpdatePage(false)} />
      )}

      {/* ================= CREATE MODAL ================= */}
      {openCreatePR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Procurement onClose={() => setOpenCreatePR(false)} />
        </div>
      )}
    </>
  );
};

export default ProcurementPage;
