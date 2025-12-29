import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { t } from "../utils/t";

export default function Signup() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw1 !== pw2) {
      setError("비밀번호 불일치");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({ email, password: pw1 });
      await login(email, pw1);
      navigate("/home", { replace: true });
    } catch {
      setError("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto pt-20 space-y-5">
      <h1 className="text-xl font-bold text-center">{t("signupTitle", lang)}</h1>

      <input
        placeholder={t("email", lang)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg"
      />

      <input
        type="password"
        placeholder={t("password", lang)}
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg"
      />

      <input
        type="password"
        placeholder={t("password", lang)}
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
        {loading ? t("signupLoading", lang) : t("signup", lang)}
      </button>

      <Link to="/login" className="block text-center text-sm text-blue-600">
        {t("backToLogin", lang)}
      </Link>
    </form>
  );
}
