

import React, { useState } from "react";
import UpdateFinance from "./UpdateFinance";
import ViewFinanceRequests from "./ViewFinanceRequests";

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "update">("view");

  return (
    <div className="px-4 sm:px-6 pb-6 w-full">

      {/* HEADER ROW */}
      {/* HEADER ROW */}
<div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
  {/* LEFT: Tabs */}
  <h2
    onClick={() => setActiveTab("view")}
    className={`cursor-pointer text-lg font-semibold pb-1 ${
      activeTab === "view"
        ? "text-white border-b-2 border-white"
        : "text-gray-500"
    }`}
  >
    All Finance
  </h2>

  {/* RIGHT: Button */}
  <button
    onClick={() => setActiveTab("update")}
    className="h-8 sm:h-9 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white hover:opacity-90 transition whitespace-nowrap"
  >
    + Update Finance
  </button>
</div>


      {/* CONTENT */}
      <div className="w-full">
        {activeTab === "view" && <ViewFinanceRequests />}
        {activeTab === "update" && <UpdateFinance />}
      </div>
    </div>
  );
};

export default FinancePage;
