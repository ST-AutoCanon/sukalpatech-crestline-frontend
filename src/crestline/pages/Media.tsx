import React, { useState } from "react";
import MediaUpdates from "./MediaUpdates";
import PhotoVideoGallery from "./PhotoVideoGallery";

const MediaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"media" | "gallery">("media");

  return (
    // <div className="min-h-screen bg-[#3D268C] flex justify-center px-4 py-6 sm:px-6 sm:py-10">
    <div className="pt-16">
    <div className="min-h-screen bg-[#3D268C] flex justify-center px-4 py-6 mt-6 sm:mt-0 sm:px-6 sm:py-10 pt-24">
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
        {/* 🔹 TOP TABS */}
        <div className="flex justify-center px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto rounded-t-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setActiveTab("media")}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold transition ${
                activeTab === "media"
                  ? "bg-[#3D268C] text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Media Updates
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold transition ${
                activeTab === "gallery"
                  ? "bg-[#3D268C] text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Photo & Video Gallery
            </button>
          </div>
        </div>

        {/* 🔹 CONTENT */}
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          {activeTab === "media" && <MediaUpdates />}
          {activeTab === "gallery" && <PhotoVideoGallery />}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MediaPage;
