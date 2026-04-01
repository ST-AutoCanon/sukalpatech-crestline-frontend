// // src/features/user/pages/EmployeeDashboard.tsx
// import React, { useEffect, useContext, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";
// import TopNav from "../components/TopNav";
// import Sidebar from "../components/Sidebar";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);
//   const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   console.log("Departments from backend:", departments);

 

//   const apiNameToKey: Record<string, string> = {
//     procurement: "procurement",
//     fessibility: "feasibility",
//     feasibility: "feasibility",
//     finance: "finance",
//     bd: "bd",
//   };

//   const deptRoutes: Record<string, string> = {
//     procurement: "/employee/procurement",
//     feasibility: "/employee/feasibility",
//     finance: "/employee/finance",
//     bd: "/employee/bd",
//   };

//   const departmentNames: Record<string, string> = {
//     "/employee/procurement": "Procurement",
//     "/employee/feasibility": "Feasibility",
//     "/employee/finance": "Finance",
//      "/employee/bd": "Business development",
//   };

//   if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
//   if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar
//         departments={departments}
//         apiNameToKey={apiNameToKey}
//         deptRoutes={deptRoutes}
//         sidebarOpen={sidebarOpen}
//       />

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col">
//         <TopNav departmentNames={departmentNames} />

//         <main className="flex-1 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


// src/features/user/pages/EmployeeDashboard.tsx

import { useEffect, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5004";

const handleRes = async (res: Response) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "API error");
  return json.data ?? json;
};

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);

  const [departments, setDepartments] = useState<any[]>([]);
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen] = useState(true);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    if (!user?.email) return;

    try {
      // 1️⃣ Get all employees with department relation
      const empRes = await fetch(
        `${API_URL}/api/departments/employees-departments`,
        {
          credentials: "include",
        }
      );

      const employees = await handleRes(empRes);

      const me = employees.find(
        (emp: any) => emp.email === user.email
      );

      setDepartments(
        Array.isArray(me?.departments) ? me.departments : []
      );

      // 2️⃣ Get full department list
      const deptRes = await fetch(
        `${API_URL}/api/departments`,
        {
          credentials: "include",
        }
      );

      const deptMaster = await handleRes(deptRes);
      setAllDepartments(
        Array.isArray(deptMaster) ? deptMaster : []
      );
    } catch (err) {
      console.error("❌ Department Fetch Error", err);
      setDepartments([]);
      setAllDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  /* ================= ROUTE MAPPINGS ================= */

 const apiNameToKey: Record<string, string> = {
  procurement: "procurement",
  feasibility: "feasibility",
  finance: "finance",
  bd: "bd",

  two_wheeler: "two_wheeler",
  three_wheeler: "three_wheeler",

  
  food_business: "food_business",
  gold_business: "gold_business",
};

 const deptRoutes: Record<string, string> = {
  procurement: "/employee/procurement",
  feasibility: "/employee/feasibility",
  finance: "/employee/finance",
  bd: "/employee/bd",

  two_wheeler: "/employee/bd2/2w",
  three_wheeler: "/employee/bd2/3w",
  food_business: "/employee/bd2/food", // ✅ FIX
   gold_business: "/employee/bd2/gold",
};
  const departmentNames: Record<string, string> = {
    "/employee/procurement": "Procurement",
    "/employee/feasibility": "Feasibility",
    "/employee/finance": "Finance",
    "/employee/bd": "Business Development",
   
  "/employee/bd2/2w": "Two Wheeler BD",
 "/employee/bd2/3w": "Three Wheeler BD",
  "/employee/bd2/food": "Food Business BD",
   "/employee/bd2/gold": "Gold Business BD", 
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