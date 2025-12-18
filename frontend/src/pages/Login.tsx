import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/home", { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;

        if (status === 401) {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-white px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm pt-16 space-y-6">
        <h1 className="text-center text-xl font-bold">로그인</h1>

        <div>
          <label className="block mb-1 text-sm font-medium">이메일</label>
          <input
            className="w-full rounded-lg border px-4 py-3 bg-blue-50"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">비밀번호</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className="w-full rounded-lg border px-4 py-3 bg-blue-50 pr-10"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              👁
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          또는
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Link
          to="/signup"
          className="block w-full text-center border py-3 rounded-lg text-blue-600 font-semibold"
        >
          회원가입
        </Link>
      </form>
    </div>
  );
}