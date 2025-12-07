// src/components/report/KeyMetricsSection.tsx
import React from "react";
import { t } from "../../utils/t";

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
        {t("keyMetrics", lang)}
      </div>

      <ul className="list-disc ml-5 text-gray-700">
        <li>
          {t("bestPlatform", lang)}: <b>{platform}</b>
        </li>

        <li>
          {t("expectedProfitKrw", lang)}: {profitKrw.toLocaleString()}
        </li>

        <li>
          {t("expectedProfitJpy", lang)}: {profitJpy.toLocaleString()}
        </li>
      </ul>
    </div>
  );
}