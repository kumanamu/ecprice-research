import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { t } from "../utils/t";
import api from "../api/axios";
import { AxiosError } from "axios";

export default function Login() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔑 로그인 시도:", email);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ 백엔드 응답:", response.data);

      const accessToken = response.data.accessToken || response.data.token || response.data.access_token;
      const userEmail = response.data.email || email;
      const role = response.data.role || "ROLE_USER";

      console.log("🔑 추출한 토큰:", accessToken);
      console.log("👤 유저 정보:", { email: userEmail, role });

      if (!accessToken) {
        throw new Error("토큰이 응답에 없습니다");
      }

      login(accessToken, { email: userEmail, role });

      // 역할에 따라 다른 페이지로 이동
      if (role === "ROLE_ADMIN") {
        console.log("✅ 관리자 로그인 완료, /admin으로 이동");
        navigate("/admin", { replace: true });
      } else {
        console.log("✅ 일반 사용자 로그인 완료, /home으로 이동");
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error("❌ 로그인 에러:", err);

      if (err instanceof AxiosError) {
        console.error("❌ 에러 응답:", err.response?.data);
        setError(
          lang === "ko"
            ? `로그인 실패: ${err.response?.data?.message || err.message}`
            : `ログイン失敗: ${err.response?.data?.message || err.message}`
        );
      } else if (err instanceof Error) {
        setError(
          lang === "ko"
            ? `로그인 실패: ${err.message}`
            : `ログイン失敗: ${err.message}`
        );
      } else {
        setError(
          lang === "ko"
            ? "로그인 실패: 알 수 없는 오류"
            : "ログイン失敗: 不明なエラー"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm md:max-w-md mx-auto px-4 md:px-0 pt-10 md:pt-20 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-center">{t("loginTitle", lang)}</h1>

      <input
        placeholder={t("email", lang)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2.5 md:py-3 border rounded-lg text-base"
      />

      <input
        type="password"
        placeholder={t("password", lang)}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2.5 md:py-3 border rounded-lg text-base"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg disabled:opacity-50 text-base md:text-lg font-medium"
      >
        {loading ? t("loginLoading", lang) : t("login", lang)}
      </button>

      <div className="text-center text-sm md:text-base">{t("or", lang)}</div>

      <Link to="/signup" className="block text-center text-blue-600 text-sm md:text-base">
        {t("signup", lang)}
      </Link>
    </form>
  );
}