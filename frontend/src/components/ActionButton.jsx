import React from "react";

export default function ActionButton({ onClick, text, color = "bg-blue-600 hover:bg-blue-700" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full sm:w-auto ${color} text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap`}
    >
      {/*Icono de +*/}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      {text}
    </button>
  );
}