import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEstadoNotificacion } from "../api/notificacionApi";

export default function VerificarEstado() {
  const { id } = useParams();

  const [solicitudId, setSolicitudId] = useState(id || "");
  const [estadoSolicitud, setEstadoSolicitud] = useState(null);
  const [estadoLoading, setEstadoLoading] = useState(true);

  const handleVerificarEstado = async (idAVerificar) => {
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
      } else {
        setEstadoSolicitud({ error: "Esta solicitud ya fue resuelta" });
      }
    } catch (error) {
      setEstadoSolicitud({ error: "No se pudo encontrar la solicitud o no está activa." });
    } finally {
      setEstadoLoading(false);
    }
    return clean;
  };


  useEffect(() => {
    if (id) {
      setSolicitudId(id);
      handleVerificarEstado(id);
    } else {
      setEstadoLoading(false);
    }
  }, [id]);

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
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        Estado de la Solicitud
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="solicitudId" className="block text-gray-700 font-medium mb-2">
            Número de Solicitud
          </label>
          <input
            type="text"
            id="solicitudId"
            value={solicitudId}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
          <button 
              type="button"
              onClick={() => handleVerificarEstado(solicitudId)} 
              disabled={estadoLoading || !solicitudId} 
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
            >
              {estadoLoading ? "Consultando..." : "Actualizar Estado"}
            </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md border min-h-24 flex items-center justify-center">
          {estadoLoading && <p className="text-gray-600">Consultando estado...</p>}
          
          {estadoSolicitud && (
            <div>
              {estadoSolicitud.error ? (
                <p className="text-red-600 font-semibold">{estadoSolicitud.error}</p>
              ) : (
                <div className="text-center">
                  <p className="text-lg"><strong>Estado:</strong></p>
                  <p className={`text-2xl font-bold ${estadoSolicitud.estado === 'Pendiente' ? 'text-yellow-600' : 'text-blue-700'}`}>
                    {estadoSolicitud.estado}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    <strong>Última Actualización:</strong><br/>
                    {estadoSolicitud.timestamp ? new Date(estadoSolicitud.timestamp).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
