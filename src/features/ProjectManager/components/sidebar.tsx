import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Settings,
  Menu,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  /* SAME EXPAND/COLLAPSE LIKE MANAGER */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* MOBILE */
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const isActive = (path: string) =>
    location.pathname === path;

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
        {/* LOGO */}

        <div className="flex justify-center mb-10">
          <h1
            className={`font-semibold text-gray-800 transition-all
            ${sidebarOpen ? "text-lg" : "text-sm"}
          `}
          >
            {sidebarOpen
              ? "Project Manager"
              : "PM"}
          </h1>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1">
          <ul className="space-y-3">

            {/* DASHBOARD */}

            <li>
              <Link
                to="/project_manager/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg
                ${
                  isActive(
                    "/project_manager/dashboard"
                  )
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard size={22} />

                {sidebarOpen && (
                  <span>Dashboard</span>
                )}
              </Link>
            </li>

            {/* TEMPORARY DEPARTMENT */}

            <li>
              <Link
               to="/project_manager/projects"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg
                ${
                  isActive("/project_manager/projects")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings size={22} />

                {sidebarOpen && (
                  <span>Project_Manager</span>
                )}
              </Link>
            </li>

          </ul>
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}

      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t shadow">
        <div className="flex justify-around items-center py-2">

          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate(
                "/project_manager/dashboard"
              )
            }
            className={`flex flex-col items-center justify-center w-12 h-12
            ${
              isActive(
                "/project_manager/dashboard"
              )
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <LayoutDashboard size={22} />
          </button>

          {/* TEMP PAGE */}

          <button
            onClick={() =>
              navigate("/project_manager/projects")
            }
            className={`flex flex-col items-center justify-center w-12 h-12
            ${
              isActive("/project_manager/projects")
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <Settings size={22} />
          </button>

          {/* HAMBURGER */}

          <button
            onClick={() =>
              setMobileMenuOpen(true)
            }
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
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="relative w-64 bg-white shadow-lg p-6">

            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              ×
            </button>

            <div className="flex justify-center mb-6">
              <h1 className="text-lg font-semibold">
                Project Manager
              </h1>
            </div>

            <nav>
              <ul className="space-y-4">

                <li>
                  <Link
                    to="/project_manager/dashboard"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  >
                    <LayoutDashboard size={22} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                   to="/project_manager/projects"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  >
                    <Settings size={22} />
                    <span>Project_Manager</span>
                  </Link>
                </li>

              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}