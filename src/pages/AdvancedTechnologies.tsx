import React from "react";
import {
  Zap,
  Shield,
  Cpu,
  Gauge,
  Wifi,
  Wrench,
  Navigation,
  Leaf,
  VolumeX,
  Droplet,
  Wind,
  Box,
  Bus,
} from "lucide-react";

export default function AdvancedTechnologies() {
  return (
    <section className="bg-[#3D268C] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center text-white font-inter">
        {/* Section Badge */}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium  shadow-md"
          style={{
            background: "linear-gradient(90deg, #00B8DB 0%, #9810FA 100%)",
          }}
        >
          Innovation & Technology
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-semibold mt-6">
          Advanced Technologies
        </h2>
        <div className="mb-5 mt-3">
          <p className="text-gray-300">
            Our vehicles are equipped with the latest innovations
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
          <TechCard
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Electric & Hybrid"
            description="Sustainable drive technologies for eco-friendly mobility of the future."
            iconBg="bg-gradient-to-br from-yellow-400 to-orange-500"
          />

          <TechCard
            icon={<Shield className="w-5 h-5 text-white" />}
            title="Maximum Safety"
            description="State-of-the-art safety systems and driver assistance for highest protection."
            iconBg="bg-gradient-to-br from-sky-400 to-blue-500"
          />

          <TechCard
            icon={<Cpu className="w-5 h-5 text-white" />}
            title="AI Technology"
            description="Intelligent systems for optimized performance and predictive maintenance."
            iconBg="bg-gradient-to-br from-pink-500 to-purple-600"
          />

          <TechCard
            icon={<Gauge className="w-5 h-5 text-white" />}
            title="Performance"
            description="Powerful engines with optimized efficiency and fuel consumption."
            iconBg="bg-gradient-to-br from-green-400 to-emerald-600"
          />

          <TechCard
            icon={<Wifi className="w-5 h-5 text-white" />}
            title="Connected"
            description="5G connectivity and modern infotainment systems for all passengers."
            iconBg="bg-gradient-to-br from-cyan-400 to-sky-500"
          />

          <TechCard
            icon={<Wrench className="w-5 h-5 text-white" />}
            title="Durability"
            description="Robust construction and premium materials for maximum lifespan."
            iconBg="bg-gradient-to-br from-orange-400 to-red-500"
          />
          <TechCard
            icon={<Navigation className="w-5 h-5 text-white" />}
            title="Smart Navigation"
            description="Real-time GPS intelligence with adaptive routing for faster, safer journeys."
            iconBg="bg-gradient-to-br from-indigo-400 to-indigo-600"
          />
         
          <TechCard
            icon={<VolumeX className="w-5 h-5 text-white" />}
            title="Noise Reduction"
            description="Engineered acoustic insulation for a smoother, quieter driving experience."
            iconBg="bg-gradient-to-br from-slate-400 to-slate-700"
          />
         
         
        
        
          <TechCard
            icon={<Bus className="w-5 h-5 text-white" />} // or Bus icon if available
            title="Powerful & Efficient Diesel Bus"
            description="Designed for heavy loads and long routes, providing reliable, fuel-efficient, and smooth passenger transport."
            iconBg="bg-gradient-to-br from-orange-400 to-red-500"
          />
        </div>
      </div>
    </section>
  );
}

/* ===== Reusable Technology Card ===== */
// function TechCard({
//   icon,
//   title,
//   description,
//   iconBg,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   iconBg?: string;
// }) {
//   return (
//     <div
//       className="relative bg-white border border-gray-200 rounded-2xl p-6 text-left
//   transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 group text-black"
//     >
//       {/* Gradient overlay for subtle movement */}
//       <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-400 to-purple-500 transition-opacity duration-300"></div>

//       <div
//         className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${iconBg} shadow-lg`}
//       >
//         {icon}
//       </div>

//       <h3 className="relative text-lg font-semibold text-black mb-2">
//         {title}
//       </h3>
//       <p className="relative text-black text-sm leading-relaxed">
//         {description}
//       </p>
//     </div>
//   );
// }

function TechCard({ icon, title, description, iconBg }) {
  return (
    <div
      className="
        relative bg-white border border-gray-200 rounded-2xl p-6 text-left 
        transition-all duration-300 shadow-md
        hover:-translate-y-2 hover:shadow-xl
      "
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${iconBg} shadow-md`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>

      <p className="text-black text-sm leading-relaxed">{description}</p>
    </div>
  );
}
