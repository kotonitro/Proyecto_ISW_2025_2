import React from "react";

export default function DeleteButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors"
    >
      Eliminar
    </button>
  );
}