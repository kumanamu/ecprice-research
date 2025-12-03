import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

export default function PlatformDetailTable({ data }: { data: any }) {
  if (!data) return null;

  const rows = [
    {
      name: "Amazon JP",
      priceKrw: data.platformPrices.amazonJp?.priceKrw || 0,
      priceJpy: data.platformPrices.amazonJp?.priceJpy || 0,
      link: data.platformPrices.amazonJp?.items?.[0]?.url || "",
    },
    {
      name: "Rakuten",
      priceKrw: data.platformPrices.rakuten?.priceKrw || 0,
      priceJpy: data.platformPrices.rakuten?.priceJpy || 0,
      link: data.platformPrices.rakuten?.items?.[0]?.url || "",
    },
    {
      name: "Naver",
      priceKrw: data.platformPrices.naver?.priceKrw || 0,
      priceJpy: data.platformPrices.naver?.priceJpy || 0,
      link: data.platformPrices.naver?.items?.[0]?.link || "",
    },
    {
      name: "Coupang",
      priceKrw: data.platformPrices.coupang?.priceKrw || 0,
      priceJpy: data.platformPrices.coupang?.priceJpy || 0,
      link: data.platformPrices.coupang?.items?.[0]?.link || "",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">📦 플랫폼별 상세 가격</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-600">플랫폼</th>
              <th className="text-right p-3 font-medium text-gray-600">가격 (KRW)</th>
              <th className="text-right p-3 font-medium text-gray-600">가격 (JPY)</th>
              <th className="text-center p-3 font-medium text-gray-600">바로가기</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-100 transition">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3 text-right">{r.priceKrw.toLocaleString()} 원</td>
                <td className="p-3 text-right">{r.priceJpy.toLocaleString()} 엔</td>
                <td className="p-3 text-center">
                  {r.link ? (
                    <a
                      href={r.link}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      보기
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
