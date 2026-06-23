import React, { useContext, useEffect, useState } from "react";
import { api } from "../../user/api/businessApi";
import ProjectManagerCard from "./ProjectManagerCard";
import { AuthContext } from "../../../context/AuthContext";

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
  const { user }: any = useContext(AuthContext);


const currentUser =
  user?.first_name?.trim().toLowerCase() || "";

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await api.get("/project-manager/projects", {
        withCredentials: true,
      });

      const allProjects = res.data.data || [];

      const uniqueProjects = Array.from(
        new Map(allProjects.map(p => [p.id, p])).values()
      ).sort((a, b) => b.id - a.id);

      setProjects(uniqueProjects);
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

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

          {projects.map((project) => ( 
            <ProjectManagerCard 
            key={project.id} 
            data={project} 
            onUpdate={fetchProjects} 
            showAssignFlow={true} 
            showWorkflowFlow={true} 
            /> 
            ))}
        </div>
      )}
    </div>
  );
};
export default UpdateProjects;