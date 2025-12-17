// src/components/search/ToggleLanguage.tsx
import React from "react";
import { useLang } from "../../context/LangContext";
import { t } from "../../utils/t";

export default function ToggleLanguage() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang("ko")}
        className={`px-3 py-1 text-sm font-bold rounded-full border transition
          ${
            lang === "ko"
              ? "bg-primary text-white border-primary"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
          }`}
      >
        {t("korean", lang)}
      </button>

      <button
        onClick={() => setLang("jp")}
        className={`px-3 py-1 text-sm font-bold rounded-full border transition
          ${
            lang === "jp"
              ? "bg-primary text-white border-primary"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
          }`}
      >
        {t("japanese", lang)}
      </button>
    </div>
  );
}
