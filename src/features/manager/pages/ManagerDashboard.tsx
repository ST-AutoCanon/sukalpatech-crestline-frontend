import { useEffect, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleRes = async (res: Response) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "API error");
  return json.data ?? json;
};

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);

  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen] = useState(true);

  /* ================= FETCH MANAGER DEPARTMENTS ================= */

  const fetchData = async () => {
    if (!user?.email) return;

    try {
      const empRes = await fetch(
        `${API_URL}/api/departments/employees-departments`,
        {
          credentials: "include",
        },
      );

      const employees = await handleRes(empRes);

      const me = employees.find((emp: any) => emp.email === user.email);

      setDepartments(Array.isArray(me?.departments) ? me.departments : []);
    } catch (err) {
      console.error("❌ Manager Department Fetch Error", err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  /* ================= ROUTE MAPPINGS ================= */

  const apiNameToKey: Record<string, string> = {
    engineering_design: "engineering_design",
    stores_materials: "stores_materials",
    fabrication_structure: "fabrication_structure",
    quality_control: "quality_control",
    Two_Wheeler: "Two_Wheeler",
  };

  

  const deptRoutes: Record<string, string> = {
    engineering_design: "/manager/engineering-design",
    stores_materials: "/manager/store-materials",
    fabrication_structure: "/manager/fabrication",
    quality_control: "/manager/quality-control",
    Two_Wheeler: "/manager/Two_Wheeler",
  };

const departmentNames: Record<string, string> = {
  "/manager/engineering-design": "Engineering & Design",
  "/manager/store-materials": "Stores & Materials",
  "/manager/fabrication": "Fabrication & Structure",
  "/manager/quality-control": "Quality Control",
  "/manager/Two_Wheeler": "Two Wheeler",
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