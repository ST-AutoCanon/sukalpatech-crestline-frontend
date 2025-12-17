import React from "react";
import { Factory, Award, Globe, TrendingUp } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function AboutUs() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium shadow-md"
            style={{
              background: "linear-gradient(90deg, #00B8DB 0%, #9810FA 100%)",
            }}
          >
            About Us
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Crestline <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Meets Innovation
            </span>
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Crestline is driving the future of mobility and industrial
            innovation with precision engineering, breakthrough technology, and
            an unrelenting pursuit of excellence. We bring ideas to life —
            crafting custom-built coaches and advanced engineering solutions
            that set new benchmarks in quality, reliability, and craftsmanship.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Our vision extends beyond product creation — we are dedicated to
            generating sustainable value, driving innovation, and maintaining
            world-class standards across every project.
          </p>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-4">
            <StatCard
              icon={<Factory className="w-6 h-6 text-blue-600" />}
              value="15,000m²"
              label="Production Area"
            />
            <StatCard
              icon={<Award className="w-6 h-6 text-blue-600" />}
              value="ISO 9001:2015"
              label="Certified"
            />
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 2500 }}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              className="rounded-2xl"
            >
              <SwiperSlide>
                <div className="relative w-full">
                  <img
                    src="/crestline/public/state_warehouse.jpeg"
                    alt="Slide 1"
                    className="w-full h-auto max-h-[550px] object-contain rounded-2xl bg-black"
                  />

                  <div
                    className="
          absolute bottom-6 left-6
          bg-black/60 text-white
          px-4 py-3 rounded-md
          max-w-[220px] leading-snug
        "
                  >
                    <p className="font-semibold text-base">
                      State of the
                      <br />
                      art biggest
                      <br />
                      Warehouse
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative w-full">
                  <img
                    src="/crestline/public/paint_booth.jpg"
                    alt="Slide 2"
                    className="w-full h-auto max-h-[550px] object-contain rounded-2xl bg-black"
                  />

                  <div
                    className="
          absolute bottom-6 left-6
          bg-black/60 text-white
          px-4 py-3 rounded-md
          max-w-[220px] leading-snug
        "
                  >
                    <p className="font-semibold text-base">
                      Advanced
                      <br />
                      Paint Booth
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative w-full">
                  <img
                    src="/crestline/public/shearing_machine.jpg"
                    alt="Slide 3"
                    className="w-full h-auto max-h-[550px] object-contain rounded-2xl bg-black"
                  />

                  <div
                    className="
          absolute bottom-6 left-6
          bg-black/60 text-white
          px-4 py-3 rounded-md
          max-w-[220px] leading-snug
        "
                  >
                    <p className="font-semibold text-base">
                      High-precision
                      <br />
                      Shearing Machine
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative w-full">
                  <img
                    src="/crestline/public/press_brake.jpg"
                    alt="Slide 4"
                    className="w-full h-auto max-h-[550px] object-contain rounded-2xl bg-black"
                  />

                  <div
                    className="
          absolute bottom-6 left-6
          bg-black/60 text-white
          px-4 py-3 rounded-md
          max-w-[220px] leading-snug
        "
                  >
                    <p className="font-semibold text-base">
                      CNC Press
                      <br />
                      Brake System
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

/* STAT CARD COMPONENT */
function StatCard({ icon, value, label }) {
  return (
    <div
      className="
      flex items-center gap-3 bg-white rounded-xl shadow-md p-4 
      transition-all duration-300 
      hover:-translate-y-1 hover:shadow-xl
    "
    >
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-lg font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

