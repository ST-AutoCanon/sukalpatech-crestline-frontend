import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// Real project ID from DB
const PROJECT_ID = 1;

export default function EngineeringDesignPage() {
  const { user } = useContext(AuthContext);
  const [deptId, setDeptId] = useState<number | null>(null);

  // 1️⃣ Fetch department ID dynamically based on department name
  useEffect(() => {
    if (!user) return;

    const fetchDepartmentId = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/departments?org_code=${user.org_code}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!data.success) return;

        const dept = data.data.find(
          (d: any) => d.name === "engineering_design",
        );
        setDeptId(dept?.department_id || null);
      } catch (err) {
        console.error("Error fetching department ID:", err);
      }
    };

    fetchDepartmentId();
  }, [user]);

  const handleCompleteProject = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    if (!deptId) {
      alert("Department not found for this org");
      return;
    }

    try {
      console.log("Starting project completion...");

      // 1️⃣ Update BD status
      const bdResponse = await fetch(
        `${BACKEND_URL}/api/business-development/${PROJECT_ID}/bd-update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ bd_status: "COMPLETED" }),
        },
      );

      const bdData = await bdResponse.json().catch(() => ({}));
      if (!bdResponse.ok) {
        console.error("BD Update Failed:", bdData);
        alert(bdData.message || "Failed to update project");
        return;
      }
      console.log("✅ BD updated:", bdData);

      // 2️⃣ Send notification dynamically
      const notifResponse = await fetch(`${BACKEND_URL}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: "Project Completed",
          message:
            "Engineering & Design department completed the project and moved to next department",
          type: "PROJECT_MOVED",
          related_bd_id: PROJECT_ID,
          recipient_department_id: deptId, // dynamically fetched department
          // Optionally, you can also send to a role or specific user:
          // recipient_role: "manager",
          // recipient_id: 54,
          metadata: { department: "Engineering & Design" },
        }),
      });

      const notifData = await notifResponse.json().catch(() => ({}));
      if (!notifResponse.ok) {
        console.error("Notification Failed:", notifData);
        alert(notifData.message || "Failed to send notification");
        return;
      }

      console.log(`✅ Notification sent to department users:`, notifData);
      alert("Project completed and notification sent to department users!");
    } catch (error) {
      console.error("❌ Error completing project:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-[80vh] p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Engineering & Design
        </h2>

        <p className="text-gray-600 mb-6">
          Manage engineering drawings, design approvals, and technical
          documentation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Drawings</h3>
            <p className="text-sm text-gray-500">
              Upload and manage engineering drawings.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Design Approvals
            </h3>
            <p className="text-sm text-gray-500">
              Review and approve design submissions.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Documentation</h3>
            <p className="text-sm text-gray-500">
              Manage technical documentation and revisions.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleCompleteProject}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={!deptId}
          >
            {deptId ? "Mark Project as Completed" : "Loading Department..."}
          </button>
        </div>
      </div>
    </div>
  );
}