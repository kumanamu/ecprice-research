import React from "react";
import { useLang } from "../../context/LangContext";
import { t } from "../../utils/t";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function HomeHeroRaw({
  keyword,
  onKeywordChange,
  onSearch,
  loading = false,
}: Props) {
  const { lang } = useLang();

  const canSearch = keyword.trim().length > 0 && !loading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canSearch) {
      onSearch();
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-20">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow">
        🤖 {lang === "ko" ? "AI 분석 준비중..." : "AI分析準備中..."}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-black text-center leading-tight">
        {lang === "ko"
          ? "글로벌 마켓 상품 분석,"
          : "グローバル市場の商品分析、"}
        <br />
        <span className="text-primary">
          {lang === "ko"
            ? "AI로 더 정확하고 빠르게"
            : "AIでもっと正確・高速に"}
        </span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-center text-slate-600 max-w-xl">
        {lang === "ko"
          ? "라쿠텐, 네이버, 아마존재팬, 쿠팡의 가격과 마진을 한눈에 비교하세요."
          : "楽天・Naver・Amazon Japan・Coupangの価格とマージンを一目で比較。"}
      </p>

      {/* Search Box */}
      <div className="mt-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border p-3 flex gap-2">
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("searchPlaceholder", lang)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          disabled={!canSearch}
          onClick={onSearch}
          className={`px-6 py-3 rounded-xl font-bold transition
            ${
              canSearch
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {loading
            ? lang === "ko"
              ? "분석 중..."
              : "分析中..."
            : t("search", lang)}
        </button>
      </div>
    </section>
  );
}
