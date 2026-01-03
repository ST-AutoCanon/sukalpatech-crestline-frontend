// import React, { useState } from "react";
// import FeasibilityPage from "./FeasibilityPage";
// import OthersPage from "./others/others"; // placeholder for other actions

// const FeasibilityHome: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<
//     "home" | "feasibility" | "others"
//   >("home");

//   if (currentPage === "feasibility") return <FeasibilityPage />;
//   if (currentPage === "others") return <OthersPage />;

//   return (
//     <div className="p-10 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Feasibility Card */}
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("feasibility")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Feasibility</h2>
//           <p className="text-gray-600 text-center">
//             Manage PR Feasibility Requests
//           </p>
//         </div>

//         {/* Others Card */}
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("others")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Others</h2>
//           <p className="text-gray-600 text-center">Other Actions / Requests</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeasibilityHome;




import React, { useState } from "react";
import FeasibilityPage from "./FeasibilityPage";
import OthersPage from "./others/others"; // placeholder for other actions
import { Check } from "lucide-react";

const FeasibilityHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feasibility" | "others">(
    "feasibility"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 px-8 py-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-white mt-5">Feasibility</h1>

      {/* TABS */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setActiveTab("feasibility")}
          className={`px-5 py-2 rounded-full font-medium ${
            activeTab === "feasibility"
              ? "bg-white text-purple-700"
              : "bg-white/10 text-white"
          }`}
        >
          Feasibility
        </button>

        <button
          onClick={() => setActiveTab("others")}
          className={`px-5 py-2 rounded-full font-medium ${
            activeTab === "others"
              ? "bg-white text-purple-700"
              : "bg-white/10 text-white"
          }`}
        >
          Others
        </button>
      </div>

      {/* DYNAMIC TAB CONTENT */}
      <div className="pt-10">
        {activeTab === "feasibility" && <FeasibilityPage />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FeasibilityHome;
