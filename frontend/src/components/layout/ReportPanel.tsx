// src/components/layout/ReportPanel.tsx

import type { MarginResponse, PriceInfo } from "../../types/marginTypes";
import SummaryHeader from "../report/SummaryHeader";
import KeyMetricsSection from "../report/KeyMetricsSection";
import ChartsSection from "../report/ChartsSection";
import AiAnalysisPanel from "../report/AiAnalysisPanel";

export type ReportStage =
  | "idle"
  | "prices"
  | "basic-ai"
  | "premium-ai";

interface Props {
  stage: ReportStage;
  result: MarginResponse | null;
  prices: { [platform: string]: PriceInfo } | null;
  lang: "ko" | "jp";
}

export default function ReportPanel({
  stage,
  result,
  prices,
  lang,
}: Props) {
  if (!result) return null;

  return (
    <section className="space-y-6">
      {/* 1️⃣ 핵심 요약 */}
      <SummaryHeader result={result} />

      {/* 2️⃣ KPI + 차트 (가격 수집 이후) */}
      {prices && (
        <>
          <KeyMetricsSection
            platform={result.bestPlatform}
            profitKrw={result.profitKrw ?? 0}
            profitJpy={result.profitJpy ?? 0}
            lang={lang}
          />

          <ChartsSection prices={prices} lang={lang} />
        </>
      )}

      {/* 3️⃣ AI 기본 분석 */}
      {(stage === "basic-ai" || stage === "premium-ai") && (
        <AiAnalysisPanel result={result} mode="basic" />
      )}

      {/* 4️⃣ AI 프리미엄 분석 */}
      {stage === "premium-ai" && (
        <AiAnalysisPanel result={result} mode="premium" />
      )}
    </section>
  );
}
