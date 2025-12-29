// src/components/report/SummaryHeader.tsx
import { useState } from "react";
import type { MarginResponse } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";
import { translatePlatform } from "../../utils/t";

interface Props {
  result: MarginResponse;
}

export default function SummaryHeader({ result }: Props) {
  const { lang } = useLang();
  const [selectedPlatform, setSelectedPlatform] = useState(result.bestPlatform);

  const platforms = Object.keys(result.platformPrices || {});
  const selectedMargin = result.platformMargins?.[selectedPlatform];

  // 최고 마진 플랫폼 찾기
  const bestSellPlatform = platforms.reduce((best, current) => {
    const bestMargin = result.platformMargins?.[best]?.profitKrw || -Infinity;
    const currentMargin = result.platformMargins?.[current]?.profitKrw || -Infinity;
    return currentMargin > bestMargin ? current : best;
  }, platforms[0]);

  // 기본값 처리
  if (!selectedMargin) {
    return (
      <section className="mb-6 rounded-xl border bg-slate-50 p-4">
        <h2 className="text-lg font-black">
          {lang === "ko" ? "📌 핵심 요약" : "📌 主要サマリー"}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {lang === "ko" ? "마진 계산 중..." : "利益計算中..."}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-slate-50 p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-black">
          {lang === "ko" ? "📌 핵심 요약" : "📌 主要サマリー"}
        </h2>

        <span
          className={
            "text-xs font-bold px-3 py-1 rounded-full border " +
            (selectedMargin.feasibility === "PROFIT"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : selectedMargin.feasibility === "LOSS"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-slate-50 text-slate-600 border-slate-200")
          }
        >
          {lang === "ko"
            ? selectedMargin.feasibility === "PROFIT"
              ? "차익 가능"
              : selectedMargin.feasibility === "LOSS"
              ? "차익 손실"
              : "차익 없음/보류"
            : selectedMargin.feasibility === "PROFIT"
            ? "利益あり"
            : selectedMargin.feasibility === "LOSS"
            ? "損失あり"
            : "利益なし/保留"}
        </span>
      </div>

      {/* 플랫폼 선택 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {platforms.map((platform) => {
          const isBestBuy = platform === result.bestPlatform;
          const isBestSell = platform === bestSellPlatform;

          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={
                "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all " +
                (selectedPlatform === platform
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-slate-700 border hover:bg-slate-100")
              }
            >
              {translatePlatform(platform, lang)}
              {isBestBuy && (
                <span className="ml-1 text-xs">
                  {lang === "ko" ? "🛒" : "🛒"}
                </span>
              )}
              {isBestSell && (
                <span className="ml-1 text-xs">
                  {lang === "ko" ? "💰" : "💰"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 플랫폼 마진 정보 */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">
            {lang === "ko" ? "판매 플랫폼:" : "販売プラットフォーム:"}
          </span>
          <span className="font-bold">
            {translatePlatform(selectedMargin.sellPlatform, lang)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">
            {lang === "ko" ? "구매처 (최저가):" : "購入先（最安値）:"}
          </span>
          <span className="font-bold">
            {translatePlatform(selectedMargin.buyFrom, lang)}
          </span>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex justify-between">
          <span className="text-slate-600">
            {lang === "ko" ? "구매 가격:" : "購入価格:"}
          </span>
          <span>₩{selectedMargin.buyPriceKrw.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">
            {lang === "ko" ? "판매 가격:" : "販売価格:"}
          </span>
          <span>₩{selectedMargin.sellPriceKrw.toLocaleString()}</span>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700">
            {lang === "ko" ? "예상 마진:" : "予想利益:"}
          </span>
          <div className="text-right">
            <div
              className={
                "text-lg font-bold " +
                (selectedMargin.profitKrw > 0
                  ? "text-emerald-600"
                  : selectedMargin.profitKrw < 0
                  ? "text-red-600"
                  : "text-slate-600")
              }
            >
              {selectedMargin.profitKrw >= 0 ? "+" : ""}
              ₩{selectedMargin.profitKrw.toLocaleString()}{" "}
              {lang === "ko" ? "원" : "ウォン"}
            </div>
            <div className="text-xs text-slate-500">
              ¥{selectedMargin.profitJpy.toLocaleString()} /{" "}
              {selectedMargin.profitRate >= 0 ? "+" : ""}
              {selectedMargin.profitRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 pt-4 border-t text-xs text-slate-500">
        <div className="flex items-center gap-2 mb-2">
          <span>🛒 = {lang === "ko" ? "최저가 구매처" : "最安値購入先"}</span>
          <span>💰 = {lang === "ko" ? "최고 마진" : "最高利益"}</span>
        </div>
        {lang === "ko"
          ? "💡 상세 전략 분석은 아래 AI 분석을 확인하세요"
          : "💡 詳細戦略分析は下記AI分析をご確認ください"}
      </div>
    </section>
  );
}