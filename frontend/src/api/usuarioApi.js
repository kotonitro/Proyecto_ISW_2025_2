import axios from 'axios';

const API_URL = 'http://localhost:3000/api/usuarios';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsuarios = () => api.get('/');
export const getUsuarioByRut = (rut) => api.get(`/${rut}`);
export const createUsuario = (data) => api.post('/', data);
export const updateUsuario = (rut, data) => api.patch(`/${rut}`, data);
export const deleteUsuario = (rut) => api.delete(`/${rut}`);
