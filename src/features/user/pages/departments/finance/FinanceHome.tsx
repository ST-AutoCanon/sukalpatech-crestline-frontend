// import React, { useState } from "react";
// import FinancePage from "./FinancePage";
// import OthersPage from "./others/others"; // placeholder for other actions

// const FinanceHome: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<"home" | "finance" | "others">(
//     "home"
//   );

//   if (currentPage === "finance") return <FinancePage />;
//   if (currentPage === "others") return <OthersPage />;

//   return (
//     <div className="p-10 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         Finance Dashboard
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Finance Card */}
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("finance")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Finance</h2>
//           <p className="text-gray-600 text-center">
//             Manage PR Finance Requests
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

// export default FinanceHome;



import React, { useState } from "react";
import FinancePage from "./FinancePage";
import OthersPage from "./others/others"; // placeholder for other actions
import { Check } from "lucide-react";

const FinanceHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Finance" | "others">(
    "Finance"
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 px-8 py-6">
   
      {/* TABS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setActiveTab("Finance")}
          className={`px-5 py-2 rounded-full font-medium ${activeTab === "Finance"
              ? "bg-white text-purple-700"
              : "bg-white/10 text-white"
            }`}
        >
          Finance
        </button>

        <button
          onClick={() => setActiveTab("others")}
          className={`px-5 py-2 rounded-full font-medium ${activeTab === "others"
              ? "bg-white text-purple-700"
              : "bg-white/10 text-white"
            }`}
        >
          Others
        </button>
      </div>


      {/* DYNAMIC TAB CONTENT */}
      <div className="pt-10">
        {activeTab === "Finance" && <FinancePage />}
        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};


export default FinanceHome;
