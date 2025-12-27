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

  // Manejador para validar que solo entren números positivos
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permite solo dígitos del 0 al 9
    if (value === "" || /^[0-9]+$/.test(value)) {
      setSearchId(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* BUSCADOR Y FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text" // Cambiado a text para eliminar flechas (spinners)
            inputMode="numeric" // Optimiza teclado en móviles
            placeholder="ID Bicicleta..."
            value={searchId}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            BUSCAR
          </button>
        </form>

        <select
          value={filtroEstado}
          onChange={(e) => { setFiltroEstado(e.target.value); load(e.target.value, searchId); }}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none bg-white w-full md:w-48 cursor-pointer"
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
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Bici</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">RUT Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 animate-pulse">Cargando registros...</td></tr>
            ) : registros.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">No se encontraron registros.</td></tr>
            ) : (
              registros.map((r) => (
                <tr key={r.idRegistroAlmacen} className="hover:bg-blue-50/40 transition-colors">
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></span>
                        EN CUSTODIA
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-gray-400"></span>
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