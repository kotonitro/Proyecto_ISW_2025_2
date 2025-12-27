import React, { useState } from "react";
import CustodiaList from "../components/CustodiaList";
import CustodiaForm from "../components/CustodiaForm";
import HistorialRegistros from "../components/HistorialRegistros";

export default function CustodiaPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("custodia");

  function onSuccess() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header / Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 focus:outline-none ${
            activeTab === "custodia"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("custodia")}
        >
          Registrar Custodia
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 focus:outline-none ${
            activeTab === "historial"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("historial")}
        >
          Historial
        </button>
      </div>

      {activeTab === "custodia" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CustodiaForm onSuccess={onSuccess} />
          </div>
          <div className="lg:col-span-2" key={refreshKey}>
            <CustodiaList />
          </div>
        </div>
      )}

      {activeTab === "historial" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <HistorialRegistros />
        </div>
      )}
    </div>
  );
}
