import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aceptarNotificacion } from '../api/notificacionApi';

export default function AceptarNotificacionCorreo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setStatus('error');
      setError('No se proporcionó un ID de notificación.');
      return;
    }

    const accept = async () => {
      try {
        await aceptarNotificacion(id);
        setStatus('success');
        // Redirigir después de un breve retraso para que el usuario pueda leer el mensaje
        setTimeout(() => {
          navigate('/notificaciones');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Ocurrió un error al aceptar la notificación.');
      }
    };

    accept();
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Procesando solicitud...</p>
            <p className="text-gray-500">Intentando aceptar la notificación.</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">¡Éxito!</h1>
            <p className="text-gray-600 mt-2">La notificación ha sido aceptada y asignada a tu cuenta.</p>
            <p className="text-sm text-gray-500 mt-4">Serás redirigido en un momento...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Error</h1>
            <p className="text-red-600 mt-2">{error}</p>
            <button onClick={() => navigate('/notificaciones')} className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                Ir a mis notificaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
