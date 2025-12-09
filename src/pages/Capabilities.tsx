import { Lightbulb, Factory, ShieldCheck, Clock } from "lucide-react";

export default function Capabilities() {
  const capabilities = [
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-500 mx-auto mb-3" />,
      title: "Design Innovation",
      desc: "Cutting-edge design processes using advanced CAD systems and 3D modeling for optimal results.",
      highlight: "25+ Design Awards",
    },
    {
      icon: <Factory className="w-8 h-8 text-blue-500 mx-auto mb-3" />,
      title: "Manufacturing Excellence",
      desc: "State-of-the-art manufacturing facility with precision tooling and quality control systems.",
      highlight: "99.8% Quality Rate",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-500 mx-auto mb-3" />,
      title: "Safety Standards",
      desc: "Exceeding industry safety standards with rigorous testing and certification processes.",
      highlight: "DOT Certified",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />,
      title: "Rapid Delivery",
      desc: "Efficient production schedules ensuring on-time delivery without compromising quality.",
      highlight: "6–8 Week Lead Time",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Consultation & Design",
      desc: "We work closely with clients to understand requirements and create custom design solutions.",
    },
    {
      step: "02",
      title: "Engineering & Planning",
      desc: "Our engineering team develops detailed plans and specifications for optimal performance.",
    },
    {
      step: "03",
      title: "Manufacturing",
      desc: "Precision manufacturing using advanced techniques and quality materials.",
    },
    {
      step: "04",
      title: "Testing & Delivery",
      desc: "Comprehensive testing and quality assurance before final delivery and support.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* ----- Capabilities Section ----- */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Our Capabilities
        </h2>
        <p className="text-gray-600  mx-auto mb-12">
          Advanced manufacturing capabilities combined with innovative design
          approach to deliver superior bus body solutions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 mt-10">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 text-center"
            >
              {cap.icon}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {cap.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{cap.desc}</p>
              <p className="text-blue-600 font-medium text-sm">
                {cap.highlight}
              </p>
            </div>
          ))}
        </div>

        {/* ----- Process Section ----- */}
        <div className="bg-white rounded-2xl shadow-md p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Process</h3>
          <p className="text-gray-600 mx-auto mb-12">
            From concept to completion, our proven process ensures exceptional
            results.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left mt-10">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4 font-semibold">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
