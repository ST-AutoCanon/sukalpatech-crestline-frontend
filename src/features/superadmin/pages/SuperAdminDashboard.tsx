// import { useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import TopNav from "../components/TopNav";
// // import CreateOrganisation from "./organisations/CreateOrganisation";
// import OrganisationHome from "./organisations/OrganisationHome";
// import ManageOrganisation from "./organisations/ManageOrgDepartments";
// export default function SuperAdminDashboard() {
//   const { pathname } = useLocation();

//   // Map paths to page names
//   const pathToPage: Record<string, string> = {
//     "/super_admin": "Dashboard",
//     "/super_admin/create_organisation": "Create Organisation",
//     "/super_admin/manage_organisation": "Manage Organisation",
//   };

//   const activePage = pathToPage[pathname] || "Dashboard";

//   const pageComponents: Record<string, JSX.Element> = {
//     Dashboard: (
//       <div>
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//           Welcome to Super Admin Dashboard
//         </h2>
//         <p className="text-gray-700">
//           Use the sidebar to navigate to different sections.
//         </p>
//       </div>
//     ),
//     "Create Organisation": <OrganisationHome />,
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Layout Wrapper */}
//       <div className="flex min-h-screen">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Content Area */}
//         <div className="flex-1 flex flex-col w-full">
//           {/* Top Navigation */}
//           <TopNav pageTitle={activePage} />

//           {/* Main Content */}
//           <main className="flex-1 bg-gray-50 overflow-auto">
//             {pageComponents[activePage]}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import OrganisationHome from "./organisations/OrganisationHome";
import UpdateOrganisation from "./organisations/UpdateOrganisation";

export default function SuperAdminDashboard() {
  const { pathname } = useLocation();

  // Map paths to page names
  const pathToPage: Record<string, string> = {
    "/super_admin": "Dashboard",
    "/super_admin/create_organisation": "Create Organisation",
    "/super_admin/manage_organisation": "Manage Organisation",
  };

  const activePage = pathToPage[pathname] || "Dashboard";

  const pageComponents: Record<string, JSX.Element> = {
    Dashboard: (
      <div className="w-full h-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white min-h-[80vh]">
        <div className="w-full px-4 sm:px-6 md:px-10 pt-5 md:pt-8 flex flex-wrap gap-4 sm:gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Welcome to Super Admin Dashboard
            </h2>
            <p className="text-gray-700">
              Use the sidebar to navigate to different sections.
            </p>
          </div>
        </div>
      </div>
    ),
    "Create Organisation": <OrganisationHome />,
    "Manage Organisation": <UpdateOrganisation />,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Layout Wrapper */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {/* Top Navigation */}
          <TopNav pageTitle={activePage} />

          {/* Main Content */}
          <main className="flex-1 bg-gray-50 overflow-auto">
            {pageComponents[activePage]}
          </main>
        </div>
      </div>
    </div>
  );
}