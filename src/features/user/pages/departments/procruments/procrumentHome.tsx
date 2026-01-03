// import React, { useState } from "react";
// import ProcurementPage from "./ProcurementPage";
// import VendorPage from "./vendors/VendorPage"; // placeholder for vendor actions
// import StorePage from "./store/StorePage";
// import Others from "./others/others";
// // imprt StorePage from "./store/StorePage"; // placeholder for store actions
// const ProcurementHome: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<
//     "home" | "procurement" | "vendors" | "store" | "others"
//   >("home");

//   if (currentPage === "procurement") return <ProcurementPage />;
//   if (currentPage === "vendors") return <VendorPage />;
//   if (currentPage === "store") return <StorePage />;
//   if (currentPage === "others") return <Others />;
//   return (
//     <div className="p-10 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Procurement Card */}
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("procurement")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Procurement</h2>
//           <p className="text-gray-600 text-center">Manage PRs</p>
//         </div>

//         {/* Vendor Card */}
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("vendors")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Vendors</h2>
//           <p className="text-gray-600 text-center">Manage Vendors</p>
//         </div>
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("store")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Store</h2>
//           <p className="text-gray-600 text-center">Manage Store</p>
//         </div>
//         <div
//           className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
//           onClick={() => setCurrentPage("others")}
//         >
//           <h2 className="text-xl font-semibold mb-2">Others</h2>
//           <p className="text-gray-600 text-center">Manage Others</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProcurementHome;



import React, { useState } from "react";
import { Package, Users, Store, ShoppingCart } from "lucide-react";

import ProcurementPage from "./ProcurementPage";
import VendorPage from "./vendors/VendorPage";
import StorePage from "./store/StorePage";
import Others from "./others/others";

const tabs = [
  { key: "procurement", label: "Procurement", icon: Package },
  { key: "vendors", label: "Vendors", icon: Users },
  { key: "store", label: "Store", icon: Store },
  { key: "others", label: "Others", icon: ShoppingCart }
] as const;

const ProcurementHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "procurement" | "vendors" | "store" | "others"
  >("procurement");

  return (
    /* ===== ONE CONTINUOUS GRADIENT ===== */
    <div className="w-full h-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">

      {/* ================= HEADER ================= */}
      <div className="w-full pt-8 px-8">
        <h1 className=" text-3xl font-semibold">Procurement</h1>

        {/* Tabs */}
        <div className="flex w-fit gap-2 rounded-full bg-white/10 p-2 mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition
                  ${active
                    ? "bg-white text-[#4b1b7a] shadow"
                    : "text-white/70 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CONTENT (NO BACKGROUND) ================= */}
      <div className="px-10 pb-10 pt-6">
        {activeTab === "procurement" && <ProcurementPage />}
        {activeTab === "vendors" && <VendorPage />}
        {activeTab === "store" && <StorePage />}
        {activeTab === "others" && <Others />}
      </div>
    </div>
  );
};

export default ProcurementHome;
