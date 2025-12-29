import React, { useState, useEffect, useCallback } from "react";
import {
  getNotificaciones,
  aceptarNotificacion,
  finalizarNotificacion,
} from "../api/notificacionApi";
import PageTitle from "../components/PageTitle";
import Alert from "../components/Alert";
import ConfirmAlert from "../components/ConfirmAlert";

// Función de utilidad para formatear el RUT
function formatRut(rut) {
  if (!rut || typeof rut !== "string") return "";
  const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (cleanRut.length < 2) return cleanRut;
  const dv = cleanRut.slice(-1);
  const rutBody = cleanRut.slice(0, -1);
  return `${rutBody}-${dv}`;
}

const NotificacionCard = ({ notificacion, onAccept, onFinish }) => {
  const {
    notificacionId,
    mensaje,
    rutSolicitante,
    estado,
    bicicletero,
    fechaCreacion,
  } = notificacion;

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
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusChip(
              estado
            )}`}
          >
            {estado}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(fechaCreacion).toLocaleString()}
          </span>
        </div>
        <h3 className="font-bold text-gray-800">
          {bicicletero?.nombre || "Bicicletero no especificado"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Desde: {bicicletero?.ubicacion || "N/A"}
        </p>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
          "{mensaje}"
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Solicitante: {formatRut(rutSolicitante)}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        {estado === "Pendiente" && (
          <button
            onClick={() => onAccept(notificacionId)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Aceptar
          </button>
        )}
        {estado === "En Camino" && (
          <button
            onClick={() => onFinish(notificacionId)}
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
  const [alertas, setAlertas] = useState([]);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showAlert = (type, message) => {
    const newAlert = { id: Date.now(), type, message };
    setAlertas((prev) => [...prev, newAlert]);
  };

  const removeAlert = (idToRemove) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== idToRemove));
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmState({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    closeConfirm();
  };

  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (err) {
      showAlert("error", err.message || "Error al cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 15000); // Polling para refrescar
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const handleAcceptClick = (notificacionId) => {
    openConfirm(
      "¿Aceptar Solicitud?",
      "Estás a punto de hacerte cargo de esta solicitud. ¿Deseas continuar?",
      () =>
        handleAction(
          aceptarNotificacion,
          notificacionId,
          "Solicitud aceptada exitosamente."
        )
    );
  };

  const handleFinishClick = (notificacionId) => {
    openConfirm(
      "¿Finalizar Tarea?",
      "Esto marcará la tarea como completada. Asegúrate de haber terminado antes de confirmar.",
      () =>
        handleAction(
          finalizarNotificacion,
          notificacionId,
          "Tarea finalizada correctamente."
        )
    );
  };

  const handleAction = async (action, notificacionId, successMessage) => {
    try {
      await action(notificacionId);
      showAlert("success", successMessage);
      fetchNotificaciones();
    } catch (err) {
      showAlert("error", err.message || "No se pudo completar la acción.");
    }
  };

  const pendientes = notificaciones.filter((n) => n.estado === "Pendiente");
  const misAsignadas = notificaciones.filter((n) => n.estado === "En Camino");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="fixed top-20 right-5 z-[100] flex flex-col items-end pointer-events-none">
        {alertas.map((alert) => (
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
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />

      <PageTitle title="Gestión de Notificaciones" />

      {loading && notificaciones.length === 0 && (
        <p className="text-center text-gray-500">Cargando notificaciones...</p>
      )}

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">
            Solicitudes Pendientes
          </h2>
          {pendientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendientes.map((n) => (
                <NotificacionCard
                  key={n.notificacionId}
                  notificacion={n}
                  onAccept={handleAcceptClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">
                No hay solicitudes pendientes por el momento.
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            Mis Tareas Asignadas
          </h2>
          {misAsignadas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {misAsignadas.map((n) => (
                <NotificacionCard
                  key={n.notificacionId}
                  notificacion={n}
                  onFinish={handleFinishClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">
                No tienes tareas asignadas en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
