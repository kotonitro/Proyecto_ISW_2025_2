import React, { useEffect, useState } from "react";
import { fetchBicicletasAlmacenadas, postSalida } from "../api/custodiaApi";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

export default function CustodiaList() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, idRegistro: null });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBicicletasAlmacenadas();
      setRegistros(data);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleEliminar(idRegistro) {
    setConfirmDialog({ show: true, idRegistro });
  }

  async function confirmarEliminacion() {
    const { idRegistro } = confirmDialog;
    setConfirmDialog({ show: false, idRegistro: null });

    try {
      await postSalida(idRegistro);
      await load();
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  function cancelarEliminacion() {
    setConfirmDialog({ show: false, idRegistro: null });
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Registro diario
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {!loading && registros.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No hay bicicletas almacenadas en este momento.
          </div>
        )}

        {!loading && registros.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Bicicleta
                        </span>
                          <span className="text-[10px] text-gray-400 font-medium normal-case mt-0.5">Marca, Modelo, Color
                            </span>
                          </div>
                        </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">Bicicletero</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-blue-800">Hora Entrada</th>
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registros.map((r) => (
                  <tr key={r.idRegistroAlmacen} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {r.bicicleta ? `${r.bicicleta.marca}, ${r.bicicleta.modelo}, ${r.bicicleta.color}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{r.nombreUsuario}</div>
                      <div className="text-xs text-gray-500">{r.rutUsuario}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {LISTA_BICICLETEROS.find(b => b.id === r.idBicicletero)?.nombre || `ID: ${r.idBicicletero}`}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 italic">
                      {new Date(r.fechaEntrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEliminar(r.idRegistroAlmacen)}
                        className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-all text-xs font-bold shadow-sm"
                      >
                        RETIRAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación personalizado */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            {/* Icono de advertencia */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              ¿Estás seguro?
            </h3>

            {/* Mensaje */}
            <p className="text-gray-600 text-center mb-6">
              ¿Deseas retirar este registro de custodia? La bicicleta será liberada del bicicletero.
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={cancelarEliminacion}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
              >
                Retirar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
