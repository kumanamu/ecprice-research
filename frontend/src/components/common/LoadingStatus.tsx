// src/components/common/LoadingStatus.tsx
import { useLang } from "../../context/LangContext";

interface Props {
  currentPlatform?: string; // ex) naver | coupang | amazon | rakuten
  finished: boolean;        // 모든 플랫폼 완료 여부
}

const PLATFORMS = [
  { key: "naver", label: "Naver" },
  { key: "coupang", label: "Coupang" },
  { key: "amazon", label: "Amazon JP" },
  { key: "rakuten", label: "Rakuten" },
];

export default function LoadingStatus({
  currentPlatform,
  finished,
}: Props) {
  const { lang } = useLang();

  return (
    <div className="mt-10 flex flex-col items-center gap-5">
      {/* 상단 문구 */}
      <p className="text-sm text-gray-500">
        {finished
          ? lang === "jp"
            ? "AI分析を実行中です…"
            : "AI 분석 중입니다…"
          : lang === "jp"
          ? "価格情報を取得中です…"
          : "가격 정보를 수집 중입니다…"}
      </p>

      {/* 플랫폼 상태 */}
      <ul className="flex gap-3">
        {PLATFORMS.map(({ key, label }) => {
          const isDone =
            finished ||
            (currentPlatform &&
              PLATFORMS.findIndex(p => p.key === key) <
                PLATFORMS.findIndex(p => p.key === currentPlatform));

          const isCurrent = key === currentPlatform && !finished;

          return (
            <li
              key={key}
              className={`
                flex items-center gap-1 px-3 py-1 rounded-full text-sm border
                transition-all
                ${
                  isDone
                    ? "bg-green-600 text-white border-green-600"
                    : isCurrent
                    ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                    : "bg-white text-gray-400 border-gray-300"
                }
              `}
            >
              {isDone ? "✓" : "•"} {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
