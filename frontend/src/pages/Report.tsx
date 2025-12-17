import React, { useState } from "react";
import ReportList from "../components/report/ReportList";
import ReportDetail from "../components/report/ReportDetail";

export default function Report() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 🔥 MOCK DATA (나중에 API 대체)
  const reports = [
    { id: "1", keyword: "무선 이어폰", createdAt: "2025-01-16" },
    { id: "2", keyword: "로봇 청소기", createdAt: "2025-01-15" },
    { id: "3", keyword: "캠핑 의자", createdAt: "2025-01-14" },
  ];

  const selected = reports.find((r) => r.id === selectedId);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">📁 저장된 리포트</h1>

      <ReportList reports={reports} onSelect={setSelectedId} />

      {selected && <ReportDetail keyword={selected.keyword} />}
    </main>
  );
}
