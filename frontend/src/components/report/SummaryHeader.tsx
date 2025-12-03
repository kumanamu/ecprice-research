// src/components/report/SummaryHeader.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  platform: string;
  profitKrw: number;
  profitJpy: number;
  lang: "ko" | "jp";
}

export default function SummaryHeader({ platform, profitKrw, profitJpy, lang }: Props) {
  return (
    <div className="p-5 rounded-xl shadow bg-white">
      <div className="text-xl font-bold mb-4">
        {lang === "ko" ? "핵심 요약" : "主要サマリー"}
      </div>

      <div className="flex gap-12">

        <div>
          <div className="text-gray-500 text-sm">Platform</div>
          <div className="font-bold text-lg">{platform}</div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">
            {lang === "ko" ? "수익(KRW)" : "利益(KRW)"}
          </div>
          <div className="font-bold text-lg">
            {profitKrw.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">
            {lang === "ko" ? "수익(JPY)" : "利益(JPY)"}
          </div>
          <div className="font-bold text-lg">
            {profitJpy.toLocaleString()}
          </div>
        </div>

      </div>
    </div>
  );
}
