import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BicicleteroCard from "../components/BicicleteroCard";
import { crearNotificacion } from "../api/notificacionApi";
import axios from "axios";
import Alert from "../components/Alert";

// Importación de imágenes locales
import bike1 from "../images/bike1.jpg";
import bike2 from "../images/bike2.jpg";
import bike3 from "../images/bike3.jpg";
import bike4 from "../images/bike4.jpg";

// Mapeo para asignar la imagen correcta según el ID que venga de la DB
const imageMap = {
  1: bike1,
  2: bike2,
  3: bike3,
  4: bike4,
};

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
      const res = await axios.get("http://localhost:3000/api/bicicleteros/disponibilidad");
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

    if (!formData.bicicleteroId || !formData.rutSolicitante || !formData.mensaje) {
      showAlert("error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await crearNotificacion(formData);
      const newId = response.data?.id || response.data?.notificacionId;

      if (newId) {
        navigate(`/verificar-estado/${newId}`);
      } else {
        showAlert("success", response.message || "Solicitud enviada con éxito.");
        setIsModalOpen(false);
      }
      
      setFormData({ bicicleteroId: "", rutSolicitante: "", mensaje: "" });

    } catch (error) {
      let errorMessage = "Ocurrió un error al enviar la solicitud.";
      if (error && error.message) {
        errorMessage = error.message;
      }
      if (error && error.errors) {
        const details = error.errors.join('. ');
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bicicleteros.length > 0 ? (
            bicicleteros.map((b) => (
              <BicicleteroCard
                key={b.id}
                title={b.title}
                location={b.location}
                capacity={`${b.ocupados} / ${b.total}`}
                image={imageMap[b.id] || bike1}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron bicicleteros configurados en el sistema.
            </div>
          )}
        </div>
      </main>

      {!token && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-40"
            aria-label="Solicitar Guardia"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="ml-2">Solicitar Guardia</span>
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Solicitar Asistencia de Guardia</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="bicicleteroId" className="block text-gray-700 font-medium mb-2">
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
                    <label htmlFor="rutSolicitante" className="block text-gray-700 font-medium mb-2">
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
                    <label htmlFor="mensaje" className="block text-gray-700 font-medium mb-2">
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