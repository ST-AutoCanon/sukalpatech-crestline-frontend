//12-11-2025
import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import "../../index.css";
import { useNavigate } from "react-router-dom";

export default function ContactSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#3D268C] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium  shadow-md"
            style={{
              background: "linear-gradient(90deg, #00B8DB 0%, #9810FA 100%)",
            }}
          >
            Contact
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Let’s Talk
          </h2>
          <p className="text-white mt-3">Contact us for a personalized quote</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* ===== Left Info Section ===== */}
          <div className="space-y-6">
            <InfoCard
              icon={<Phone className="w-6 h-6 text-white" />}
              iconBg="bg-[linear-gradient(135deg,#00B8DB_0%,#9810FA_100%)]"
              title="Phone"
              lines={["+91 9035099112", "Mon–Fri: 8:00 AM – 6:00 PM"]}
            />

            {/* Email */}
            <InfoCard
              icon={<Mail className="w-6 h-6 text-white" />}
              iconBg="bg-[linear-gradient(135deg,#00B8DB_0%,#9810FA_100%)]"
              title="Email"
              lines={["info.crestlinetech@gmail.com"]}
            />

            {/* Address */}
            <InfoCard
              icon={<MapPin className="w-6 h-6 text-white" />}
              iconBg="bg-[linear-gradient(135deg,#00B8DB_0%,#9810FA_100%)]"
              title="Address"
              lines={[
                "Vasanthanarasapura Industrial Park KIADB",
                "572128 Tumkur, India",
              ]}
            />

            <div className="gradient-bg text-white rounded-2xl p-6 shadow-md">
              <h4 className="text-lg font-semibold mb-2">
                Schedule a Consultation
              </h4>
              <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                Our experts are happy to advise you on your individual project.
              </p>
              {/* <button className="bg-white text-blue-700 font-medium rounded-lg px-5 py-2 hover:bg-gray-100 transition mt-4">
                Book Appointment
              </button> */}

              <button
                onClick={() => navigate("/crestline/appointment")}
                className="bg-white text-blue-700 font-medium rounded-lg px-5 py-2 hover:bg-gray-100 transition mt-4"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* ===== Right Form Section ===== */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none 
                               placeholder-gray-400 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none 
                               placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none 
                               placeholder-gray-400 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9591104481"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none 
                               placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                             focus:ring-2 focus:ring-blue-500 focus:outline-none 
                             placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  placeholder="Describe your project..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
                             focus:ring-2 focus:ring-blue-500 focus:outline-none 
                             resize-none placeholder-gray-400 text-gray-900"
                ></textarea>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-full gradient-bg text-white font-medium 
                           py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Reusable Info Card Component ===== */
function InfoCard({
  icon,
  iconBg,
  title,
  lines,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex items-start bg-white rounded-2xl shadow-sm p-5">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg} mr-4 shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        {lines.map((line, index) => (
          <p key={index} className="text-sm text-gray-600">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
