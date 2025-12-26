import React, { useEffect, useState } from "react";
import { fetchHistorial } from "../api/custodiaApi";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

export default function HistorialRegistros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  async function load(estado = "", idBici = "") {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (idBici) filters.idBicicleta = idBici;

      const data = await fetchHistorial(filters);
      setRegistros(data);
    } catch (e) {
      setError("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load("", searchId);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
        
        <div className="relative">
          <label className="text-[10px] font-bold text-blue-600 uppercase ml-1 mb-1.5 block tracking-wider">
            Buscar por ID Bicicleta
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: 105"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 placeholder-blue-300 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-medium shadow-sm"
            />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

        <div className="flex items-end justify-end pb-1">
          <button
            onClick={() => { setSearchId(""); setFiltroEstado(""); load("", ""); }}
            className="bg-white text-blue-600 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm text-xs font-bold"
          >
            Limpiar Filtro
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-blue-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-blue-700 uppercase tracking-wider">ID Bicicleta</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-blue-700 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-blue-700 uppercase tracking-wider">Ubicación</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-blue-700 uppercase tracking-wider">Fecha Entrada</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-blue-700 uppercase tracking-wider">Fecha Salida</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-blue-700 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/50">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-20 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></td></tr>
            ) : registros.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-40">
                    <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-sm font-medium text-gray-500">No se encontraron registros</p>
                  </div>
                </td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.idRegistroAlmacen} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-3 group-hover:scale-110 transition-transform">
                        #{r.idBicicleta}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-blue-900">{r.nombreUsuario || "Usuario"}</div>
                    <div className="text-xs text-blue-400 mt-0.5">{r.rutUsuario}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-3 h-3 mr-1.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {LISTA_BICICLETEROS.find(b => b.id === r.idBicicletero)?.nombre || "Ubicación desconocida"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-600 font-mono">
                    {r.fechaEntrada ? new Date(r.fechaEntrada).toLocaleString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-600 font-mono">
                    {r.fechaSalida ? new Date(r.fechaSalida).toLocaleString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase border border-blue-100">
                      Retirada
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}