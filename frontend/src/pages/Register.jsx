import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Register.jsx
 *
 * Página de registro simple como placeholder.
 * También proporciona un pequeño formulario mock y navegación posterior al "registro".
 *
 * Usa clases de Tailwind para estilos (el proyecto ya está configurado con Tailwind).
 */

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Aquí podrías llamar al backend para crear la cuenta.
      // Como placeholder simulamos éxito con setTimeout.
      await new Promise((resolve) => setTimeout(resolve, 600));

      // En un flujo real guardarías el token y redirigirías a dashboard.
      // Simulamos redirección al login.
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-brand-blue">Crear cuenta</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="********"
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-blue text-white px-4 py-2 rounded hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <Link to="/login" className="text-sm text-brand-blue hover:underline">
              ¿Ya tienes cuenta?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute
 *
 * Componente wrapper para proteger rutas. Si existe token en localStorage,
 * renderiza `children`. Si no, redirige a `/login` conservando la ubicación previa.
 *
 * Uso:
 * <ProtectedRoute><MiComponente /></ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  // Evitar uso de window en renderizado del lado servidor
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const navigate = useNavigate();

  if (!token) {
    // Si no hay token, redirigir programáticamente al login.
    // Se puede mejorar usando <Navigate /> si se quiere una redirección declarativa.
    navigate("/login", { replace: true });
    return null;
  }

  return children;
}
