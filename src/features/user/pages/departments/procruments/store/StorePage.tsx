// import React, { useState } from "react";
// import AddItem from "./UpdatePRstore";
// import ViewItems from "./ViewPRstore";
// import EmployeeDashboard from "../procrumentHome"; // import the component
// import AddCategories from "./AddCategories";
// import AddItems from "./additems";
// const StorePage: React.FC = () => {
//   const [selectedTab, setSelectedTab] = useState<
//     "UpdatePR" | "viewPR" | "categories" | "additems"
//   >("UpdatePR");
//   const [showDashboard, setShowDashboard] = useState(false);

//   if (showDashboard) {
//     return <EmployeeDashboard />; // render dashboard directly
//   }
//   return (
//     <div className="p-2  max-w-7xl mx-auto">
//       {/* // <div className="p-10 w-full mx-auto"> */}
//       <button
//         className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         onClick={() => setShowDashboard(true)} // show dashboard
//       >
//         Back to Dashboard
//       </button>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-10">
//         Store Management
//       </h1>

//       {/* Top Buttons */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             selectedTab === "UpdatePR"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setSelectedTab("UpdatePR")}
//         >
//           Update PR
//         </button>

//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             selectedTab === "viewPR"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setSelectedTab("viewPR")}
//         >
//           View PR
//         </button>
//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             selectedTab === "categories"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setSelectedTab("categories")}
//         >
//           Add Categories
//         </button>
//         <button
//           className={`px-4 py-2 rounded transition-all duration-200 ${
//             selectedTab === "additems"
//               ? "bg-blue-600 text-white shadow"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//           onClick={() => setSelectedTab("additems")}
//         >
//           Add Items
//         </button>
//       </div>

//       {/* Page Content Below */}
//       <div className="border p-2 rounded-xl shadow-md bg-white mt-4">
//         {selectedTab === "UpdatePR" && <AddItem />}
//         {selectedTab === "viewPR" && <ViewItems />}
//         {selectedTab === "categories" && <AddCategories />}
//         {selectedTab === "additems" && <AddItems />}
//       </div>
//     </div>
//   );
// };

// export default StorePage;


import React, { useState } from "react";
import AddItem from "../store/UpdatePRstore";
import ViewItems from "../store/ViewPRstore";
import EmployeeDashboard from "../procrumentHome"; // import the component
import AddCategories from "./AddCategories";
import AddItems from "./additems";
import { Check, Search } from "lucide-react";

const StorePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "add" | "view" | "AddCategories" | "AddItems"
  >("add");
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <EmployeeDashboard />; // render dashboard directly
  }
  return (
    <div className="px-6 py-6">
      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        {/* LEFT : ALL STORES */}
        <p
          onClick={() => setSelectedTab("view")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "view"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          All Stores
        </p>
        <p
          onClick={() => setSelectedTab("AddCategories")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "AddCategories"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          Add Categories
        </p>
        <p
          onClick={() => setSelectedTab("AddItems")}
          className={`cursor-pointer text-lg font-medium transition-all duration-200 ${
            selectedTab === "AddItems"
              ? "text-white border-b-2 border-white pb-1"
              : "text-white/70 hover:text-white"
          }`}
        >
          Add Items
        </p>

        {/* RIGHT : SEARCH + ADD */}
        <div className="flex items-center gap-4">

          {/* ADD STORE BUTTON */}
          <button
            onClick={() => setSelectedTab("add")}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
          >
            + Update PR
          </button>
        </div>
      </div>

      {/* Page Content Below */}
      {selectedTab === "add" && <AddItem />}
      {selectedTab === "view" && <ViewItems />}
      {selectedTab === "AddCategories" && <AddCategories />}
      {selectedTab === "AddItems" && <AddItems />}
    </div>
  );
};

export default StorePage;
