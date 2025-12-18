// src/api/axios.ts
import axios from "axios";

// 환경에 따라 자동 처리
const getBaseURL = () => {
  // 배포 환경 (HTTPS)
  if (window.location.protocol === 'https:') {
    return '/api';  // Nginx가 처리
  }
  // 로컬 개발 환경
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
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