// src/components/report/AIRecommendationCard.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  basicText: string;
  premiumText?: string;     // premium 모드일 때만 존재
  type: "basic" | "premium";
  lang: "ko" | "jp";
}

export default function AIRecommendationCard({ basicText, premiumText, type, lang }: Props) {
  const title =
    lang === "ko"
      ? type === "basic"
        ? "AI 기본 분석 요약"
        : "AI 프리미엄 심층 분석"
      : type === "basic"
      ? "AI基本分析サマリー"
      : "AIプレミアム詳細分析";

  const content = type === "basic" ? basicText : premiumText ?? "";

  return (
    <div className="p-5 rounded-xl shadow bg-white mt-6">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-700">
        {content || (lang === "ko" ? "AI 분석 준비중..." : "AI分析準備中...")}
      </pre>
    </div>
  );
}
