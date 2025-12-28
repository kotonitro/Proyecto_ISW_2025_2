import React, { useEffect, useState } from "react";
import { fetchRegistros } from "../api/custodiaApi";

const NOMBRES_BICICLETEROS = {
  1: "Av. Principal",
  2: "Plaza Central",
  3: "Parque Norte",
  4: "Calle Secundaria"
};

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
      if (estado) filters.estado = estado;
      if (idBici) filters.idBicicleta = idBici;
      
      const data = await fetchRegistros(filters);
      setRegistros(data);
    } catch (e) {
      setError("Error al cargar los registros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(filtroEstado, searchId);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* SECCIÓN DE FILTROS ESTILIZADA */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="relative">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Buscar por ID</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: 105"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Filtrar Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); load(e.target.value, searchId); }}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm cursor-pointer"
          >
            <option value="">Todos los registros</option>
            <option value="entrada">En Custodia</option>
            <option value="salida">Retiradas</option>
          </select>
        </div>

        <div className="flex items-end justify-end">
          <button 
            onClick={() => {setSearchId(""); setFiltroEstado(""); load("", "");}}
            className="text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* TABLA MODERNIZADA */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID Bicicleta</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ubicación Actual</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-20 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></td></tr>
            ) : registros.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-40">
                    <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-sm font-medium">No se encontraron registros históricos</p>
                  </div>
                </td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.idRegistroAlmacen} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold mr-3 group-hover:scale-110 transition-transform">
                        #{r.idBicicleta}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-700 block">{r.rutUsuario}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {NOMBRES_BICICLETEROS[r.idBicicletero] || "Ubicación desconocida"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.estadoBicicleta === "entrada" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                        <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></span>
                        En Custodia
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span>
                        Retirada
                      </span>
                    )}
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