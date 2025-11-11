import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CustodiaPage from "./pages/CustodiaPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [encargadoNombre, setEncargadoNombre] = useState(localStorage.getItem("encargadoNombre") || "");

  useEffect(() => {
    // Verificar si hay token al cargar
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setEncargadoNombre(localStorage.getItem("encargadoNombre") || "");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("encargadoNombre");
    setIsLoggedIn(false);
    setEncargadoNombre("");
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(nombre) => {
      setIsLoggedIn(true);
      setEncargadoNombre(nombre);
    }} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src="https://www.ubiobio.cl/web2023/images/logo-ubb.png" alt="Logo UBB" className="logo" />
          <h1>Gestión de Custodia de Bicicletas</h1>
        </div>
        <div className="header-right">
          <span className="encargado-name">Encargado: {encargadoNombre}</span>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/custodia/*" element={<CustodiaPage />} />
          <Route path="/" element={<Navigate to="/custodia" />} />
        </Routes>
      </main>
    </div>
  );
}
