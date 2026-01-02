// src/components/admin/UserTable.tsx
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminapi";
import type { UserListPageResponse, UserListItem } from "../../types/Admintypes";
import { ChevronLeft, ChevronRight, Shield, User } from "lucide-react";

export default function UserTable() {
  const [data, setData] = useState<UserListPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  const loadUsers = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await adminApi.getUserList(pageNum, size);
      setData(response.data);
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
      alert("사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        사용자가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">사용자 목록</h2>
        <p className="text-sm text-slate-500">
          총 {data.totalElements.toLocaleString()}명
        </p>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  이메일
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  이름
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  권한
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  가입 방식
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.content.map((user) => (
                <UserRow key={user.id} user={user} formatDate={formatDate} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이징 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {data.number + 1} / {data.totalPages} 페이지
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={data.first}
            className={
              "px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 " +
              (data.first
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700")
            }
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>

          <button
            onClick={() => setPage(page + 1)}
            disabled={data.last}
            className={
              "px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 " +
              (data.last
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700")
            }
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================
// UserRow 컴포넌트
// =========================================
interface UserRowProps {
  user: UserListItem;
  formatDate: (date: string) => string;
}

function UserRow({ user, formatDate }: UserRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-6 py-4 text-sm font-medium text-slate-700">
        #{user.id}
      </td>
      <td className="px-6 py-4 text-sm text-slate-700">
        {user.email}
      </td>
      <td className="px-6 py-4 text-sm text-slate-700">
        {user.name || "-"}
      </td>
      <td className="px-6 py-4">
        {user.role === "ROLE_ADMIN" ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            <Shield className="w-3 h-3" />
            관리자
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            <User className="w-3 h-3" />
            일반
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {user.provider === "local" ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            이메일
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            Google
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(user.createdAt)}
      </td>
    </tr>
  );
}