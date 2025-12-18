import type { MarginResponse } from "../../types/marginTypes";
import AiAnalysisPanel from "./AiAnalysisPanel";

interface Props {
  loading: boolean;
  hasResults: boolean;
  finalResult: MarginResponse | null;
}

export default function AnalysisSidePanel({
  loading,
  hasResults,
  finalResult,
}: Props) {
  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 min-h-[240px]">
        {/* 아직 검색 전 */}
        {!hasResults && !loading && (
          <p className="text-sm text-slate-500 text-center">
            검색을 실행하면 AI 분석이 여기에 표시됩니다.
          </p>
        )}

        {/* 플랫폼 수집 중 */}
        {loading && (
          <p className="text-sm font-medium text-slate-600">
            🤖 AI 분석 준비 중…
          </p>
        )}

        {/* 최종 분석 */}
        {finalResult && <AiAnalysisPanel result={finalResult} />}
      </div>
    </aside>
  );
}
