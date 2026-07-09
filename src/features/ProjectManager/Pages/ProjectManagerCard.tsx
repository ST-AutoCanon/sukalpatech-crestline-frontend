import React, { useEffect, useState, useContext, useMemo } from "react";
import { api } from "../../user/api/businessApi";
import ALeart from "../../user/components/Aleartmessage";
import { AuthContext } from "../../../context/AuthContext";
import {
  FaTasks,
  FaCheckSquare,
  FaSpinner,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

interface Props {
  data: any;
  showAssignFlow?: boolean;
  showWorkflowFlow?: boolean;
  autoOpen?: boolean;
  onUpdate: () => Promise<void>;
  isMyProject?: boolean;
  showAssignmentStatus?: boolean;
  allowEdit?: boolean;   // <-- add this
}

const ProjectManagerCard: React.FC<Props> = ({ data, isMyProject = false, showAssignmentStatus = false, allowEdit = true, onUpdate, showAssignFlow, showWorkflowFlow, autoOpen = false, }) => {

  const [workflow, setWorkflow] = useState([
    {
      task_title: "",
      department: "",
      assigned_to: "",
      priority: "Medium",
      start_date: "",
      due_date: "",
      estimated_days: "",
      task_description: "",
    },
  ]);
  const priorities = [
    "Low",
    "Medium",
    "High",
  ];

  const [showModal, setShowModal] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [projectManagers, setProjectManagers] = useState<any[]>([]);

  const [tasksAssigned, setTasksAssigned] = useState(false);
  const [savedTasks, setSavedTasks] = useState<any[]>([]);
  const [managers, setManagers] = useState([]);


  const [workflowSaved, setWorkflowSaved] = useState(false);
  const [assignedManagerId, setAssignedManagerId] = useState<number | null>(null);
  const [workflowView, setWorkflowView] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);
  const { user }: any = useContext(AuthContext);
  const [allWorkflows, setAllWorkflows] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);


  const alreadyAssignedToPM =
    data.assigned_project_manager &&
    data.assigned_project_manager.trim() !== "";

  const assignedTo = data.assigned_project_manager;

  const isAssignedToSelf = Boolean(
    assignedTo &&
    user?.first_name &&
    assignedTo.trim().toLowerCase() ===
    user.first_name.trim().toLowerCase()
  );

  const isAssignedToOther =
    assignedTo && assignedTo !== user?.first_name;


  const [departmentTasks, setDepartmentTasks] = useState([
    {
      department: "",
      task_description: "",
    },
  ]);

  const [departments, setDepartments] = useState<any[]>([]);

  const sortedManagers = [
    ...projectManagers.filter(m => m.id === user?.id),
    ...projectManagers.filter(m => m.id !== user?.id),
  ];


  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const latestWorkflows = Object.values(
    allWorkflows.reduce((acc: any, item: any) => {
      const key = `${item.project_management_id}_${item.department}`;

      if (
        !acc[key] ||
        new Date(item.updated_at) >
        new Date(acc[key].updated_at)
      ) {
        acc[key] = item;
      }

      return acc;
    }, {})
  );


  const latestStatuses = Object.values(
    statusList.reduce((acc: any, item: any) => {
      const key = item.department;

      if (
        !acc[key] ||
        new Date(item.updated_at) >
        new Date(acc[key].updated_at)
      ) {
        acc[key] = item;
      }

      return acc;
    }, {})
  );
  const taskStats = {
    total_tasks: latestWorkflows.length,

    completed_tasks: latestWorkflows.filter(
      (x) => x.status === "APPROVED"
    ).length,

    in_progress_tasks: latestWorkflows.filter(
      (x) => x.status === "IN_PROGRESS"
    ).length,

    pending_tasks: latestWorkflows.filter(
      (x) => x.status === "PENDING"
    ).length,

    rejected_tasks: latestWorkflows.filter(
      (x) => x.status === "REJECTED"
    ).length,
  };

  const statusColors: Record<string, string> = {
    APPROVED: "#22c55e",
    IN_PROGRESS: "#3b82f6",
    PENDING: "#eab308",
    REJECTED: "#ef4444",
  };
  const hasTaskData = workflowView.some(
    (task) =>
      task.task_title ||
      task.task_description ||
      task.department ||
      task.assigned_to ||
      task.priority ||
      task.start_date ||
      task.due_date ||
      task.estimated_days
  );


  useEffect(() => {
    fetchAllWorkflows();
  }, []);

  const fetchAllWorkflows = async () => {
    const res = await api.get(
      "/project-manager/all-project-workflows",
      { withCredentials: true }
    );

    setAllWorkflows(res.data.data || []);
  };

  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(
          `/project-manager/project/${data.id}/tasks`,
          {
            withCredentials: true,
          }
        );

        setSavedTasks(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    if (showModal) {
      fetchTasks();
    }
  }, [showModal, data.id]);

  useEffect(() => {
    if (
      alreadyAssignedToPM ||
      savedTasks.length > 0
    ) {
      setTasksAssigned(true);
    }
  }, [alreadyAssignedToPM, savedTasks]);


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments", {
          withCredentials: true,
        });

        setDepartments(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const loadManagers = async () => {
      try {
        const res = await api.get("/project-manager/managers", {
          withCredentials: true,
        });

        setManagers(res.data.data || []);
      } catch (err) {
        console.error("Failed to load managers", err);
      }
    };

    loadManagers();
  }, [showModal]);
  useEffect(() => {

    const fetchWorkflow = async () => {
      try {
        const res = await api.get(
          `/project/${data.id}/workflow`,
          { withCredentials: true }
        );
        console.log("WORKFLOW RESPONSE:", res.data.data);

        setWorkflowView(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setWorkflowView([]);
      }
    };

    if (showModal) {
      fetchWorkflow();
    }
  }, [showModal, data.id]);

  const handleSaveWorkflow = async () => {
    // Validate required fields
    const hasEmptyFields = workflow.some(
      (item) =>
        !item.task_title?.trim() ||
        !item.department ||
        !item.assigned_to ||
        !item.priority ||
        !item.start_date ||
        !item.due_date ||
        !item.estimated_days ||
        !item.task_description?.trim()
    );

    if (hasEmptyFields) {
      setAlert({
        type: "error",
        message: "Please fill all required fields before assigning the task.",
      });
      return;
    }

    try {
      await api.put(`/project/${data.id}/workflow`, {
        workflow: workflow.map((item, index) => ({
          task_title: item.task_title,
          department: item.department,
          assigned_to: item.assigned_to,
          priority: item.priority,
          start_date: item.start_date,
          due_date: item.due_date,
          estimated_days: item.estimated_days,
          task_description: item.task_description,
          sequence: index + 1,
        })),
      });

      setWorkflowSaved(true);

      const res = await api.get(`/project/${data.id}/workflow`, {
        withCredentials: true,
      });

      setWorkflow(res.data?.data || []);

      setAlert({
        type: "success",
        message: "Tasks saved successfully",
      });
    } catch (err) {
      console.error(err);

      setAlert({
        type: "error",
        message: "Failed to save tasks.",
      });
    }
  };

  const handleAssignManager = async () => {
    try {

      await api.put(
        `/project/${data.id}/assign`,
        {
          assigned_to: selectedManager,
        },
        { withCredentials: true }
      );

      // Refresh assigned tasks list
      const taskRes = await api.get(
        `/project-manager/project/${data.id}/tasks`,
        { withCredentials: true }
      );

      setSavedTasks(taskRes.data.data || []);

      setAlert({
        type: "success",
        message: "Project assigned and tasks saved successfully",
      });

      onUpdate();
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to assign project",
      });
    }
  };


  const fetchStatuses = async () => {
    try {
      const res = await api.get(
        `/project/status/${data.id}`,
        {
          withCredentials: true,
        }
      );

      setStatusList(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (showModal) {
      fetchStatuses();
    }
  }, [showModal]);

  const totalTasks = workflowView.length;

  const completedTasks = latestStatuses.filter(
    (s) => s.status === "APPROVED"
  ).length;

  const inProgressTasks = latestStatuses.filter(
    (s) => s.status === "IN_PROGRESS"
  ).length;

  const pendingTasks = latestStatuses.filter(
    (s) => s.status === "PENDING"
  ).length;

  const rejectedTasks = latestStatuses.filter(
    (s) => s.status === "REJECTED"
  ).length;

  const chartData = statusList.map((item) => ({
    department: item.department,
    completion: item.completion_percentage || 0,
    status: item.status,
  }));
  const overdueTasks = statusList.filter(
    (task) =>
      task.expected_days &&
      task.status !== "APPROVED"
  );

  const handleAssignToManager = async () => {
    try {
      if (!selectedManager) {
        setAlert({
          type: "error",
          message: "Please select project manager",
        });
        return;
      }

      const manager = JSON.parse(selectedManager);

      await api.put(
        `/project-manager/projects/${data.id}/assign-manager`,
        {
          assigned_project_manager: manager.name,
          role: manager.role,
        },
        { withCredentials: true }
      );

      setAlert({
        type: "success",
        message:
          manager.name === user?.first_name
            ? "Project assigned successfully"
            : `Project assigned to ${manager.name}`,
      });

      // Refresh parent project list
      await onUpdate();
      setTimeout(() => {
        window.dispatchEvent(new Event("projects-updated"));
      }, 100);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Failed to assign project",
      });
    }
  };
  useEffect(() => {
    if (!showModal) return;

    const fetchProjectManagers = async () => {
      try {
        const res = await api.get("/project-manager/project-managers", {
          withCredentials: true,
        });

        const managersOnly = (res.data.data || []).filter((u: any) =>
          u.role?.toLowerCase().includes("manager")
        );

        setProjectManagers(managersOnly);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjectManagers();
  }, [showModal]);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const res = await api.get(
          `/project-manager/project/${data.id}/request-details`,
          { withCredentials: true }
        );

        setRequestDetails(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequestDetails();
  }, [data.id]);


  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
  };

  const handleEditTask = async (item: any) => {
    console.log("projectId:", projectId);
    console.log("item:", item);
    console.log("task id:", item.id);

    try {
      const res = await api.put(
        `/project-manager/project/${data.id}/workflow/${item.id}`,
        {
          task_title: item.task_title,
          department: item.department,
          assigned_to: item.assigned_to,
          priority: item.priority,
          start_date: item.start_date,
          due_date: item.due_date,
          estimated_days: item.estimated_days,
          task_description: item.task_description,
        },
        { withCredentials: true }
      );

      setAlert({
        type: "success",
        message: "Task updated successfully",
      });

      console.log(res.data);

    } catch (err) {
      console.error(err);

      setAlert({
        type: "error",
        message: "Failed to update task",
      });
    }
  };

  const cardTheme = isMyProject
    ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border-emerald-300"
    : "bg-gradient-to-br from-slate-600 via-indigo-700 to-violet-700 border-indigo-300";

  const FIELD_CONFIG: Record<string, { label: string; key: string }[]> = {
    "2W": [
      { label: "Contact Person", key: "contact_person" },
    ],

    "3W": [
      { label: "Contact Person", key: "contact_person" },
    ],

    "FOOD": [
      { label: "Contact Person", key: "contact_person" },
    ],

    "GOLD_BUSINESS": [
      { label: "Contact Person", key: "contact_person" },
    ],
    "BUS": [
      { label: "Contact Person", key: "contact_person" },
    ],
  };
  const industryFields = useMemo(() => {
    const type = requestDetails?.industry_type?.toUpperCase() || "";
    const config = FIELD_CONFIG[type] || [];

    return config.map((field) => ({
      label: field.label,
      value: requestDetails?.[field.key] ?? "-",
    }));
  }, [requestDetails]);


  return (
    <>
      {/* ================= CARD ================= */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col min-h-[180px] cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-purple-600 font-semibold text-lg">
            Project ID: {data.bd_request_id}
          </h2>
          {showAssignmentStatus &&
            data.assigned_project_manager &&
            data.assigned_project_manager.trim() !== "" && (
              <div
                className={`w-3 h-3 rounded-full ${isMyProject ? "bg-green-500" : "bg-blue-500"
                  }`}
                title={isMyProject ? "Assigned to Me" : "Assigned to Another Manager"}
              />
            )}
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Industry Type</span>
          <span className="font-base">
            {requestDetails?.industry_type
              ? requestDetails.industry_type.replace(/_/g, " ").toUpperCase()
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Required Date</span>
          <span className="font-base">
            {data.required_date ? formatDate(data.required_date) : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Description</span>
          <span className="font-base truncate ml-2">
            {requestDetails?.description || "-"}
          </span>
        </div>

        {industryFields.map((field) => (
          <div key={field.label} className="flex justify-between">
            <span className="text-gray-500">{field.label}</span>
            <span className="font-medium truncate ml-2">
              {field.value}
            </span>
          </div>
        ))}




        <span className="text-blue-600 text-sm font-medium mt-3">
          View Details →
        </span>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">

            {/* HEADER */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Project Manager Details
            </h2>

            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            {/* ALERT */}
            {alert && (
              <div className="mt-4 sticky top-0 z-50">
                <ALeart
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            {/* ================= PROJECT DETAILS ================= */}
            <div className="bg-gray-100 p-4 rounded mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs font-medium">
                    BD Request ID
                  </label>

                  <input
                    readOnly
                    value={data.bd_request_id || ""}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Project ID
                  </label>

                  <input
                    readOnly
                    value={data.bd_request_id}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                {data.required_date && (
                  <div>
                    <label className="text-xs font-medium">
                      Required Date
                    </label>

                    <input
                      readOnly
                      value={formatDate(data.required_date)}
                      className="border p-2 rounded w-full bg-white text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium">
                    Assigned Date
                  </label>

                  <input
                    readOnly
                    value={
                      data.assigned_date
                        ? new Date(data.assigned_date).toLocaleDateString()
                        : "-"
                    }
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Assigned By
                  </label>

                  <input
                    readOnly
                    value={data.assigned_by || "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">
                    Assigned To
                  </label>

                  <input
                    readOnly
                    value={data.assigned_project_manager || "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Created At
                  </label>

                  <input
                    readOnly
                    value={
                      data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : "-"
                    }
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">
                    Industry Type
                  </label>

                  <input
                    readOnly
                    value={requestDetails?.industry_type
                      ? requestDetails.industry_type.replace(/_/g, " ").toUpperCase()
                      : "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Required Date
                  </label>

                  <input
                    readOnly
                    value={data.required_date ? formatDate(data.required_date) : "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Description
                  </label>

                  <input
                    readOnly
                    value={requestDetails?.description || "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                {industryFields.map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-medium">
                      {field.label}
                    </label>

                    <input
                      readOnly
                      value={field.value || ""}
                      className="border p-2 rounded w-full bg-white text-sm"
                    />
                  </div>
                ))}



                {/* <div className="sm:col-span-2">
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
                </div> */}
              </div>
            </div>

            {workflowView.length > 0 && (
              <>
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">
                    Task Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">

                    {/* Total Tasks */}
                    <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Total Tasks</p>
                        <h2 className="text-2xl font-bold">{totalTasks}</h2>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaTasks className="text-blue-600 text-xl" />
                      </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-green-50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <h2 className="text-2xl font-bold text-green-600">
                          {completedTasks}
                        </h2>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <FaCheckSquare className="text-green-600 text-xl" />
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">In Progress</p>
                        <h2 className="text-2xl font-bold text-blue-600">
                          {inProgressTasks}
                        </h2>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaSpinner className="text-blue-600 text-xl" />
                      </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-yellow-50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <h2 className="text-2xl font-bold text-yellow-600">
                          {pendingTasks}
                        </h2>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaClock className="text-yellow-600 text-xl" />
                      </div>
                    </div>

                    {/* Rejected */}
                    <div className="bg-red-50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Rejected</p>
                        <h2 className="text-2xl font-bold text-red-600">
                          {rejectedTasks}
                        </h2>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <FaTimesCircle className="text-red-600 text-xl" />
                      </div>
                    </div>

                  </div>

                </div>

              </>
            )}

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    {hasTaskData && (
                      <>
                        <th className="p-2 text-left whitespace-nowrap">Task Title</th>
                        <th className="p-2 text-left whitespace-nowrap">Description</th>
                        <th className="p-2 text-left whitespace-nowrap">Department</th>
                        <th className="p-2 text-left whitespace-nowrap">Assigned To</th>
                        <th className="p-2 text-left whitespace-nowrap">Priority</th>
                        <th className="p-2 text-left whitespace-nowrap">Start Date</th>
                        <th className="p-2 text-left whitespace-nowrap">Due Date</th>
                        <th className="p-2 text-left whitespace-nowrap">Duration</th>
                        <th className="p-2 text-left whitespace-nowrap">Status</th>
                        <th className="p-2 text-left whitespace-nowrap">Progress</th>
                        {alreadyAssignedToPM && allowEdit && (
                          <th className="p-2">Action</th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {workflowView.map((task, index) => {
                    const departmentStatuses = statusList.filter(
                      (s) =>
                        s.department?.trim().toLowerCase() ===
                        task.department?.trim().toLowerCase()
                    );

                    const statusData =
                      departmentStatuses.length > 0
                        ? departmentStatuses[departmentStatuses.length - 1]
                        : null;
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {editingIndex === index ? (
                            <input
                              value={task.task_title}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].task_title = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            task.task_title
                          )}
                        </td>

                        <td className="p-2">
                          {editingIndex === index ? (
                            <input
                              value={task.task_description}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].task_description = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            task.task_description
                          )}
                        </td>
                        <td className="p-2">
                          {editingIndex === index ? (
                            <select
                              value={task.department}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].department = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded p-1 w-full"
                            >
                              {departments.map((dept: any) => (
                                <option key={dept.department_id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            task.department
                              ? task.department
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())
                              : "-"
                          )}
                        </td>
                        <td className="p-2">
                          {editingIndex === index ? (
                            <select
                              value={task.assigned_to || ""}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].assigned_to = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="">Select Manager</option>

                              {managers.map((m: any) => (
                                <option
                                  key={m.id}
                                  value={`${m.first_name} ${m.last_name}`}
                                >
                                  {m.first_name} {m.last_name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            task.assigned_to || "-"
                          )}
                        </td>
                        <td className="p-2">
                          {editingIndex === index ? (
                            <select
                              value={task.priority}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].priority = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            >
                              {priorities.map((priority) => (
                                <option key={priority} value={priority}>
                                  {priority}
                                </option>
                              ))}
                            </select>
                          ) : (
                            task.priority
                          )}
                        </td>
                        <td className="p-2">
                          {editingIndex === index ? (
                            <input
                              type="date"
                              value={task.start_date?.split("T")[0] || ""}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].start_date = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded p-1"
                            />
                          ) : (
                            task.start_date
                              ? new Date(task.start_date).toLocaleDateString("en-GB")
                              : "-"
                          )}
                        </td>

                        <td className="p-2">
                          {editingIndex === index ? (
                            <input
                              type="date"
                              value={task.due_date?.split("T")[0] || ""}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].due_date = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded p-1"
                            />
                          ) : (
                            task.due_date
                              ? new Date(task.due_date).toLocaleDateString("en-GB")
                              : "-"
                          )}
                        </td>

                        <td className="p-2">
                          {editingIndex === index ? (
                            <input
                              value={task.estimated_days}
                              onChange={(e) => {
                                const updated = [...workflowView];
                                updated[index].estimated_days = e.target.value;
                                setWorkflowView(updated);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            task.estimated_days
                          )}
                        </td>
                        {/* STATUS */}
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${statusData?.status === "APPROVED"
                              ? "bg-green-500"
                              : statusData?.status === "IN_PROGRESS"
                                ? "bg-blue-500"
                                : statusData?.status === "PENDING"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                          >
                            {statusData?.status || "PENDING"}
                          </span>
                        </td>

                        {/* PROGRESS */}
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                  width: `${statusData?.completion_percentage || 0}%`,
                                }}
                              />
                            </div>

                            <span>
                              {statusData?.completion_percentage || 0}%
                            </span>
                          </div>
                        </td>
                        {alreadyAssignedToPM && allowEdit && (
                          <td className="p-2">
                            {editingIndex === index ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    handleEditTask(workflowView[index]);
                                    setEditingIndex(null);
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                                >
                                  Save
                                </button>

                                <button
                                  onClick={() => setEditingIndex(null)}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!isAssignedToSelf) {
                                    setAlert({
                                      type: "error",
                                      message:
                                        "Only the assigned project manager can edit this workflow.",
                                    });
                                    return;
                                  }

                                  setEditingIndex(index);
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              { }
              {showAssignFlow && !alreadyAssignedToPM && (
                <div className="bg-gray-100 p-4 rounded mt-6">
                  <h3 className="font-semibold mb-4">
                    Assign To Project Manager
                  </h3>

                  <select
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Project Manager</option>

                    {sortedManagers.map((manager: any) => (
                      <option
                        key={manager.id}
                        value={JSON.stringify({
                          id: manager.id,
                          name: manager.first_name,
                          role: manager.role,
                        })}
                      >
                        {manager.first_name} {manager.last_name}
                        {manager.id === user?.id ? " (Self)" : ""}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAssignToManager}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}
              {showWorkflowFlow &&
                isAssignedToSelf &&
                workflowView.length === 0 && (
                  <>
                    <div className="bg-gray-100 p-4 rounded mt-6">
                      <h3 className="font-semibold mb-4">
                        Task Assignment to department
                      </h3>

                      {workflow.map((item, index) => (
                        <div
                          key={index}
                          className="relative bg-white border rounded-xl p-4 mb-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* Task Title */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="text"
                                value={item.task_title}
                                placeholder="Enter task title"
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].task_title = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className={`w-full border rounded-lg px-3 py-2
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white"
                                  }`}
                              />
                            </div>

                            {/* Department */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={item.department}
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].department = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              >
                                <option value="">Select Department</option>

                                {departments.map((dept: any) => (
                                  <option
                                    key={dept.department_id}
                                    value={dept.name}
                                  >
                                    {dept.name
                                      ?.replace(/_/g, " ")
                                      ?.toLowerCase()
                                      ?.replace(/\b\w/g, (c: string) => c.toUpperCase())}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Assigned To */}
                            {alreadyAssignedToPM && (
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Assigned To <span className="text-red-500">*</span>
                                </label>

                                <select
                                  value={item.assigned_to}
                                  onChange={(e) => {
                                    const updated = [...workflow];
                                    updated[index].assigned_to = e.target.value;
                                    setWorkflow(updated);
                                  }}
                                  className="w-full border p-2 rounded"
                                >
                                  <option value="">Select Manager</option>

                                  {managers.map((m: any) => (
                                    <option key={m.id} value={`${m.first_name} ${m.last_name}`}>
                                      {m.first_name} {m.last_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Priority */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Priority <span className="text-red-500">*</span>
                              </label>

                              <select
                                value={item.priority}
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].priority = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              >
                                {priorities.map((priority) => (
                                  <option
                                    key={priority}
                                    value={priority}
                                  >
                                    {priority}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Start Date */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Start Date <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="date"
                                value={item.start_date}
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].start_date = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>

                            {/* Due Date */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Due Date <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="date"
                                value={item.due_date}
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].due_date = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>

                            {/* Estimated Days */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Estimated Duration <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="number"
                                placeholder="Days"
                                value={item.estimated_days}
                                onChange={(e) => {
                                  const updated = [...workflow];
                                  updated[index].estimated_days = e.target.value;
                                  setWorkflow(updated);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Task Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Enter task description"
                              value={item.task_description}
                              onChange={(e) => {
                                const updated = [...workflow];
                                updated[index].task_description =
                                  e.target.value;
                                setWorkflow(updated);
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-end gap-3">
                              {workflow.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setWorkflow(workflow.filter((_, i) => i !== index))
                                  }
                                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setWorkflow([
                            ...workflow,
                            {
                              task_title: "",
                              department: "",
                              assigned_to: "",
                              priority: "Medium",
                              start_date: "",
                              due_date: "",
                              estimated_days: "",
                              task_description: "",
                            },
                          ])
                        }
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                      >
                        + Add Step
                      </button>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        onClick={() => {
                          setWorkflow([
                            {
                              task_title: "",
                              department: "",
                              assigned_to: "",
                              priority: "Medium",
                              start_date: "",
                              due_date: "",
                              estimated_days: "",
                              task_description: "",
                            },
                          ]);
                        }}
                        className="px-6 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSaveWorkflow}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                      >
                        Create Task
                      </button>
                    </div>
                  </>
                )}
              {showWorkflowFlow && isAssignedToSelf && workflowSaved && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAssignManager}
                    className="px-6 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                  >
                    Assign To Manager
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectManagerCard; 