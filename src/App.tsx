import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import AuthLayout from "./components/layout/AuthLayout";
import { useAuth } from "./features/auth/hooks/useAuth";
import SessionTimeout from "./components/Sessiontimeout";

import AdminDashboard from "./features/admin/pages/AdminDashboard";
import EmployeeDashboard from "./features/user/pages/EmployeeDashboard";
import SuperAdminDashboard from "./features/superadmin/pages/SuperAdminDashboard";

import DashboardHome from "./features/admin/pages/DashboardHome";
import EmployeeDashboardHome from "./features/user/pages/EmployeeDashboardHome";

import DepartmentPage from "./features/admin/pages/Department";
import EmployeeUpdate from "./features/admin/pages/EmployeeUpdate";
import OrganisationHome from "./features/superadmin/pages/organisations/OrganisationHome";

import TwoWheelerHome from "./features/user/pages/departments/TwoWheeler/Business/TwoWheelerHome";
import ThreeWheelerHome from "./features/user/pages/departments/ThreeWheeler/Business/ThreeWheelerHome";
import FoodBusinessHome from "./features/user/pages/departments/FoodBusiness/FoodPages/FoodBusinessHome";
import GoldBusinessHome from "./features/user/pages/departments/gold_business/goldbusinessHome";



import ManagerDashboard from "./features/manager/pages/ManagerDashboard";
import ManagerDashboardHome from "./features/manager/pages/ManagerHome";
import EngineeringDesignPage from "./features/manager/pages/engineeringDesign/EngineeringDesignHome";
import StoreMaterialsPage from "./features/manager/pages/storeMaterials/StoreMaterialsHome";
import FabricationPage from "./features/manager/pages/fabrication/FabricationHome";
import QualityControlPage from "./features/manager/pages/qualityControl/QualityControlHome";
import PannelingWeldingPage from "./features/manager/pages/paneling&welding/Paneling&weldingHome";
import InteriorFitmentPage from "./features/manager/pages/InteriorFitment/InteriorFitmentHome";
import GlassDoorsPage from "./features/manager/pages/glass&doors/glass&doorsHome";
import FinalDispatchPage from "./features/manager/pages/finaldispatch/finaldispatchHome";
import FinalAssemblyDispatchPage from "./features/manager/pages/finalassembly&dispatch/finalassemblyHome";

import ProjectManagerDashboard from "./features/ProjectManager/ProjectManagerDashboard";
import ProjectManagerPage from "./features/ProjectManager/Pages/ProjectManagerPage";
import ProjectManagerHome from "./features/ProjectManager/Pages/ProjectManagerHome";


import UpdatedFeasibilityPage from "./features/user/pages/departments/Businessdevelopment/Feasibility/UpdatedFeasibilitypage";
import Home from "./pages/Home";
import CategoryLimitPage from "./features/admin/pages/Categorylimit";

/* =========================
   Lazy Loaded Departments
========================= */

const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  procurement: React.lazy(
    () =>
      import("./features/user/pages/departments/procruments/procrumentHome"),
  ),
  feasibility: React.lazy(
    () =>
      import("./features/user/pages/departments/feasibility/FeasibilityHome"),
  ),
  finance: React.lazy(
    () => import("./features/user/pages/departments/finance/FinanceHome"),
  ),
  BD: React.lazy(
    () =>
      import("./features/user/pages/departments/Businessdevelopment/Business/BusinessdevelopmentHome"),
  ),
};

/* =========================
   Auth Guard
========================= */

const RequireAuth = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <h3 style={{ padding: 20 }}>Restoring session...</h3>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

 return (
  <>
    <SessionTimeout />
    {children}
  </>
);
};

/* =========================
   App Routes
========================= */

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
      </Route>
      <Route path="/" element={<Home />} />
      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <RequireAuth roles={["employee"]}>
            <EmployeeDashboard />
          </RequireAuth>
        }
      >
        <Route index element={<EmployeeDashboardHome />} />
        <Route path="dashboard" element={<EmployeeDashboardHome />} />
        

        {Object.entries(componentMap).map(([key, Component]) => (
          <Route
            key={key}
            path={key}
            element={
              <Suspense fallback={<div>Loading {key}...</div>}>
                <Component />
              </Suspense>
            }
          />
        ))}

        <Route
          path="bd/updated"
          element={
            <Suspense fallback={<div>Loading Updated PRs...</div>}>
              <UpdatedFeasibilityPage />
            </Suspense>
          }
        />
        {/* BD2 ROUTES */}
<Route
  path="bd2/2w"
  element={
    <Suspense fallback={<div>Loading Two Wheeler...</div>}>
      <TwoWheelerHome />
    </Suspense>
  }
/>

<Route
  path="bd2/3w"
  element={
    <Suspense fallback={<div>Loading Three Wheeler...</div>}>
      <ThreeWheelerHome />
    </Suspense>
  }
/>

<Route
  path="bd2/food"
  element={
    <Suspense fallback={<div>Loading Food Business...</div>}>
      <FoodBusinessHome />
    </Suspense>
  }
/>
<Route
  path="bd2/gold"
  element={
    <Suspense fallback={<div>Loading gold Business...</div>}>
      <GoldBusinessHome />
    </Suspense>
  }
/>
  
      </Route>

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <RequireAuth roles={["manager"]}>
            <ManagerDashboard />
          </RequireAuth>
        }
      >
        <Route index element={<ManagerDashboardHome />} />
        <Route path="dashboard" element={<ManagerDashboardHome />} />

        <Route path="project-manager" element={<ProjectManagerPage />} />
       <Route
          path="engineering-design/:bdId"
          element={<EngineeringDesignPage />}
        />

        <Route path="store-materials/:bdId" element={<StoreMaterialsPage />} />
        <Route path="fabrication/:bdId" element={<FabricationPage />} />
        <Route path="quality-control/:bdId" element={<QualityControlPage />} />
        <Route
          path="panneling-welding/:bdId"
          element={<PannelingWeldingPage/>}
        />

        <Route path="interior-fitment/:bdId" element={<InteriorFitmentPage />} />
        <Route path="glass-doors/:bdId" element={<GlassDoorsPage/>} />
        <Route path="final-dispatch/:bdId" element={<FinalDispatchPage />} />
        <Route path="final-assembly-dispatch/:bdId" element={<FinalAssemblyDispatchPage/>} />

      </Route>
      {/* Project Manager Routes */}
{/* Project Manager Routes */}
<Route
  path="/project_manager"
  element={
    <RequireAuth
      roles={[
        "project_manager",
        "project_manager_a",
        "project_manager_b",
        "project_manager_c",
        "project_manager_d",
        "project_manager_e",
      ]}
    >
      <ProjectManagerDashboard />
    </RequireAuth>
  }
>
  <Route
    index
    element={<ProjectManagerHome />}
  />

  <Route
    path="dashboard"
    element={<ProjectManagerHome />}
  />

 <Route
  path="projects"
  element={<ProjectManagerPage />}
/>
</Route>
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireAuth roles={["admin"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="departments" element={<DepartmentPage />} />
        <Route path="employee-update" element={<EmployeeUpdate />} />
        <Route path="categorylimit" element={<CategoryLimitPage />} />
      </Route>

      {/* Super Admin Routes */}
      <Route
        path="/super_admin"
        element={
          <RequireAuth roles={["super_admin"]}>
            <SuperAdminDashboard />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="create_organisation" element={<OrganisationHome />} />

      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
} 