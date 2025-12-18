// src/components/search/SearchHero.tsx
import SearchInput from "../common/SearchInput";
import { t } from "../../utils/t";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: "ko" | "jp";
  loading?: boolean;
}

export default function SearchHero({
  keyword,
  onKeywordChange,
  onSearch,
  lang,
  loading = false,
}: Props) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center text-center gap-10 mb-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black">
          {lang === "ko"
            ? "다른 상품도 바로 분석해보세요"
            : "別の商品もすぐに分析できます"}
        </h2>

        <p className="text-slate-600">
          {lang === "ko"
            ? "검색어만 바꾸면 즉시 새로운 분석 결과를 확인할 수 있습니다."
            : "キーワードを変えるだけで新しい分析結果を確認できます。"}
        </p>
      </div>

      {/* 🔒 여기서도 동일 UX */}
      <div className="w-full max-w-3xl">
        <SearchInput
          label={lang === "ko" ? "검색어 입력" : "検索キーワード"}
          keyword={keyword}
          onKeywordChange={onKeywordChange}
          onSearch={onSearch}
          lang={lang}
          loading={loading}
        />
      </div>
    </div>
  );
}
