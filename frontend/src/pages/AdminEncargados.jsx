import React, { useEffect, useState } from "react";
import { encargadoService } from "../api/encargadoService"; // Importamos el servicio del paso 1

export default function AdminEncargados() {
  // --- ESTADOS ---
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el Modal (Formulario)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Datos del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "", // Solo se usa al crear
    esAdmin: false,
  });

  // --- CARGAR DATOS AL INICIO ---
  const fetchEncargados = async () => {
    setLoading(true);
    try {
      const data = await encargadoService.getAll();
      // Ajusta esto si tu backend devuelve { data: [...] } o directo [...]
      setEncargados(data.data || data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncargados();
  }, []);

  // --- MANEJADORES ---
  
  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setForm({ nombre: "", email: "", password: "", esAdmin: false });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = (encargado) => {
    setForm({
      nombre: encargado.nombre,
      email: encargado.email,
      password: "", // Dejamos vacío, si escribe algo se actualiza
      esAdmin: encargado.esAdmin || false,
    });
    setCurrentId(encargado._id || encargado.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Lógica de editar (quitamos password si está vacía para no sobrescribirla)
        const dataToUpdate = { ...form };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        
        await encargadoService.update(currentId, dataToUpdate);
      } else {
        // Lógica de crear
        await encargadoService.create(form);
      }
      setShowModal(false);
      fetchEncargados(); // Recargar tabla
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este encargado?")) return;
    try {
      await encargadoService.delete(id);
      fetchEncargados();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ENCABEZADO DE LA PÁGINA */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Encargados</h1>
          <p className="text-gray-500 text-sm">Administra el acceso del personal al sistema.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Encargado
        </button>
      </div>

      {/* 2. TABLA DE DATOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando encargados...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Rol</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {encargados.map((enc) => (
                  <tr key={enc._id || enc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{enc.nombre}</td>
                    <td className="px-6 py-4">{enc.email}</td>
                    <td className="px-6 py-4 text-center">
                      {enc.esAdmin ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          Administrador
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          Encargado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleOpenEdit(enc)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(enc._id || enc.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {encargados.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No hay encargados registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. MODAL (POPUP) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            {/* Header del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Encargado" : "Crear Nuevo Encargado"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {isEditing && <span className="text-gray-400 font-normal">(Opcional)</span>}
                </label>
                <input
                  type="password"
                  required={!isEditing} // Obligatoria solo al crear
                  placeholder={isEditing ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="esAdmin"
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  checked={form.esAdmin}
                  onChange={(e) => setForm({ ...form, esAdmin: e.target.checked })}
                />
                <label htmlFor="esAdmin" className="text-sm text-gray-700 cursor-pointer select-none">
                  Otorgar permisos de <strong>Administrador</strong>
                </label>
              </div>

              {/* Botones del Modal */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition"
                >
                  {isEditing ? "Guardar Cambios" : "Crear Encargado"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}