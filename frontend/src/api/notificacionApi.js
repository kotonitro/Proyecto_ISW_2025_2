import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const crearNotificacion = async (notificacionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notificaciones`,
      notificacionData
    );
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

export const getNotificaciones = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/notificaciones`,
      authHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const aceptarNotificacion = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notificaciones/${id}/aceptar`,
      {},
      authHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const finalizarNotificacion = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notificaciones/${id}/finalizar`,
      {},
      authHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
