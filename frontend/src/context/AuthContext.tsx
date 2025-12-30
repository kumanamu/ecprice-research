import React, { createContext, useContext, useState } from "react";
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
  // ✅ useState 초기값으로 localStorage 읽기 (useEffect 대신)
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem("accessToken");
    if (saved) {
      setAxiosToken(saved);  // axios에도 설정
    }
    return saved;  // state 초기값
  });

  const [user, setUser] = useState<User | null>(null);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};