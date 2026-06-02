import React, { useEffect, useState } from "react";
import ProjectManagerCard from "./ProjectManagerCard";
import UpdateProjects from "./UpdateProjects";
import { api } from "../../user/api/businessApi";

const ProjectManagerPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/project-manager/projects",
        {
          withCredentials: true,
        }
      );

      setProjects(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
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

      {activeTab === "projects" ? (
        projects.length === 0 ? (
          <p className="text-white">No projects found</p>
        ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

            {projects.map((item) => (
              <ProjectManagerCard
                key={item.id}
                data={item}
                onUpdate={fetchProjects}
              />
            ))}
          </div>
        )
      ) : (
        <UpdateProjects />
      )}
    </div>
  );
};

export default ProjectManagerPage;