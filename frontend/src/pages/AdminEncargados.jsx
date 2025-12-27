import { useEffect, useState } from 'react';
import { getEncargados, createEncargado, deleteEncargado } from '../api/encargadoApi';

const AdminEncargados = () => {
  const [encargados, setEncargados] = useState([]);
  
  // Estado para el formulario (coincide con tu backend)
  const [form, setForm] = useState({ 
    rut: '', 
    nombre: '', 
    email: '', 
    contrasena: '', 
    telefono: '' 
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
      setForm({ rut: '', nombre: '', email: '', contrasena: '', telefono: '' }); // Limpiar form
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Administrar Encargados</h1>

      {/* --- FORMULARIO --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Agregar Nuevo Encargado</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="rut" placeholder="RUT (sin puntos)" value={form.rut} onChange={handleChange} className="border p-2 rounded" required />
          <input name="nombre" placeholder="Nombre Completo" value={form.nombre} onChange={handleChange} className="border p-2 rounded" required />
          <input name="email" type="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
          <input name="telefono" placeholder="Teléfono (8 dígitos)" value={form.telefono} onChange={handleChange} className="border p-2 rounded" required />
          <input name="contrasena" type="password" placeholder="Contraseña (Mayus, Num, Simbolo)" value={form.contrasena} onChange={handleChange} className="border p-2 rounded" required />
          
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-1 md:col-span-2 font-bold">
            Crear Encargado
          </button>
        </form>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">RUT</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {encargados.map((enc) => (
              <tr key={enc.idEncargado} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{enc.rut}</td>
                <td className="py-3 px-4">{enc.nombre}</td>
                <td className="py-3 px-4">{enc.email}</td>
                <td className="py-3 px-4 text-center">
                  <button 
                    onClick={() => handleDelete(enc.idEncargado)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {encargados.length === 0 && <p className="text-center py-4 text-gray-500">No hay encargados registrados.</p>}
      </div>
    </div>
  );
};

export default AdminEncargados;