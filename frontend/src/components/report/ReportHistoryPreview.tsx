import { useLang } from "../../context/LangContext";

interface ReportHistoryItem {
  id: string;
  keyword: string;
  createdAt: string;
}

interface Props {
  items: ReportHistoryItem[];
}

export default function ReportHistoryPreview({ items }: Props) {
  const { lang } = useLang();

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-16 text-center text-slate-400 text-sm">
        {lang === "ko"
          ? "아직 저장된 리포트가 없습니다."
          : "まだ保存されたレポートはありません。"}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      {/* ===== 섹션 제목 ===== */}
      <h3 className="text-sm font-black text-slate-500 mb-4 uppercase tracking-wider">
        {lang === "ko" ? "최근 리포트" : "最近のレポート"}
      </h3>

      {/* ===== 카드 리스트 ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white
                       p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => {
              // ⛔ 아직 라우팅/조회 API 없음
              console.log("OPEN REPORT:", item.id);
            }}
          >
            <p className="text-base font-black mb-1">
              {item.keyword}
            </p>

            <p className="text-xs text-slate-500">
              {lang === "ko"
                ? `생성일: ${item.createdAt}`
                : `作成日: ${item.createdAt}`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
