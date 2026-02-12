import React, { useState } from "react";

type GalleryItem = {
  type: "image" | "video";
  src: string;
  thumbnail?: string;
};

const galleryItems: GalleryItem[] = [
  // {
  //   type: "image",
  //   src: "/crestline/public/media/news2.jpeg",
  // },
  // {
  //   type: "image",
  //   src: "/crestline/public/media/news1.jpeg",
  // },
  {
    type: "video",
    src: "/crestline/public/gallery/galleryVideo2.mp4",
    thumbnail: "/crestline/public/gallery/gallerVideo2thumb.jpg",
  },
  {
    type: "video",
    src: "/crestline/public/gallery/galleryVideo1.mp4",
    thumbnail: "/crestline/public/gallery/gallerVideo1thumb.jpg",
  },
];

const PhotoVideoGallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
            Photo & Video Gallery
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-1">
            Explore moments captured from our recent events
          </p>
        </div>

        {/* 🔹 RESPONSIVE GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer relative rounded-xl overflow-hidden shadow-md bg-neutral-100"
            >
              {/* IMAGE */}
              {item.type === "image" && (
                <img
                  src={item.src}
                  alt="Gallery"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* VIDEO THUMB */}
              {item.type === "video" && (
                <>
                  <img
                    src={item.thumbnail}
                    alt="Video"
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-4xl">
                    ▶
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 MODAL VIEW */}
      {activeItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* IMAGE MODAL */}
          {activeItem.type === "image" && (
            <img
              src={activeItem.src}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              alt="Expanded"
            />
          )}

          {/* VIDEO MODAL */}
          {activeItem.type === "video" && (
            <video
              src={activeItem.src}
              controls
              autoPlay
              className="w-full max-w-3xl max-h-[80vh] rounded-lg bg-black"
            />
          )}
        </div>
      )}
    </>
  );
};

export default PhotoVideoGallery;
