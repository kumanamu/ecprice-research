import React, { createContext, useContext, useEffect, useState } from "react";
import { setToken as setAxiosToken } from "../api/axios";

interface User {
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // ✅ 단일 기준: localStorage → axios → context
  useEffect(() => {
    const saved = localStorage.getItem("accessToken");
    if (saved) {
      setToken(saved);
      setAxiosToken(saved);
    }
  }, []);

  const login = (accessToken: string, user: User) => {
    localStorage.setItem("accessToken", accessToken);
    setAxiosToken(accessToken);
    setToken(accessToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAxiosToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
