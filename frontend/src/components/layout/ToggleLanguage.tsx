import { useLang } from "../../context/LangContext";

export default function ToggleLanguage() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "ko" ? "jp" : "ko")}
      className="px-3 py-1 text-sm font-bold rounded-full border"
    >
      {lang === "ko" ? "日本語" : "한국어"}
    </button>
  );
}
