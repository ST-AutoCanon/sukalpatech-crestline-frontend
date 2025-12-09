import { useState } from "react";

export default function Portfolio() {
  const [selected, setSelected] = useState("All Projects");

  const categories = [
    "All Projects",
    "Luxury Coaches",
    "Public Transit",
    "Custom Builds",
  ];

  const projects = [
    {
      id: 1,
      title: "Executive Luxury Coach",
      category: "Luxury Coaches",
      image: "/executive_lux_coach.jpg",
      desc: "Premium 45-passenger luxury coach with leather interiors and entertainment systems.",
      tags: ["45 Passengers", "Leather Interiors", "WiFi & Entertainment"],
    },
    {
      id: 2,
      title: "City Transit Bus",
      category: "Public Transit",
      image: "/transist_bus.jpg",
      desc: "Efficient 40-foot public transit bus with accessibility features and durability focus.",
      tags: ["40 Passengers", "ADA Compliant", "Low Floor Design"],
    },
    {
      id: 3,
      title: "Mobile Command Center",
      category: "Custom Builds",
      image: "/mobile_command.jpeg",
      desc: "Custom-built mobile command center with specialized equipment integration.",
      tags: ["Command Center", "Tech Integration", "Custom Layout"],
    },
    {
      id: 4,
      title: "VIP Charter Bus",
      category: "Luxury Coaches",
      image: "/vip_charter.jpeg",
      desc: "High-end charter bus with premium amenities and comfort features.",
      tags: ["32 Passengers", "Reclining Seats", "Premium Audio"],
    },
    {
      id: 5,
      title: "Articulated Transit",
      category: "Public Transit",
      image: "/articulated.jpg",
      desc: "Large capacity articulated bus for high-volume urban transportation.",
      tags: ["80 Passengers", "Articulated Design", "High Capacity"],
    },
    {
      id: 6,
      title: "Medical Transport",
      category: "Custom Builds",
      image: "/medical_bus.jpg",
      desc: "Specialized medical transport vehicle with advanced life support systems.",
      tags: ["Medical Equipment", "Life Support", "Emergency Ready"],
    },
  ];

  const filtered =
    selected === "All Projects"
      ? projects
      : projects.filter((p) => p.category === selected);

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Portfolio</h2>
        <p className="text-gray-600 mx-auto mb-10">
          Explore our diverse range of bus body manufacturing projects,
          showcasing innovation, quality, and attention to detail.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                selected === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden text-left"
            >
              <div className="relative h-56 w-full">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
