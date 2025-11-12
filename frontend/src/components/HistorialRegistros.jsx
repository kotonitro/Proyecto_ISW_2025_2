import React, { useEffect, useState } from "react";
import { fetchRegistros } from "../api/custodiaApi";

export default function HistorialRegistros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  async function load(estado = "") {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (estado) filters.estado = estado;
      const data = await fetchRegistros(filters);
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

  function handleFiltroChange(e) {
    const estado = e.target.value;
    setFiltroEstado(estado);
    load(estado);
  }

  return (
    <div className="historial-container">
      <h2>Historial de Registros</h2>
      
      <div className="filtro-grupo">
        <label htmlFor="filtro-estado">Filtrar por estado:</label>
        <select id="filtro-estado" value={filtroEstado} onChange={handleFiltroChange}>
          <option value="">Todos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
        </select>
      </div>

      {loading && <div className="loading">Cargando historial...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && registros.length === 0 && (
        <div className="loading">No hay registros en el historial.</div>
      )}
      
      {!loading && registros.length > 0 && (
        <div className="historial-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>RUT</th>
                <th>Bicicleta</th>
                <th>Bicicletero</th>
                <th>Estado</th>
                <th>Fecha Entrada</th>
                <th>Fecha Salida</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.idRegistroAlmacen}>
                  <td>#{r.idRegistroAlmacen}</td>
                  <td>{r.nombreUsuario}</td>
                  <td>{r.rutUsuario}</td>
                  <td>{r.bicicleta?.idBicicleta || r.idBicicleta || "-"}</td>
                  <td>{r.bicicletero?.idBicicletero || r.idBicicletero || "-"}</td>
                  <td className={`estado-${r.estadoBicicleta}`}>{r.estadoBicicleta?.toUpperCase()}</td>
                  <td>{new Date(r.fechaEntrada).toLocaleString()}</td>
                  <td>{r.fechaSalida ? new Date(r.fechaSalida).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
