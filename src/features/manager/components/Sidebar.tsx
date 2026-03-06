import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, Menu } from "lucide-react";

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
  sidebarOpen: initialSidebarOpen,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  /* Department Icons */

  const departmentIcons: Record<string, JSX.Element> = {
    engineering_design: <Settings size={22} />,
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`hidden md:flex flex-col bg-white shadow-md 
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-64 p-6" : "w-20 p-3"}
      `}
      >
        {/* Logo */}

        <div className="flex justify-center mb-8">
          <h1
            className={`font-semibold text-gray-800 transition-all
            ${sidebarOpen ? "text-lg" : "text-sm"}
          `}
          >
            {sidebarOpen ? "Manager Panel" : "MP"}
          </h1>
        </div>

        {/* Navigation */}

        <nav className="flex-1">
          <ul className="space-y-3">
            {/* Dashboard */}

            <li>
              <Link
                to="/manager/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg
                ${
                  isActive("/manager/dashboard")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard size={22} />
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Dynamic Departments */}

            {departments.map((dept) => {
              const key = apiNameToKey[dept.name.toLowerCase()];
              if (!key) return null;

              const route = deptRoutes[key];

              const active = isActive(route);

              return (
                <li key={dept.id}>
                  <Link
                    to={route}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {departmentIcons[key] || <Settings size={22} />}
                    {sidebarOpen && <span>{dept.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}

      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t shadow">
        <div className="flex justify-around items-center py-2">
          {/* Dashboard */}

          <button
            onClick={() => navigate("/manager/dashboard")}
            className={`flex flex-col items-center justify-center w-12 h-12
            ${
              isActive("/manager/dashboard") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <LayoutDashboard size={22} />
          </button>

          {/* Dynamic Departments */}

          {departments.map((dept) => {
            const key = apiNameToKey[dept.name.toLowerCase()];
            if (!key) return null;

            const route = deptRoutes[key];

            return (
              <button
                key={dept.id}
                onClick={() => navigate(route)}
                className={`flex flex-col items-center justify-center w-12 h-12
                ${isActive(route) ? "text-blue-600" : "text-gray-500"}`}
              >
                {departmentIcons[key] || <Settings size={22} />}
              </button>
            );
          })}

          {/* Hamburger */}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center w-12 h-12 text-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative w-64 bg-white shadow-lg p-6">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ×
            </button>

            <div className="flex justify-center mb-6">
              <h1 className="text-lg font-semibold">Manager Panel</h1>
            </div>

            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/manager/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  >
                    <LayoutDashboard size={22} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                {departments.map((dept) => {
                  const key = apiNameToKey[dept.name.toLowerCase()];
                  if (!key) return null;

                  const route = deptRoutes[key];

                  return (
                    <li key={dept.id}>
                      <Link
                        to={route}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      >
                        {departmentIcons[key] || <Settings size={22} />}
                        <span>{dept.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
