// src/components/drawers/PremiumAnalysisDrawer.tsx
import type { MarginResponse } from "../../types/marginTypes";

import KeyMetricsSection from "../report/KeyMetricsSection";
import ChartsSection from "../report/ChartsSection";

interface Props {
  result: MarginResponse;
  lang: "ko" | "jp";
}

export default function PremiumAnalysisDrawer({ result, lang }: Props) {
  const text =
    lang === "jp"
      ? result.premiumAi.textJp
      : result.premiumAi.textKo;

  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🌟</span>
        <h3 className="text-lg font-semibold">Premium 분석</h3>
      </div>

      {/* KPI 요약 */}
      <KeyMetricsSection
        platform={result.bestPlatform}
        profitKrw={result.profitKrw}
        profitJpy={result.profitJpy}
        lang={lang}
      />

      {/* 차트 영역 */}
      <ChartsSection
        prices={result.platformPrices}
        lang={lang}
      />

      {/* 테이블 영역 (mock 유지) */}
      {/* <PlatformDetailTableMock /> */}

      {/* AI 텍스트 */}
      <div className="rounded-xl bg-white border p-4">
        <h4 className="text-sm font-semibold mb-2">AI 종합 분석</h4>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {text}
        </p>
      </div>
    </section>
  );
}
