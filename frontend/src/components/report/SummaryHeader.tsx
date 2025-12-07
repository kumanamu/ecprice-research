// src/components/report/SummaryHeader.tsx
import React from "react";
import { useLang } from "../../context/LangContext";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  platformResults: Record<string, PriceInfo>;
}

export default function SummaryHeader({ platformResults }: Props) {
  const { lang } = useLang();

  const platforms = Object.entries(platformResults);

  if (platforms.length === 0) return null;

  return (
    <div className="w-full bg-white border rounded p-4 shadow mb-4">
      <h2 className="text-xl font-bold mb-2">
        {lang === "jp" ? "プラットフォームの比較結果" : "플랫폼 비교 결과"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {platforms.map(([platform, info]) => (
          <div key={platform} className="flex flex-col">
            <span className="font-semibold">{platform}</span>
            <span className="text-sm text-gray-600">
              {info?.productName ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
