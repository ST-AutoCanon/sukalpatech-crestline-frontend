// src/features/user/pages/EmployeeDashboard.tsx
import React, { useEffect, useContext, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useEmployee } from "../hooks/useEmployee";
import TopNav from "../components/TopNav";

export default function EmployeeDashboard() {
  const { user, token } = useContext(AuthContext);

  const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Map API names to normalized keys
  const apiNameToKey: Record<string, string> = {
    procurement: "procurement",
    store: "store",
    "buisness development": "business-development",
    fessibility: "feasibility",
    feasibility: "feasibility",
    finance: "finance",
    bd: "bd",
  };

  // Map normalized keys to routes
  const deptRoutes: Record<string, string> = {
    procurement: "/employee/procurement",
    store: "/employee/store",
    "business-development": "/employee/business-analysis",
    feasibility: "/employee/feasibility",
    finance: "/employee/finance",
    bd: "/employee/business-analysis",
  };

  // Map route → display name for TopNav
  const departmentNames: Record<string, string> = {
    "/employee/procurement": "Procurement",
    "/employee/store": "Store",
    "/employee/business-analysis": "Business Analysis",
    "/employee/feasibility": "Feasibility",
    "/employee/finance": "Finance",
    "/employee/dashboard": "Dashboard",
  };

  if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
  if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-0"
        } bg-gray-100 p-6 overflow-hidden flex flex-col`}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800">Employee Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-3">
            {/* Static Dashboard Link */}
            <li>
              <Link
                to="/employee/dashboard"
                className={`block px-3 py-2 rounded-md font-medium ${
                  location.pathname === "/employee/dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Dashboard
              </Link>
            </li>

            {/* Departments */}
            {departments.length === 0 && (
              <li className="text-gray-500">No department assigned</li>
            )}

            {departments.map((dept) => {
              const key = apiNameToKey[dept.name.toLowerCase()];
              if (!key) return null;
              const route = deptRoutes[key];
              const active = location.pathname === route;

              return (
                <li key={dept.id}>
                  <Link
                    to={route}
                    className={`block px-3 py-2 rounded-md font-medium ${
                      active
                        ? "bg-blue-500 text-white"
                        : "text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {dept.name}{" "}
                    {dept.permission && (
                      <span className="text-xs text-gray-600">
                        ({dept.permission})
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* TopNav */}
        <TopNav departmentNames={departmentNames} />

        <main className="flex-1 p-6 overflow-auto">
         

          {/* Nested routes render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

