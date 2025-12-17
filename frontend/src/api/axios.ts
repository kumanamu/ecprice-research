import axios from "axios";

const BASE_URL = "http://localhost:8080";
const TOKEN_KEY = "accessToken";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ✅ 인증 필요 없는 요청용 (회원가입/로그인)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ✅ 인증 필요한 요청용
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ✅ 요청마다 localStorage에서 토큰 읽어서 붙임 (context/memory 꼬임 방지)
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
