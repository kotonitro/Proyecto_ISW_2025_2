import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import InputField from "../components/InputField";
import logoUBB from "../images/logoTextoUBB.webp";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);

        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime < expirationTime) {
          navigate("/");
        } else {
          localStorage.clear();
        }
      } catch (error) {
        localStorage.clear();
      }
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const token = data.data.token;
      const infoEncargado = data.data.encargado;

      localStorage.setItem("token", token);
      localStorage.setItem("nombre", infoEncargado.nombre);
      localStorage.setItem("email", infoEncargado.email);
      localStorage.setItem("idEncargado", infoEncargado.idEncargado);

      const rolUsuario = infoEncargado.esAdmin ? "admin" : "encargado";
      localStorage.setItem("rol", rolUsuario);

      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Contenedor Principal
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Tarjeta de login */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <img src={logoUBB} alt="Logo UBB" className="mx-auto h-40 w-auto" />
        </div>
        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/*Input Email*/}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <div className="mt-1">
              <InputField
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="encargado@ejemplo.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          {/* Input Contraseña */}
          <div>
            <label
              htmlFor="contrasena"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="mt-1">
              <PasswordInput
                id="contrasena"
                name="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                disabled={loading}
              />
            </div>
          </div>
          {/* Mensaje de error */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 text-center">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          {/* Botón de ingresar */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all"}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </div>
        </form>
        {/* Olvido su contraseña */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="font-medium text-sm text-blue-600 hover:text-blue-500 hover:underline transition bg-transparent border-none p-0 cursor-pointer"
          >
            ¿Olvidó su contraseña? Contacte al administrador.
          </button>
        </div>
      </div>
    </div>
  );
}
