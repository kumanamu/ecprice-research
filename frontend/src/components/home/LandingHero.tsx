// src/components/home/LandingHero.tsx
import { useLang } from "../../context/LangContext";

export default function LandingHero() {
  const { lang } = useLang();

  const onStartClick = () => {
    const input = document.querySelector<HTMLInputElement>(
      'input[placeholder]'
    );
    input?.focus();
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="flex flex-col items-center justify-center h-[60vh] text-center gap-6">
      {/* 아이콘 */}
      <div className="text-6xl">🔍</div>

      {/* 타이틀 */}
      <h2 className="text-3xl font-bold">
        {lang === "jp"
          ? "商品を検索してみてください"
          : "상품을 검색해보세요"}
      </h2>

      {/* 설명 */}
      <p className="text-gray-500 max-w-md leading-relaxed">
        {lang === "jp"
          ? "韓国・日本の価格を比較し、AI分析結果を確認できます。"
          : "한국 / 일본 가격을 비교하고 AI 분석 결과를 확인할 수 있습니다."}
      </p>

      {/* 플랫폼 배지 */}
      <div className="flex gap-3 flex-wrap justify-center text-sm">
        <span className="px-3 py-1 rounded-full border bg-white shadow-sm">
          Amazon JP
        </span>
        <span className="px-3 py-1 rounded-full border bg-white shadow-sm">
          Rakuten
        </span>
        <span className="px-3 py-1 rounded-full border bg-white shadow-sm">
          Naver
        </span>
        <span className="px-3 py-1 rounded-full border bg-white shadow-sm">
          Coupang
        </span>
      </div>

      {/* CTA 버튼 */}
      <button
        onClick={onStartClick}
        className="mt-4 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
      >
        {lang === "jp" ? "AI分析を開始" : "AI 분석 시작"}
      </button>
    </section>
  );
}
