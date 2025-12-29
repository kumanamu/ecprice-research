// src/components/report/KeyMetricsSection.tsx
import { useLang } from "../../context/LangContext";
import { translatePlatform } from "../../utils/t";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  platform: string;
  profitKrw: number;
  profitJpy: number;
  lang: "ko" | "jp";
  prices: Record<string, PriceInfo>;
  jpyToKrw: number;
}

export default function KeyMetricsSection({
  platform,
  prices,
  jpyToKrw,
}: Props) {
  const { lang } = useLang();
  const platformName = translatePlatform(platform, lang);

  // ✅ 한국 플랫폼 최저가
  const krPlatforms = ["naver", "coupang"];
  const krPrices = Object.entries(prices)
    .filter(([p]) => krPlatforms.includes(p.toLowerCase()))
    .map(([, data]) => data.priceKrw ?? Infinity)  // ✅ _ 대신 , 사용 (27번 줄)
    .filter(p => p !== Infinity);
  const krMin = krPrices.length > 0 ? Math.min(...krPrices) : 0;

  // ✅ 일본 플랫폼 최저가
  const jpPlatforms = ["amazon", "rakuten"];
  const jpPrices = Object.entries(prices)
    .filter(([p]) => jpPlatforms.includes(p.toLowerCase()))
    .map(([, data]) => data.priceJpy ?? Infinity)  // ✅ _ 대신 , 사용 (35번 줄)
    .filter(p => p !== Infinity);
  const jpMin = jpPrices.length > 0 ? Math.min(...jpPrices) : 0;

  // ✅ 마진 계산
  const jpMinInKrw = Math.round(jpMin * jpyToKrw);
  const krToJpMargin = jpMinInKrw - krMin;
  const jpToKrMargin = krMin - jpMinInKrw;

  const bestMargin = Math.max(krToJpMargin, jpToKrMargin);
  const bestDirection = krToJpMargin > jpToKrMargin
    ? (lang === "ko" ? "한국 → 일본" : "韓国 → 日本")
    : (lang === "ko" ? "일본 → 한국" : "日本 → 韓国");

  return (
    <div className="bg-white rounded-xl border p-5 mt-6">
      <h3 className="font-bold mb-3">
        {lang === "ko" ? "핵심 지표" : "主要指標"}
      </h3>

      <ul className="space-y-2 text-sm">
        <li>
          ✅ {lang === "ko" ? "최적 구매 플랫폼:" : "最適購入プラットフォーム:"}
          <span className="ml-1 font-semibold text-blue-600">
            {platformName}
          </span>
        </li>
        <li>
          💰 {lang === "ko" ? "예상 최대 마진:" : "予想最大利益:"}{" "}
          <span className="font-semibold text-green-600">
            {bestMargin.toLocaleString()} {lang === "ko" ? "원" : "ウォン"}
          </span>
        </li>
        <li>
          🌏 {lang === "ko" ? "최적 판매 방향:" : "最適販売方向:"}{" "}
          <span className="font-semibold text-purple-600">{bestDirection}</span>
        </li>
      </ul>

      <div className="mt-3 text-sm text-slate-600">
        🤖{" "}
        {lang === "ko"
          ? `AI 판단 요약: ${bestDirection} 판매 시 약 ${bestMargin.toLocaleString()}원의 마진이 예상됩니다.`
          : `AI判断要約: ${bestDirection}販売時、約${bestMargin.toLocaleString()}ウォンの利益が予想されます。`}
      </div>
    </div>
  );
}