// src/features/user/pages/EmployeeDashboard.tsx
import React, { useEffect, useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useEmployee } from "../hooks/useEmployee";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

export default function EmployeeDashboard() {
  const { user, token } = useContext(AuthContext);
  const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  console.log("Departments from backend:", departments);

 

  const apiNameToKey: Record<string, string> = {
    procurement: "procurement",
    fessibility: "feasibility",
    feasibility: "feasibility",
    finance: "finance",
    bd: "bd",
  };

  const deptRoutes: Record<string, string> = {
    procurement: "/employee/procurement",
    feasibility: "/employee/feasibility",
    finance: "/employee/finance",
    bd: "/employee/bd",
  };

  const departmentNames: Record<string, string> = {
    "/employee/procurement": "Procurement",
    "/employee/feasibility": "Feasibility",
    "/employee/finance": "Finance",
     "/employee/bd": "Business development",
  };

  if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
  if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        departments={departments}
        apiNameToKey={apiNameToKey}
        deptRoutes={deptRoutes}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <TopNav departmentNames={departmentNames} />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
