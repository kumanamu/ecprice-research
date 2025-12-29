// src/components/layout/AppHeader.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { t } from "../../utils/t";
import ToggleLanguage from "./ToggleLanguage";

export default function AppHeader() {
  const { lang } = useLang();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="font-black text-lg">
          EC Price Research
        </Link>

        {/* 우측 영역 */}
        <div className="flex items-center gap-4">
          {/* 언어 토글 */}
          <ToggleLanguage />

          {/* 인증 메뉴 */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-sm font-semibold hover:underline"
            >
              {t("logout", lang)}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold hover:underline"
              >
                {t("login", lang)}
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold hover:underline"
              >
                {t("signup", lang)}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
