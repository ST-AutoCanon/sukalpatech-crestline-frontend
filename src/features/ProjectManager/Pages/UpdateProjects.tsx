import React, { useEffect, useState } from "react";
import { api } from "../../user/api/businessApi";
import ProjectManagerCard from "./ProjectManagerCard";

interface Project {
  id: number;
  bd_request_id: number;
  description: string;
  required_date: string;
  assigned_date: string;
  assigned_by: string;
  assigned_project_manager?: string | null;
  created_at: string;
}

const UpdateProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await api.get(
  "/project-manager/pending-projects",
  {
    withCredentials: true,
  }
);

      setProjects(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
     
      {loading ? (
        <div className="text-center py-10">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-500">
            No pending projects found
          </p>
        </div>
      ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

          {projects.map((project) => (
            <ProjectManagerCard
              key={project.id}
              data={project}
              onUpdate={fetchProjects}
              isUpdateMode={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateProjects;