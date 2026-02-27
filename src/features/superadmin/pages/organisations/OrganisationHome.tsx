// import React, { useState } from "react";
// import CreateOrganisation from "./CreateOrganisation";
// import UpdateOrganisation from "./UpdateOrganisation";

// const OrganisationHome: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"create" | "update">(
//     "create",
//   );

//   return (
//     <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">
//       {/* ================= TABS ================= */}
//       <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8 flex flex-wrap gap-4 sm:gap-4">
//         <button
//           onClick={() => setActiveTab("create")}
//           className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
//             activeTab === "create"
//               ? "bg-white text-purple-700"
//               : "bg-white/20 text-white hover:bg-white/30"
//           }`}
//         >
//           Create Organisation
//         </button>

//         <button
//           onClick={() => setActiveTab("update")}
//           className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
//             activeTab === "update"
//               ? "bg-white text-purple-700"
//               : "bg-white/20 text-white hover:bg-white/30"
//           }`}
//         >
//           Update Organisation
//         </button>

//       </div>

//       {/* ================= CONTENT ================= */}
//       <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb- md:pb-10">
//         {activeTab === "create" && <CreateOrganisation />}
//         {activeTab === "update" && <UpdateOrganisation />}
//       </div>
//     </div>
//   );
// };

// export default OrganisationHome;

import React, { useState } from "react";
import CreateOrganisation from "./CreateOrganisation";
import UpdateOrganisation from "./UpdateOrganisation";
import DeleteOrganisation from "./deleteOrganisation";
// comment test

const OrganisationHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "update" | "delete">(
    "create",
  );

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white">
      {/* ================= TABS ================= */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8 flex flex-wrap gap-4 sm:gap-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "create"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Create Organisation
        </button>

        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "update"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Update Organisation
        </button>

        <button
          onClick={() => setActiveTab("delete")}
          className={`px-4 sm:px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === "delete"
              ? "bg-white text-purple-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Delete Organisation
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-3 sm:px-5 md:px-10 pt-4 md:pt-6 pb- md:pb-10">
        {activeTab === "create" && <CreateOrganisation />}
        {activeTab === "update" && <UpdateOrganisation />}
        {activeTab === "delete" && <DeleteOrganisation />}
      </div>
    </div>
  );
};

export default OrganisationHome;