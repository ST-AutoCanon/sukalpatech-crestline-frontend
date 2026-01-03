// import React, { useState } from "react";
// import FesibilityDashboard from "./FeasibilityHome"; // import the component
// import UpdateFeasibility from "./UpdateFeasibility"; // Form/page to update feasibility
// import ViewFeasibilityRequests from "./ViewFeasibilityReq"; // Page to view PRs

// const FeasibilityPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"update" | "view">("update");
//   const [showDashboard, setShowDashboard] = useState(false);

//   if (showDashboard) {
//     return <FesibilityDashboard />; // render dashboard directly
//   }
//   return (
//     <div className="p-10 max-w-4xl mx-auto">
//       <button
//         className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-60 mb-5"
//         onClick={() => setShowDashboard(true)} // show dashboard
//       >
//         Back to Dashboard
//       </button>

//       <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
//         Feasibility Requests
//       </h1>

//       {/* --------- TOP BUTTONS ---------- */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "update"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("update")}
//         >
//           Update Feasibility
//         </button>

//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "view"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("view")}
//         >
//           View Feasibility Requests
//         </button>
//       </div>

//       {/* ---------- CONTENT SECTION BELOW ---------- */}
//       <div className="mt-4">
//         {activeTab === "update" && <UpdateFeasibility />}
//         {activeTab === "view" && <ViewFeasibilityRequests />}
//       </div>
//     </div>
//   );
// };

// export default FeasibilityPage;



import React, { useState } from "react";
import UpdateFeasibility from "./UpdateFeasibility";
import ViewFeasibilityRequests from "./ViewFeasibilityReq";
import { Search } from "lucide-react";

const FeasibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "update">("view");
  const [search, setSearch] = useState("");

  return (
    <div className="px-6 pb-6 w-full">
      {/* HEADER ROW */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        {/* LEFT */}
        <div className="flex gap-4">
          <h2
            onClick={() => setActiveTab("view")}
            className={`cursor-pointer text-lg font-semibold inline-block pb-1 ${
              activeTab === "view"
                ? "text-white border-b-2 border-white"
                : "text-gray-500"
            }`}
          >
            All Feasibility
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
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

          <button
            onClick={() => setActiveTab("update")}
            className="h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 text-sm font-medium text-white hover:opacity-90 transition"
          >
            + Update Feasibility
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === "view" && <ViewFeasibilityRequests />}
      {activeTab === "update" && (
        <UpdateFeasibility onBack={() => setActiveTab("view")} />
      )}
    </div>
  );
};

export default FeasibilityPage;
