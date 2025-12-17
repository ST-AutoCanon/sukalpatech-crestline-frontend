// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Login from "../../features/auth/pages/Login";

// Dashboards
import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import EmployeeDashboard from "../../features/user/pages/EmployeeDashboard";

// Department page for admin
import DepartmentPage from "../../features/admin/pages/Department";

// Auth hook
import { useAuth } from "../../features/auth/hooks/useAuth";
import DashboardHome from "../../features/admin/pages/DashboardHome";
import EmployeeDashboardHome from "../../features/user/pages/EmployeeDashboardHome";
// import ProcurementHome from "../../features/user/pages/departments/procruments/procrumentHome";

// Lazy-load employee department components
const componentMap: Record<string, any> = {
  procurement: React.lazy(
    () =>
      import("../../features/user/pages/departments/procruments/procrumentHome")
  ),
  store: React.lazy(
    () => import("../../features/user/pages/departments/Store")
  ),
  "business-analysis": React.lazy(
    () => import("../../features/user/pages/departments/BusinessAnalysis")
  ),
  feasibility: React.lazy(
    () => import("../../features/user/pages/departments/feasibility/FeasibilityHome")
  ),
  finance: React.lazy(
    () => import("../../features/user/pages/departments/Finance")
  ),
};

const RequireAuth = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) return <h3 style={{ padding: 20 }}>Loading...</h3>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.map((r) => r.toLowerCase()).includes(user.role.toLowerCase()))
    return <Navigate to="/login" replace />;

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Employee Dashboard */}
      <Route
        path="/employee"
        element={
          <RequireAuth roles={["employee"]}>
            <EmployeeDashboard />
          </RequireAuth>
        }
      >

        <Route index element={<EmployeeDashboardHome />} /> {/* /employee */}
        <Route path="dashboard" element={<EmployeeDashboardHome />} />{" "}
        {/* /employee/dashboard */}
        {/* Default /employee */}
        {/* Nested employee department routes */}
        {Object.entries(componentMap).map(([key, Component]) => (
          <Route
            key={key}
            path={key} // nested path
            element={
              <Suspense fallback={<div>Loading {key}...</div>}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <RequireAuth roles={["admin"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} /> {/* /admin */}
        {/* Nested admin routes */}
        <Route path="departments" element={<DepartmentPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
