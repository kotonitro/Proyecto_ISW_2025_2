import React from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";

/**
 * Error404 - Página sencilla de error 404
 */
export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-6xl font-extrabold text-brand-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, la ruta a la que intentas acceder no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-blue text-white px-5 py-2 rounded-md shadow hover:opacity-95"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

/**
 * Root - Layout principal mínimo que envuelve la aplicación
 * Incluye una cabecera simple y un <Outlet /> para rutas hijas.
 */
export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-brand-blue text-white py-4 shadow">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full" />
            <span className="text-xl font-semibold">Proyecto ISW</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/login" className="hover:underline">
              Ingresar
            </Link>
            <Link to="/register" className="hover:underline">
              Registrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Proyecto ISW
      </footer>
    </div>
  );
}

/**
 * Register - Placeholder simple de registro
 */
export function Register() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-brand-blue">Registro</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-brand-blue text-white px-4 py-2 rounded hover:opacity-95"
            >
              Crear cuenta
            </button>
            <Link to="/login" className="text-sm text-brand-blue hover:underline">
              Ya tengo cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute - Componente wrapper que protege rutas.
 * Si hay token en localStorage permite acceso, si no redirige a /login.
 *
 * Uso:
 * <ProtectedRoute><MiComponente /></ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    // Redirige a login preservando la ubicación previa
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
