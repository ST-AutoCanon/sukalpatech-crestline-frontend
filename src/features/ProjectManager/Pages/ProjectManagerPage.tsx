import React, { useEffect, useState } from "react";
import ProjectManagerCard from "./ProjectManagerCard";
import { api } from "../../user/api/businessApi";

const ProjectManagerPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

 return (
  <div className="min-h-screen w-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-6 py-6">
    {/* ================= HEADING ================= */}
   <div className="mb-8">
  <div className="inline-flex items-center bg-white/10 rounded-full p-1 shadow-lg backdrop-blur-md">

    <button className="px-6 py-2 rounded-full bg-white text-purple-700 font-semibold shadow">
      Projects
    </button>

  </div>
</div>
    

    {projects.length === 0 ? (
      <p className="text-white">No projects found</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((item) => (
          <ProjectManagerCard
            key={item.id}
            data={item}
            onUpdate={fetchProjects}
          />
        ))}
      </div>
    )}

  </div>
);
};

export default ProjectManagerPage;