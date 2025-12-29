import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/encargados` || "http://localhost:3000/api/encargados";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getEncargados = () => api.get("/");
export const getEncargado = (id) => api.get(`/${id}`);
export const createEncargado = (data) => api.post("/", data);
export const deleteEncargado = (id) => api.delete(`/${id}`);
export const updateEncargado = (id, data) => api.patch(`/${id}`, data);

export default api;
