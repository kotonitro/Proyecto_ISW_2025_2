import React, { useEffect, useState } from "react";
import { 
  getEncargados,
  getEncargado,
  createEncargado, 
  deleteEncargado, 
  updateEncargado 
} from "../api/encargadoApi";

export default function AdminEncargados() {
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rut: "",
    telefono: "",
    contrasena: "",
  });

  // --- CARGAR DATOS ---
  const fetchEncargados = async () => {
    setLoading(true);
    try {
      const res = await getEncargados();
      setEncargados(res.data.data || res.data); 
    } catch (err) {
      console.error("Error cargando encargados:", err);
      alert("Error al cargar la lista de encargados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncargados();
  }, []);

  // 2. LÓGICA DE FILTRADO (Buscamos por RUT)
  const encargadosFiltrados = encargados.filter((enc) => {
    // Convertimos a minúsculas para que no importe si escriben con mayúscula o minúscula
    return enc.rut.toLowerCase().includes(busqueda.toLowerCase());
  });

  // --- MANEJADORES ---
  const handleOpenCreate = () => {
    setForm({ nombre: "", email: "", rut: "", telefono: "", contrasena: "" });
    setShowPassword(false);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (enc) => {
    setForm({
      nombre: enc.nombre,
      email: enc.email,
      rut: enc.rut || "",
      telefono: enc.telefono || "",
      contrasena: "",
    });
    setCurrentId(enc.id || enc._id);
    setShowPassword(false);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const dataToUpdate = { ...form };
        if (!dataToUpdate.contrasena) delete dataToUpdate.contrasena;
        await updateEncargado(currentId, dataToUpdate);
        alert("Encargado actualizado correctamente");
      } else {
        await createEncargado(form);
        alert("Encargado creado correctamente");
      }
      setShowModal(false);
      fetchEncargados();
    } catch (err) {
      // 1. Obtenemos la respuesta del error
      const errorData = err.response?.data;
      
      // 2. Mensaje principal (ej: "Error de validación")
      let errorMessage = errorData?.message || "Ocurrió un error al guardar";

      // 3. Si el backend envió detalles específicos (errorDetails), los agregamos
      if (errorData?.errorDetails && Array.isArray(errorData.errorDetails)) {
        // Mapeamos cada error para listarlo con un guion
        const detalles = errorData.errorDetails
          .map((detail) => `• ${detail.message}`) // Muestra el mensaje específico de cada campo
          .join("\n");
        
        errorMessage += `\n\nDetalles:\n${detalles}`;
      }

      // 4. Mostramos todo junto
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este encargado?")) return;
    try {
      await deleteEncargado(id);
      fetchEncargados();
    } catch (err) {
      const msg = err.response?.data?.message || "No se pudo eliminar";
      alert("Error: " + msg);
    }
  };

  return (
    <div className="space-y-6">
      
      {/*Header (Título)*/}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Administración de Personal</h1>
        <p className="text-gray-500 text-sm">Gestiona los encargados del sistema.</p>
      </div>

      {/*Barra de búsqueda y botón crear */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Barra de búsqueda (Izquierda)*/}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por RUT..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Botón crear (Derecha)*/}
        <button
          onClick={handleOpenCreate}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Encargado
        </button>

      </div>

      {/* Tabla de encargados */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Cargando datos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Correo Electrónico</th>
                  <th className="px-6 py-4">Rut</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4 text-center">Rol</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/*Datos*/}
                {encargadosFiltrados.map((enc) => (
                  <tr key={enc.id || enc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-700">{enc.nombre}</td>
                    <td className="px-6 py-4 font-mono text-gray-700">{enc.email}</td>
                    <td className="px-6 py-4 font-mono text-gray-700">{enc.rut}</td>
                    <td className="px-6 py-4 font-mono text-gray-700">9 {enc.telefono}</td>
                    <td className="px-6 py-4 text-center">
                      {enc.esAdmin ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          Encargado
                        </span>
                      )}
                    </td>
                    {/* Acciones*/}
                    <td className="px-6 py-4 text-right">
                      {enc.esAdmin ? (
                        // Si es admin mostrar protegido (no se puede modificar)
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gray-50 text-gray-400 text-xs font-medium border border-gray-100 select-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Protegido
                        </span>
                      ) : (
                        // Si no es admin mostrar editar y eliminar
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(enc)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(enc.id || enc._id)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Si no hay resultados */}
                {encargadosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      {busqueda ? "No se encontraron encargados con ese RUT." : "No hay encargados registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Encargado" : "Registrar Personal"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input type="text" required placeholder="12.345.678-9" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" required placeholder="+569..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
                <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {/* CAMPO CONTRASEÑA CON TOGGLE */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {isEditing && <span className="text-gray-400 font-normal">(Opcional)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" // pr-10 para dar espacio al icono
                    value={form.password}
                    onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? (
                      // Icono Ojo Tachado (Ocultar)
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.043 9.043 0 012.817-.654c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    ) : (
                      // Icono Ojo (Ver)
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md">{isEditing ? "Guardar Cambios" : "Crear Usuario"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}