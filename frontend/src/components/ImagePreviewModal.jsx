import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ImagePreviewModal({ image, onClose }) {
  useEffect(() => {
    if (image) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [image]);
  if (!image) return null;
  const modalContent = (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex justify-center items-center animate-fadeIn"
      onClick={onClose}
    >
      {/* BOTÓN CERRAR (X) */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[200] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
        title="Cerrar imagen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* IMAGEN */}
      <img
        src={image}
        alt="Vista previa"
        className="max-w-[95vw] max-h-[95vh] object-contain rounded-md shadow-2xl cursor-default select-none"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}
