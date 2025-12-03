import React from "react";
import SummaryHeader from "../report/SummaryHeader";
import ChartsSection from "../report/ChartsSection";
import PriceTable from "../report/PriceTable";
import KeyMetricsSection from "../report/KeyMetricsSection";
import AIRecommendationCard from "../report/AiRecommendationCard";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";


interface Props {
  data: MarginResponse;
  lang: "ko" | "jp";
  type: "basic" | "premium";
  step: string;
}

export default function ReportPanel({ data, lang, type, step }: Props) {
  const platform = data.bestPlatform;
  const prices = data.platformPrices;
  const profitKrw = data.profitKrw;
  const profitJpy = data.profitJpy;

  return (
    <div className="flex flex-col gap-10 w-full mt-8">

      {/* STEP 1 - 가격 데이터 */}
      {step === "step1" || step === "done" ? (
        <PriceTable prices={prices} lang={lang} />
      ) : (
        <div>Loading step1...</div>
      )}

      {/* STEP 2 - 요약 + 차트 */}
      {step === "step2" || step === "done" ? (
        <>
          <SummaryHeader
            platform={platform}
            profitKrw={profitKrw}
            profitJpy={profitJpy}
            lang={lang}
          />

          <ChartsSection prices={prices} lang={lang} />

          <KeyMetricsSection
            platform={platform}
            profitKrw={profitKrw}
            profitJpy={profitJpy}
            lang={lang}
          />
        </>
      ) : (
        <div>Loading step2...</div>
      )}

      {/* STEP 3 - AI 분석 */}
      {step === "step3" || step === "done" ? (
        <AIRecommendationCard
          basicText={data.basicAi.text}
          premiumText={data.premiumAi.text}
          type={type}
          lang={lang}
        />
      ) : (
        <div>Loading step3...</div>
      )}
    </div>
  );
}
