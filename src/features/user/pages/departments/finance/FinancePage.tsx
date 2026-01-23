// import React, { useState } from "react";
// import UpdateFinance from "./UpdateFinance";
// import ViewFinanceRequests from "./ViewFinanceRequests";

// const FinancePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"view" | "update">("view");

//   return (
//     <div className="px-4 sm:px-6 pb-6 w-full">

//       {/* HEADER ROW */}
//       <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
//         {/* LEFT: Tabs */}
//         <h2
//           onClick={() => setActiveTab("view")}
//           className={`cursor-pointer text-lg font-semibold pb-1 ${activeTab === "view"
//               ? "text-white border-b-2 border-white"
//               : "text-gray-500"
//             }`}
//         >
//           All PR's
//         </h2>

//         {/* RIGHT: Button */}
//         <button
//           onClick={() => setActiveTab("update")}
//           className="h-8 sm:h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white hover:opacity-90 transition whitespace-nowrap"
//         >
//           + Update PR
//         </button>
//       </div>


//       {/* CONTENT */}
//       <div className="w-full">
//         {activeTab === "view" && <ViewFinanceRequests />}
//         {activeTab === "update" && <UpdateFinance />}
//       </div>
//     </div>
//   );
// };

// export default FinancePage;


import React, { useState } from "react";
import ViewFinanceRequests from "./ViewFinanceRequests";
import UpdateFinance from "./UpdateFinance";

type TabType = "all" | "pending" | "rejected" | "update";

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabClass = (tab: TabType) =>
    `cursor-pointer text-lg font-semibold pb-1 ${
      activeTab === tab ? "text-white border-b-2 border-white" : "text-gray-500"
    }`;

  return (
    <div className="px-4 sm:px-6 pb-6 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        {/* LEFT: Tabs */}
        <div className="flex gap-6">
          <h2 onClick={() => setActiveTab("all")} className={tabClass("all")}>
            All PRs
          </h2>

          <h2
            onClick={() => setActiveTab("pending")}
            className={tabClass("pending")}
          >
            Pending PRs
          </h2>

          <h2
            onClick={() => setActiveTab("rejected")}
            className={tabClass("rejected")}
          >
            Rejected PRs
          </h2>
        </div>

        {/* RIGHT */}
        <button
          onClick={() => setActiveTab("update")}
          className="h-8 sm:h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white"
        >
          + Update PR
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "all" && <ViewFinanceRequests status="all" />}
      {activeTab === "pending" && <ViewFinanceRequests status="pending" />}
      {activeTab === "rejected" && <ViewFinanceRequests status="rejected" />}
      {activeTab === "update" && <UpdateFinance />}
    </div>
  );
};

export default FinancePage;
