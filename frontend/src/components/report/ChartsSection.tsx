// src/components/report/ChartsSection.tsx
import React from "react";
import type { PriceInfo } from "../../types/marginTypes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  prices: { [platform: string]: PriceInfo };
  lang: "ko" | "jp";
}

export default function ChartsSection({ prices, lang }: Props) {
  if (!prices) return null;

  const chartData = Object.entries(prices).map(([platform, p]) => ({
    platform,
    price: p.priceKrw ?? null,
  }));

  return (
    <div className="w-full h-64 bg-white p-4 shadow rounded">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
