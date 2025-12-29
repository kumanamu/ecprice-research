// src/components/report/AiAnalysisPanel.tsx
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import type { AiMarginAnalysis } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  basicAi: AiMarginAnalysis | null;
  premiumAi: AiMarginAnalysis | null;
}

export default function AiAnalysisPanel({ basicAi, premiumAi }: Props) {
  const { lang } = useLang();
  const [mode, setMode] = useState<"basic" | "premium">("basic");

  const aiText = useMemo(() => {
    const analysis = mode === "basic" ? basicAi : premiumAi;
    if (!analysis) return null;
    return lang === "ko" ? analysis.textKo : analysis.textJp;
  }, [basicAi, premiumAi, mode, lang]);

  // ✅ Basic AI도 없으면 아무것도 표시 안 함
  if (!basicAi) {
    return null;
  }

  // ✅ Premium 로딩 중
  const isPremiumLoading = basicAi && !premiumAi && mode === "premium";

  return (
    <section className="mt-10">
      {/* 토글 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black">
          {lang === "ko" ? "AI 분석 결과" : "AI分析結果"}
        </h2>

        {/* Basic / Premium 토글 */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("basic")}
            className={
              "px-4 py-2 rounded-lg font-medium transition " +
              (mode === "basic"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
            }
          >
            {lang === "ko" ? "기본 분석" : "基本分析"}
          </button>
          <button
            onClick={() => setMode("premium")}
            className={
              "px-4 py-2 rounded-lg font-medium transition " +
              (mode === "premium"
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
            }
            disabled={!premiumAi}
          >
            {lang === "ko" ? "프리미엄 분석" : "プレミアム分析"}
            {!premiumAi && " ⏳"}
          </button>
        </div>
      </div>

      {/* ✅ Premium 로딩 중 */}
      {isPremiumLoading ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-700">
            {lang === "ko"
              ? "🔄 프리미엄 분석을 생성 중입니다..."
              : "🔄 プレミアム分析を生成中です..."}
          </p>
        </div>
      ) : aiText ? (
        <>
          {/* 핵심 요약 */}
          <motion.div
            key={`${mode}-${lang}-summary`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-white p-5 mb-4"
          >
            <p className="text-sm text-slate-500 mb-1">
              {lang === "ko" ? "핵심 판단" : "要点判断"}
            </p>
            <p className="font-semibold whitespace-pre-line">
              {aiText.split(/\r?\n{1,}/)[0]}
            </p>
          </motion.div>

          {/* 상세 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiText
              .split(/\r?\n{1,}/)
              .slice(1)
              .filter(Boolean)
              .map((text, idx) => (
                <motion.div
                  key={`${mode}-${lang}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border bg-slate-50 p-4"
                >
                  <p className="text-sm whitespace-pre-line">{text}</p>
                </motion.div>
              ))}
          </div>
        </>
      ) : null}
    </section>
  );
}