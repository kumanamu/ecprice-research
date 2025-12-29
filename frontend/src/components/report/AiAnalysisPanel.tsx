// src/components/report/AiAnalysisPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
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

  // ✅ 현재 언어의 텍스트 추출
  const aiText = useMemo(() => {
    const analysis = mode === "basic" ? basicAi : premiumAi;
    if (!analysis) return null;

    const text = lang === "ko" ? analysis.textKo : analysis.textJp;

    // ✅ 다른 언어로 토글된 경우
    if (!text) {
      return "NEED_RESEARCH";
    }

    return text;
  }, [basicAi, premiumAi, mode, lang]);

  if (!basicAi) return null;

  // ✅ 재검색 필요
  if (aiText === "NEED_RESEARCH") {
    return (
      <section className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-lg font-semibold mb-3">
          {lang === "ko"
            ? "🔄 언어가 변경되었습니다"
            : "🔄 言語が変更されました"}
        </p>
        <p className="text-sm text-slate-600 mb-4">
          {lang === "ko"
            ? "선택한 언어로 AI 분석을 다시 검색해주세요."
            : "選択した言語でAI分析を再検索してください。"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {lang === "ko" ? "다시 검색하기" : "再検索する"}
        </button>
      </section>
    );
  }

  const isPremiumLoading = basicAi && !premiumAi && mode === "premium";

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black">
          {lang === "ko" ? "🤖 AI 분석 결과" : "🤖 AI分析結果"}
        </h2>

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
            {lang === "ko" ? "⚡ 빠른 분석" : "⚡ 簡易分析"}
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
            {lang === "ko" ? "💎 상세 전략" : "💎 詳細戦略"}
            {!premiumAi && " ⏳"}
          </button>
        </div>
      </div>

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
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* 핵심 판단 */}
              <div className="rounded-xl border bg-white p-5 mb-4">
                <p className="text-sm text-slate-500 mb-1">
                  {lang === "ko" ? "핵심 판단" : "要点判断"}
                </p>
                <p className="font-semibold whitespace-pre-line">
                  {aiText.split(/\r?\n{1,}/)[0]}
                </p>
              </div>

              {/* 상세 분석 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiText
                  .split(/\r?\n{1,}/)
                  .slice(1)
                  .filter(Boolean)
                  .map((text, idx) => (
                    <div
                      key={`detail-${idx}`}
                      className="rounded-xl border bg-slate-50 p-4"
                    >
                      <p className="text-sm whitespace-pre-line">{text}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ⚠️ 면책 조항 UI */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-5 bg-yellow-50 border-2 border-yellow-300 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-900 mb-3">
                  {lang === "ko" ? "면책 조항" : "免責事項"}
                </p>
                <ul className="text-xs text-yellow-800 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {lang === "ko"
                        ? "이 분석은 추정치 기반이며, 실제 비용과 20-30% 차이날 수 있습니다."
                        : "この分析は推定値ベースであり、実際のコストとは20-30%異なる場合があります。"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {lang === "ko"
                        ? "실제 거래 전 반드시 다음을 직접 확인하세요: 정확한 상품 무게/부피, 실제 배송비 견적, HSCODE 및 관세율, 플랫폼 최신 정책"
                        : "実際の取引前に必ず次を直接確認してください：正確な商品重量/体積、実際の送料見積もり、HSコードおよび関税率、プラットフォームの最新ポリシー"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>
                      {lang === "ko"
                        ? "환율 변동, 정책 변경, 시장 상황에 따라 수익성이 크게 달라질 수 있습니다."
                        : "為替レート変動、政策変更、市場状況により収益性が大きく変わる可能性があります。"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 font-bold">•</span>
                    <span className="font-bold">
                      {lang === "ko"
                        ? "최종 투자 판단과 그 결과에 대한 책임은 사용자에게 있습니다."
                        : "最終的な投資判断とその結果に対する責任はユーザーにあります。"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </section>
  );
}