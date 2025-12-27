import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoUBB from "../images/logoUBB.png";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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

      // --- Lógica de Éxito ---
      const token = data.data.token;
      const infoEncargado = data.data.encargado;

      localStorage.setItem("token", token);
      localStorage.setItem("nombre", infoEncargado.nombre);
      localStorage.setItem("email", infoEncargado.email);

      // Convertimos el booleano a rol de texto
      const rolUsuario = infoEncargado.esAdmin ? "admin" : "encargado";
      localStorage.setItem("rol", rolUsuario);

      // Redirigir al Home (o dashboard)
      navigate("/");

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // 1. Contenedor principal (Fondo degradado)
    <div className="login-container">
      
      {/* 2. La Tarjeta (Caja blanca) */}
      <div className="login-card">
        
        {/* Encabezado con Logo */}
        <div className="login-header">
          <img src={logoUBB} alt="Logo UBB" className="login-logo" />
          <h2>Universidad del Bío-Bío</h2>
          <p>Gestión de Custodia de Bicicletas</p>
          <p className="login-subtitle">Acceso para Encargados</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@ubiobio.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Botón */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                ⏳ Ingresando...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Footer del card */}
        <div className="login-footer">
          <a href="#" onClick={(e) => e.preventDefault()}>
            ¿Olvidó su contraseña? Contacte al administrador.
          </a>
        </div>
      </div>
    </div>
  );
}