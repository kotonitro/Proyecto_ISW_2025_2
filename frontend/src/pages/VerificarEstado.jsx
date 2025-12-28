import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEstadoNotificacion } from "../api/notificacionApi";

export default function VerificarEstado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitudId, setSolicitudId] = useState(id || "");
  const [estadoSolicitud, setEstadoSolicitud] = useState(null);
  const [estadoLoading, setEstadoLoading] = useState(false);

  const handleCheckEstado = async (idToCheck) => {
    if (!idToCheck) return;

    setEstadoLoading(true);
    setEstadoSolicitud(null);
    try {
      const response = await getEstadoNotificacion(idToCheck);
      setEstadoSolicitud(response.data);
    } catch (error) {
      setEstadoSolicitud({ error: error.message || "No se pudo encontrar la solicitud." });
    } finally {
      setEstadoLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleCheckEstado(id);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/verificar-estado/${solicitudId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        Verificar Estado de la Solicitud
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <label htmlFor="solicitudId" className="block text-gray-700 font-medium mb-2">
            Número de Solicitud
          </label>
          <input
            type="text"
            id="solicitudId"
            value={solicitudId}
            onChange={(e) => setSolicitudId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Ingrese el número de seguimiento"
          />
          <button 
            type="submit" 
            disabled={estadoLoading || !solicitudId} 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
          >
            {estadoLoading ? "Consultando..." : "Consultar"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-md border min-h-24">
          {estadoLoading && <p className="text-gray-600">Cargando estado...</p>}
          {estadoSolicitud && (
            <div>
              {estadoSolicitud.error ? (
                <p className="text-red-600 font-semibold">{estadoSolicitud.error}</p>
              ) : (
                <div>
                  <p className="text-lg"><strong>Estado:</strong> <span className="font-semibold text-blue-700">{estadoSolicitud.estado}</span></p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Última Actualización:</strong> {estadoSolicitud.timestamp ? new Date(estadoSolicitud.timestamp).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
          {!estadoLoading && !estadoSolicitud && (
            <p className="text-gray-500">
              {id ? "Cargando datos para la solicitud..." : "Ingrese un número de solicitud y consulte su estado."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
