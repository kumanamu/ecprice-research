import { createContext, useContext, useState } from "react";
import { publicApi, tokenStore } from "../api/axios";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!tokenStore.get()
  );

  const login = async (email: string, password: string) => {
    const res = await publicApi.post("/api/auth/login", { email, password });
    tokenStore.set(res.data.accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenStore.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
