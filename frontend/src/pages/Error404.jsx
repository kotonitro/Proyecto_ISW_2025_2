import React from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center px-6 py-12">
      {/* 1. Número 404*/}
      <h1 className="text-9xl font-black text-blue-200 animate-pulse">
        404
      </h1>

      {/* 2. MENSAJE DE ERROR (Debajo del número) */}
      <div className="mt-6 mb-8 "> {/* Margen negativo para acercarlo un poco sin taparlo */}
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
          ¡Ups! Página no encontrada
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-lg">
          Esta página no existe o ha sido movida.
        </p>
      </div>

      {/* 3. BOTÓN DE REGRESO */}
      <Link 
        to="/"
        className="px-8 py-3 bg-blue-700 text-white rounded-full font-semibold shadow-lg hover:bg-blue-800 hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver al Inicio
      </Link>
    </div>
  );
}