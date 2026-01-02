// src/pages/Admin.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import StatsDashboard from "../components/admin/StatsDashboard";
import UserTable from "../components/admin/UserTable";
import { BarChart3, Users } from "lucide-react";

type TabType = "stats" | "users";

export default function Admin() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("stats");

  // 로그인 체크
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 권한 체크 (ROLE_ADMIN만 접근 가능)
  if (user?.role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md text-center">
          <div className="text-5xl md:text-6xl mb-4">🚫</div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            접근 권한이 없습니다
          </h1>
          <p className="text-sm md:text-base text-slate-600 mb-6">
            이 페이지는 관리자만 접근할 수 있습니다.
          </p>
          <a
            href="/"
            className="px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block text-sm md:text-base"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">
            관리자 페이지
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            사용자 관리 및 통계를 확인하세요
          </p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 md:gap-2 overflow-x-auto">
            <TabButton
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
              icon={BarChart3}
              label="통계"
            />
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={Users}
              label="사용자 관리"
            />
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {activeTab === "stats" && <StatsDashboard />}
        {activeTab === "users" && <UserTable />}
      </div>
    </div>
  );
}

// =========================================
// TabButton 컴포넌트
// =========================================
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-bold border-b-4 transition flex items-center gap-2 whitespace-nowrap " +
        (active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")
      }
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}