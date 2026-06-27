import { useEffect, useState, useContext } from "react";
import axios from "axios";

/* ================= TYPES ================= */
interface Project {
  id: number;
  bd_request_id: number;
  description: string;
  required_date: string;
  assigned_date: string;
  assigned_by: string;
  created_at: string;
}

/* ================= COMPONENT ================= */
export default function ProjectPage() {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/project`;

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [workflowView, setWorkflowView] = useState<any[]>([]);


  /* ===== STATUS STATES ===== */
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [expandDeptStatus, setExpandDeptStatus] = useState(true);
  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
type FilterType = (typeof filters)[number];

const [filter, setFilter] = useState<FilterType>("All PR");

  /* ================= FETCH PROJECTS ================= */
  const fetchProjects = async () => {
  try {
    const mappedStatus =
      filter === "All PR"
        ? "ALL"
        : filter === "Completed"
        ? "APPROVED"
        : filter.toUpperCase();

    console.log("👉 Selected Filter:", filter);
    console.log("👉 API Status Param:", mappedStatus);

    const res = await axios.get(`${API_BASE}`, {
      params: { status: mappedStatus },
      withCredentials: true,
    });

    console.log("✅ API Response:", res.data);

    setProjects(res.data.data || []);
  } catch (err) {
    console.error("❌ Project fetch error", err);
  }
};

  useEffect(() => {
    fetchProjects();
  }, [filter]);

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
  const fetchWorkflowTasks = async (projectId: number) => {
  try {
    const res = await axios.get(
      `${API_BASE}/project/${projectId}/tasks`,
      {
        withCredentials: true,
      }
    );

    console.log("Workflow Tasks:", res.data);

    setWorkflowView(res.data.data || []);
  } catch (err) {
    console.error("Workflow fetch error", err);
    setWorkflowView([]);
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

    fetchStatuses(p.id); // 🔥 load existing statuses
    fetchWorkflowTasks(p.id);
  };



  return (
    <div className="p-4 sm:p-6 text-black">
      {/* ================= PROJECT CARDS ================= */}
      <div className="flex gap-10 mb-4">
  {filters.map((tab) => (
    <button
      key={tab}
      onClick={() => setFilter(tab)}
      className="flex flex-col items-center text-sm font-medium"
    >
      <span
        className={`transition-all ${
          filter === tab
            ? "text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        {tab}
      </span>

      <span
        className={`h-[2px] mt-1 rounded transition-all duration-300 ${
          filter === tab ? "w-full bg-white" : "w-0"
        }`}
      />
    </button>
  ))}
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => openProject(p)}
            className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col min-h-[200px] cursor-pointer"
          >
            <h2 className="text-purple-600 font-semibold text-lg mb-2">
              Project ID: {p.bd_request_id}
            </h2>

            <div className="flex-1 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">BD Request</span>
                <span className="font-medium">{p.bd_request_id}</span>
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

      {/* ================= MODAL ================= */}
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            {/* HEADER */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Project Details (ID: {selectedProject.id})
            </h2>

            {/* CLOSE */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            {/* ================= DETAILS ================= */}
            <div className="bg-gray-100 p-4 rounded mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["Project ID", selectedProject.bd_request_id],
                  ["BD Request ID", selectedProject.bd_request_id],
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
                <div className="sm:col-span-2 mt-4">
                  <label className="text-xs font-medium">
                    Assigned Tasks
                  </label>

                  {workflowView.length > 0 ? (
                    <div className="border p-3 rounded bg-white">
                      {workflowView.map((task, index) => (
                        <div
                          key={index}
                          className="border-b last:border-b-0 py-2"
                        >
                          <p>
                            <strong>Department:</strong> {task.department}
                          </p>

                          <p>
                            <strong>Task:</strong> {task.task_description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      readOnly
                      value="No tasks assigned"
                      className="border p-2 rounded w-full bg-white text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* TOGGLE BUTTON */}
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
                        {/* LEFT */}
                        <div className="flex flex-col gap-1">
                          <p>                            
                            <strong>Status:</strong> {s.department} — {s.status}
                          </p>
                          <p>
                            <strong>Comment:</strong> {s.comments || "-"}
                          </p>
                          <p>
                            <strong>Completion Percentage:</strong>{" "}
                            {s.completion_percentage != null
                              ? `${s.completion_percentage}%`
                              : "-"}
                          </p>
                        </div>

                        {/* RIGHT */}
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
          </div>
        </div>
      )}
    </div>
  );
}