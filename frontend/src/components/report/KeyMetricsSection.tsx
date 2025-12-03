// src/components/report/KeyMetricsSection.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";
interface Props {
  platform: string;
  profitKrw: number;
  profitJpy: number;
  lang: "ko" | "jp";
}

export default function KeyMetricsSection({ platform, profitKrw, profitJpy, lang }: Props) {
  return (
    <div className="p-5 rounded-xl shadow bg-white">
      <div className="font-bold text-lg mb-3">
        {lang === "ko" ? "핵심 지표" : "主要指標"}
      </div>

      <ul className="list-disc ml-5 text-gray-700">
        <li>
          {lang === "ko" ? "최적 플랫폼" : "最適プラットフォーム"}:{" "}
          <b>{platform}</b>
        </li>

        <li>
          {lang === "ko" ? "예상 이익 (KRW)" : "予想利益 (KRW)"}:{" "}
          {profitKrw.toLocaleString()}
        </li>

        <li>
          {lang === "ko" ? "予想利益 (JPY)" : "예상 이익 (JPY)"}:{" "}
          {profitJpy.toLocaleString()}
        </li>
      </ul>
    </div>
  );
}
