// src/components/report/AiAnalysisPanel.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import type { MarginResponse } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  result: MarginResponse;
}

export default function AiAnalysisPanel({ result }: Props) {
  const { lang } = useLang();
  const [mode, setMode] = useState<"basic" | "premium">("basic");

  const analysis =
    mode === "basic"
      ? lang === "jp"
        ? result.basicAi?.textJp
        : result.basicAi?.textKo
      : lang === "jp"
      ? result.premiumAi?.textJp
      : result.premiumAi?.textKo;

  if (!analysis) return null;

  /* ---------- 텍스트 파싱 ---------- */
  const blocks = analysis
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const summary = blocks[0];
  const details = blocks.slice(1);

  return (
    <section className="mt-10">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black tracking-tight">
          {lang === "ko" ? "AI 분석 리포트" : "AI分析レポート"}
        </h2>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border bg-white overflow-hidden text-sm font-bold">
          <button
            className={`px-4 py-2 ${
              mode === "basic"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            onClick={() => setMode("basic")}
          >
            BASIC
          </button>
          <button
            className={`px-4 py-2 ${
              mode === "premium"
                ? "bg-amber-500 text-black"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            onClick={() => setMode("premium")}
          >
            PREMIUM
          </button>
        </div>
      </div>

      {/* ===== Summary Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border bg-white p-5 mb-4"
      >
        <p className="text-sm text-slate-500 mb-1">
          {lang === "ko" ? "핵심 판단" : "要点判断"}
        </p>
        <p className="text-base font-semibold leading-relaxed">
          {summary}
        </p>
      </motion.div>

      {/* ===== Detail Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((text, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="rounded-xl border bg-slate-50 p-4"
          >
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ===== Footer Hint ===== */}
      <div className="mt-4 text-xs text-slate-400">
        {lang === "ko"
          ? "※ 본 분석은 환율·배송·상품 매칭 결과를 기준으로 생성된 참고용 리포트입니다."
          : "※ 本分析は為替・送料・商品マッチング結果に基づく参考レポートです。"}
      </div>
    </section>
  );
}
