import { useAuth } from "../../auth/hooks/useAuth";
import ProjectManagerPage from "../../ProjectManager/Pages/ProjectManagerPage";
import ProjectManagerPageA from "../../ProjectManagerSub/Pages/ProjectManagerPageA";

const ProjectManagerProjectsRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "project_manager_a":
      return <ProjectManagerPageA />;

    case "project_manager_b":
      return <ProjectManagerPageA />; // or PageB if exists

    case "project_manager":
    default:
      return <ProjectManagerPage />;
  }
};

export default ProjectManagerProjectsRouter;