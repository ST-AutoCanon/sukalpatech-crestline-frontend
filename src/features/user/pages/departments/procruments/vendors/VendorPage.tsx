// import React, { useState } from "react";
// import AddVendor from "./AddVendor";
// import AllVendors from "./AllVendors";
// import EmployeeDashboard from "../procrumentHome"; // import the component

// const VendorPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"addVendor" | "allVendors">(
//     "addVendor"
//   );
//   const [showDashboard, setShowDashboard] = useState(false);

//   if (showDashboard) {
//     return <EmployeeDashboard />; // render dashboard directly
//   }
//   return (
//     <div className="p-10 max-w-4xl mx-auto">
//       {/* Back Button */}
//       <button
//         className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         onClick={() => setShowDashboard(true)} // show dashboard
//       >
//         Back to Dashboard
//       </button>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
//         Vendor Management
//       </h1>

//       {/* Top Buttons */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             activeTab === "addVendor"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setActiveTab("addVendor")}
//         >
//           Add Vendor
//         </button>

//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             activeTab === "allVendors"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setActiveTab("allVendors")}
//         >
//           View All Vendors
//         </button>
//       </div>

//       {/* Content Below */}
//       <div className="border p-6 rounded-xl shadow-md bg-white mt-4">
//         {activeTab === "addVendor" && <AddVendor />}
//         {activeTab === "allVendors" && <AllVendors />}
//       </div>
//     </div>
//   );
// };

// export default VendorPage;


import React, { useState } from "react";
import AddVendor from "./AddVendor";
import AllVendors from "./AllVendors";
import EmployeeDashboard from "../procrumentHome"; // import the component
import { Check, Plus, Search } from "lucide-react";

const VendorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"addVendor" | "allVendors">(
    "allVendors"
  );
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmployeeDashboard />; // render dashboard directly
  }

  return (
    <div className="px-6 py-4">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        {/* LEFT */}
        <p
          onClick={() => setActiveTab("allVendors")}
          className={`cursor-pointer text-lg font-semibold transition-all ${
            activeTab === "allVendors"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          All Vendors
        </p>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-white/60" />
            <input
              placeholder="Search"
              className="w-64 rounded-lg bg-white/10 pl-2 pr-3 py-2 text-sm text-white placeholder-white/60 outline-none"
            />
          </div>

          {/* ADD VENDOR */}
          <button
            onClick={() => setActiveTab("addVendor")}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
          >
            Add new Vendor
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === "allVendors" && <AllVendors />}

      {activeTab === "addVendor" && (
        <AddVendor
          key="add-vendor-modal"
          onClose={() => setActiveTab("allVendors")}
        />
      )}
    </div>
  );
};

export default VendorPage;

