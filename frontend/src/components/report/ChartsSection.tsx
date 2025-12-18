import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  prices: { [platform: string]: PriceInfo };
  lang: "ko" | "jp";
}

export default function ChartsSection({ prices }: Props) {
  if (!prices) return null;

  const chartData = Object.entries(prices).map(([platform, p]) => ({
    platform,
    value: p.priceKrw ?? 0
  }));

  return (
    <div className="bg-white shadow rounded p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
