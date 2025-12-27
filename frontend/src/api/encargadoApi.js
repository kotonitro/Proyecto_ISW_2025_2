import axios from 'axios';

// Asegúrate de que esta URL coincida con tu backend (puerto 3000 generalmente)
const API_URL = 'http://localhost:3000/api/encargados';

// Creamos una instancia de axios configurada
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Antes de cada petición, le pegamos el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Definimos las funciones que usará la página
export const getEncargados = () => api.get('/');
export const createEncargado = (data) => api.post('/', data);
export const deleteEncargado = (id) => api.delete(`/${id}`);
// export const updateEncargado = (id, data) => api.put(`/${id}`, data); // Opcional por ahora