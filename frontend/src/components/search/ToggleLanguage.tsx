// src/search/ToggleLanguage.tsx
import React from "react";
import { useLang } from "../../context/LangContext";

export default function ToggleLanguage() {
  const { lang, setLang } = useLang();

  const toggle = () => {
    setLang(lang === "jp" ? "ko" : "jp");
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 border rounded-lg bg-white shadow text-sm"
    >
      {lang === "jp" ? "한국어 / 日本語" : "日本語 / 한국어"}
    </button>
  );
}
