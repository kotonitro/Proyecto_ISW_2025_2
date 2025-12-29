import React from "react";

export default function BicicleteroCard({
  title,
  location,
  capacity,
  image,
  onClick,
  placeholder,
}) {
  const effectiveFallback = placeholder || defaultFallback;

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
      role={onClick ? "button" : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={title ? `Ver ${title}` : "Bicicletero"}
    >
      <div className="h-48 w-full relative overflow-hidden">
        <img
          src={image || effectiveFallback}
          alt={title || "Bicicletero"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            if (e.target.src !== effectiveFallback) {
              e.target.onerror = null;
              e.target.src = effectiveFallback;
            }
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {location}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">Capacidad</p>
          <p className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {capacity}
          </p>
        </div>
      </div>
    </div>
  );
}
