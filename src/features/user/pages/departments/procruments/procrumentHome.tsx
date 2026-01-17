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
    <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">

      {/* ================= HEADER ================= */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
  

        {/* ================= TABS ================= */}
        <div className="mt-4 md:mt-6">
          <div className="relative">
            {/* Mobile horizontal scroll */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 w-max rounded-full bg-white/10 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 rounded-full
                        px-4 sm:px-5 md:px-6 py-2 sm:py-2.5
                        text-sm sm:text-base font-medium transition
                        ${
                          active
                            ? "bg-white text-[#4b1b7a] shadow"
                            : "text-white/70 hover:text-white"
                        }`}
                    >
                      <Icon size={16} />
                      <span className="whitespace-nowrap">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb- md:pb-10">
        <div className="max-w-[3600px] mx-auto">
          {activeTab === "procurement" && <ProcurementPage />}
          {activeTab === "vendors" && <VendorPage />}
          {activeTab === "store" && <StorePage />}
          {activeTab === "others" && <Others />}
        </div>
      </div>
    </div>
  );
};

export default ProcurementHome;
