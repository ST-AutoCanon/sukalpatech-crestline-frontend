import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../user/api/businessApi";

import {
  FaTasks,
  FaCheckSquare,
  FaSpinner,
  FaClock,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";


interface WorkflowItem {
  department: string;
  status: string;
  total?: number;
  completion_percentage?: number;
}


export default function ProjectManagerHome() {
  const navigate = useNavigate();

  const [taskStats, setTaskStats] = useState<any>({});
  const [workflow, setWorkflow] = useState<WorkflowItem[]>([]);
  const [hoverDept, setHoverDept] = useState<string | null>(null);
  const [busData, setBusData] = useState<any>(null);

  const [allWorkflows, setAllWorkflows] = useState<any[]>([]);
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [clickedDepartment, setClickedDepartment] = useState<string | null>(null);

  const departmentLabels = {
    engineering_design: "Design",
    fabrication_structure: "Fabrication",
    panneling_welding: "Assembly",
    quality_control: "Quality Control",
    stores_materials: "Stores & Materials",
    interior_fitment: "Interior Fitment",
    glass_doors: "Glass & Doors",
    final_dispatch: "Final Dispatch",
    final_assembly_dispatch: "Final Assembly Dispatch",
  };

  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    ...new Map(
      allWorkflows.map((item) => [
        item.project_management_id,
        item,
      ])
    ).values(),
  ];

  const selectedProjectWorkflow = allWorkflows.filter(
    (item) =>
      item.project_management_id ===
      selectedProject?.project_management_id
  );
  const getStatusColor = (status?: string) => {
    switch ((status || "PENDING").toUpperCase()) {
      case "APPROVED":
        return "bg-green-500 text-white";
      case "IN_PROGRESS":
        return "bg-blue-500 text-white";
      case "REJECTED":
        return "bg-red-500 text-white";
      case "PENDING":
      default:
        return "bg-yellow-500 text-white";
    }
  };

  const handleHover = async (deptKey: string) => {
    setHoverDept(deptKey);

    const res = await api.get(
      `/project-manager/department-details/${deptKey}`
    );

    setBusData(res.data.data);
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/project-manager/dashboard-tasks", {
        withCredentials: true,
      });

      setTaskStats(res.data.data);
    };

    fetch();
  }, []);

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = async () => {
    const res = await api.get(
      "/project-manager/workflow-summary"
    );
    console.log("Workflow API Response:", res.data.data);

    setWorkflow(res.data.data);
  };
  const fetchAllWorkflows = async () => {
    const res = await api.get(
      "/project-manager/all-project-workflows",
      { withCredentials: true }
    );

    const data = res.data.data || [];

    setAllWorkflows(data);

    // Get unique projects
    const uniqueProjects = [
      ...new Map(
        data.map((item: any) => [
          item.project_management_id,
          item,
        ])
      ).values(),
    ];

    // Select latest project by default
    if (uniqueProjects.length > 0) {
      const lastProject = uniqueProjects.sort(
        (a: any, b: any) =>
          b.project_management_id - a.project_management_id
      )[0];

      setSelectedProject(lastProject);
    }
  };

  useEffect(() => {
    fetchAllWorkflows();
  }, []);

  const handleDepartmentClick = (deptKey: string) => {


    const priority = {
      IN_PROGRESS: 1,
      PENDING: 2,
      APPROVED: 3,
      REJECTED: 4
    };

    const latestProject = allWorkflows
      .filter(
        (item) =>
          item.department === deptKey &&
          item.status
      )
      .sort((a, b) => {
        const statusCompare =
          priority[a.status] -
          priority[b.status];

        if (statusCompare !== 0)
          return statusCompare;

        return (
          b.project_management_id -
          a.project_management_id
        );
      })[0];

    if (!latestProject) {
      alert("No project found");
      return;
    }

    navigate(
      `/project_manager/projects?projectId=${latestProject.project_management_id}`
    );
  };


  const taskCards = [
    {
      title: "Total Tasks",
      value: taskStats.total_tasks || 0,
      icon: <FaTasks className="text-blue-600 text-xl" />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Completed",
      value: taskStats.completed_tasks || 0,
      icon: <FaCheckSquare className="text-green-600 text-xl" />,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "In Progress",
      value: taskStats.in_progress_tasks || 0,
      icon: <FaSpinner className="text-blue-600 text-xl" />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Pending",
      value: taskStats.pending_tasks || 0,
      icon: <FaClock className="text-yellow-600 text-xl" />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Rejected",
      value: taskStats.rejected_tasks || 0,
      icon: <FaTimesCircle className="text-red-600 text-xl" />,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
    },
  ];

  const departments = Object.entries(departmentLabels).sort(
    ([deptA], [deptB]) => {
      const statusA =
        workflow.find((w) => w.department === deptA)?.status || "PENDING";

      const statusB =
        workflow.find((w) => w.department === deptB)?.status || "PENDING";

      const order: Record<string, number> = {
        APPROVED: 1,
        IN_PROGRESS: 2,
        PENDING: 3,
        REJECTED: 4,
      };

      return order[statusA] - order[statusB];
    }
  );

  const projectTasks = selectedProject
    ? allWorkflows.filter(
      (item) =>
        item.project_management_id ===
        selectedProject.project_management_id
    )
    : [];

  const visibleWorkflows = isTableExpanded
    ? projectTasks
    : projectTasks.slice(0, 8);


  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-xl font-bold">
          Project Manager Dashboard
        </h1>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm mb-4">
          Overall Task Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {taskCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bg} p-4 rounded-xl flex justify-between items-center`}
            >
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-2xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">
            Department Progress
          </h2>

          <select
            value={selectedProject?.project_management_id || ""}
            onChange={(e) => {
              const project = projects.find(
                (p) =>
                  p.project_management_id === Number(e.target.value)
              );

              setSelectedProject(project);
            }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option
                key={project.project_management_id}
                value={project.project_management_id}
              >
                Project id:{project.project_management_id}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300"></div>

          <div className="flex justify-between relative">
            {Object.entries(departmentLabels).map(
              ([deptKey, deptName], index) => {
                const isSelected =
                  selectedProjectWorkflow.some(
                    (w) => w.department === deptKey
                  );
                const item = selectedProjectWorkflow.find(
                  (w) => w.department === deptKey
                );

                let bg = "bg-gray-300";
                let textColor = "text-gray-500";

                if (item?.status === "APPROVED") {
                  bg = "bg-green-500";
                  textColor = "text-green-600";
                } else if (item?.status === "IN_PROGRESS") {
                  bg = "bg-blue-500";
                  textColor = "text-blue-600";
                } else if (item?.status === "REJECTED") {
                  bg = "bg-red-500";
                  textColor = "text-red-600";
                } else if (item?.status === "PENDING") {
                  bg = "bg-yellow-500";
                  textColor = "text-yellow-600";
                }

                return (
                  <div
                    key={deptKey}
                    className={`relative flex flex-col items-center flex-1 z-10 transition-all duration-300 ${isSelected
                      ? "scale-110 opacity-100"
                      : "opacity-40"
                      }`}
                  >
                    {/* Truck */}
                    {selectedProject &&
                      (item?.status === "IN_PROGRESS" ||
                        item?.status === "PENDING") && (
                        <div className="absolute -top-10">
                          <FaTruck
                            className="text-yellow-500 text-3xl cursor-pointer"
                            onMouseEnter={() => handleHover(deptKey)}
                            onMouseLeave={() => setHoverDept(null)}
                          />
                        </div>
                      )}
                    {/* Department Circle */}
                    <div
                      onClick={() => {
                        if (selectedProject) {
                          navigate(
                            `/project_manager/projects?projectId=${selectedProject.project_management_id}`
                          );
                        }
                      }}
                      className={`w-12 h-12 rounded-full ${bg}
  text-white flex items-center justify-center
  font-bold border-4 border-white shadow transition
  ${selectedProject
                          ? "cursor-pointer hover:scale-110"
                          : "opacity-40"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-center">
                      {deptName}
                    </p>

                    <p className={`text-xs ${textColor}`}>
                      {item?.status || "PENDING"}
                    </p>

                    <p className="text-xs text-gray-600">
                      {item?.completion_percentage ?? 0}%
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Department Task Details</h3>

            
          </div>
          {isTableOpen && (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Task Title</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Assigned To</th>
                  <th className="p-2 text-left">Priority</th>
                  <th className="p-2 text-left">Start Date</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Progress</th>
                </tr>
              </thead>

              <tbody>
                {visibleWorkflows.map((task, index) => {
                  const statusData = workflow.find(
                    (w) => w.department === task.department
                  );

                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{task.task_title || "-"}</td>
                      <td className="p-2">{task.task_description || "-"}</td>
                      <td className="p-2">{task.department || "-"}</td>
                      <td className="p-2">{task.assigned_to || "-"}</td>
                      <td className="p-2">{task.priority || "-"}</td>

                      <td className="p-2">
                        {task.start_date
                          ? new Date(task.start_date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-2">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}
                        >
                          {task.status || "PENDING"}
                        </span>
                      </td>

                      <td className="p-2">
                        <div className="w-24 bg-gray-200 h-2 rounded">
                          <div
                            className="bg-green-500 h-2 rounded"
                            style={{
                              width: `${statusData?.completion_percentage || 0}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}