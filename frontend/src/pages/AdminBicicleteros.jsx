import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import ActionToolbar from "../components/ActionToolbar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Alert from "../components/Alert";
import ConfirmAlert from "../components/ConfirmAlert"
import { 
  getBicicleteros,
  getBicicletero, 
  createBicicletero, 
  deleteBicicletero, 
  updateBicicletero 
} from "../api/bicicleteroApi";

export default function AdminBicicleteros() {
  const [bicicleteros, setBicicleteros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: ""
  });

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "", // Nuevo campo
    capacidad: "", 
  });

  // Alertas
  const [alertas, setAlertas] = useState([]);

  const showAlert = (type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message
    };
    setAlertas((prev) => [newAlert, ...prev]);
  };

  const removeAlert = (idToRemove) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== idToRemove));
  };

  // Cargar bicicleteros
  const fetchBicicleteros = async () => {
    setLoading(true);
    try {
      const res = await getBicicleteros();
      setBicicleteros(res.data.data);
    } catch (err) {
      showAlert("error", "Error al cargar la lista de bicicleteros")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBicicleteros();
  }, []);

  // Filtar por nombre
  const bicicleterosFiltrados = bicicleteros.filter((bic) => 
    bic.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir al crear
  const handleOpenCreate = () => {
    setForm({ nombre: "", ubicacion: "", capacidad: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir al editar
  const handleOpenEdit = (bic) => {
    setForm({
      nombre: bic.nombre || "",
      ubicacion: bic.ubicacion || "",
      capacidad: bic.capacidad || "",
    });
    setCurrentId(bic.idBicicletero);
    setIsEditing(true);
    setShowModal(true);
  };

  // Confirmar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const dataToUpdate = { ...form };
        await updateBicicletero(currentId, dataToUpdate);
        showAlert("success", "Bicicletero actualizado correctamente");
      } else {
        await createBicicletero(form);
        showAlert("success", "Bicicletero creado correctamente");
      }
      setShowModal(false);
      fetchBicicleteros();
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Ocurrió un error al guardar";
      if (errorData?.errorDetails && Array.isArray(errorData.errorDetails)) {
        const detalles = errorData.errorDetails
          .map((detail) => `• ${detail.message}`)
          .join("\n");
        errorMessage += `\n\nDetalles:\n${detalles}`;
      }
      showAlert("error", errorMessage)
    }
  };

  // Borrar
  const handleDeleteClick = (idBicicletero, nombreBicicletero, ubicacionBicicletero) => {
    setCurrentId(idBicicletero);
    setConfirmConfig({
      title: "¿Estás seguro que deseas eliminar el bicicletero?",
      message:(
        <span>
          Vas a eliminar a <span className="font-bold text-gray-900">{nombreBicicletero}</span> ubicado en <span className="font-bold text-gray-900">{ubicacionBicicletero}</span> de forma permanente.
        </span>
      ) 
    });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {

    if (!currentId) return;
    try {
      await deleteBicicletero(currentId);
      showAlert("success", "Bicicletero eliminado correctamente")
      fetchBicicleteros();
    } catch (err) {
      const msg = err.response?.data?.message || "No se pudo eliminar";
      showAlert("error", msg)
    } finally {}
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setCurrentId(null);
  };

  // Pagina visual
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/*Alertas*/}
      <div className="fixed top-10 right-5 z-[100] flex flex-col items-end pointer-events-none">
          {alertas.map((alert) => (
              <Alert 
                  key={alert.id}
                  id={alert.id}
                  type={alert.type} 
                  message={alert.message} 
                  onClose={removeAlert} 
              />
          ))}

      </div>
      {/*Alerta de confirmación*/}
      <ConfirmAlert 
        isOpen={showConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />

      {/*Header (Título)*/}
      <PageTitle title="Administración de Bicicleteros" />

      {/*Barra de búsqueda y botón crear */}
      <ActionToolbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        placeholder="Buscar por Nombre..."
        buttonText="Nuevo Bicicletero"
        onClick={handleOpenCreate}
        buttonColor={"bg-blue-700 hover:bg-blue-800"}
      />

      {/* Tabla de bicicleteros*/}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
          <div className="p-12 text-center text-gray-500 text-lg">Cargando bicicleteros...</div>
          ) : (
          <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-600">
              <thead className="bg-gray-100 text-black text-xs font-bold tracking-wider">
                  <tr>
                  <th className="px-6 py-4">NOMBRE</th>
                  <th className="px-6 py-4">UBICACIÓN</th>
                  <th className="px-6 py-4 text-center">CAPACIDAD</th>
                  <th className="px-6 py-4 text-right">ACCIONES</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/*Datos*/}
                {bicicleterosFiltrados.map((bic) => (
                  <tr key={bic.idBicicletero} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-black">{bic.nombre}</td>
                      <td className="px-6 py-4 font-mono text-gray-600">{bic.ubicacion}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                            {bic.capacidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                          <EditButton onClick={() => handleOpenEdit(bic)} />
                          <DeleteButton onClick={() => handleDeleteClick(bic.idBicicletero, bic.nombre, bic.ubicacion)} />
                      </div>
                      </td>
                  </tr>
                ))}
                {bicicleterosFiltrados.length === 0 && (
                <tr>
                    <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
                    {busqueda ? "No se encontraron bicicleteros con ese nombre." : "No hay bicicleteros registrados."}
                    </td>
                </tr>
                )}
            </tbody>
            </table>
          </div>
          )}
      </div>

      {/*Formulario*/}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                  {isEditing ? "Editar Bicicletero" : "Nuevo Bicicletero"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/*Nombre*/}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Bicicletero</label>
                  <input 
                  type="text" 
                  required 
                  placeholder="Ej: Bicicletero Norte"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.nombre} 
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                  />
              </div>

              {/*Ubicación*/}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input 
                  type="text" 
                  required 
                  placeholder="Ej: Costado Edificio Aulas AA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.ubicacion} 
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} 
                  />
              </div>

              {/*Capacidad*/}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
                  <input 
                  type="number" 
                  required 
                  min="1"
                  placeholder="Ej: 12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.capacidad} 
                  onChange={(e) => setForm({ ...form, capacidad: e.target.value })} 
                  />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                  Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-colors">
                  {isEditing ? "Guardar Cambios" : "Crear Bicicletero"}
                  </button>
              </div>
              </form>
          </div>
          </div>
      )}
    </div>
  );
}