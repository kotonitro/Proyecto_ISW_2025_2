import React, { useState, useEffect, useRef } from "react";
import { postEntrada } from "../api/custodiaApi";
import axios from "axios";

const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
];

export default function CustodiaForm({ onSuccess }) {
  const [rutBase, setRutBase] = useState("");
  const [rutDV, setRutDV] = useState("");
  const [userData, setUserData] = useState(null);
  const [idBicicletero, setIdBicicletero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencia para saltar al siguiente input automáticamente
  const dvInputRef = useRef(null);

  // Efecto que dispara la búsqueda automática cuando el DV está presente
  useEffect(() => {
    if (rutBase.length >= 7 && rutDV.length === 1) {
      buscarUsuario();
    } else {
      setUserData(null);
      setError(null);
    }
  }, [rutBase, rutDV]);

  const buscarUsuario = async () => {
    setError(null);
    const rutCompleto = `${rutBase}-${rutDV}`;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/api/usuarios/${rutCompleto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.data) {
        setUserData(res.data.data);
      }
    } catch (e) {
      setUserData(null);
      setError("Usuario no encontrado.");
    }
  };

  const handleBaseChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 8) setRutBase(val);
    
    // Salto automático al DV cuando llega a 8 dígitos
    if (val.length === 8) {
      dvInputRef.current.focus();
    }
  };

  const handleDVChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^0-9K]/g, "");
    if (val.length <= 1) setRutDV(val);
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Intentamos sacar el ID de la bici desde los datos del usuario
      const idBici = userData.idBicicleta || (userData.bicicletas && userData.bicicletas[0]?.idBicicleta);
      
      await postEntrada({
        rutUsuario: `${rutBase}-${rutDV}`,
        idBicicleta: idBici,
        idBicicletero: parseInt(idBicicletero, 10),
      });

      setRutBase("");
      setRutDV("");
      setUserData(null);
      setIdBicicletero("");
      if (onSuccess) onSuccess();
      alert("¡Entrada registrada con éxito!");
    } catch (e) {
      setError("Error al procesar la entrada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Registro de Entrada</h2>

      <div className="space-y-4">
        {/* Sistema de Doble Input con Guion Estático */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RUT del Usuario</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="12345678"
              value={rutBase}
              onChange={handleBaseChange}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-xl font-bold text-gray-400">-</span>
            <input
              ref={dvInputRef} // Referencia para el salto automático
              type="text"
              placeholder="K"
              value={rutDV}
              onChange={handleDVChange}
              className="w-12 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
        </div>

        {/* LOG DEL USUARIO (Aparece solo si lo encuentra) */}
        {userData && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-blue-600 uppercase">Datos del Usuario</p>
              <p className="text-sm text-gray-800"><strong>Nombre:</strong> {userData.nombre}</p>
              <p className="text-sm text-gray-800"><strong>Bicicleta ID:</strong> {userData.idBicicleta || userData.bicicletas?.[0]?.idBicicleta || "N/A"}</p>
            </div>
          </div>
        )}

        {/* ERROR (Solo aparece si falla la búsqueda final) */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asignar Bicicletero</label>
          <select
            value={idBicicletero}
            onChange={(e) => setIdBicicletero(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seleccione una ubicación --</option>
            {LISTA_BICICLETEROS.map((b) => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !userData || !idBicicletero}
        className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
      >
        {loading ? "Registrando..." : "Confirmar Entrada"}
      </button>
    </form>
  );
}