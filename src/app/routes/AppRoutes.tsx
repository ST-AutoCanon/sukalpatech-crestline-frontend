import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useState } from "react";

/* ================= PUBLIC (WEBSITE) ================= */
import Navbar from "../../crestline/components/Navbar";
import Footer from "../../crestline/components/Footer";

import Home from "../../crestline/pages/Home";
import Portfolio from "../../crestline/pages/Portfolio";
import Capabilities from "../../crestline/pages/Capabilities";
import Contact from "../../crestline/pages/ContactSection";
import AboutUs from "../../crestline/pages/About";
import About from "../../crestline/pages/AboutUs";
import PremiumCoachModels from "../../crestline/pages/PremiumCoachModels";
import RequestQuote from "../../crestline/pages/RequestQuote";
import AdvancedTechnologies from "../../crestline/pages/AdvancedTechnologies";
import AppointmentPage from "../../crestline/pages/AppointmentPage";

import LoginModal from "../../crestline/components/LoginModal";
import RegisterModal from "../../crestline/components/RegisterModal";

/* ================= AUTH & DASHBOARD ================= */
import AuthLayout from "../../components/layout/AuthLayout";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/hooks/useAuth";

import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import EmployeeDashboard from "../../features/user/pages/EmployeeDashboard";

import DashboardHome from "../../features/admin/pages/DashboardHome";
import EmployeeDashboardHome from "../../features/user/pages/EmployeeDashboardHome";
import DepartmentPage from "../../features/admin/pages/Department";

/* ================= EMPLOYEE LAZY MODULES ================= */
const componentMap: Record<string, React.LazyExoticComponent<any>> = {
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
    () =>
      import(
        "../../features/user/pages/departments/feasibility/FeasibilityHome"
      )
  ),
  finance: React.lazy(
    () => import("../../features/user/pages/departments/Finance")
  ),
};

/* ================= AUTH GUARD ================= */
const RequireAuth = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) return <h3 style={{ padding: 20 }}>Loading...</h3>;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!roles.includes(user.role.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
};




/* ================= PUBLIC LAYOUT ================= */
const WebsiteLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const closeAll = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLoginSuccess = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    closeAll();
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crestline/portfolio" element={<Portfolio />} />
          <Route path="/crestline/capabilities" element={<Capabilities />} />
          <Route path="/crestline/contact" element={<Contact />} />
          <Route path="/crestline/about" element={<AboutUs />} />
          <Route path="/crestline/aboutus" element={<About />} />
          <Route
            path="/crestline/technology"
            element={<AdvancedTechnologies />}
          />
          <Route path="/crestline/vehicles" element={<PremiumCoachModels />} />
          <Route path="/crestline/requestquote" element={<RequestQuote />} />
          <Route path="/crestline/appointment" element={<AppointmentPage />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={showLogin}
        onClose={closeAll}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={closeAll}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

/* ================= ROOT ROUTES ================= */
export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route path="/*" element={<WebsiteLayout />} />

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* EMPLOYEE DASHBOARD */}
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
      </Route>

      {/* ADMIN DASHBOARD */}
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
      </Route>
    </Routes>
  );
}
