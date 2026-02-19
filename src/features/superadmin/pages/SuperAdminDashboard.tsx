import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import CreateOrganisation from "./CreateOrganisation";
import ManageOrganisation from "./ManageOrgDepartments";
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
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome to Super Admin Dashboard
        </h2>
        <p className="text-gray-700">
          Use the sidebar to navigate to different sections.
        </p>
      </div>
    ),
    "Create Organisation": <CreateOrganisation />,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Layout Wrapper */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {/* Top Navigation */}
          <TopNav pageTitle={activePage} />

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
            {pageComponents[activePage]}
          </main>
        </div>
      </div>
    </div>
  );
}
