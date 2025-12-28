import React, { useEffect, useState } from "react";

export default function Alert({ id, type, message, onClose }) {
  const [show, setShow] = useState(false);

  const styles = {
    success: {
      bg: "bg-green-100",
      border: "border-green-400",
      text: "text-green-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-100",
      border: "border-red-400",
      text: "text-red-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-yellow-100",
      border: "border-yellow-400",
      text: "text-yellow-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  };

  const currentStyle = styles[type] || styles.success;

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose(id);
    }, 500); 
  };

  if (!message) return null;

  return (
    <div
      className={`relative pointer-events-auto max-w-xs overflow-hidden transition-all duration-500 ease-in-out transform
                  ${show 
                    ? "translate-x-0 opacity-100 max-h-screen mb-2 py-0" 
                    : "translate-x-full opacity-0 max-h-0 mb-0 py-0"
                  }`}
    >
        <div 
        className={`flex items-center p-4 border rounded-lg shadow-lg ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}`} 
        role="alert"
        >
        {/* Botón Cerrar */}
        <button
            onClick={handleClose}
            type="button"
            className="mr-3 -ml-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 transition-colors"
            aria-label="Close"
        >
          <span className="sr-only">Cerrar</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Mensaje */}
        <div className="text-sm font-medium flex-1">
          {message}
        </div>

        {/* Icono */}
        <div className="ml-3 inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg">
          {currentStyle.icon}
        </div>
      </div>
    </div>
  );
}