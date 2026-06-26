import React, { useEffect, useState } from "react";
import ProjectManagerCard from "./ProjectManagerCard";
import UpdateProjects from "./UpdateProjects";
import { api } from "../../user/api/businessApi";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Project {
  id: number;
  assigned_project_manager?: string;
  assigned_project_manager_id?: number;
  assigned_by?: string;
}


const ProjectManagerPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [assignTab, setAssignTab] = useState("myProjects");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchParams] = useSearchParams();

   const selectedProjectId = Number(
  searchParams.get("projectId")
);

  const { user }: any = useContext(AuthContext);

 const myProjects = useMemo(() => {
  if (!user?.first_name) return [];

  const currentUser = user.first_name.trim().toLowerCase();

  return projects.filter(
    (p) =>
      p.assigned_project_manager
        ?.trim()
        .toLowerCase() === currentUser
  );
}, [projects, user?.first_name]);
  const assignedProjects = useMemo(() => {
    return projects.filter((p) => {
      return !p.assigned_project_manager || p.assigned_project_manager.trim() === "";
    });
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/project-manager/projects",
        {
          withCredentials: true,
        }
      );
      console.log("PROJECTS:", res.data.data);
      console.log("selectedProjectId", selectedProjectId);

      setProjects(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  fetchProjects();

  window.addEventListener("projects-updated", fetchProjects);

  return () => window.removeEventListener("projects-updated", fetchProjects);
}, []);

  useEffect(() => {
  if (!selectedProjectId || projects.length === 0) return;

  const project = projects.find(
    (p) => p.id === selectedProjectId
  );

  if (project) {
    setSelectedProject(project);
  }
}, [projects, selectedProjectId]);

  const updateProjects = projects.filter(
    (p) => p.project_status !== "COMPLETED"
  );

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-6 py-6">
      {/* ================= HEADING ================= */}
      <div className="mb-8 flex justify-between items-center">

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "projects"
              ? "bg-white text-purple-700 shadow"
              : "bg-white/10 text-white"
              }`}
          >
            Projects
          </button>

          {/* <button
            onClick={() => setActiveTab("myProjects")}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "myProjects"
              ? "bg-white text-purple-700 shadow"
              : "bg-white/10 text-white"
              }`}
          >
            My Projects
          </button> */}
        </div>

        <button
          onClick={() => setActiveTab("assignedprojects")}
          className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "assignedprojects"
            ? "bg-white text-purple-700 shadow"
            : "bg-white/10 text-white"
            }`}
        >
          Assign Projects
        </button>

      </div>

      {activeTab === "projects" ? (
        projects.length === 0 ? (
          <p className="text-white">No projects found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...projects]
              .sort((a, b) => b.id - a.id)
              .map((item) => (
                <ProjectManagerCard
  key={item.id}
  data={item}
  onUpdate={fetchProjects}
  autoOpen={item.id === selectedProjectId}
/>
              ))}
          </div>
        )
      ) : activeTab === "assignedprojects" ? (
        <>
          {/* Sub Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAssignTab("myProjects")}
              className={`px-4 py-2 rounded-full ${assignTab === "myProjects"
                  ? "bg-white text-purple-700"
                  : "bg-white/10 text-white"
                }`}
            >
              My Projects
            </button>

            <button
              onClick={() => setAssignTab("assignedProjects")}
              className={`px-4 py-2 rounded-full ${assignTab === "assignedProjects"
                  ? "bg-white text-purple-700"
                  : "bg-white/10 text-white"
                }`}
            >
              Assigned Projects
            </button>
          </div>

          {assignTab === "myProjects" ? (
            myProjects.length === 0 ? (
              <p className="text-white">No assigned projects</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...myProjects]
                  .sort((a, b) => b.id - a.id)
                  .map((item) => (
                    <ProjectManagerCard
                      key={item.id}
                      data={item}
                      showAssignFlow={false}
                      showWorkflowFlow={true}
                      onUpdate={fetchProjects}
                    />
                  ))}
              </div>
            )
          ) : (
            <UpdateProjects />
          )}
        </>
      ) : null}
    </div>
  );
};

export default ProjectManagerPage;