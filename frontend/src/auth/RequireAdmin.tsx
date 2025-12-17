import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user || user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
