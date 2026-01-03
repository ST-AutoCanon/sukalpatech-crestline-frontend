// src/features/user/components/Sidebar.tsx
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

  const dashboardRoute = "/employee";
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`transition-all duration-300 ${
        sidebarOpen ? "w-64 p-6" : "w-0 p-0"
      } bg-white shadow-md overflow-hidden flex flex-col`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src="/crestlinetech_black.png" className="h-22" />
       
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          {/* Dashboard */}
          {/* <li>
            <Link
              to={dashboardRoute}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium
                ${
                  isActive(dashboardRoute)
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
            >
              Dashboard
            </Link>
          </li> */}

          {/* No Departments */}
          {departments.length === 0 && (
            <li className="text-gray-500 text-sm">No department assigned</li>
          )}

          {/* Departments */}
          {departments.map((dept) => {
            const key = apiNameToKey[dept.name.toLowerCase()];
            if (!key) return null;

            const route = deptRoutes[key];
            const active = isActive(route);

            return (
              <li key={dept.id}>
                <Link
                  to={route}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {dept.name}
                  {dept.permission && (
                    <span className="text-xs text-gray-600">
                      {/* ({dept.permission}) */}
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
