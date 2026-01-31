import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../crestline/components/Navbar";
import Footer from "../../crestline/components/Footer";

import Home from "../../crestline/pages/Home";
import Portfolio from "../../crestline/pages/Portfolio";
import Capabilities from "../../crestline/pages/Capabilities";
import Contact from "../../crestline/pages/ContactSection";
import AboutUs from "../../crestline/pages/About";
import About from "../../crestline/pages/AboutUs";
import Media from "../../crestline/pages/Media";
import PremiumCoachModels from "../../crestline/pages/PremiumCoachModels";
import RequestQuote from "../../crestline/pages/RequestQuote";
import AdvancedTechnologies from "../../crestline/pages/AdvancedTechnologies";
import AppointmentPage from "../../crestline/pages/AppointmentPage";

import LoginModal from "../../crestline/components/LoginModal";
import RegisterModal from "../../crestline/components/RegisterModal";

import HRMSPage from "../../crestline/pages/HRMSpage";

import AuthLayout from "../../components/layout/AuthLayout";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/hooks/useAuth";

import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import EmployeeDashboard from "../../features/user/pages/EmployeeDashboard";

import DashboardHome from "../../features/admin/pages/DashboardHome";
import EmployeeDashboardHome from "../../features/user/pages/EmployeeDashboardHome";
import DepartmentPage from "../../features/admin/pages/Department";
import UpdatedFeasibilityPage from "../../features/user/pages/departments/Businessdevelopment/UpdatedFeasibilitypage";

const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  procurement: React.lazy(
    () =>
      import("../../features/user/pages/departments/procruments/procrumentHome")
  ),

  feasibility: React.lazy(
    () =>
      import(
        "../../features/user/pages/departments/feasibility/FeasibilityHome"
      )
  ),
  finance: React.lazy(
    () => import("../../features/user/pages/departments/finance/FinanceHome")
  ),
   bd: React.lazy(
    () => import( "../../features/user/pages/departments/Businessdevelopment/BusinessdevelopmentHome"
      )
  ),
};


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

  return children;
};


type ModalState = "none" | "normal" | "register";

const WebsiteLayout = () => {
  const [modalState, setModalState] = useState<ModalState>("none");

  const closeAll = () => setModalState("none");
  const openLogin = () => setModalState("normal");
  const openRegister = () => setModalState("register");

  const navigate = useNavigate();

  const openHRMS = () => {
    closeAll();
    navigate("/hrms");
  };

  const handleLoginSuccess = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    closeAll();
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Navbar
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onHRMSClick={openHRMS}
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
          <Route path="/crestline/media" element={<Media />} />
          <Route path="/crestline/vehicles" element={<PremiumCoachModels />} />
          <Route path="/crestline/requestquote" element={<RequestQuote />} />
          <Route path="/crestline/appointment" element={<AppointmentPage />} />
          <Route path="/hrms" element={<HRMSPage />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={modalState === "normal"}
        onClose={closeAll}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setModalState("register");
        }}
        onSwitchToHRMSLogin={openHRMS}
      />

      <RegisterModal
        isOpen={modalState === "register"}
        onClose={closeAll}
        onSwitchToLogin={() => {
          setModalState("normal");
        }}
      />
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<WebsiteLayout />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

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
