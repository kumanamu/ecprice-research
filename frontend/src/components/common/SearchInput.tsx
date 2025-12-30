import { t } from "../../utils/t";
import type { Lang } from "../../utils/t";

interface Props {
  label?: string;
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  lang: Lang;
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
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border p-3">
      {label && <p className="mb-2 text-sm font-semibold">{label}</p>}

      <div className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder={t("searchPlaceholder", lang)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50"
        />

        <button
          onClick={onSearch}
          className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white"
        >
          {loading ? t("aiAnalyzing", lang) : t("search", lang)}
        </button>
      </div>
    </div>
  );
}