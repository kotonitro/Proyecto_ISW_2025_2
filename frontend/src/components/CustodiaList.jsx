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
      <h2>Bicicletas Almacenadas</h2>
      
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && registros.length === 0 && (
        <div className="loading">No hay bicicletas almacenadas en este momento.</div>
      )}
      
      {!loading && registros.length > 0 && (
        <div className="registros-list">
          {registros.map((r) => (
            <div key={r.idRegistroAlmacen} className="registro-item">
              <strong>Bicicleta ID:</strong> {r.bicicleta?.idBicicleta || r.idBicicleta}<br />
              <strong>Usuario:</strong> {r.nombreUsuario} ({r.rutUsuario})<br />
              <strong>Registro:</strong> #{r.idRegistroAlmacen}<br />
              <strong>Entrada:</strong> {new Date(r.fechaEntrada).toLocaleString()}<br />
              <button onClick={() => handleSalida(r.idRegistroAlmacen)}>Registrar Salida</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
