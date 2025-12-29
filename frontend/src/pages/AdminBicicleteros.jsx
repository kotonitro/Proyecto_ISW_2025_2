import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import ActionToolbar from "../components/ActionToolbar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Alert from "../components/Alert";
import ConfirmAlert from "../components/ConfirmAlert";
import StatusButton from "../components/StatusButton";
import defaultImage from "../images/bicicleteroPlaceholder.jpg";
import ImagePreviewModal from "../components/ImagePreviewModal";
import {
  getBicicleteros,
  getBicicletero,
  createBicicletero,
  deleteBicicletero,
  updateBicicletero,
} from "../api/bicicleteroApi";

const IMAGE_BASE_URL = `${import.meta.env.VITE_URL_IMG}/uploads/bicicleteros` || "http://localhost:3000/uploads/bicicleteros/";

export default function AdminBicicleteros() {
  const [bicicleteros, setBicicleteros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false); // Para marcar que queremos borrar
  const [currentImage, setCurrentImage] = useState(null); // Para saber si el item editado tiene imagen
  const [previewImage, setPreviewImage] = useState(null);

  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
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
      message,
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
      showAlert("error", "Error al cargar la lista de bicicleteros");
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
    setImagenFile(null);
    setCurrentImage(null); // Limpiar
    setDeleteImage(false); // Limpiar
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir al editar
  const handleOpenEdit = (bic) => {
    setForm({
      nombre: bic.nombre || "",
      ubicacion: bic.ubicacion || "",
      capacidad: bic.capacidad || "",
      activo: bic.activo,
    });
    setCurrentId(bic.idBicicletero);
    setImagenFile(null);
    setCurrentImage(bic.imagen); // Guardamos la imagen actual del registro
    setDeleteImage(false); // Reseteamos el flag
    setIsEditing(true);
    setShowModal(true);
  };

  // Confirmar
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("ubicacion", form.ubicacion);
    formData.append("capacidad", form.capacidad);
    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }

    try {
      if (isEditing) {
        formData.append("activo", form.activo ? "true" : "false");
        if (deleteImage) {
          formData.append("eliminarImagen", "true");
        }
        await updateBicicletero(currentId, formData);
        showAlert("success", "Bicicletero actualizado correctamente");
      } else {
        await createBicicletero(formData);
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
      showAlert("error", errorMessage);
    }
  };

  // Borrar
  const handleDeleteClick = (
    idBicicletero,
    nombreBicicletero,
    ubicacionBicicletero
  ) => {
    setCurrentId(idBicicletero);
    setConfirmConfig({
      title: "¿Estás seguro que deseas eliminar el bicicletero?",
      message: (
        <span>
          Vas a eliminar{" "}
          <span className="font-bold text-gray-900">{nombreBicicletero}</span>{" "}
          ubicado en{" "}
          <span className="font-bold text-gray-900">
            {ubicacionBicicletero}
          </span>{" "}
          de forma permanente.
        </span>
      ),
    });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentId) return;
    try {
      await deleteBicicletero(currentId);
      showAlert("success", "Bicicletero eliminado correctamente");
      fetchBicicleteros();
    } catch (err) {
      const msg = err.response?.data?.message || "No se pudo eliminar";
      showAlert("error", msg);
    } finally {
    }
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

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
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
          <div className="p-12 text-center text-gray-500 text-lg">
            Cargando bicicleteros...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-600">
              <thead className="bg-gray-100 text-black text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">NOMBRE</th>
                  <th className="px-6 py-4">UBICACIÓN</th>
                  <th className="px-6 py-4 text-center">CAPACIDAD</th>
                  <th className="px-6 py-3 text-center">ESTADO</th>
                  <th className="px-6 py-4 text-center">IMAGEN</th>
                  <th className="px-6 py-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bicicleterosFiltrados.map((bic) => {
                  // 4. Calculamos la URL para cada fila
                  const imageUrl = bic.imagen
                    ? `${IMAGE_BASE_URL}${bic.imagen.replace(
                        /^bicicleteros\//,
                        ""
                      )}`
                    : defaultImage;

                  return (
                    <tr
                      key={bic.idBicicletero}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-black">
                        {bic.nombre}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {bic.ubicacion}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                          {bic.capacidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {bic.activo ? (
                          <span className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                            Activo
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 border border-red-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center group relative">
                          <img
                            src={imageUrl}
                            alt="Bicicletero"
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm bg-white cursor-pointer hover:scale-110 transition-transform hover:ring-2 hover:ring-blue-400"
                            // 5. Al hacer click, pasamos la URL al estado
                            onClick={() => setPreviewImage(imageUrl)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultImage;
                            }}
                          />
                          <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Ver imagen
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <EditButton onClick={() => handleOpenEdit(bic)} />
                          <DeleteButton
                            onClick={() =>
                              handleDeleteClick(
                                bic.idBicicletero,
                                bic.nombre,
                                bic.ubicacion
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {bicicleterosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      {busqueda
                        ? "No se encontraron bicicleteros con ese nombre."
                        : "No hay bicicleteros registrados."}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Editar Bicicletero" : "Nuevo Bicicletero"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Bicicletero
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bicicletero Norte"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  required
                  placeholder="Costado Edificio Aulas AA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm({ ...form, ubicacion: e.target.value })
                  }
                />
              </div>

              {/* Capacidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.capacidad}
                  onChange={(e) =>
                    setForm({ ...form, capacidad: e.target.value })
                  }
                />
              </div>

              {/* Input Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen{" "}
                  {isEditing && (
                    <span className="text-gray-400 font-normal">
                      (Opcional: cambiar actual)
                    </span>
                  )}
                </label>

                {/* Eliminar imagen actual */}
                {isEditing && currentImage && !deleteImage && !imagenFile && (
                  <div className="mb-2 flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Imagen actual asignada
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteImage(true)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold hover:underline"
                    >
                      Quitar Imagen
                    </button>
                  </div>
                )}

                {/* Mensaje de confirmación de borrado */}
                {deleteImage && !imagenFile && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center">
                    <span className="text-xs text-red-600">
                      La imagen se eliminará al guardar.
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteImage(false)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Deshacer
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImagenFile(e.target.files[0]);
                    setDeleteImage(false);
                  }}
                  className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer"
                />
                {imagenFile && (
                  <p className="mt-1 text-xs text-green-600">
                    Archivo seleccionado: {imagenFile.name}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="md:col-span-2 mt-2">
                  <StatusButton
                    isActive={form.activo}
                    onToggle={() => setForm({ ...form, activo: !form.activo })}
                    activeLabel="Activo"
                    inactiveLabel="Inactivo"
                    topText={"Estado actual del bicicletero"}
                    bottomText={"Haga click para cambiar el estado"}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-colors"
                >
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
