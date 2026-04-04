import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import AuthLayout from "../../components/layout/AuthLayout";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/hooks/useAuth";

import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import EmployeeDashboard from "../../features/user/pages/EmployeeDashboard";
import SuperAdminDashboard from "../../features/superadmin/pages/SuperAdminDashboard";

import DashboardHome from "../../features/admin/pages/DashboardHome";
import EmployeeDashboardHome from "../../features/user/pages/EmployeeDashboardHome";

import DepartmentPage from "../../features/admin/pages/Department";
import EmployeeUpdate from "../../features/admin/pages/EmployeeUpdate";
import CreateOrganisation from "../../features/superadmin/pages/organisations/CreateOrganisation";

import UpdatedFeasibilityPage from "../../features/user/pages/departments/Businessdevelopment/Feasibility/UpdatedFeasibilitypage";
// import ThreeWheelerPage from "../../features/user/pages/departments/ThreeWheeler/Business/ThreeWheelerHome";
// import Foodbusiness from "../../features/user/pages/departments/FoodBusiness/FoodPages/FoodBusinessHome";
// import TwoWheelerHome from "../../features/user/pages/departments/TwoWheeler/Business/TwoWheelerHome";
/* =========================
   Lazy Loaded Departments
========================= */

const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  procurement: React.lazy(
    () =>
      import("../../features/user/pages/departments/procruments/procrumentHome"),
  ),
  feasibility: React.lazy(
    () =>
      import("../../features/user/pages/departments/feasibility/FeasibilityHome"),
  ),
  finance: React.lazy(
    () => import("../../features/user/pages/departments/finance/FinanceHome"),
  ),
  BD: React.lazy(
    () =>
      import("../../features/user/pages/departments/Businessdevelopment/Business/BusinessdevelopmentHome"),
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
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* =========================
   App Routes
========================= */

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

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
      </Route>
      {/* <Route
  path="bd2/2w"
  element={
    <Suspense fallback={<div>Loading 2W...</div>}>
      <TwoWheelerHome />
    </Suspense>
  }
/> */}

{/* <Route
  path="bd2/3w"
  element={
    <Suspense fallback={<div>Loading 3W...</div>}>
      <ThreeWheelerPage />
    </Suspense>
  }
/> */}

{/* <Route
  path="bd2/food"
  element={
    <Suspense fallback={<div>Loading Food...</div>}>
      <Foodbusiness />
    </Suspense>
  }
/> */}

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
        <Route path="employeea" element={<EmployeeUpdate />} />
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
        <Route path="create_organisation" element={<CreateOrganisation />} />

         {/* Business Development Pages */}
       
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
