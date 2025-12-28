import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();

  // Helper para saber si un link está activo
  const isActive = (path) => location.pathname === path;

  // Clases base para los links
  const linkClasses = (path) =>
    `block py-3 px-4 rounded-lg transition-colors mb-1 font-medium ${
      isActive(path)
        ? "bg-blue-800 text-white shadow-sm"
        : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
    }`;

  return (
    <aside className="w-full h-full bg-blue-900 flex flex-col text-white shadow-xl z-20">
      {/* Navigation Links */}
      <nav className="flex-1 p-4 overflow-y-auto mt-2">
        <Link to="/" className={linkClasses("/")}>
          Inicio
        </Link>
        <div className="my-4 border-t border-blue-800" />
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-2">
          Gestión
        </p>

        <Link to="/notificaciones" className={linkClasses("/notificaciones")}>
          Notificaciones
        </Link>

        <Link to="/custodia" className={linkClasses("/custodia")}>
          Custodia
        </Link>

        <Link to="/usuarios" className={linkClasses("/usuarios")}>
          Usuarios
        </Link>

        <Link to="/informes" className={linkClasses("/informes")}>
          Informes
        </Link>

        {role === "admin" && (
          <>
            <div className="my-4 border-t border-blue-800" />
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-2">
              Administración
            </p>
            <Link
              to="/admin/encargados"
              className={linkClasses("/admin/encargados")}
            >
              Encargados
            </Link>
            <Link
              to="/admin/bicicleteros"
              className={linkClasses("/admin/bicicleteros")}
            >
              Bicicleteros
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
