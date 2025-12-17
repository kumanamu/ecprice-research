import { useLocation } from "react-router-dom";
import { useLang } from "../../context/LangContext";

export default function AppHeader() {
  const location = useLocation();
  const { lang, setLang } = useLang();

  // 로그인 / 회원가입 페이지에서는 숨김
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  if (hideHeader) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* 로고 */}
        <div className="font-black text-lg tracking-tight">
          EC Price Research
        </div>

        {/* 🌐 언어 토글 (정답 UX) */}
        <button
          onClick={() => setLang(lang === "ko" ? "jp" : "ko")}
          className="px-4 py-1.5 text-sm font-bold rounded-full border
                     bg-white text-slate-700 border-slate-300
                     hover:bg-slate-100 transition"
        >
          {lang === "ko" ? "日本語" : "한국어"}
        </button>
      </div>
    </header>
  );
}
