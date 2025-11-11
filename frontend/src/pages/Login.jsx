import React, { useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        throw new Error(data?.message || "Error al iniciar sesión");
      }

      // Guardar token en localStorage
      const token = data.data?.token || data.token;
      localStorage.setItem("token", token);
      
      // Guardar nombre del encargado si está disponible
      const nombre = data.data?.nombre || data.nombre || "Encargado";
      localStorage.setItem("encargadoNombre", nombre);

      onLoginSuccess(nombre);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://www.ubiobio.cl/web2023/images/logo-ubb.png"
            alt="Logo UBB"
            className="login-logo"
          />
          <h2>Universidad del Bío-Bío</h2>
          <p>Gestión de Custodia de Bicicletas</p>
          <p className="login-subtitle">Acceso para Encargados</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Ingrese su Email</label>
            <input
              id="email"
              type="email"
              placeholder="encargado@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Ingrese su Contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-footer">
          <a href="#">¿Olvidó su contraseña?</a>
        </div>
      </div>
    </div>
  );
}
