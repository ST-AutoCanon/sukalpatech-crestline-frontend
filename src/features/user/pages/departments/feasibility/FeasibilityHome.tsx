
// import React, { useState } from "react";
// import FeasibilityPage from "./FeasibilityPage";
// import Feasibility from "../Businessdevelopment/Feasibility/BusinessFeasibility";
// import TwoWheelerFeasibility from "../TwoWheeler/Feasibility/TwoWheelerfeasibility";
// import ThreeWheelerFeasibility from "../ThreeWheeler/Feasibility/ThreeWheelerfeasibility";
// import FoodBusinessFeasibility from "../FoodBusiness/FeasibilityPages/FoodBusinessfeasibility";
// import GoldBusinessFeasibility from "../gold_business/Feasibility/goldbusinessfeasibility";
// import OthersPage from "./others/others";

// // Map businessType to its component
// const businessComponents = {
//   bd: Feasibility,
//   "2w": TwoWheelerFeasibility,
//   "3w": ThreeWheelerFeasibility,
//   food: FoodBusinessFeasibility,
//   gold: GoldBusinessFeasibility,
// };

// // Define a dynamic list for rendering buttons
// const businessTypes = [
//   { key: "bd", label: "BD" },
//   { key: "2w", label: "2 Wheeler" },
//   { key: "3w", label: "3 Wheeler" },
//   { key: "food", label: "Food" },
//   { key: "gold", label: "Gold" },
// ];

// const FeasibilityHome: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"feasibility" | "others">("feasibility");
//   const [requestType, setRequestType] = useState<"procurement" | "business">("procurement");
//   const [businessType, setBusinessType] = useState<keyof typeof businessComponents>("bd");

//   // Decide which component to render dynamically
//   const BusinessComponent = businessComponents[businessType];

//   return (
//     <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">

//       {/* TABS */}
// <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
//   <div className="flex flex-wrap gap-4 relative">

//     {/* Main Tabs */}
//     <button
//       onClick={() => {
//         setActiveTab("feasibility");
//         setRequestType("procurement");
//       }}
//       className={`px-4 py-2 rounded-full ${
//         activeTab === "feasibility" && requestType === "procurement"
//           ? "bg-white text-purple-700 shadow"
//           : "bg-white/10 text-white hover:bg-white/20"
//       }`}
//     >
//       Procurement Request
//     </button>

//     <button
//       onClick={() => {
//         setActiveTab("feasibility");
//         setRequestType("business");
//       }}
//       className={`px-4 py-2 rounded-full ${
//         activeTab === "feasibility" && requestType === "business"
//           ? "bg-white text-purple-700 shadow"
//           : "bg-white/10 text-white hover:bg-white/20"
//       }`}
//     >
//       Business Request
//     </button>

//     <button
//       onClick={() => setActiveTab("others")}
//       className={`px-4 py-2 rounded-full ${
//         activeTab === "others"
//           ? "bg-white text-purple-700 shadow"
//           : "bg-white/10 text-white hover:bg-white/20"
//       }`}
//     >
//       Others
//     </button>
//   </div>

//   {/* Subtabs (Directly below Business Request) */}
//   {activeTab === "feasibility" && requestType === "business" && (
//     <div className="flex flex-wrap gap-2 mt-8">
//       {businessTypes.map((b) => (
//         <button
//           key={b.key}
//           onClick={() => setBusinessType(b.key as keyof typeof businessComponents)}
//           className={`px-3 py-1 rounded-full ${
//             businessType === b.key
//               ? "bg-white text-purple-700 shadow"
//               : "bg-white/10 text-white hover:bg-white/20"
//           }`}
//         >
//           {b.label}
//         </button>
//       ))}
//     </div>
//   )}
// </div>

    
//       {/* TAB CONTENT */}
//       <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb-10">
//         {activeTab === "feasibility" && requestType === "procurement" && <FeasibilityPage />}
//         {activeTab === "feasibility" && requestType === "business" && <BusinessComponent />}
//         {activeTab === "others" && <OthersPage />}
//       </div>
//     </div>
//   );
// };

// export default FeasibilityHome;

import React, { useEffect, useState, useContext } from "react";
import FeasibilityPage from "./FeasibilityPage";
import Feasibility from "../Businessdevelopment/Feasibility/BusinessFeasibility";
import TwoWheelerFeasibility from "../TwoWheeler/Feasibility/TwoWheelerfeasibility";
import ThreeWheelerFeasibility from "../ThreeWheeler/Feasibility/ThreeWheelerfeasibility";
import FoodBusinessFeasibility from "../FoodBusiness/FeasibilityPages/FoodBusinessfeasibility";
import GoldBusinessFeasibility from "../gold_business/goldbusinessfeasibility";
import OthersPage from "./others/others";
import { AuthContext } from "../../../../../context/AuthContext";

/* ================= NORMALIZE FUNCTION ================= */
const normalize = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

/* ================= DEPARTMENT MAP ================= */
const departmentMap: Record<
  string,
  { key: string; component: any }
> = {
  bd: { key: "bd", component: Feasibility },
  twowheeler: { key: "2w", component: TwoWheelerFeasibility },
  threewheeler: { key: "3w", component: ThreeWheelerFeasibility },
  foodbusiness: { key: "food", component: FoodBusinessFeasibility },
  goldbusiness: { key: "gold", component: GoldBusinessFeasibility },
};

const FeasibilityHome: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState<"feasibility" | "others">("feasibility");
  const [requestType, setRequestType] = useState<"procurement" | "business">("procurement");

  const [businessType, setBusinessType] = useState<string>("");
  const [allowedBusinessTypes, setAllowedBusinessTypes] = useState<
    { key: string; component: any; permission?: string }[]
  >([]);

  /* ================= LABEL HELPER ================= */
  const getLabel = (key: string) => {
    switch (key) {
      case "bd": return "Bus Body";
      case "2w": return "2W Business";
      case "3w": return "3W Business";
      case "food": return "Food Business";
      case "gold": return "Gold Business";
      default: return key.toUpperCase();
    }
  };


  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    if (!user) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/departments/employees-departments`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("API failed: " + res.status);

        const result = await res.json();
        console.log("API RESULT:", result);

        const loggedUser = result.data.find(
          (emp: any) => emp.email === user?.email
        );

        console.log("LOGGED USER:", loggedUser);

        if (!loggedUser || !loggedUser.departments) {
          setAllowedBusinessTypes([]);
          return;
        }

        // ✅ Get ALL departments from all employees
const allDepartments = result.data.flatMap((emp: any) =>
  emp.departments || []
);

// ✅ Remove duplicates
const uniqueDepartments = Array.from(
  new Map(
    allDepartments.map((d: any) => [
      normalize(d.name),
      d
    ])
  ).values()
);

// ✅ Map to your UI tabs
const filtered = uniqueDepartments
  .map((d: any) => {
    const key = normalize(d.name);

    return departmentMap[key]
      ? { ...departmentMap[key], permission: d.permission }
      : null;
  })
  .filter(
    (item): item is { key: string; component: any; permission?: string } =>
      item !== null
  );
  setAllowedBusinessTypes(filtered);


// ✅ Default tab selection
if (filtered.length > 0) {
  setBusinessType(filtered[0].key);
}

      } catch (err) {
        console.error("❌ Fetch failed", err);
        setAllowedBusinessTypes([]);
      }
    };

    fetchEmployee();
  }, [user]);

  /* ================= DYNAMIC COMPONENT ================= */
  const BusinessComponent =
    allowedBusinessTypes.find((b) => b.key === businessType)?.component;

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">

      {/* ================= MAIN TABS ================= */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8">
        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => {
              setActiveTab("feasibility");
              setRequestType("procurement");
            }}
            className={`px-4 py-2 rounded-full ${
              activeTab === "feasibility" && requestType === "procurement"
                ? "bg-white text-purple-700 shadow"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Procurement Request
          </button>

          <button
  onClick={() => {
    setActiveTab("feasibility");
    setRequestType("business");
  }}
  className={`px-4 py-2 rounded-full ${
    activeTab === "feasibility" && requestType === "business"
      ? "bg-white text-purple-700 shadow"
      : "bg-white/10 hover:bg-white/20"
  }`}
>
  Business Request
</button>

          <button
            onClick={() => setActiveTab("others")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "others"
                ? "bg-white text-purple-700 shadow"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Others
          </button>
        </div>

        {/* ================= SUB TABS ================= */}
        {activeTab === "feasibility" && requestType === "business" && (
          <div className="flex flex-wrap gap-2 mt-8">
            {allowedBusinessTypes.length === 0 ? (
              <span className="text-sm text-gray-300">
                No departments assigned
              </span>
            ) : (
              allowedBusinessTypes.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBusinessType(b.key)}
                  className={`px-3 py-1 rounded-full ${
                    businessType === b.key
                      ? "bg-white text-purple-700 shadow"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {getLabel(b.key)}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb-10">

        {activeTab === "feasibility" &&
          requestType === "procurement" && <FeasibilityPage />}

        {activeTab === "feasibility" &&
          requestType === "business" &&
          BusinessComponent && <BusinessComponent />}

        {activeTab === "others" && <OthersPage />}
      </div>
    </div>
  );
};

export default FeasibilityHome;