import React from "react";
import { t } from "../../utils/t";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: "ko" | "jp";
}

export default function SearchHero({
  keyword,
  onKeywordChange,
  onSearch,
  lang,
}: Props) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center text-center gap-8 mb-12">
      {/* 🔥 Hero Text */}
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm mb-2">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          AI 실시간 분석 엔진 가동 중
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          글로벌 마켓 상품 분석,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            AI로 더 정확하고 빠르게
          </span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          라쿠텐, 네이버, 아마존재팬, 쿠팡의 가격 및 마진을 한눈에 비교하세요.
          <br className="hidden sm:block" />
          복잡한 데이터 분석은 AI에게 맡기고, 판매 전략에만 집중하세요.
        </p>
      </div>

      {/* 🔍 Search Area */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 p-2 md:p-3 mt-4 transition-all hover:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>

            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder={t("searchPlaceholder", lang)}
              className="block w-full h-14 pl-12 pr-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder-slate-400 text-lg transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="h-14 px-8 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 min-w-[160px]"
          >
            <span className="material-symbols-outlined text-[20px]">
              auto_awesome
            </span>
            <span>{t("search", lang)}</span>
          </button>
        </div>

        {/* 🧱 Platform Select (UI only) */}
        <div className="mt-4 px-2 pb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-left pl-1">
            분석 대상 플랫폼 선택
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Rakuten", "Naver", "Amazon JP", "Coupang"].map((p) => (
              <div
                key={p}
                className="h-12 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
