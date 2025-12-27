import React, { useState } from "react";
import { postEntrada } from "../api/custodiaApi";
import axios from "axios";

// Configuración fácilmente escalable para el futuro
const LISTA_BICICLETEROS = [
  { id: 1, nombre: "Bicicletero 1 - Av. Principal" },
  { id: 2, nombre: "Bicicletero 2 - Plaza Central" },
  { id: 3, nombre: "Bicicletero 3 - Parque Norte" },
  { id: 4, nombre: "Bicicletero 4 - Calle Secundaria" },
  // Para agregar más, solo añade: { id: 5, nombre: "Bicicletero 5 - Nombre" },
];

// Útil para el "Auto-completado" en CustodiaForm.jsx
export const getUsuarioYBiciPorRut = (rut) => api.get(`/usuario-datos/${rut}`);

export default function CustodiaForm({ onSuccess }) {
  const [rut, setRut] = useState("");
  const [userData, setUserData] = useState(null);
  const [idBicicletero, setIdBicicletero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para buscar usuario y su bicicleta asociada por RUT
  const buscarUsuarioYBici = async (rutIngresado) => {
    if (rutIngresado.length < 8) return;
    try {
      // Reemplaza con tu URL real de backend
      const res = await axios.get(`http://localhost:3000/api/usuarios/${rutIngresado}`);
      setUserData(res.data); 
      setError(null);
    } catch (e) {
      setUserData(null);
      setError("Usuario no encontrado.");
    }
  };

  const handleRutChange = (e) => {
    const value = e.target.value;
    setRut(value);
    if (value.length >= 8) {
      buscarUsuarioYBici(value);
    } else {
      setUserData(null);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!userData) throw new Error("Debe ingresar un RUT válido.");
      if (!idBicicletero) throw new Error("Debe seleccionar un bicicletero.");

      await postEntrada({
        rutUsuario: rut,
        idBicicleta: userData.idBicicleta, // Obtenido automáticamente del backend
        idBicicletero: parseInt(idBicicletero, 10),
      });

      // Limpiar el formulario tras éxito
      setRut("");
      setUserData(null);
      setIdBicicletero("");
      
      if (onSuccess) onSuccess();
      alert("¡Entrada registrada con éxito!");
    } catch (e) {
      setError(e.message || "Error al procesar la entrada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Registro de Entrada
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Campo RUT */}
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
            RUT del Usuario
          </label>
          <input
            id="rut"
            type="text"
            value={rut}
            onChange={handleRutChange}
            placeholder="Ej: 12345678-K"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Info del usuario (aparece dinámicamente) */}
        {userData && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in duration-300">
            <p className="text-sm text-blue-800"><strong>Nombre:</strong> {userData.nombreUsuario}</p>
            <p className="text-sm text-blue-800"><strong>Bicicleta ID:</strong> {userData.idBicicleta}</p>
          </div>
        )}

        {/* Selección de Bicicletero Escalable */}
        <div>
          <label htmlFor="bicicletero" className="block text-sm font-medium text-gray-700 mb-1">
            Asignar Bicicletero
          </label>
          <select
            id="bicicletero"
            value={idBicicletero}
            onChange={(e) => setIdBicicletero(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Seleccione una ubicación --</option>
            {LISTA_BICICLETEROS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !userData || !idBicicletero}
        className="mt-6 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
      >
        {loading ? "Registrando..." : "Confirmar Entrada"}
      </button>
    </form>
  );
}