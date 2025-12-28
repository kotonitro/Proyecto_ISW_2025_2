import React from "react";
import { createPortal } from "react-dom";

export default function ConfirmAlert({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  const handleConfirmClick = async () => {
    await onConfirm();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity animate-fade-in">
      {/* Contenedor blanco*/}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-fade-in-up border border-gray-100">
        <div className="p-6 text-center">
          
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-yellow-100 mb-5">
            <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title || "¿Estás seguro?"}
          </h3>
          
          <p className="text-sm text-gray-500 mb-6 px-2">
            {message || "Esta acción es irreversible. ¿Deseas continuar?"}
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmClick}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}