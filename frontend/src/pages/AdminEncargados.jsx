import { useEffect, useState } from "react";
import {
  getEncargados,
  createEncargado,
  deleteEncargado,
} from "../api/encargadoApi";

const AdminEncargados = () => {
  const [encargados, setEncargados] = useState([]);

  // Estado para el formulario (coincide con tu backend)
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    email: "",
    contrasena: "",
    telefono: "",
  });

  // 1. Cargar la lista al entrar a la página
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const respuesta = await getEncargados();
      setEncargados(respuesta.data.data); // Asumiendo que tu backend devuelve { data: [...] }
    } catch (error) {
      console.error("Error al cargar encargados:", error);
    }
  };

  // 2. Manejar lo que escribes en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Enviar el formulario (Crear)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEncargado(form);
      alert("Encargado creado con éxito");
      setForm({ rut: "", nombre: "", email: "", contrasena: "", telefono: "" }); // Limpiar form
      cargarDatos(); // Recargar la tabla
    } catch (error) {
      // Muestra el error que viene del backend (ej: "El email ya existe")
      alert("Error: " + (error.response?.data?.message || "Ocurrió un error"));
    }
  };

  // 4. Eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar a este encargado?")) {
      try {
        await deleteEncargado(id);
        cargarDatos();
      } catch (error) {
        alert("Error al eliminar: " + error.response?.data?.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4">
        Administrar Encargados
      </h1>

      {/* --- FORMULARIO --- */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Agregar Nuevo Encargado
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="rut"
            placeholder="RUT (sin puntos)"
            value={form.rut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <input
            name="nombre"
            placeholder="Nombre Completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono (8 dígitos)"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña (Mayus, Num, Simbolo)"
            value={form.contrasena}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 col-span-1 md:col-span-2 font-bold shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Crear Encargado
          </button>
        </form>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {encargados.map((enc) => (
                <tr
                  key={enc.idEncargado}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {enc.rut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {enc.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enc.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(enc.idEncargado)}
                      className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm font-medium inline-flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {encargados.length === 0 && (
          <p className="text-center py-8 text-gray-500 bg-gray-50">
            No hay encargados registrados.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminEncargados;
