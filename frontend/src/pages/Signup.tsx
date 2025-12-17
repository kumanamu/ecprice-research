// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { publicApi } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await publicApi.post("/api/auth/signup", { email, password });
      await login(email, password);
      navigate("/home", { replace: true });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) {
        setError("이미 존재하는 이메일입니다.");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-white px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm pt-12 space-y-5"
      >
        <h1 className="text-center text-xl font-bold">회원가입</h1>

        <input
          className="w-full rounded-lg border px-4 py-3 bg-blue-50"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full rounded-lg border px-4 py-3 bg-blue-50"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full rounded-lg border px-4 py-3 bg-blue-50"
          placeholder="비밀번호를 다시 입력하세요"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>

        <Link
          to="/login"
          className="block text-center text-sm text-blue-600"
        >
          로그인으로 돌아가기
        </Link>
      </form>
    </div>
  );
}
