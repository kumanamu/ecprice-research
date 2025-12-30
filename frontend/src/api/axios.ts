// src/api/axios.ts
import axios from "axios";

const api = axios.create({
baseURL: import.meta.env?.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// ✅ 기존 함수들 유지 (AuthContext에서 사용)
// ========================================
export const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("accessToken", token);  // ✅ accessToken으로 통일
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");  // ✅ accessToken으로 통일
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");  // ✅ accessToken으로 통일
};

// ========================================
// 🔥 추가: 요청 인터셉터 - 자동 토큰 포함
// ========================================
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 [Axios] 토큰 포함:", token.substring(0, 20) + "...");
    } else {
      console.log("⚠️ [Axios] 토큰 없음");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// 🔥 추가: 응답 인터셉터 - 401 자동 처리
// ========================================
api.interceptors.response.use(
  (response) => {
    // 정상 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      console.log("🚨 [Axios] 인증 만료 - 로그아웃 처리");

      // 토큰 삭제
      removeToken();

      // 로그인 페이지로 이동 (무한 루프 방지)
      if (window.location.pathname !== "/login") {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;