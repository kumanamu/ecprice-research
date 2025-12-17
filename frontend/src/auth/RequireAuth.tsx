import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "../api/axios";

export default function RequireAuth() {
  const token = tokenStore.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
