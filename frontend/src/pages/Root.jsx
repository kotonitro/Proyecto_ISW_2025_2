import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import logoUBB from "../images/logoUBB.webp";

export default function Root() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const nombreUsuario = localStorage.getItem("nombre");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col font-sans text-gray-800">
      
      {/* Header Azul */}
      <header className="w-full h-16 bg-blue-700 shadow-md flex items-center justify-between px-18">

        {/* Logo */}
        <Link to="/" className="ml-18 text-white text-xl font-bold flex items-center gap-3 hover:opacity-90 transition drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
        <img src={logoUBB} alt="Logo UBB" className="h-10 w-auto" />
          Bicicleteros UBB
        </Link>

        {/* Botón Ingresar o Salir*/}
        <div>
          {token ? (
            <div className="flex items-center gap-4">
              {/*Salir*/}
              <span className="text-white text-sm font-medium hidden sm:block">
                ¡Hola, {nombreUsuario}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-md hover:shadow-lg"
              >
                Salir
              </button>
            </div>
          ) : (
            location.pathname !== "/login" && (
              <div className="flex items-center gap-4">
                {/*Ingresar*/}
                <span className="text-white text-sm font-medium hidden sm:block">
                  ¿Eres encargado?
                </span>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md hover:shadow-lg"
                >
                  Ingresar
                </Link>
              </div>
            )
          )}
        </div>

      </header>

      {/* Contenido */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 Universidad del Bío-Bío
      </footer>

    </div>
  );
}