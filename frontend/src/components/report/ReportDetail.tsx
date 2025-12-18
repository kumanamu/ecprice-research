
interface Props {
  keyword: string;
}

export default function ReportDetail({ keyword }: Props) {
  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow">
      <h2 className="text-xl font-black mb-4">
        📄 리포트 상세 – {keyword}
      </h2>

      <div className="text-sm text-slate-600 space-y-2">
        <p>• 플랫폼별 가격 요약</p>
        <p>• 예상 수익률</p>
        <p>• AI 분석 결과</p>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        ※ 실제 데이터는 백엔드 연결 후 표시됩니다.
      </p>
    </section>
  );
}
