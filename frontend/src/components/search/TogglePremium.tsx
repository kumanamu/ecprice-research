// src/components/search/TogglePremium.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  type: "basic" | "premium";
  onChange: (v: "basic" | "premium") => void;
}

export default function TogglePremium({ type, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(type === "basic" ? "premium" : "basic")}
      className="px-4 py-2 bg-yellow-200 rounded-lg shadow font-semibold"
    >
      {type === "basic" ? "✨ 프리미엄" : "📘 기본 분석"}
    </button>
  );
}
