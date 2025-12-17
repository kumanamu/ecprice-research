import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>접근 권한이 없습니다.</div>;
  }

  return <div>Admin Page</div>;
}
