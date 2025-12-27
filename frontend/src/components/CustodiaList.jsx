import React, { useEffect, useState } from "react";
import { fetchBicicletasAlmacenadas, postSalida } from "../api/custodiaApi";

// Diccionario para mostrar el nombre del bicicletero en lugar de solo el ID
const NOMBRES_BICICLETEROS = {
  1: "Av. Principal",
  2: "Plaza Central",
  3: "Parque Norte",
  4: "Calle Secundaria"
};

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
      await load();
      alert("Salida registrada correctamente");
    } catch (e) {
      alert("Error: " + (e.message || e));
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Registro diario
        </h2>
        <button onClick={load} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Actualizar
        </button>
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">ID Bici</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Bicicletero</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Hora Entrada</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registros.map((r) => (
                <tr key={r.idRegistroAlmacen} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                      {r.idBicicleta}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{r.nombreUsuario}</div>
                    <div className="text-xs text-gray-500">{r.rutUsuario}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {NOMBRES_BICICLETEROS[r.idBicicletero] || `ID: ${r.idBicicletero}`}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 italic">
                    {new Date(r.fechaEntrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSalida(r.idRegistroAlmacen)}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-red-100"
                    >
                      DAR SALIDA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
