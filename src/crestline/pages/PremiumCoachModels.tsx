import React from "react";
import { Users } from "lucide-react";

export default function PremiumCoachModels() {
  return (
    <section className="bg-gradient-to-b from-purple-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        {/* Section Badge */}
        {/* <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200">
          Our Vehicles
        </span> */}

        <span
          style={{
            background: "linear-gradient(90deg, #AD46FF 0%, #E60076 100%)",
            padding: "0.375rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: "500",
            display: "inline-block",
          }}
        >
          Our Vehicles
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
          Premium Coach Models
        </h2>
        <p className="text-gray-600 mt-3 mb-12 mt-5">
          Custom solutions for every application
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mt-4">
          {/* ===== Card 1 ===== */}
          <CoachCard
            image="/crestline/public/Premium_Executive.png"
            category="Luxury Class"
            title="Premium Executive"
            seats="24–32 Seats"
            seatColor="text-gray-700"
            features={[
              "Leather Interior",
              "Entertainment System",
              "WiFi 6",
              "Climate Control",
            ]}
            bulletColor="text-pink-500"
            buttonColor="bg-gradient-to-r from-fuchsia-500 to-purple-600"
          />

          {/* ===== Card 2 ===== */}
          <CoachCard
            image="/crestline/public/City_Cruiser.png"
            category="Urban & Intercity"
            title="City Cruiser"
            seats="45–55 Seats"
            seatColor="text-gray-700"
            features={[
              "Ergonomic Seats",
              "USB Ports",
              "LED Lighting",
              "XXL Luggage Space",
            ]}
            bulletColor="text-blue-500"
            buttonColor="bg-blue-600"
          />

          {/* ===== Card 3 ===== */}
          <CoachCard
            image="/crestline/public/E_Coach.png"
            category="Electric Mobility"
            title="E-Coach Future"
            seats="38–42 Seats"
            seatColor="text-gray-700"
            features={[
              "100% Electric",
              "500km Range",
              "Fast Charging",
              "Zero Emissions",
            ]}
            bulletColor="text-green-500"
            buttonColor="bg-green-600"
          />
        </div>
      </div>
    </section>
  );
}

/* ===== Reusable Card Component ===== */
function CoachCard({
  image,
  category,
  title,
  seats,
  seatColor,
  features,
  bulletColor,
  buttonColor,
}: {
  image: string;
  category: string;
  title: string;
  seats: string;
  seatColor?: string;
  features: string[];
  bulletColor?: string;
  buttonColor?: string;
}) {
  return (
    // <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden text-left">
    <div
      className="
    bg-white rounded-2xl shadow-sm 
    transition-all duration-300 overflow-hidden text-left
    hover:-translate-y-2 hover:shadow-xl
  "
    >
      {/* Image */}
      <img src={image} alt={title} className="w-full h-56 object-cover" />

      {/* Content */}
      <div className="p-6">
        <p className="text-sm font-medium mb-1" style={{ color: "#0092B8" }}>
          {category}
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        <div className={`flex items-center text-sm ${seatColor} mb-3`}>
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          {seats}
        </div>

        <ul className="space-y-1 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <span className="mr-2 text-lg bg-gradient-to-r from-[#9810FA] to-[#E60076] text-transparent bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                •
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* <button
          className={`w-full text-white font-medium py-2.5 rounded-lg ${buttonColor} hover:opacity-90 transition`}
        >
          Learn More
        </button> */}
        <button className="w-full text-white font-medium py-2.5 rounded-lg btn-gradient hover:opacity-90 transition">
          Learn More
        </button>
      </div>
    </div>
  );
}
