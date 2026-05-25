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
  const [currentBdId, setCurrentBdId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestBdId, setLatestBdId] = useState<number | null>(null);
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
  const fetchLatestBd = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/business-development`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log("LATEST BD =", data);

      if (data.success && data.data.length > 0) {
        // latest record
        const latest = data.data[data.data.length - 1];

        setLatestBdId(latest.related_bd_id || latest.id);
      }
    } catch (err) {
      console.error("Latest BD fetch error:", err);
    }
  };

  fetchLatestBd();
}, []);
  useEffect(() => {
  const fetchCurrentBdId = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/business-development`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log("BD DATA =", data);

      if (data.success && data.data.length > 0) {

        // latest record
        const latestBd = data.data[data.data.length - 1];

        setCurrentBdId(latestBd.related_bd_id || latestBd.id);
      }

    } catch (err) {
      console.error("BD fetch error", err);
    }
  };

  fetchCurrentBdId();
}, []);

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  /* ================= ROUTE MAPPINGS ================= */

  const apiNameToKey: Record<string, string> = {
    engineering_design: "engineering_design",
    stores_materials: "stores_materials",
    fabrication_structure: "fabrication_structure",
    quality_control: "quality_control",
    
    panneling_welding: "panneling_welding",
    interior_fitment: "interior_fitment",
    glass_doors: "glass_doors",
    final_dispatch: "final_dispatch",
    final_assembly_dispatch: "final_assembly_dispatch",
  };

  

 const deptRoutes: Record<string, string> = {
  engineering_design: `/manager/engineering-design/${latestBdId}`,
  stores_materials: `/manager/store-materials/${latestBdId}`,
  fabrication_structure: `/manager/fabrication/${latestBdId}`,
  quality_control: `/manager/quality-control/${latestBdId}`,

  panneling_welding: `/manager/panneling-welding/${latestBdId}`,
  interior_fitment: `/manager/interior-fitment/${latestBdId}`,
  glass_doors: `/manager/glass-doors/${latestBdId}`,
  final_dispatch: `/manager/final-dispatch/${latestBdId}`,
  final_assembly_dispatch: `/manager/final-assembly-dispatch/${latestBdId}`,
};

const departmentNames: Record<string, string> = {
  "/manager/engineering-design": "Engineering & Design",
  "/manager/store-materials": "Stores & Materials",
  "/manager/fabrication": "Fabrication & Structure",
  "/manager/quality-control": "Quality Control",
  "/manager/Two_Wheeler": "Two Wheeler",

   "/manager/panneling-welding": "Panneling & Welding",
  "/manager/interior-fitment": "Interior Fitment",
  "/manager/glass-doors": "Glass & Doors",
  "/manager/final-dispatch": "Final Dispatch",
  "/manager/final-assembly-dispatch": "Final Assembly & Dispatch",
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