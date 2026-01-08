


import React, { useState } from "react";
import AddVendor from "./AddVendor";
import AllVendors from "./AllVendors";
import EmployeeDashboard from "../procrumentHome"; // import the component
import { Plus } from "lucide-react";

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
          className={`cursor-pointer text-lg font-semibold transition-all ${activeTab === "allVendors"
            ? "text-white border-b-2 border-white pb-1"
            : "text-white/70 hover:text-white"
            }`}
        >
          All Vendors
        </p>


        {/* RIGHT */}
        <div className="flex items-center gap-4">

          

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

