import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BicicleteroCard from "../components/BicicleteroCard";
import { crearNotificacion } from "../api/notificacionApi";
import axios from "axios";
import Alert from "../components/Alert";
import defaultImage from "../images/bicicleteroPlaceholder.jpg";

const IMAGE_BASE_URL = "http://localhost:3000/uploads/bicicleteros/";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [bicicleteros, setBicicleteros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bicicleteroId: "",
    rutSolicitante: "",
    mensaje: "",
  });

  const [alertas, setAlertas] = useState([]);

  const showAlert = (type, message) => {
    const newAlert = { id: Date.now(), type, message };
    setAlertas((prev) => [...prev, newAlert]);
  };

  const removeAlert = (idToRemove) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== idToRemove));
  };

  const fetchDisponibilidad = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/bicicleteros/disponibilidad"
      );
      if (res.data && res.data.data) {
        setBicicleteros(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponibilidad();

    const interval = setInterval(fetchDisponibilidad, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.bicicleteroId ||
      !formData.rutSolicitante ||
      !formData.mensaje
    ) {
      showAlert("error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await crearNotificacion(formData);
      const newId = response.data?.id || response.data?.notificacionId;

      if (newId) {
        navigate(`/verificar-estado/${newId}`);
      } else {
        showAlert(
          "success",
          response.message || "Solicitud enviada con éxito."
        );
        setIsModalOpen(false);
      }

      setFormData({ bicicleteroId: "", rutSolicitante: "", mensaje: "" });
    } catch (error) {
      let errorMessage = "Ocurrió un error al enviar la solicitud.";
      if (error && error.message) {
        errorMessage = error.message;
      }
      if (error && error.errors) {
        const details = error.errors.join(". ");
        errorMessage += `: ${details}`;
      }
      showAlert("error", errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const bicicleterosActivos = bicicleteros.filter((b) => b.activo);

  const formatRut = (rut) => {
    let value = rut.replace(/[^0-9kK]/g, "");
    if (value.length > 1) {
      value = value.slice(0, -1) + "-" + value.slice(-1);
    }
    return value;
  };

  return (
    <div>
      <div className="fixed top-20 right-5 z-[100] flex flex-col items-end pointer-events-none">
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

      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Bicicleteros Disponibles
        </h1>

        {/* Indicadores de Carrusel (Solo Móvil) */}
        <div className="mb-4 flex justify-between items-center md:hidden px-2 animate-pulse">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Desliza
          </span>
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
            Ver más
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-6 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          {bicicleterosActivos.length > 0 ? (
            bicicleterosActivos.map((b) => (
              <div
                key={b.id}
                className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center shrink-0 h-full"
              >
                <BicicleteroCard
                  title={b.title}
                  location={b.location}
                  capacity={`${b.ocupados} / ${b.total}`}
                  image={
                    b.imagen ? `${IMAGE_BASE_URL}${b.imagen}` : defaultImage
                  }
                  placeholder={defaultImage}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 w-full">
              No se encontraron bicicleteros configurados en el sistema.
            </div>
          )}
        </div>

        {/* Espaciador */}
        <div className="h-16 md:h-24"></div>

        {/* Sección de Búsqueda Rápida */}
        {!token && (
          <div className="mb-12 bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden ">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 md:flex items-center justify-between gap-8">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <h2 className="text-2xl font-bold mb-2">
                  ¿Olvidaste dónde dejaste tu bici?
                </h2>
                <p className="text-blue-100 mb-6">
                  Ingresa tu RUT y consulta instantáneamente en qué bicicletero
                  se encuentra tu bicicleta.
                </p>
                <button
                  onClick={() => navigate("/ubicacion-bicicleta")}
                  className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-50 transition-transform transform hover:-translate-y-1"
                >
                  Buscar Mi Bicicleta
                </button>
              </div>

              <div className="hidden md:block md:w-1/3 opacity-90">
                <svg
                  className="w-full h-auto text-white/20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm15 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM8.76 9.69l.73 3.06-1.95 2.05a4.01 4.01 0 0 0-3.32.7l-1.2-1.6a5.96 5.96 0 0 1 4.57-1.12l.62-1.85A1.99 1.99 0 0 1 6.5 9c-.27 0-.53.05-.77.14L4 9.87l-.46-1.87 2.45-1.05A3.98 3.98 0 0 1 9.5 5h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2.14l-1.6 1.69z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </main>

      {!token && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-40"
            aria-label="Solicitar Guardia"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="ml-2">Solicitar Guardia</span>
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">
                  Solicitar Asistencia de Guardia
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="bicicleteroId"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Bicicletero
                    </label>
                    <select
                      id="bicicleteroId"
                      name="bicicleteroId"
                      value={formData.bicicleteroId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Seleccione un bicicletero</option>
                      {bicicleteros.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} - {b.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="rutSolicitante"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      RUT del Solicitante
                    </label>
                    <input
                      type="text"
                      id="rutSolicitante"
                      name="rutSolicitante"
                      value={formatRut(formData.rutSolicitante)}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Ej: 12345678-9"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="mensaje"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Describe brevemente por qué necesitas asistencia..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="font-bold py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
                    >
                      Enviar Solicitud
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
