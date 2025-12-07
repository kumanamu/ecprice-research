// src/components/search/SearchBar.tsx
import React from "react";
import { t } from "../../utils/t";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: "ko" | "jp";
}

export default function SearchBar({
  keyword,
  onKeywordChange,
  onSearch,
  lang,
}: Props) {
  return (
    <div className="flex gap-3 items-center w-full">

      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder={t("searchPlaceholder", lang)}
        className="border p-2 flex-1 rounded-lg shadow-sm"
      />

      <button
        type="button"
        onClick={() => {
          console.log("🔍 SEARCH CLICK");
          onSearch();
        }}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        {t("search", lang)}
      </button>

    </div>
  );
}
