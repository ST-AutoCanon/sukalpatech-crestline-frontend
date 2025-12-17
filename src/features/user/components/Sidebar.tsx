import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  departments: any[];
  apiNameToKey: Record<string, string>;
  deptRoutes: Record<string, string>;
  sidebarOpen: boolean;
}

export default function Sidebar({
  departments,
  apiNameToKey,
  deptRoutes,
  sidebarOpen,
}: SidebarProps) {
  const location = useLocation();

  // Static Dashboard route
  const dashboardRoute = "/employee";

  // Helper to check active route
  const isActive = (path: string) => location.pathname === path;

  return (
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
              to={dashboardRoute}
              className={`block px-3 py-2 rounded-md font-medium ${
                isActive(dashboardRoute)
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
            const active = isActive(route);

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
  );
}
