// src/components/report/AiAnalysisPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { AiMarginAnalysis } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  basicAi: AiMarginAnalysis | null;
  premiumAi: AiMarginAnalysis | null;
}

// ✅ 텍스트 파싱 함수
function parseAiText(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const sections: { type: string; content: string }[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    // 헤더 (### 또는 ────)
    if (trimmed.startsWith("###") || trimmed.startsWith("────")) {
      if (trimmed.startsWith("###")) {
        sections.push({ type: "header", content: trimmed.replace(/^###\s*/, "") });
      }
    }
    // 볼드 텍스트 (**text**)
    else if (trimmed.includes("**")) {
      sections.push({
        type: "bold",
        content: trimmed.replace(/\*\*/g, ""),
      });
    }
    // 리스트 (- text)
    else if (trimmed.startsWith("-")) {
      sections.push({ type: "list", content: trimmed.replace(/^-\s*/, "") });
    }
    // 테이블 행 (| text |)
    else if (trimmed.startsWith("|")) {
      sections.push({ type: "table", content: trimmed });
    }
    // 일반 텍스트
    else if (trimmed) {
      sections.push({ type: "text", content: trimmed });
    }
  });

  return sections;
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

  // ✅ 파싱된 섹션
  const sections = useMemo(() => {
    if (!aiText || aiText === "NEED_RESEARCH") return [];
    return parseAiText(aiText);
  }, [aiText]);

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
      ) : sections.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {sections.map((section, idx) => {
              // 헤더
              if (section.type === "header") {
                return (
                  <div
                    key={`section-${idx}`}
                    className="mt-6 mb-3 pb-2 border-b-2 border-blue-200"
                  >
                    <h3 className="text-lg font-bold text-blue-900">
                      {section.content}
                    </h3>
                  </div>
                );
              }

              // 강조 텍스트
              if (section.type === "bold") {
                return (
                  <div
                    key={`section-${idx}`}
                    className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded"
                  >
                    <p className="font-semibold text-slate-800">
                      {section.content}
                    </p>
                  </div>
                );
              }

              // 리스트
              if (section.type === "list") {
                return (
                  <div
                    key={`section-${idx}`}
                    className="ml-4 flex gap-2 text-sm"
                  >
                    <span className="text-blue-600">•</span>
                    <p className="text-slate-700">{section.content}</p>
                  </div>
                );
              }

              // 테이블
              if (section.type === "table") {
                return (
                  <div
                    key={`section-${idx}`}
                    className="bg-slate-100 px-3 py-2 rounded font-mono text-xs overflow-x-auto"
                  >
                    <pre className="whitespace-pre">{section.content}</pre>
                  </div>
                );
              }

              // 일반 텍스트
              return (
                <div
                  key={`section-${idx}`}
                  className="text-sm text-slate-700 leading-relaxed"
                >
                  <p>{section.content}</p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      ) : null}
    </section>
  );
}