import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import DepartmentPage from "./Department";
import EmployeeUpdate from "./EmployeeUpdate";
import CategoryLimitPage from "./Categorylimit";
import Dashboard from "./DashboardHome";

export default function AdminDashboard() {
  const { pathname } = useLocation();

  const pathToPage: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/departments": "Departments",
    "/admin/employee-update": "EmployeeUpdate",
    "/admin/categorylimit": "CategoryLimit",

  };

  const activePage = pathToPage[pathname] || "Dashboard";

  const pageComponents: Record<string, JSX.Element> = {
    // Dashboard: <div>Welcome to Admin Dashboard!</div>,
    Dashboard: <Dashboard />,
    Departments: <DepartmentPage />,
    EmployeeUpdate: <EmployeeUpdate />,
    CategoryLimit: <CategoryLimitPage />,  };
     

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navigation */}
        <TopNav pageTitle={activePage} />

        {/* Page Content */}
        <main className="flex-1  bg-gray-50 overflow-auto">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
