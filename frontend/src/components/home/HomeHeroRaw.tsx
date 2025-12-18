// src/components/home/HomeHeroRaw.tsx
import { useLang } from "../../context/LangContext";
import SearchInput from "../common/SearchInput";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
}
//수정완료//
export default function HomeHeroRaw({
  keyword,
  onKeywordChange,
  onSearch,
  loading = false,
}: Props) {
  const { lang } = useLang();

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

      {/* 🔒 검색창은 무조건 고정 */}
      <div className="mt-10 w-full max-w-2xl">
        <SearchInput
          label={lang === "ko" ? "검색어 입력" : "検索キーワード"}
          keyword={keyword}
          onKeywordChange={onKeywordChange}
          onSearch={onSearch}
          lang={lang}
          loading={loading}
        />
      </div>
    </section>
  );
}
