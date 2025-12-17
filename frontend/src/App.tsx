import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import RequireAuth from "./auth/RequireAuth";
import AppHeader from "./components/layout/AppHeader";

export default function App() {
  return (
    <>
      {/* ✅ 전역 헤더 (번역 토글 위치) */}
      <AppHeader />

      <Routes>
        {/* 기본 진입 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 공개 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 보호 */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* 나머지 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
