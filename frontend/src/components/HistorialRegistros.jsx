import React, { useEffect, useState } from "react";
import { fetchRegistros } from "../api/custodiaApi";

// Mapeo de nombres para las ubicaciones basadas en el ID del bicicletero
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
    <div className="space-y-4">
      {/* BUSCADOR Y FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="number"
            placeholder="ID Bicicleta..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700">
            BUSCAR
          </button>
        </form>

        <select
          value={filtroEstado}
          onChange={(e) => { setFiltroEstado(e.target.value); load(e.target.value, searchId); }}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none bg-white w-full md:w-48"
        >
          <option value="">Todos los estados</option>
          <option value="entrada">En Custodia</option>
          <option value="salida">Retirada</option>
        </select>
      </div>

      {/* TABLA SIMPLIFICADA */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID Bici</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">RUT Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Cargando...</td></tr>
            ) : registros.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No hay registros.</td></tr>
            ) : (
              registros.map((r) => (
                <tr key={r.idRegistroAlmacen} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    #{r.idBicicleta}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {r.rutUsuario}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {NOMBRES_BICICLETEROS[r.idBicicletero] || `ID: ${r.idBicicletero}`}
                  </td>
                  <td className="px-6 py-4">
                    {r.estadoBicicleta === "entrada" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        EN CUSTODIA
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        RETIRADA
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