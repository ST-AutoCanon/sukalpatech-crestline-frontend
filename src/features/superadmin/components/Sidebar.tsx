import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Menu, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bdOpen, setBdOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      path: "/super_admin",
      icon: <LayoutDashboard size={22} />,
    },
    {
      name: "Create Organisation",
      path: "/super_admin/create_organisation",
      icon: <Building2 size={22} />,
    },
    {
      name: "Business Development",
      icon: <BarChart3 size={22} />,
      children: [
        {
          name: "Two Wheeler",
          path: "super-admin/business/TwoWheelerpage",
        },
        {
          name: "Three Wheeler",
          path: "super-admin/business/ThreeWheelerpage",
        },
        {
          name: "Food Industry",
          path: "super-admin/business/Foodbusiness",
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    return path === "/super_admin"
      ? location.pathname === path
      : location.pathname.startsWith(path);
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
        {/* Logo / Title */}
        <div className="flex justify-center mb-8 transition-all duration-300">
          <h1
            className={`font-semibold text-gray-800 transition-all duration-300
            ${sidebarOpen ? "text-lg" : "text-sm"}
          `}
          >
            {sidebarOpen ? "Super Admin" : "SA"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-3">
            {links.map((link) => {

              // If link has children
              if (link.children) {
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => setBdOpen(!bdOpen)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
                    >
                      {link.icon}
                      {sidebarOpen && <span>{link.name}</span>}
                    </button>

                    {bdOpen && sidebarOpen && (
                      <ul className="ml-8 mt-2 space-y-2">
                        {link.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className="block text-gray-600 hover:text-blue-600"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
              const active = isActive(link.path);

              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${active
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                  `}
                  >
                    {link.icon}
                    {sidebarOpen && <span>{link.name}</span>}
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
          {links.map((link) => {
            const active = isActive(link.path || "");

            return (
              <button
                key={link.name}
                 onClick={() => link.path && navigate(link.path)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition
                ${active ? "text-blue-600" : "text-gray-500"}
              `}
              >
                {link.icon}
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
              <h1 className="text-lg font-semibold">Super Admin</h1>
            </div>

            <nav>
              <ul className="space-y-4">
                {links.map((link) => {
                 const active = isActive(link.path || "");

                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                        ${active
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                          }
                      `}
                      >
                        {link.icon}
                        <span>{link.name}</span>
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
