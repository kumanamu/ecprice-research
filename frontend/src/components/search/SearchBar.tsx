// src/components/search/SearchBar.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: "ko" | "jp";
}

export default function SearchBar({ keyword, onKeywordChange, onSearch, lang }: Props) {
  return (
    <div className="flex gap-3 items-center w-full">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder={lang === "ko" ? "검색어 입력" : "検索ワード入力"}
        className="border p-2 flex-1 rounded-lg shadow-sm"
      />

      <button
        onClick={onSearch}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        {lang === "ko" ? "검색" : "検索"}
      </button>
    </div>
  );
}
