import React, { useState } from "react";
import { postEntrada } from "../api/custodiaApi";

export default function CustodiaForm({ onSuccess }) {
  const [form, setForm] = useState({
    rutUsuario: "",
    nombreUsuario: "",
    emailUsuario: "",
    telefonoUsuario: "",
    idBicicleta: "",
    idBicicletero: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validación mínima
      if (!form.rutUsuario || !form.idBicicleta || !form.idBicicletero) {
        setError("RUT, ID Bicicleta e ID Bicicletero son obligatorios");
        setLoading(false);
        return;
      }

      await postEntrada({
        ...form,
        idBicicleta: parseInt(form.idBicicleta, 10),
        idBicicletero: parseInt(form.idBicicletero, 10),
      });

      setForm({
        rutUsuario: "",
        nombreUsuario: "",
        emailUsuario: "",
        telefonoUsuario: "",
        idBicicleta: "",
        idBicicletero: "",
      });
      if (onSuccess) onSuccess();
      alert("Entrada registrada correctamente");
    } catch (e) {
      setError(e.message || String(e));
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
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Registrar Entrada
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="rut"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            RUT del Usuario
          </label>
          <input
            id="rut"
            name="rutUsuario"
            value={form.rutUsuario}
            onChange={change}
            placeholder="Ej: 12345678-K"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            id="nombre"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={change}
            placeholder="Nombre completo"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="emailUsuario"
            value={form.emailUsuario}
            onChange={change}
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefonoUsuario"
            value={form.telefonoUsuario}
            onChange={change}
            placeholder="+56 9 1234 5678"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="bicicleta"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Bicicleta
            </label>
            <input
              id="bicicleta"
              name="idBicicleta"
              value={form.idBicicleta}
              onChange={change}
              type="number"
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="bicicletero"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Bicicletero
            </label>
            <input
              id="bicicletero"
              name="idBicicletero"
              value={form.idBicicletero}
              onChange={change}
              type="number"
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        {loading ? "Registrando..." : "Registrar Entrada"}
      </button>
    </form>
  );
}
