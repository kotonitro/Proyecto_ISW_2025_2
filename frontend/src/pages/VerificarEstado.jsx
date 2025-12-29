import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getEstadoNotificacion } from "../api/notificacionApi";
import Alert from "../components/Alert";

export default function VerificarEstado() {
  const { id } = useParams();
  const [solicitudId, setSolicitudId] = useState(id || "");
  const [estadoSolicitud, setEstadoSolicitud] = useState(null);
  const [estadoLoading, setEstadoLoading] = useState(true);
  const [alertas, setAlertas] = useState([]);

  const showAlert = (type, message) => {
    const newAlert = { id: Date.now(), type, message };
    setAlertas((prev) => [...prev, newAlert]);
  };

  const removeAlert = (idToRemove) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== idToRemove));
  };

  const handleVerificarEstado = useCallback(async (idAVerificar) => {
    if (!idAVerificar) {
      setEstadoLoading(false);
      return;
    }

    setEstadoLoading(true);
    setEstadoSolicitud(null);
    try {
      const response = await getEstadoNotificacion(idAVerificar);
      const { estado } = response.data;

      if (estado === "Pendiente" || estado === "En Camino") {
        setEstadoSolicitud(response.data);
        showAlert("success", `Estado actualizado a: ${estado}`);
      } else {
        setEstadoSolicitud({ estado: "Finalizada" });
        showAlert("warning", "Esta solicitud ya fue resuelta o ha finalizado.");
      }
    } catch (error) {
      setEstadoSolicitud(null);
      showAlert("error", "No se pudo encontrar la solicitud o no está activa.");
    } finally {
      setEstadoLoading(false);
    }
  }, []);


  useEffect(() => {
    if (id) {
      setSolicitudId(id);
      handleVerificarEstado(id);
    } else {
      setEstadoLoading(false);
    }
    

    const interval = setInterval(() => {
      if(id) handleVerificarEstado(id);
    }, 20000);

    return () => clearInterval(interval);

  }, [id, handleVerificarEstado]);

  if (!id) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso no válido</h1>
        <p className="text-gray-600">
          Por favor, utilice el enlace de seguimiento que se le proporcionó para verificar el estado de su solicitud.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="fixed top-20 right-5 z-100 flex flex-col items-end pointer-events-none">
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

      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        Estado de la Solicitud
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="solicitudId" className="block text-gray-700 font-medium mb-2">
            Número de Solicitud
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="solicitudId"
              value={solicitudId}
              readOnly
              className="grow p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <button 
                type="button"
                onClick={() => handleVerificarEstado(solicitudId)} 
                disabled={estadoLoading || !solicitudId} 
                className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                title="Actualizar Estado"
              >
                {estadoLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md border min-h-48 flex items-center justify-center">
          {estadoLoading && !estadoSolicitud && <p className="text-gray-600">Consultando estado...</p>}
          
          {estadoSolicitud && (
            <div className="text-center">
              <p className="text-lg"><strong>Estado:</strong></p>
              <p className={`text-2xl font-bold ${
                estadoSolicitud.estado === 'Pendiente' ? 'text-yellow-600' :
                estadoSolicitud.estado === 'En Camino' ? 'text-blue-700' :
                'text-green-600'
              }`}>
                {estadoSolicitud.estado}
              </p>
              <p className="text-sm text-gray-500 mt-3">
                <strong>Última Actualización:</strong><br/>
                {estadoSolicitud.timestamp ? new Date(estadoSolicitud.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
          )}

          {!estadoLoading && !estadoSolicitud && (
             <p className="text-gray-500">No se ha cargado el estado de la solicitud.</p>
          )}
        </div>
      </div>
    </div>
  );
}
