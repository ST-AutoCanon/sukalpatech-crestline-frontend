import React, { useEffect, useState } from "react";
import { api } from "../../user/api/businessApi";
import Alert from "../../../components/Aleartmessage";

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import WorkflowBuilder from "../../user/pages/departments/Businessdevelopment/Feasibility/workflow/WorkflowBuilder";


interface Project {
  id: number;
  bd_request_id: number;
  description: string;
  required_date: string;
  assigned_date: string;
  assigned_by: string;
  assigned_project_manager: string;
  created_at: string;
}

const AssignedProjectsPage = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [workflow, setWorkflow] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("projects");

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });


  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const allRes = await api.get(
        "/project-manager/projects",
        { withCredentials: true }
      );

      const assignedRes = await api.get(
        "/project-manager/assigned-projects",
        { withCredentials: true }
      );

      setAllProjects(allRes.data.data || []);
      setAssignedProjects(assignedRes.data.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject?.id) return;

    const fetchWorkflow = async () => {
      try {
        const res = await api.get(
          `/project/${selectedProject.id}/workflow`,
          {
            withCredentials: true,
          }
        );

        const formatted = (res.data.data || []).map((item: any) => ({
          id: item.id?.toString(),
          department: item.department,
        }));

        setWorkflow(formatted);

        if (res.data.project_id) {
          setProjectId(res.data.project_id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkflow();
  }, [selectedProject]);

  const handleAssignProject = async () => {
    try {
      if (!selectedProject) return null;

      const res = await api.post(
        "/project/assign",
        {
          bd_request_id: selectedProject.bd_request_id,
          description: selectedProject.description,
          required_date: selectedProject.required_date,
          assigned_by: user?.first_name,
        },
        {
          withCredentials: true,
        }
      );

      const createdProject = res.data.data;

      setProjectId(createdProject.id);
      setAlert({
        show: true,
        type: "success",
        message: "Project assigned successfully",
      });

      return createdProject.id;
    } catch (err: any) {
      console.error(err);

      if (
        err.response?.data?.message ===
        "Project already exists"
      ) {
        const existingRes = await api.get(
          `/project/by-bd/${selectedProject.bd_request_id}`,
          { withCredentials: true }
        );

        const existingProject = existingRes.data.data;

        setProjectId(existingProject.id);

        setAlert({
          show: true,
          type: "success",
          message: "Project already assigned",
        });

        return existingProject.id;
      } setAlert({
        show: true,
        type: "error",
        message: "Failed to assign project",
      });

      return null; throw err;
    }
  };
  const handleSaveWorkflow = async () => {
    try {
      let currentProjectId = projectId;

      if (!currentProjectId) {
        currentProjectId = await handleAssignProject();
      }

      if (!currentProjectId) return;

      await api.put(
        `/project/${currentProjectId}/workflow`,
        {
          workflow: workflow.map(
            (item, index) => ({
              department: item.department,
              sequence: index + 1,
            })
          ),
        },
        {
          withCredentials: true,
        }
      );

      await api.post(
        "/project/status",
        {
          project_management_id:
            currentProjectId,
          department: "PROJECT_MANAGER",
          status: "APPROVED",
          comments: "Workflow created",
        },
        {
          withCredentials: true,
        }
      );

      setAlert({
        show: true,
        type: "success",
        message: "Workflow saved successfully",
      });

      setShowModal(false);

      fetchProjects();
    } catch (err) {
      console.error(err);
      setAlert({
        show: true,
        type: "error",
        message: "Failed to save workflow",
      });
    }
  };

  const currentProjects =
    activeTab === "projects"
      ? allProjects
      : assignedProjects;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() =>
            setAlert({
              show: false,
              type: "",
              message: "",
            })
          }
        />
      )}

      <div className="mb-8 flex justify-between items-center">

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "projects"
            ? "bg-white text-purple-700 shadow"
            : "bg-white/10 text-white"
            }`}
        >
          Projects
        </button>

        <button
          onClick={() => setActiveTab("updates")}
          className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "updates"
            ? "bg-white text-purple-700 shadow"
            : "bg-white/10 text-white"
            }`}
        >
          Update Projects
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

        {currentProjects.map((project) => (

          <div
            key={project.id}
            className="bg-white rounded-xl shadow-md p-2 min-h-[140px]"
          >

            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              Project Id:{project.id}
            </h2>

            <div className="space-y-1 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  BD Request
                </span>

                <span className="font-medium">
                  {project.bd_request_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Assigned By
                </span>

                <span className="font-medium">
                  {project.assigned_by}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Assigned To
                </span>

                <span className="font-medium">
                  {project.assigned_project_manager}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Required Date
                </span>

                <span className="font-medium">
                  {new Date(
                    project.required_date
                  ).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-gray-500">
                  Description
                </span>

                <p className="mt-1 text-gray-700">
                  {project.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setShowModal(true);
                }}
                className="text-blue-600 font-medium mt-3 hover:underline"
              >
                View Details →
              </button>

            </div>
          </div>
        ))}
      </div>
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Project Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">
                  BD Request ID
                </label>

                <input
                  readOnly
                  value={selectedProject.bd_request_id}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Project ID
                </label>

                <input
                  readOnly
                  value={selectedProject.id}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Required Date
                </label>

                <input
                  readOnly
                  value={new Date(
                    selectedProject.required_date
                  ).toLocaleDateString()}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Assigned Date
                </label>

                <input
                  readOnly
                  value={
                    selectedProject.assigned_date
                      ? new Date(
                        selectedProject.assigned_date
                      ).toLocaleDateString()
                      : "-"
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Assigned By
                </label>

                <input
                  readOnly
                  value={selectedProject.assigned_by}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Assigned To
                </label>

                <input
                  readOnly
                  value={
                    selectedProject.assigned_project_manager || "-"
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Description
                </label>

                <textarea
                  readOnly
                  value={selectedProject.description}
                  rows={4}
                  className="border p-2 rounded w-full"
                />
              </div>

            </div>

            {/* Assign Section */}




            {activeTab === "updates" && (
              <div className="mt-6">

                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleAssignProject}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                  >
                    Assign To Manager
                  </button>
                </div>

                {projectId && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Workflow Builder
                    </h3>

                    <WorkflowBuilder
                      workflow={workflow}
                      onChange={setWorkflow}
                    />

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSaveWorkflow}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                      >
                        Save Workflow
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default AssignedProjectsPage;