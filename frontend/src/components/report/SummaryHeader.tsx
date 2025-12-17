// src/components/report/SummaryHeader.tsx
import type { MarginResponse } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

interface Props {
  result: MarginResponse;
}

export default function SummaryHeader({ result }: Props) {
  const { lang } = useLang();

  const best = (result.bestPlatform || "-").toUpperCase();

  const profitKrw = Number(result.profitKrw ?? 0);
  const profitJpy = Number(result.profitJpy ?? 0);

  const isZeroProfit = profitKrw === 0 && profitJpy === 0;

  return (
    <section className="mb-6 rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black mb-2">
          {lang === "ko" ? "📌 핵심 요약" : "📌 主要サマリー"}
        </h2>

        {/* 상태 배지 */}
        <span
          className={
            "text-xs font-bold px-2 py-1 rounded-full border " +
            (isZeroProfit
              ? "bg-white text-slate-600 border-slate-200"
              : "bg-white text-slate-900 border-slate-200")
          }
        >
          {isZeroProfit
            ? lang === "ko"
              ? "차익 없음/보류"
              : "利益なし/保留"
            : lang === "ko"
            ? "차익 가능"
            : "利益あり"}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="font-bold">
            {lang === "ko" ? "최적 플랫폼: " : "最適プラットフォーム: "}
          </span>
          {best}
        </div>

        <div>
          <span className="font-bold text-emerald-600">
            {lang === "ko" ? "예상 이익(KRW): " : "予想利益(KRW): "}
          </span>
          ₩ {profitKrw.toLocaleString()}
        </div>

        <div>
          <span className="font-bold text-indigo-600">
            {lang === "ko" ? "예상 이익(JPY): " : "予想利益(JPY): "}
          </span>
          ¥ {profitJpy.toLocaleString()}
        </div>
      </div>

      {/* 0일 때만 안내 문구 */}
      {isZeroProfit && (
        <div className="mt-3 text-xs text-slate-500 leading-relaxed">
          {lang === "ko" ? (
            <>
              현재 조건(환율/배송/수수료/상품 매칭)에선 유의미한 차익이 잡히지
              않았습니다.{" "}
              <span className="font-semibold text-slate-600">(0으로 표시)</span>
              <br />
              다른 키워드로 재검색하거나, 프리미엄 분석/조건 보정 단계에서 다시
              판정할 수 있습니다.
            </>
          ) : (
            <>
              現在の条件（為替/送料/手数料/商品マッチング）では有意な利益が出ませんでした。{" "}
              <span className="font-semibold text-slate-600">
                （0として表示）
              </span>
              <br />
              別キーワードで再検索、またはプレミアム分析/条件補正で再判定できます。
            </>
          )}
        </div>
      )}
    </section>
  );
}
