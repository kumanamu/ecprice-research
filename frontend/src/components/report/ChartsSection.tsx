// src/components/report/ChartsSection.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";
import { translatePlatform } from "../../utils/t";

interface Props {
  prices: { [platform: string]: PriceInfo };
  bestPlatform: string;
}

export default function ChartsSection({ prices, bestPlatform }: Props) {
  const { lang } = useLang();

  const data = Object.entries(prices).map(([platform, p]) => ({
    platform,
    price: lang === "ko" ? (p.priceKrw ?? 0) : (p.priceJpy ?? 0),
  }));

  const minPrice = Math.min(...data.map(d => d.price));
  const currency = lang === "ko" ? "KRW" : "JPY";
  const symbol = lang === "ko" ? "₩" : "¥";

  return (
    <div className="bg-white rounded-xl border p-5 mt-6">
      <h3 className="font-bold mb-2">
        {lang === "ko" ? "플랫폼별 가격 비교" : "プラットフォーム別価格比較"} ({currency})
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip formatter={(v) => `${symbol} ${Number(v).toLocaleString()}`} />

          <ReferenceLine
            y={minPrice}
            stroke="#16a34a"
            strokeDasharray="4 4"
            label={{
              value: lang === "ko" ? "최저가 기준" : "最安値基準",
              position: "right",
              fill: "#16a34a",
            }}
          />

          <Bar dataKey="price">
            {data.map((d, idx) => (
              <Cell
                key={idx}
                fill={d.platform === bestPlatform ? "#2563eb" : "#c7d2fe"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="mt-3 text-sm text-slate-600">
        💡 <b>{translatePlatform(bestPlatform, lang)}</b>{" "}
        {lang === "ko"
          ? "기준으로 다른 플랫폼 대비 가장 낮은 가격을 형성하고 있습니다."
          : "基準で他のプラットフォームに比べて最も低い価格を形成しています。"}
      </p>
    </div>
  );
}