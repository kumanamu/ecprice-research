import React from "react";
import ReportPanel from "../components/layout/ReportPanel";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../types/marginTypes";

export default function Report() {
  // 추후: recoil/zustand/global state or route state 활용
  // 지금은 빈 페이지 구조만 제공

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">AI 분석 리포트</h2>

      <div className="text-gray-400">
        아직 저장된 리포트 없음.  
        (홈에서 검색 후 → 이 페이지로 데이터 전달 기능은 이후 작업)
      </div>
    </div>
  );
}
