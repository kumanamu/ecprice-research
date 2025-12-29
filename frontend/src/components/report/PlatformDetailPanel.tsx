// src/components/report/PlatformDetailPanel.tsx
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";
import { translatePlatform, formatPrice } from "../../utils/t";

interface Props {
  platform: string;
  data: PriceInfo;
  onClose: () => void;
}

export default function PlatformDetailPanel({
  platform,
  data,
  onClose,
}: Props) {
  const { lang } = useLang();

  const platformName = translatePlatform(platform, lang);
  const { main, sub } = formatPrice(
    data.priceKrw,
    data.priceJpy,
    data.country,
    lang
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {platformName} {lang === "ko" ? "상품 상세" : "商品詳細"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        {data.productImage && (
          <img
            src={data.productImage}
            alt={data.productName}
            className="w-full h-48 object-contain mb-4 rounded cursor-pointer hover:opacity-80"
            onClick={() => window.open(data.productUrl, "_blank")}
          />
        )}

        <h3 className="font-semibold text-base mb-2">{data.productName}</h3>

        <div className="mb-4">
          <p className="text-2xl font-black">{main}</p>
          {sub && <p className="text-sm text-slate-500">{sub}</p>}
          <p className="text-xs text-slate-400 mt-1">{data.displayPrice}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <span className="font-semibold">
              {lang === "ko" ? "상태:" : "ステータス:"}
            </span>{" "}
            {data.status}
          </p>
          {data.reason && (
            <p className="text-sm text-slate-600 mt-1">{data.reason}</p>
          )}
        </div>

        <a
          href={data.productUrl}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {lang === "ko" ? "상품 페이지 열기" : "商品ページを開く"}
        </a>
      </div>
    </div>
  );
}
