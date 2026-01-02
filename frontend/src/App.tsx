import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import RequireAuth from "./auth/RequireAuth";
import AppHeader from "./components/layout/AppHeader";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      {/* ✅ 전 페이지 공통 헤더 (언어 토글 항상 유지) */}
      <AppHeader />

      <Routes>
        {/* ✅ 첫 진입은 Home */}
        <Route path="/" element={<Home />} />
        
         {/* 어드민페이지*/}
        <Route path="/admin" element={<Admin />} />


        {/* 공개 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 보호 페이지 (추후 마이페이지 / 어드민용) */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
