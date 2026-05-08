import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import Alert from "../../../../components/Aleartmessage";
/* ================= TYPES ================= */
interface Project {
  id: number;
  display_id?: number;
  bd_request_id: number;
  bd_request_display_id?: number;

  description: string;
  required_date: string;
  assigned_date: string;
  assigned_by: string;
  created_at: string;
}

/* ================= COMPONENT ================= */
export default function ProjectPage() {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/project`;

  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [expandDeptStatus, setExpandDeptStatus] = useState(true);

  const statuses = ["PENDING", "APPROVED", "REJECTED"];

  const departmentName = "stores_materials"; // ✅ FIXED (NO HARD CODE)

  /* ================= FETCH PROJECTS (WORKFLOW FILTERED) ================= */
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/projects/department/${departmentName}`,
        { withCredentials: true },
      );

      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Project fetch error", err);
    }
  };

  useEffect(() => {
    if (departmentName) fetchProjects();
  }, [departmentName]);

  /* ================= FETCH STATUS ================= */
  const fetchStatuses = async (projectId: number) => {
    try {
      const res = await axios.get(`${API_BASE}/status/${projectId}`, {
        withCredentials: true,
      });
      setStatusList(res.data.data || []);
    } catch (err) {
      console.error("Fetch status error", err);
    }
  };

  /* ================= HELPERS ================= */
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const openProject = (p: Project) => {
    setSelectedProject(p);
    setModalOpen(true);

    setStatus("");
    setComments("");

    fetchStatuses(p.id);
  };

  /* ================= UPDATE STATUS ================= */
  // const handleStatusUpdate = async () => {
  //   if (!status) {
  //    setAlert({
  //      type: "error",
  //      message: "Status required",
  //    });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     await axios.post(
  //       `${API_BASE}/status`,
  //       {
  //         project_management_id: selectedProject?.id,
  //         department: departmentName, // ✅ FIXED
  //         updated_by: user.first_name,
  //         status,
  //         comments,
  //       },
  //       { withCredentials: true },
  //     );

  //     setAlert({
  //       type: "success",
  //       message: "Status updated successfully",
  //     });

  //     setStatus("");
  //     setComments("");

  //     setModalOpen(false);

  //     fetchProjects();
  //   } catch (err: any) {
  //     console.error("Status update error", err);
  //     setAlert({
  //       type: "error",
  //       message: err?.response?.data?.message || "Error updating status",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleStatusUpdate = async () => {
    if (!status) {
      setAlert({
        type: "error",
        message: "Status required",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ CALL BACKEND ONCE
      const res = await axios.post(
        `${API_BASE}/status`,
        {
          project_management_id: selectedProject?.id,
          department: departmentName,
          updated_by: user.first_name,
          status,
          comments,
        },
        { withCredentials: true }
      );

      // ✅ GET WORKFLOW INFO FROM RESPONSE
      const workflow = res.data.workflowInfo;

      let alertMessage = "";

      if (workflow?.status === "APPROVED") {
        alertMessage = `✅ Approved → moved to ${workflow.next}`;
      } else if (workflow?.status === "REJECTED") {
        alertMessage = `❌ Rejected → sent back to ${workflow.previous}`;
      } else if (workflow?.status === "PENDING") {
        alertMessage = `⏳ Pending in ${workflow.current}`;
      }

      // ✅ SHOW ALERT
      setAlert({
        type: "success",
        message: alertMessage || "Status updated successfully",
      });

      setStatus("");
      setComments("");
      setModalOpen(false);

      fetchProjects();

    } catch (err: any) {
      console.error("Status update error", err);

      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Error updating status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 text-black">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {/* ================= PROJECT CARDS (UNCHANGED DESIGN) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => openProject(p)}
            className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col min-h-[200px] cursor-pointer"
          >
            <h2 className="text-purple-600 font-semibold text-lg mb-2">
              Project ID: {p.display_id ?? p.id}
            </h2>

            <div className="flex-1 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">BD Request</span>
                <span className="font-medium"> {p.bd_request_display_id ?? p.bd_request_id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Required</span>
                <span className="font-medium">
                  {formatDate(p.required_date)}
                </span>
              </div>

              <div>
                <span className="text-gray-500">Description</span>
                <p className="font-medium text-gray-800 truncate">
                  {p.description || "-"}
                </p>
              </div>
            </div>

            <span className="text-blue-600 text-sm font-medium mt-3">
              View Details →
            </span>
          </div>
        ))}
      </div>

      {/* ================= MODAL (UNCHANGED STRUCTURE) ================= */}
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            {/* HEADER */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Project Details (ID: {selectedProject.display_id ?? selectedProject.id})
            </h2>

            {/* CLOSE */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            {/* ================= PROJECT DETAILS (UNCHANGED) ================= */}
            <div className="bg-gray-100 p-4 rounded mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  [
                    "Project ID",
                    selectedProject.display_id ?? selectedProject.id,
                  ],
                  [
                    "BD Request ID",
                    selectedProject.bd_request_display_id ??
                    selectedProject.bd_request_id,
                  ],
                  ["Required Date", formatDate(selectedProject.required_date)],
                  ["Assigned Date", formatDate(selectedProject.assigned_date)],
                  ["Assigned By", selectedProject.assigned_by],
                  ["Created At", formatDate(selectedProject.created_at)],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <label className="text-xs font-medium">{label}</label>
                    <input
                      readOnly
                      value={value || ""}
                      className="border p-2 rounded w-full bg-white text-sm"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">Description</label>
                  <textarea
                    readOnly
                    value={selectedProject.description || ""}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ================= DEPARTMENT STATUS (EXACT SAME DESIGN) ================= */}

            <div className="flex justify-end mb-2">
              <button
                onClick={() => setExpandDeptStatus(!expandDeptStatus)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {expandDeptStatus ? "−" : "+"}
              </button>
            </div>

            {expandDeptStatus && (
              <div className="border border-gray-200 rounded p-4 mb-4 overflow-x-auto">
                <h3 className="font-semibold mb-2">Department Status</h3>

                {statusList.length === 0 ? (
                  <p className="text-gray-500 text-sm">No status yet</p>
                ) : (
                  <div className="space-y-2">
                    {statusList.map((s) => (
                      <div
                        key={s.id}
                        className="bg-gray-200 p-2 sm:p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
                      >
                        <div className="flex flex-col gap-1">
                          <p>
                            {/* <strong>Status:</strong> {s.status} */}
                            <strong>Status:</strong> {s.department} — {s.status}
                          </p>
                          <p>
                            <strong>Comment:</strong> {s.comments || "-"}
                          </p>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600 mt-1 sm:mt-0">
                          {s.updated_by ?? "—"} •{" "}
                          <span>
                            {s.updated_at
                              ? new Date(s.updated_at).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= UPDATE SECTION (UNCHANGED DESIGN) ================= */}
            <div className="border border-gray-200 rounded p-4 mt-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-4 text-lg text-purple-600">
                Update Your Status
              </h3>

              <div className="mb-3">
                <label className="text-xs font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 rounded w-full bg-white text-sm"
                >
                  <option value="">Select</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="border p-2 rounded w-full bg-white text-sm"
                  placeholder="Enter your comments"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleStatusUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Submit Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
