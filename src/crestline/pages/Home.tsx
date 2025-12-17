import React from "react";
import { ArrowRight } from "lucide-react";
import AboutUs from "./About";
import AdvancedTechnologies from "./AdvancedTechnologies";
import PremiumCoachModels from "./PremiumCoachModels";
import ContactSection from "./ContactSection";

export default function Home() {
  return (
    <div className="font-[Inter] text-white">
      {/* ===== Hero Section (Responsive Split Layout) ===== */}
      <section className="relative overflow-hidden bg-[#3D268C]">
        <div className="flex flex-col lg:flex-row w-full min-h-[600px]">
          {/* ===== Left Container ===== */}
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

            {/* CTA Button */}
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

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-10 sm:pt-14 text-white">
              <div>
                <p className="text-3xl font-bold">Top Notch</p>
                <p className="text-sm text-gray-300">Standard Followed</p>
              </div>
              <div>
                <p className="text-3xl font-bold">Custom Made</p>
                <p className="text-sm text-gray-300">Design Specialisation</p>
              </div>
            </div>
          </div>

          {/* ===== Right Container (Image) ===== */}
          <div className="relative w-full lg:w-1/2 flex items-stretch m-0 p-0">
            <video
              src="/crestline/public/360Video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover object-center w-full h-[300px] sm:h-[400px] lg:h-[700px] rounded-none lg:rounded-l-2xl shadow-2xl"
            />

            {/* Gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ===== Additional Sections ===== */}
      <div className="relative z-20">
        <AboutUs />
        <AdvancedTechnologies />
        <PremiumCoachModels />
        <ContactSection />
      </div>
    </div>
  );
}
