// src/components/report/PlatformResultGrid.tsx
import PlatformResultItem from "./PlatformResultItem";
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  platformResults: Record<string, PriceInfo>;
  onSelect: (platform: string, data: PriceInfo) => void;
  isAnalyzing?: boolean; // ✅ 추가
}

export default function PlatformResultGrid({
  platformResults,
  onSelect,
  isAnalyzing = false, // ✅ 추가
}: Props) {
  const { lang } = useLang();
  const entries = Object.entries(platformResults);

  if (entries.length === 0) {
    return (
      <div className="mt-10 text-center text-slate-400">
        {lang === "ko"
          ? "검색 후 플랫폼 결과가 여기에 표시됩니다."
          : "検索後、プラットフォーム結果がここに表示されます。"}
      </div>
    );
  }

  return (
    <>
      {/* ✅ AI 분석 중 안내 */}
      {isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 text-center">
          <p className="text-sm text-blue-700">
            {lang === "ko"
              ? "🔄 AI 분석 중... 번역 결과와 마진이 곧 반영됩니다."
              : "🔄 AI分析中... 翻訳結果と利益がまもなく反映されます。"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {entries.map(([platform, data]) => (
          <PlatformResultItem
            key={platform}
            platform={platform}
            data={data}
            onClick={() => onSelect(platform, data)}
          />
        ))}
      </div>
    </>
  );
}