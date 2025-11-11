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
      alert("Salida registrada");
    } catch (e) {
      alert("Error: " + (e.message || e));
    }
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Bicicletas almacenadas</h2>
      {registros.length === 0 && <div>No hay bicicletas almacenadas.</div>}
      <ul>
        {registros.map((r) => (
          <li key={r.idRegistroAlmacen} style={{marginBottom:8}}>
            <strong>ID Registro:</strong> {r.idRegistroAlmacen} — <strong>Bicicleta:</strong> {r.bicicleta?.idBicicleta || r.idBicicleta} — <strong>Usuario:</strong> {r.nombreUsuario} ({r.rutUsuario})
            <div>
              <button onClick={() => handleSalida(r.idRegistroAlmacen)} style={{marginTop:6}}>Registrar salida</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
