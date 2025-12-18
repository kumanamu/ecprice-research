import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { setToken as setMemoryToken } from "../api/axios";

interface User {
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  // ✅ 새로고침 시 토큰 복구
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setMemoryToken(savedToken);
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { token: accessToken, role } = res.data;

    // ✅ 단일 흐름
    localStorage.setItem("accessToken", accessToken);
    setMemoryToken(accessToken);
    setToken(accessToken);
    setUser({ email, role });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setMemoryToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
