// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export let memoryToken: string | null = null;

export const setToken = (token: string | null) => {
  memoryToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const bootToken = localStorage.getItem('token');
if (bootToken) {
  setToken(bootToken);
}

api.interceptors.request.use(config => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

export default api;
