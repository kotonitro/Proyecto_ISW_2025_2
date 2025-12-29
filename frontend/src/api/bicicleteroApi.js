import axios from "axios";

// Ajusta la URL si tu backend tiene otro prefijo
const API_URL = `${import.meta.env.VITE_API_URL}/bicicleteros` || "http://localhost:3000/api/bicicleteros";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para enviar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBicicleteros = () => api.get("/");
export const getBicicletero = (id) => api.get(`/${id}`);
export const createBicicletero = (data) => api.post("/", data);
export const updateBicicletero = (id, data) => api.patch(`/${id}`, data);
export const deleteBicicletero = (id) => api.delete(`/${id}`);

export default api;
