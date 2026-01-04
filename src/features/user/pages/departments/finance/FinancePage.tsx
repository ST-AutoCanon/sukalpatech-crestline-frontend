// import React, { useState } from "react";
// import UpdateFinance from "./UpdateFinance"; // Form/page to update finance status
// import ViewFinanceRequests from "./ViewFinanceRequests"; // Page to view finance PRs
// import FinanceDashboard from "./FinanceHome"; // import the component

// const FinancePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"update" | "view">("update");
//  const [showDashboard, setShowDashboard] = useState(false);

//  if (showDashboard) {
//    return <FinanceDashboard />; // render dashboard directly
//  }
//   return (
//     <div className="p-10 max-w-4xl mx-auto">
//       <button
//         className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         onClick={() => setShowDashboard(true)} // show dashboard
//       >
//         Back to Dashboard
//       </button>

//       <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
//         Finance PR Requests
//       </h1>

//       {/* --------- TOP BUTTONS ---------- */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "update"
//               ? "bg-green-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("update")}
//         >
//           Update Finance
//         </button>

//         <button
//           className={`px-4 py-2 rounded ${
//             activeTab === "view"
//               ? "bg-green-600 text-white"
//               : "bg-gray-200 text-gray-800"
//           }`}
//           onClick={() => setActiveTab("view")}
//         >
//           View Finance Requests
//         </button>
//       </div>

//       {/* ---------- CONTENT SECTION BELOW ---------- */}
//       <div className="mt-4">
//         {activeTab === "update" && <UpdateFinance />}
//         {activeTab === "view" && <ViewFinanceRequests />}
//       </div>
//     </div>
//   );
// };

// export default FinancePage;


import React, { useState } from "react";
import UpdateFinance from "./UpdateFinance";
import ViewFinanceRequests from "./ViewFinanceRequests";
import { Search } from "lucide-react";

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "update">("view");
  const [search, setSearch] = useState("");

  return (
    <div className="px-6 pb-6 w-full">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        {/* LEFT: All Finance */}
        <div className="flex-1">
          <h2
            onClick={() => setActiveTab("view")}
            className={`cursor-pointer text-lg font-semibold inline-block pb-1 ${
              activeTab === "view"
                ? "text-white border-b-2 border-white"
                : "text-gray-500"
            }`}
          >
            All Finance
          </h2>
        </div>

        {/* RIGHT: Search + Create */}
        <div className="flex items-center gap-3">        

          <button
            onClick={() => setActiveTab("update")}
            className="h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 text-sm font-medium text-white hover:opacity-90 transition"
          >
            + Update Finance
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === "view" && <ViewFinanceRequests />}
      {activeTab === "update" && <UpdateFinance />}
    </div>
  );
};

export default FinancePage;
