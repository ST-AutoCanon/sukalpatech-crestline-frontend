// src/features/user/components/TopNav.tsx
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import avatarimage from "../../../assets/avatar.jpg";
interface TopNavProps {
  departmentNames?: Record<string, string>;
}

export default function TopNav({ departmentNames }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;

    if (path === "/employee" || path === "/employee/dashboard")
      return "Dashboard";

    if (departmentNames) {
      for (const [route, name] of Object.entries(departmentNames)) {
        if (path.startsWith(route)) return name;
      }
    }

    return "";
  };

  return (
    <header className="w-full bg-gradient-to-r bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-6 py-4 flex justify-between items-center">
      {/* LEFT - PAGE / DEPARTMENT NAME */}
      <h1 className="text-white text-2xl font-semibold">{getPageName()}</h1>

      {/* RIGHT - USER BOX */}
      <div className="flex items-center gap-4">
        {/* USER INFO BADGE */}
        <div className="flex items-center gap-3 border border-white/40 rounded-full px-4 py-2 text-white">
          <img
            src={avatarimage}
            alt="avatar"
            className="h-9 w-9 rounded-full border border-white/50"
          />

          <span className="text-sm font-medium">
            {user?.first_name ?? "User"}
          </span>
        </div>

        {/* LOGOUT BTN */}
        <button
          onClick={logout}
          className="border border-white/60 text-white rounded-full px-4 py-2 hover:bg-white hover:text-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
