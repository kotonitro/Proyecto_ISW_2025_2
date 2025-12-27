import React, { useEffect, useState } from "react";
import { fetchBicicletasAlmacenadas, postSalida } from "../api/custodiaApi";

export default function CustodiaList() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  async function handleSalida(idRegistro) {
    if (!confirm("¿Registrar salida de esta bicicleta?")) return;
    try {
      await postSalida(idRegistro);
      // recargar lista
      await load();
      alert("Salida registrada correctamente");
    } catch (e) {
      alert("Error: " + (e.message || e));
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Bicicletas Almacenadas
      </h2>

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {!loading && registros.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-gray-100">
          No hay bicicletas almacenadas en este momento.
        </div>
      )}

      {!loading && registros.length > 0 && (
        <div className="space-y-4">
          {registros.map((r) => (
            <div
              key={r.idRegistroAlmacen}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    ID: {r.bicicleta?.idBicicleta || r.idBicicleta}
                  </span>
                  <span className="text-sm text-gray-400">
                    #{r.idRegistroAlmacen}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {r.nombreUsuario}
                </h3>
                <p className="text-sm text-gray-500">{r.rutUsuario}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(r.fechaEntrada).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleSalida(r.idRegistroAlmacen)}
                className="w-full md:w-auto bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Registrar Salida
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
