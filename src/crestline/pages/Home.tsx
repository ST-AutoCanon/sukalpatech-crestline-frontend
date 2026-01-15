import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import HRMSLoginModal from "../components/HRMSLoginModal";

import AboutUs from "./About";
import AdvancedTechnologies from "./AdvancedTechnologies";
import PremiumCoachModels from "./PremiumCoachModels";
import ContactSection from "./ContactSection";

export default function Home() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showHRMSLogin, setShowHRMSLogin] = useState(false);

  const childOrigin = import.meta.env.VITE_CHILD_ORIGIN;

  return (
    <div className="font-[Inter] text-white">
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <iframe
        id="pulse-iframe"
        src={childOrigin}
        title="HRMS Hidden Iframe"
        style={{ display: "none" }}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToHRMSLogin={() => {
          setShowLogin(false);
          setShowHRMSLogin(true);
        }}
      />

      <HRMSLoginModal
        isOpen={showHRMSLogin}
        onClose={() => setShowHRMSLogin(false)}
        onSwitchToNormalLogin={() => {
          setShowHRMSLogin(false);
          setShowLogin(true);
        }}
        iframeId="pulse-iframe"
        childOrigin={childOrigin}
        iframeLoaded={true}
        onLoginSuccess={() => {
          setShowHRMSLogin(false);
          navigate("/hrms", { state: { skipModal: true } });
        }}
      />

      <section className="relative overflow-hidden bg-[#3D268C]">
        <div className="flex flex-col lg:flex-row w-full min-h-[600px]">
          <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-10 lg:px-16 py-20 lg:py-0 space-y-6">
            <span className="inline-block w-fit px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              The Future of Coach Building
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">
              Luxury Coaches{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                for the Future
              </span>
            </h1>

            <p className="text-gray-200 text-base sm:text-lg max-w-md leading-relaxed">
              We develop and build custom-made coaches with cutting-edge
              technology and supreme comfort. German engineering – for the
              world.
            </p>

            <div className="pt-2">
              <button
                className="px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg flex items-center gap-2 hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(90deg, #00B8DB 0%, #9810FA 100%)",
                }}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2">
            <video
              src="/crestline/public/360Video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-[300px] sm:h-[400px] lg:h-[700px]"
            />
          </div>
        </div>
      </section>

      <AboutUs />
      <AdvancedTechnologies />
      <PremiumCoachModels />
      <ContactSection />
    </div>
  );
}
