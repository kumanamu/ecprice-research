// src/components/common/SearchInput.tsx
import { t } from "../../utils/t";

interface Props {
  label?: string;
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: "ko" | "jp";
  loading?: boolean;
}

export default function SearchInput({
  label,
  keyword,
  onKeywordChange,
  onSearch,
  lang,
  loading = false,
}: Props) {
  const canSearch = keyword.trim().length > 0 && !loading;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border p-3">
      {label && (
        <p className="mb-2 text-sm font-semibold text-slate-600">
          {label}
        </p>
      )}

      <div className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder={t("searchPlaceholder", lang)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-slate-900"
        />

        <button
          onClick={onSearch}
          disabled={!canSearch}
          className={`
            px-6 py-3 rounded-xl font-bold whitespace-nowrap transition
            ${
              canSearch
                ? "bg-blue-600 text-white hover:bg-blue-700"
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
    </div>
  );
}
