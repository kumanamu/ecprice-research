// src/components/report/PlatformResultGrid.tsx
import PlatformResultItem from "./PlatformResultItem";
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  platformResults: Record<string, PriceInfo>;
  onSelect: (platform: string, data: PriceInfo) => void;
}

export default function PlatformResultGrid({
  platformResults,
  onSelect,
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
  );
}
