import React, { useState } from "react";
import CustodiaList from "../components/CustodiaList";
import CustodiaForm from "../components/CustodiaForm";
import HistorialRegistros from "../components/HistorialRegistros";
import Alert from "../components/Alert";
import ConfirmAlert from "../components/ConfirmAlert";

export default function CustodiaPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("custodia");

  // Alert State
  const [alerts, setAlerts] = useState([]);
  const addAlert = (type, message) => {
    setAlerts((prev) => [...prev, { id: Date.now(), type, message }]);
  };
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Confirm State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  function onSuccess() {
    setRefreshKey((k) => k + 1);
    addAlert("success", "Operación realizada con éxito");
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
      {/* Alerts Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={removeAlert}
          />
        ))}
      </div>

      <ConfirmAlert
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={closeConfirm}
      />

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
            <CustodiaForm onSuccess={onSuccess} addAlert={addAlert} />
          </div>
          <div className="lg:col-span-2" key={refreshKey}>
            <CustodiaList addAlert={addAlert} openConfirm={openConfirm} />
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
