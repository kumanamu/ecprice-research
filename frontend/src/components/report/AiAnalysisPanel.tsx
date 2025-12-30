// src/components/report/AiAnalysisPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { AiMarginAnalysis } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Percent
} from "lucide-react";

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

  // 현재 분석 데이터
  const analysis = mode === "basic" ? basicAi : premiumAi;

  // 결론 판단 (profitKrw 기반)
  const getDecision = (profit: number) => {
    if (profit <= 0) return "NO_GO";
    if (profit < 10000) return "MAYBE";
    if (profit < 50000) return "GO";
    return "STRONG_GO";
  };

  const decision = analysis ? getDecision(analysis.profitKrw) : "NO_GO";

  return (
    <section className="mt-10">
      {/* ========================================= */}
      {/* 헤더 - 모드 토글 */}
      {/* ========================================= */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">
          {lang === "ko" ? "🤖 AI 분석 결과" : "🤖 AI分析結果"}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("basic")}
            className={
              "px-4 py-2 rounded-lg font-medium transition " +
              (mode === "basic"
                ? "bg-blue-600 text-white shadow-lg"
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
                ? "bg-purple-600 text-white shadow-lg"
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-blue-700 font-medium">
            {lang === "ko"
              ? "📄 프리미엄 분석을 생성 중입니다..."
              : "📄 プレミアム分析を生成中です..."}
          </p>
        </div>
      ) : aiText && analysis ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ========================================= */}
              {/* 1️⃣ 결론 카드 (큼직하게) */}
              {/* ========================================= */}
              <DecisionCard
                decision={decision}
                profit={analysis.profitKrw}
                rate={analysis.profitRate}
                lang={lang}
              />

              {/* ========================================= */}
              {/* 2️⃣ 수익 메트릭 */}
              {/* ========================================= */}
              <ProfitMetrics
                profitKrw={analysis.profitKrw}
                profitRate={analysis.profitRate}
                buyPlatform={analysis.buyPlatform}
                sellPlatform={analysis.sellPlatform}
                lang={lang}
              />

              {/* ========================================= */}
              {/* 3️⃣ AI 상세 텍스트 (기존 개선) */}
              {/* ========================================= */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-700">
                  {lang === "ko" ? "📋 상세 분석" : "📋 詳細分析"}
                </h3>

                {/* 핵심 판단 */}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    {lang === "ko" ? "핵심 판단" : "要点判断"}
                  </p>
                  <p className="font-medium text-slate-800 whitespace-pre-line leading-relaxed">
                    {aiText.split(/\r?\n{2,}/)[0]}
                  </p>
                </div>

                {/* 상세 분석 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiText
                    .split(/\r?\n{2,}/)
                    .slice(1)
                    .filter(Boolean)
                    .map((text, idx) => (
                      <div
                        key={`detail-${idx}`}
                        className="rounded-xl border bg-white p-5 hover:shadow-md transition"
                      >
                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                </div>
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

// =========================================
// 🎯 결론 카드 컴포넌트
// =========================================
function DecisionCard({
  decision,
  profit,
  rate,
  lang,
}: {
  decision: string;
  profit: number;
  rate: number;
  lang: "ko" | "jp";
}) {
  const config = {
    STRONG_GO: {
      bg: "bg-gradient-to-br from-green-500 to-emerald-600",
      icon: CheckCircle,
      text: lang === "ko" ? "강력 추천 💎" : "強く推奨 💎",
      desc: lang === "ko" ? "높은 수익성 확인" : "高い収益性確認",
    },
    GO: {
      bg: "bg-gradient-to-br from-blue-500 to-cyan-600",
      icon: CheckCircle,
      text: lang === "ko" ? "수익 가능 ✅" : "収益可能 ✅",
      desc: lang === "ko" ? "진입 추천" : "進入推奨",
    },
    MAYBE: {
      bg: "bg-gradient-to-br from-yellow-500 to-orange-500",
      icon: AlertCircle,
      text: lang === "ko" ? "수익 애매함 ⚠️" : "収益微妙 ⚠️",
      desc: lang === "ko" ? "신중 검토 필요" : "慎重検討必要",
    },
    NO_GO: {
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      icon: XCircle,
      text: lang === "ko" ? "수익 불가 ❌" : "収益不可 ❌",
      desc: lang === "ko" ? "진입 비추천" : "進入非推奨",
    },
  };

  const { bg, icon: Icon, text, desc } = config[decision as keyof typeof config];

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className={`${bg} text-white rounded-2xl p-8 shadow-2xl mb-6`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Icon className="w-16 h-16" strokeWidth={2.5} />
        <div>
          <h3 className="text-3xl font-black">{text}</h3>
          <p className="text-lg opacity-90">{desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/30">
        <div>
          <p className="text-sm opacity-80 mb-1">
            {lang === "ko" ? "예상 수익" : "予想収益"}
          </p>
          <p className="text-2xl font-bold">
            {profit > 0 ? `+${profit.toLocaleString()}` : profit.toLocaleString()}{" "}
            {lang === "ko" ? "원" : "ウォン"}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-80 mb-1">
            {lang === "ko" ? "마진율" : "マージン率"}
          </p>
          <p className="text-2xl font-bold">{rate.toFixed(1)}%</p>
        </div>
      </div>
    </motion.div>
  );
}

// =========================================
// 💰 수익 메트릭 컴포넌트
// =========================================
function ProfitMetrics({
  profitKrw,
  profitRate,
  buyPlatform,
  sellPlatform,
  lang,
}: {
  profitKrw: number;
  profitRate: number;
  buyPlatform: string;
  sellPlatform: string;
  lang: "ko" | "jp";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 수익 금액 */}
      <div className="bg-white rounded-xl border-2 border-green-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {lang === "ko" ? "예상 수익" : "予想収益"}
            </p>
            <p className="text-2xl font-black text-green-600">
              {profitKrw > 0 ? "+" : ""}
              {profitKrw.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {lang === "ko" ? "원 (KRW)" : "ウォン (KRW)"}
        </p>
      </div>

      {/* 마진율 */}
      <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Percent className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {lang === "ko" ? "마진율" : "マージン率"}
            </p>
            <p className="text-2xl font-black text-blue-600">
              {profitRate.toFixed(1)}%
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {lang === "ko" ? "수익률" : "収益率"}
        </p>
      </div>

      {/* 거래 플랫폼 */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {lang === "ko" ? "거래 경로" : "取引経路"}
            </p>
            <p className="text-sm font-bold text-purple-600">
              {buyPlatform.toUpperCase()} → {sellPlatform.toUpperCase()}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {lang === "ko" ? "구매 → 판매" : "購入 → 販売"}
        </p>
      </div>
    </div>
  );
}