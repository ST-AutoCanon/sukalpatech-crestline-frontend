// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Portfolio from "./pages/Portfolio";
// import Capabilities from "./pages/Capabilities";
// import Contact from "./pages/ContactSection";
// import LoginModal from "./components/LoginModal";
// import RegisterModal from "./components/RegisterModal";
// import AboutUs from "./pages/About";
// import About from "./pages/AboutUs";
// import PremiumCoachModels from "./pages/PremiumCoachModels";
// import RequestQuote from "./pages/RequestQuote";
// import AdvancedTechnologies from "./pages/AdvancedTechnologies";
// import AppointmentPage from "./pages/AppointmentPage";

// function App() {
//   // ===== Modal States =====
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   // ===== Modal Controls =====
//   const openLogin = () => {
//     setShowRegister(false);
//     setShowLogin(true);
//   };

//   const openRegister = () => {
//     setShowLogin(false);
//     setShowRegister(true);
//   };

//   const closeAll = () => {
//     setShowLogin(false);
//     setShowRegister(false);
//   };

//   // ===== Handle Login Success =====
//   const handleLoginSuccess = (token: string, user: any, consent: boolean) => {
//     console.log("✅ Login Success:", { token, user, consent });
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     closeAll();
//     alert(`Welcome back, ${user.name}!`);
//   };

//   return (
//     <Router>
//       {/* ===== App Wrapper ===== */}
//       <div className="flex flex-col min-h-screen text-white">
//         {/* Navbar */}
//         <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

//         {/* Page Content */}
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/portfolio" element={<Portfolio />} />
//             <Route path="/capabilities" element={<Capabilities />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/aboutus" element={<About />} />
//             <Route path="/technology" element={<AdvancedTechnologies />} />
//             <Route path="/vehicles" element={<PremiumCoachModels />} />
//             <Route path="/requestquote" element={<RequestQuote />} />
//             <Route path="/appointment" element={<AppointmentPage />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <Footer />

//         {/* Modals */}
//         <LoginModal
//           isOpen={showLogin}
//           onClose={closeAll}
//           onLoginSuccess={handleLoginSuccess}
//           onSwitchToRegister={openRegister}
//         />
//         <RegisterModal
//           isOpen={showRegister}
//           onClose={closeAll}
//           onSwitchToLogin={openLogin}
//         />
//       </div>
//     </Router>
//   );
// }

// export default App;



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Portfolio from "./pages/Portfolio";
// import Capabilities from "./pages/Capabilities";
// import Contact from "./pages/ContactSection";
// import LoginModal from "./components/LoginModal";
// import HRMSLoginModal from "./components/HRMSLoginModal";
// import AboutUs from "./pages/About";
// import About from "./pages/AboutUs";
// import PremiumCoachModels from "./pages/PremiumCoachModels";
// import RequestQuote from "./pages/RequestQuote";
// import AdvancedTechnologies from "./pages/AdvancedTechnologies";
// import AppointmentPage from "./pages/AppointmentPage";
// import HRMSPage from "./pages/HRMSpage";

// function App() {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showHRMSLogin, setShowHRMSLogin] = useState(false);

//   const openLogin = () => {
//     setShowHRMSLogin(false);
//     setShowLogin(true);
//   };

//   const openHRMSLogin = () => {
//     setShowLogin(false);
//     setShowHRMSLogin(true);
//   };

//   const closeAll = () => {
//     setShowLogin(false);
//     setShowHRMSLogin(false);
//   };

//   const openHRMS = () => {
//     window.location.href = "/hrms";
//   };

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen text-white">
//         <Navbar onLoginClick={openLogin} />

//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/portfolio" element={<Portfolio />} />
//             <Route path="/capabilities" element={<Capabilities />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/aboutus" element={<About />} />
//             <Route path="/technology" element={<AdvancedTechnologies />} />
//             <Route path="/vehicles" element={<PremiumCoachModels />} />
//             <Route path="/requestquote" element={<RequestQuote />} />
//             <Route path="/appointment" element={<AppointmentPage />} />
//             <Route path="/hrms" element={<HRMSPage />} />
//           </Routes>
//         </main>

//         <Footer />

//         {/* Normal Login Modal */}
//         <LoginModal
//           isOpen={showLogin}
//           onClose={closeAll}
//           onSwitchToHRMSLogin={openHRMSLogin}
//         />

//         {/* HRMS Login Modal */}
//         <HRMSLoginModal
//           isOpen={showHRMSLogin}
//           onClose={closeAll}
//           onSwitchToNormalLogin={openLogin}
//         />
//       </div>
//     </Router>
//   );
// }

// export default App;



import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Capabilities from "./pages/Capabilities";
import Contact from "./pages/ContactSection";
import LoginModal from "./components/LoginModal";
// import RegisterModal from "./components/RegisterModal";
import AboutUs from "./pages/About";
import About from "./pages/AboutUs";
import PremiumCoachModels from "./pages/PremiumCoachModels";
import RequestQuote from "./pages/RequestQuote";
import AdvancedTechnologies from "./pages/AdvancedTechnologies";
import AppointmentPage from "./pages/AppointmentPage";

import HRMSPage from "./pages/HRMSpage";
import HRMSLoginModal from "./components/HRMSLoginModal";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showHRMSLogin, setShowHRMSLogin] = useState(false);

  const openLogin = () => {
    setShowHRMSLogin(false);
    setShowLogin(true);
  };

  const openHRMSLogin = () => {
    setShowLogin(false);
    setShowHRMSLogin(true);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowHRMSLogin(false);
  };

  const handleLoginSuccess = (token: string, user: any, consent: boolean) => {
    console.log("✅ Login Success:", { token, user, consent });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    closeAll();
    alert(`Welcome back, ${user.name}!`);
  };

  const openHRMS = () => {
    window.location.href = "/hrms";
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-white">
        <Navbar
          onLoginClick={openLogin}
          // onRegisterClick={openRegister}
          // onHRMSClick={openHRMS}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/capabilities" element={<Capabilities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/technology" element={<AdvancedTechnologies />} />
            <Route path="/vehicles" element={<PremiumCoachModels />} />
            <Route path="/requestquote" element={<RequestQuote />} />
            <Route path="/appointment" element={<AppointmentPage />} />

            <Route path="/hrms" element={<HRMSPage />} />
          </Routes>
        </main>

        <Footer />

        <LoginModal
          isOpen={showLogin}
          onClose={closeAll}
          // onLoginSuccess={handleLoginSuccess}
          // onSwitchToRegister={openHRMS}
          onSwitchToHRMSLogin={openHRMS}
        />

        <HRMSLoginModal
          isOpen={showHRMSLogin}
          onClose={closeAll}
          onSwitchToNormalLogin={openLogin}
        />
      </div>
    </Router>
  );
}

export default App;