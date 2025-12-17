import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import DepartmentPage from "./Department";

export default function AdminDashboard() {
  const { pathname } = useLocation();

  // Map pathnames to page names
  const pathToPage: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/departments": "Departments",
  };

  // Determine active page from current path
  const activePage = pathToPage[pathname] || "Dashboard";

  const pageComponents: Record<string, JSX.Element> = {
    Dashboard: <div>Welcome to Admin Dashboard!</div>,
    Departments: <DepartmentPage />,
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


