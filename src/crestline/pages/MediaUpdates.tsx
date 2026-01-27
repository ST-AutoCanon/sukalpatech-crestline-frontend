import React, { useState } from "react";

const MediaUpdates: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const images = [
    "/crestline/public/media/news1.jpeg",
    "/crestline/public/media/news2.jpeg",
  ];

  return (
    <>
      <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 text-center sm:text-left">
          Watch Our Latest Media Cuts & Links
        </h2>

        {/* 🔹 MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: VIDEO */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <video
              src="/crestline/public/gallery/galleryVideo2.mp4"
              controls
              className="w-full h-56 sm:h-72 lg:h-[380px] object-cover"
            />

            {/* VIDEO INFO */}
            <div className="p-4 sm:p-5">
              <div className="flex justify-between text-xs sm:text-sm text-neutral-500 mb-2">
                <span>News • Video</span>
                <span>January 06, 2026</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-neutral-800">
                New Initiative Launched
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 mt-2">
                This video highlights the official announcement of our new
                initiative and the impact it brings to the community.
              </p>
            </div>
          </div>

          {/* RIGHT: IMAGES */}
          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(img)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition"
              >
                <img
                  src={img}
                  alt="News"
                  className="w-full h-40 sm:h-48 lg:h-36 xl:h-44 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 IMAGE MODAL */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-3xl"
          >
            ✕
          </button>

          <img
            src={activeImage}
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            alt="Expanded"
          />
        </div>
      )}
    </>
  );
};

export default MediaUpdates;
