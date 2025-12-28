import React, { useState, useEffect, useCallback } from "react";
import { getNotificaciones, aceptarNotificacion, finalizarNotificacion } from "../api/notificacionApi";
import PageTitle from "../components/PageTitle";

const NotificacionCard = ({ notificacion, onAceptar, onFinalizar }) => {
  const { notificacionId, mensaje, rutSolicitante, estado, bicicletero, fechaCreacion } = notificacion;

  const handleAceptar = () => {
    if (window.confirm("¿Estás seguro de que quieres aceptar esta solicitud?")) {
      onAceptar(notificacionId);
    }
  };

  const handleFinalizar = () => {
    if (window.confirm("¿Estás seguro de que quieres finalizar esta tarea?")) {
      onFinalizar(notificacionId);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "En Camino":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusChip(estado)}`}>
            {estado}
          </span>
          <span className="text-xs text-gray-500">{new Date(fechaCreacion).toLocaleString()}</span>
        </div>
        <h3 className="font-bold text-gray-800">{bicicletero?.nombre || "Bicicletero no especificado"}</h3>
        <p className="text-sm text-gray-600 mb-4">Desde: {bicicletero?.ubicacion || "N/A"}</p>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">"{mensaje}"</p>
        <p className="text-sm text-gray-500 mt-3">Solicitante: {rutSolicitante}</p>
      </div>
      <div className="mt-4 flex gap-2">
        {estado === "Pendiente" && (
          <button
            onClick={handleAceptar}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Aceptar
          </button>
        )}
        {estado === "En Camino" && (
          <button
            onClick={handleFinalizar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Finalizar Tarea
          </button>
        )}
      </div>
    </div>
  );
};

export default function NotificacionesEncargado() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificaciones();
      setNotificaciones(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  const handleAction = async (action, notificacionId) => {
    try {
      await action(notificacionId);
      fetchNotificaciones(); // Recargar la lista
    } catch (err) {
      alert(`Error: ${err.message || "No se pudo completar la acción."}`);
    }
  };

  const pendientes = notificaciones.filter((n) => n.estado === "Pendiente");
  const misAsignadas = notificaciones.filter((n) => n.estado === "En Camino");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageTitle title="Gestión de Notificaciones" />

      {loading && <p className="text-center text-gray-500">Cargando notificaciones...</p>}
      {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-12">
          {/* SECCIÓN DE PENDIENTES */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">Solicitudes Pendientes</h2>
            {pendientes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendientes.map((n) => (
                  <NotificacionCard
                    key={n.notificacionId}
                    notificacion={n}
                    onAceptar={(id) => handleAction(aceptarNotificacion, id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border">
                <p className="text-gray-500">No hay solicitudes pendientes por el momento.</p>
              </div>
            )}
          </div>

          {/* SECCIÓN DE ASIGNADAS */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Mis Tareas Asignadas</h2>
            {misAsignadas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {misAsignadas.map((n) => (
                  <NotificacionCard
                    key={n.notificacionId}
                    notificacion={n}
                    onFinalizar={(id) => handleAction(finalizarNotificacion, id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border">
                <p className="text-gray-500">No tienes tareas asignadas en este momento.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
