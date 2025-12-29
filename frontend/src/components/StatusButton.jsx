import React from "react";

export default function StatusButton({
  isActive,
  onToggle,
  activeLabel,
  inactiveLabel,
  topText,
  bottomText,
}) {
  return (
    <div className="pt-0">
      <label className="block text-sm text-center font-medium text-gray-700 mb-2">
        {topText}
      </label>

      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold transition-none shadow-sm
          ${
            isActive
              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
              : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
          }`}
      >
        {isActive ? (
          // ESTADO ACTIVO
          <>
            <div className="bg-green-200 p-1 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>{activeLabel}</span>
          </>
        ) : (
          // ESTADO INACTIVO
          <>
            <div className="bg-red-200 p-1 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <span>{inactiveLabel}</span>
          </>
        )}
      </button>

      <p className="text-xs text-center mt-2 text-gray-400">{bottomText}</p>
    </div>
  );
}
