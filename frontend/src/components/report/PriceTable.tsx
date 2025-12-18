// src/components/report/PriceTable.tsx
import { t } from "../../utils/t";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  prices: { [key: string]: PriceInfo };
  lang: "ko" | "jp";
}

export default function PriceTable({ prices, lang }: Props) {
  return (
    <div className="p-5 rounded-xl shadow bg-white">

      <h2 className="font-bold text-lg mb-4">
        {t("platformPrice", lang)}
      </h2>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b text-sm text-gray-500">
            <th className="p-2">{t("platform", lang)}</th>
            <th className="p-2">KRW</th>
            <th className="p-2">JPY</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(prices).map(([key, item]) => (
            <tr key={key} className="border-b">
              <td className="p-2 font-semibold">{key}</td>
              <td className="p-2">
                {item.priceKrw !== null ? item.priceKrw.toLocaleString() : "-"}
              </td>
              <td className="p-2">
                {item.priceJpy !== null ? item.priceJpy.toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}