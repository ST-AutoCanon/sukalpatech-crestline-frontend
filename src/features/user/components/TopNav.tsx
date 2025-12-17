// src/features/user/components/TopNav.tsx
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

interface TopNavProps {
  departmentNames?: Record<string, string>; // optional mapping of route → display name
}

export default function TopNav({ departmentNames }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Determine current page name
  const getPageName = () => {
    const path = location.pathname;

    // Dashboard
    if (path === "/employee" || path === "/employee/dashboard")
      return "Dashboard";

    // Departments
    if (departmentNames) {
      for (const [route, name] of Object.entries(departmentNames)) {
        if (path.startsWith(route)) return name;
      }
    }

    // Default fallback
    return "";
  };

  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      {/* Left: Page name */}
      <div className="text-xl font-semibold text-gray-800">{getPageName()}</div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{user?.first_name}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
