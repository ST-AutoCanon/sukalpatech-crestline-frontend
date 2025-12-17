import React, { useState } from "react";
import ProcurementPage from "./ProcurementPage";
import VendorPage from "./vendors/VendorPage"; // placeholder for vendor actions
import StorePage from "./store/StorePage";
import Others from "./others/others";
// imprt StorePage from "./store/StorePage"; // placeholder for store actions
const ProcurementHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "home" | "procurement" | "vendors" | "store" | "others"
  >("home");

  if (currentPage === "procurement") return <ProcurementPage />;
  if (currentPage === "vendors") return <VendorPage />;
  if (currentPage === "store") return <StorePage />;
  if (currentPage === "others") return <Others />;
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Procurement Card */}
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("procurement")}
        >
          <h2 className="text-xl font-semibold mb-2">Procurement</h2>
          <p className="text-gray-600 text-center">Manage PRs</p>
        </div>

        {/* Vendor Card */}
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("vendors")}
        >
          <h2 className="text-xl font-semibold mb-2">Vendors</h2>
          <p className="text-gray-600 text-center">Manage Vendors</p>
        </div>
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("store")}
        >
          <h2 className="text-xl font-semibold mb-2">Store</h2>
          <p className="text-gray-600 text-center">Manage Store</p>
        </div>
        <div
          className="p-6 border rounded shadow hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center"
          onClick={() => setCurrentPage("others")}
        >
          <h2 className="text-xl font-semibold mb-2">Others</h2>
          <p className="text-gray-600 text-center">Manage Others</p>
        </div>
      </div>
    </div>
  );
};

export default ProcurementHome;
