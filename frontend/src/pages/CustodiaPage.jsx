import React, { useState } from "react";
import CustodiaList from "../components/CustodiaList";
import CustodiaForm from "../components/CustodiaForm";
import HistorialRegistros from "../components/HistorialRegistros";

export default function CustodiaPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("custodia");

  function onSuccess() {
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="custodia-container">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === "custodia" ? "active" : ""}`}
          onClick={() => setActiveTab("custodia")}
        >
          Registrar Custodia
        </button>
        <button 
          className={`tab-btn ${activeTab === "historial" ? "active" : ""}`}
          onClick={() => setActiveTab("historial")}
        >
          Historial
        </button>
      </div>

      {activeTab === "custodia" && (
        <div className="custodia-page">
          <div className="custodia-section">
            <CustodiaForm onSuccess={onSuccess} />
          </div>
          <div className="custodia-section" key={refreshKey}>
            <CustodiaList />
          </div>
        </div>
      )}

      {activeTab === "historial" && (
        <div className="custodia-page">
          <HistorialRegistros />
        </div>
      )}
    </div>
  );
}
