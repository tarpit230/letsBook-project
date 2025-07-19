import { useState } from "react";
import { BASE_URL } from "../config";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen z-50 overflow-scroll">
        <div className="p-8 grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">
              Photos of {place.title}
            </h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 py-2 px-4 rounded-2xl shadow bg-white text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close photos
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {place?.photos?.map((photo, index) => (
              <div key={index}>
                <img
                  src={`${BASE_URL}/uploads/${photo}`}
                  alt={`Photo ${index}`}
                  className="w-full h-[50vh] object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-[1fr_1fr] gap-2 rounded-3xl max-h-[70vh] overflow-hidden">
        <div className="overflow-hidden">
          {place.photos?.[0] && (
            <img
              onClick={() => setShowAllPhotos(true)}
              className="object-cover aspect-square cursor-pointer"
              src={`${BASE_URL}/uploads/${place.photos[0]}`}
              alt="Large"
            />
          )}
        </div>
        <div className="grid grid-rows-2 gap-2">
          {place.photos?.[1] && (
            <div className="overflow-hidden">
            <img
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer"
              src={`${BASE_URL}/uploads/${place.photos[1]}`}
              alt="Top Right"
            />
            </div>
          )}
          {/* {place.photos?.[2] && (
            <div className="overflow-hidden">
            <img
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer"
              src={`${BASE_URL}/uploads/${place.photos[2]}`}
              alt="Bottom Right"
            />
            </div>
          )} */}
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        Show All Photos
      </button>
    </div>
  );
}
