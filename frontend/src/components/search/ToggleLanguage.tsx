// src/components/search/ToggleLanguage.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  lang: "ko" | "jp";
  onChange: (v: "ko" | "jp") => void;
}

export default function ToggleLanguage({ lang, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(lang === "ko" ? "jp" : "ko")}
      className="px-4 py-2 bg-gray-200 rounded-lg shadow"
    >
      {lang === "ko" ? "🇰🇷 한국어" : "🇯🇵 日本語"}
    </button>
  );
}
