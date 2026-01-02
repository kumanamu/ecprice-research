// src/components/admin/StatsDashboard.tsx
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { UserStats } from "../../types/adminTypes";
import { Users, UserCheck, UserCog, Calendar, TrendingUp } from "lucide-react";

export default function StatsDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("통계 로드 실패:", error);
      alert("통계를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-slate-500">
        통계를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 사용자 통계</h2>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 총 사용자 */}
        <StatCard
          icon={Users}
          label="총 사용자"
          value={stats.totalUsers}
          color="blue"
        />

        {/* 관리자 */}
        <StatCard
          icon={UserCog}
          label="관리자"
          value={stats.totalAdmins}
          color="purple"
        />

        {/* 일반 사용자 */}
        <StatCard
          icon={UserCheck}
          label="일반 사용자"
          value={stats.totalRegularUsers}
          color="green"
        />
      </div>

      {/* 가입 방식별 */}
      <div>
        <h3 className="text-lg font-bold mb-4">가입 방식</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon={Users}
            label="일반 가입"
            value={stats.localUsers}
            color="indigo"
            subtitle="이메일/비밀번호"
          />
          <StatCard
            icon={Users}
            label="Google 가입"
            value={stats.oauthUsers}
            color="red"
            subtitle="OAuth"
          />
        </div>
      </div>

      {/* 최근 가입자 */}
      <div>
        <h3 className="text-lg font-bold mb-4">최근 가입자</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Calendar}
            label="오늘"
            value={stats.newUsersToday}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            label="이번 주"
            value={stats.newUsersThisWeek}
            color="cyan"
          />
          <StatCard
            icon={TrendingUp}
            label="이번 달"
            value={stats.newUsersThisMonth}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

// =========================================
// StatCard 컴포넌트
// =========================================
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}

function StatCard({ icon: Icon, label, value, color, subtitle }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    green: "bg-green-50 border-green-200 text-green-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    red: "bg-red-50 border-red-200 text-red-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  const iconColorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
    red: "bg-red-100 text-red-600",
    emerald: "bg-emerald-100 text-emerald-600",
    cyan: "bg-cyan-100 text-cyan-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <div className={`${iconColorClasses[color]} w-14 h-14 rounded-lg flex items-center justify-center`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <p className="text-sm opacity-80 mb-1">{label}</p>
          <p className="text-3xl font-black">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}