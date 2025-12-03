// src/components/ai/BasicReport.tsx
import React from "react";
import SummaryHeader from "../report/SummaryHeader";
import PriceTable from "../report/PriceTable";
import AIRecommendationCard from "../report/AIRecommendationCard";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  data: MarginResponse;
  lang: "ko" | "jp";
}

export default function BasicReport({ data, lang }: Props) {
  const prices = data.platformPrices ?? {};
  const platform = data.bestPlatform ?? "-";
  const profitKrw = data.profitKrw ?? 0;
  const profitJpy = data.profitJpy ?? 0;
  const basicText = data.basicAi?.text ?? "";

  return (
    <div className="flex flex-col gap-10 w-full mt-8">

      <SummaryHeader
        platform={platform}
        profitKrw={profitKrw}
        profitJpy={profitJpy}
        lang={lang}
      />

      <PriceTable prices={prices} lang={lang} />

      <AIRecommendationCard
        basicText={basicText}
        type="basic"
        lang={lang}
      />
    </div>
  );
}
