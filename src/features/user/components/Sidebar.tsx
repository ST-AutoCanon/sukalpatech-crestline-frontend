import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ShoppingCart,
  Wallet,
  Building2,
  Menu,
  Briefcase,
  BarChart3,
  LineChart,
  TrendingUp,
} from "lucide-react";

import crestlineLogo from "../../../assets/crestlinetech_black_1.png";
import crestlinelogo from "../../../assets/crestline_logo.jpeg";

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
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const departmentIcons: Record<string, JSX.Element> = {
    feasibility: <Lightbulb size={22} />,
    procurement: <ShoppingCart size={22} />,
    finance: <Wallet size={22} />,
    Businessdevelopment: <Building2 size={22} />,
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
        <div className="flex justify-center mb-6 transition-all duration-300">
          <img
            src={sidebarOpen ? crestlineLogo : crestlinelogo}
            alt="Crestline Tech"
            className={`object-contain transition-all duration-300
      ${sidebarOpen ? "h-14" : "h-10"}
    `}
          />
        </div>

        {/* Departments */}
        <nav className="flex-1">
          <ul className="space-y-3">
            {departments.map((dept) => {
              const key = apiNameToKey[dept.name.toLowerCase()];
              if (!key) return null;

              const route = deptRoutes[key];
              const active = isActive(route);

              return (
                <li key={dept.id}>
                  <div
                    onMouseEnter={() => setSidebarOpen(true)}
                    className="group"
                  >
                    <Link
                      to={route}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${
          active
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
                    >
                      {departmentIcons[dept.name.toLowerCase()] || (
                        <Building2 size={22} />
                      )}
                      {sidebarOpen && <span>{dept.name}</span>}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t shadow">
        <div className="flex justify-around items-center py-2">
          {departments.map((dept) => {
            const key = apiNameToKey[dept.name.toLowerCase()];
            if (!key) return null;

            const route = deptRoutes[key];
            const active = location.pathname === route;

            return (
              <button
                key={dept.id}
                onClick={() => navigate(route)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {departmentIcons[dept.name.toLowerCase()] || (
                  <Building2 size={22} />
                )}
              </button>
            );
          })}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE SIDE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative w-64 bg-white shadow-lg p-6">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ×
            </button>

            <div className="flex justify-center mb-6">
              <img
                src={crestlineLogo}
                alt="Crestline Tech"
                className="h-14 object-contain"
              />
            </div>

            <nav>
              <ul className="space-y-4">
                {departments.map((dept) => {
                  const key = apiNameToKey[dept.name.toLowerCase()];
                  if (!key) return null;

                  const route = deptRoutes[key];
                  const active = isActive(route);

                  return (
                    <li key={dept.id}>
                      <Link
                        to={route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                          active
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {departmentIcons[dept.name.toLowerCase()] || (
                          <Building2 size={22} />
                        )}
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
