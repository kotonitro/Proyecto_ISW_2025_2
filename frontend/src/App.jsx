import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CustodiaPage from "./pages/CustodiaPage";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Gestión de Custodia</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/custodia">Custodia</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<div>Bienvenido. Ve a la sección de Custodia.</div>} />
          <Route path="/custodia/*" element={<CustodiaPage />} />
        </Routes>
      </main>
    </div>
  );
}
