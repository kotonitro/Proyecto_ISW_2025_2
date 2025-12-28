import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const crearNotificacion = async (notificacionData) => {
  try {
    const response = await axios.post(`${API_URL}/notificaciones`, notificacionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEstadoNotificacion = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/notificaciones/${id}/estado`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

