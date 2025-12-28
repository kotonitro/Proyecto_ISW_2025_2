import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

export const getInformes = () => api.get('/informes');

export const createInforme = (data) => api.post('/informes', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const downloadInformePdf = (id) => api.get(`/informes/download/${id}`, {
  responseType: 'blob' 
});

export const downloadInformeZip = (id) => api.get(`/informes/download-zip/${id}`, {
  responseType: 'blob'
});

export const getBicicletas = () => api.get('/bicicletas');
export const getBicicleteros = () => api.get('/bicicleteros');

export default api;
