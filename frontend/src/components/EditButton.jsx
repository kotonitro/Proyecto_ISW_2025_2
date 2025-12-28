import React from "react";

export default function EditButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
    >
      Editar
    </button>
  );
}