import { publicApi } from "./axios";

export type LoginReq = { email: string; password: string };
export type SignupReq = { name: string; email: string; password: string };

export type AuthRes = {
  accessToken: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
};

export const authApi = {
  login: (body: LoginReq) => publicApi.post<AuthRes>("/api/auth/login", body),
  signup: (body: SignupReq) => publicApi.post("/api/auth/signup", body),
};
