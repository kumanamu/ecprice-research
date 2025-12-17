// src/components/drawers/BasicAnalysisDrawer.tsx
import type { MarginResponse } from "../../types/marginTypes";

interface Props {
  result: MarginResponse;
  lang: "ko" | "jp";
}

export default function BasicAnalysisDrawer({ result, lang }: Props) {
  const text =
    lang === "jp"
      ? result.basicAi.textJp
      : result.basicAi.textKo;

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
          📌
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold leading-tight">
            {lang === "jp" ? "Basic AI 分析" : "Basic AI 분석"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "jp"
              ? "要点を簡潔にまとめた分析結果です"
              : "핵심만 요약한 AI 분석 결과입니다"}
          </p>
        </div>
      </div>

      {/* Analysis Card */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {text}
        </p>
      </div>

      {/* Footer Hint */}
      <div className="text-xs text-gray-400">
        {lang === "jp"
          ? "※ より詳細な分析は Premium モードで確認できます"
          : "※ 더 자세한 분석은 Premium 모드에서 확인할 수 있습니다"}
      </div>
    </section>
  );
}
