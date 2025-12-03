import React, { useState } from "react";
import SearchBar from "../components/search/SearchBar";
import ToggleLanguage from "../components/search/ToggleLanguage";
import TogglePremium from "../components/search/TogglePremium";
import ReportPanel from "../components/layout/ReportPanel";


import { getMarginResult } from "../api/marginapi";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../types/marginTypes";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [lang, setLang] = useState<"ko" | "jp">("ko");
  const [type, setType] = useState<"basic" | "premium">("basic");

  const [step, setStep] = useState<"" | "step1" | "step2" | "step3">("");
  const [result, setResult] = useState<MarginResponse | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert(lang === "ko" ? "검색어를 입력하세요." : "検索ワードを入力してください。");
      return;
    }

    setStep("step1");
    setResult(null);

    try {
      const res = await getMarginResult(keyword, lang);

      setTimeout(() => setStep("step2"), 300);
      setTimeout(() => setStep("step3"), 600);

      setResult(res);
    } catch (err) {
      console.error(err);
      alert(lang === "ko" ? "검색 실패!" : "検索失敗！");
      setStep("");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* 검색바 */}
      <SearchBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        lang={lang}
      />

      {/* 언어 + 프리미엄 */}
      <div className="flex gap-4">
        <ToggleLanguage lang={lang} onChange={setLang} />
        <TogglePremium type={type} onChange={setType} />
      </div>

      {/* 로딩 상태 */}
      {step && (
        <div className="bg-gray-100 p-4 rounded text-center animate-pulse shadow">
          {step === "step1" && (lang === "ko" ? "🔍 초기 요청 중..." : "初期リクエスト中...")}
          {step === "step2" && (lang === "ko" ? "📦 가격 데이터 준비 중..." : "価格データ準備中...")}
          {step === "step3" && (lang === "ko" ? "🤖 AI 분석 준비 중..." : "AI分析準備中...")}
        </div>
      )}

      {/* 분석 결과 */}
      {result && (
        <ReportPanel
          data={result}
          type={type}
          lang={lang}
          step={step}
        />
      )}
    </div>
  );
}
