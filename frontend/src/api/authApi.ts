// src/api/authApi.ts
import api from "./axios";

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

export const authApi = {
  signup: (data: SignupRequest) =>
    api.post<void>("/auth/signup", data),  // 🔥 /api 제거

  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data),  // 🔥 /api 제거
};