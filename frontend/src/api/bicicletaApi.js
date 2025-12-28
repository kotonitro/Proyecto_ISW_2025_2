import axios from "axios";

const API_URL = "http://localhost:3000/api/bicicletas";

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

export const getBicicletas = () => api.get("/");
export const getBicicletasByUsuario = (idUsuario) =>
  api.get(`/usuario/${idUsuario}`);
export const createBicicleta = (data) => api.post("/", data);
export const updateBicicleta = (id, data) => api.patch(`/${id}`, data);
export const deleteBicicleta = (id) => api.delete(`/${id}`);
