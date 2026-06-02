import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TopNav from "../../ProjectManagerSub/Components/topnav";
import Sidebar from "../../ProjectManagerSub/Components/sidebar";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ProjectManagerADashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <h3 className="p-6 text-lg">Loading user...</h3>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNav departmentNames={{}} />

        <main className="flex-1 min-h-screen overflow-auto">
          <Outlet />   {/* ONLY HERE */}
        </main>
      </div>
    </div>
  );
}