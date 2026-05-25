import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import Alert from "../../../../components/Aleartmessage";
import { useParams } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// Real project ID from DB
// const PROJECT_ID = 1;

export default function FinalDispatch() {
  const { user } = useContext(AuthContext);
  const { bdId } = useParams();

const [project, setProject] = useState<any>(null);
  const [deptId, setDeptId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
  if (!bdId || !user) return;

  const fetchProject = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/project/by-bd/${bdId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      

      if (data.success) {
        setProject(data.data);
      }

    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  fetchProject();
}, [bdId, user]);

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
        console.log("department name in eng desing is :", data);
        if (!data.success) return;

        const dept = data.data.find(
          (d: any) => d.name === "panneling-welding",
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
      setAlert({
        type: "error",
        message: "User not authenticated",
      });
      return;
    }

    if (!deptId) {
      setAlert({
        type: "error",
        message: "Department not found for this org",
      });
      return;
    }
    const bdRequestId = bdId;

if (!bdRequestId) {
  setAlert({
    type: "error",
    message: "BD Request ID not found",
  });
  return;
}

    try {
      console.log("Starting project completion...");

      // 1️⃣ Update BD status
      const bdResponse = await fetch(
        `${BACKEND_URL}/api/business-development/${bdRequestId}/bd-update`,
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
        setAlert({
          type: "error",
          message: bdData.message || "Failed to update project",
        });
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
            "Final dispatch department completed the project and moved to next department",
          type: "PROJECT_MOVED",
          related_bd_id: bdRequestId,
          recipient_department_id: deptId, // dynamically fetched department
          // Optionally, you can also send to a role or specific user:
          // recipient_role: "manager",
          // recipient_id: 54,
          metadata: { department: "Final Dispatch" },
        }),
      });

      const notifData = await notifResponse.json().catch(() => ({}));
      if (!notifResponse.ok) {
        console.error("Notification Failed:", notifData);
        setAlert({
          type: "error",
          message: notifData.message || "Failed to send notification",
        });
        return;
      }

      console.log(`✅ Notification sent to department users:`, notifData);
      setAlert({
        type: "success",
        message: "Project completed and notification sent to department users!",
      });
    } catch (error) {
      console.error("❌ Error completing project:", error);
      setAlert({
        type: "error",
        message: "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full min-h-[80vh] p-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Final Dispatch
        </h2>

        <p className="text-gray-600 mb-6">
          Manage Final dispatch drawings, design approvals, and technical
          documentation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Drawings</h3>
            <p className="text-sm text-gray-500">
              Upload and manage Final dispatch drawings.
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
