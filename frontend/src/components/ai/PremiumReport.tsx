// src/components/ai/PremiumReport.tsx
import React from "react";
import SummaryHeader from "../report/SummaryHeader";
import ChartsSection from "../report/ChartsSection";
import PriceTable from "../report/PriceTable";
import KeyMetricsSection from "../report/KeyMetricsSection";
import AIRecommendationCard from "../report/AIRecommendationCard";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  data: MarginResponse;
  lang: "ko" | "jp";
}

export default function PremiumReport({ data, lang }: Props) {
  if (!data) return null;

  const prices = data.platformPrices ?? {};
  const platform = data.bestPlatform ?? "-";
  const profitKrw = data.profitKrw ?? 0;
  const profitJpy = data.profitJpy ?? 0;

  return (
    <div className="flex flex-col gap-10 w-full mt-8">

      <SummaryHeader
        platform={platform}
        profitKrw={profitKrw}
        profitJpy={profitJpy}
        lang={lang}
      />

      <ChartsSection prices={prices} lang={lang} />

      <PriceTable prices={prices} lang={lang} />

      <KeyMetricsSection
        platform={platform}
        profitKrw={profitKrw}
        profitJpy={profitJpy}
        lang={lang}
      />

      <AIRecommendationCard
        basicText={data.basicAi?.text ?? ""}
        premiumText={data.premiumAi?.text ?? ""}
        type="premium"
        lang={lang}
      />
    </div>
  );
}
