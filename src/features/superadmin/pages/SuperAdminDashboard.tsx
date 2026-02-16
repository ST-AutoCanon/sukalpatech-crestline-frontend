// import Sidebar from "../components/Sidebar";
// import TopNav from "../components/TopNav";

// const SuperAdminDashboard = () => {
//   const activePage = "Dashboard";

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <TopNav pageTitle={activePage} />

//         <div className="p-6 flex-1 bg-gray-50">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//             Welcome to Super Admin Dashboard
//           </h2>
//           <p className="text-gray-700">
//             Use the sidebar to navigate to different sections, like creating a
//             new organisation.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;


import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import CreateOrganisation from "./CreateOrganisation";

export default function SuperAdminDashboard() {
  const { pathname } = useLocation();

  // Map paths to page names
  const pathToPage: Record<string, string> = {
    "/super_admin": "Dashboard",
    "/super_admin/create_organisation": "Create Organisation",
  };

  // Determine active page
  const activePage = pathToPage[pathname] || "Dashboard";

  // Map page names to components
  const pageComponents: Record<string, JSX.Element> = {
    Dashboard: (
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome to Super Admin Dashboard
        </h2>
        <p className="text-gray-700">
          Use the sidebar to navigate to different sections, like creating a new
          organisation.
        </p>
      </div>
    ),
    "Create Organisation": <CreateOrganisation />,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNav pageTitle={activePage} />

        <main className="p-6 flex-1 bg-gray-50">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
