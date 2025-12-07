// src/components/report/PlatformCards.tsx
import React from "react";
import { useLang } from "../../context/LangContext";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  results: Record<string, PriceInfo>;
}

const PlatformCards: React.FC<Props> = ({ results }) => {
  const { lang } = useLang();

  const formatPrice = (info: PriceInfo) => {
    if (!info) return "-";

    if (lang === "jp") {
      return info.priceJpy
        ? `${info.priceJpy.toLocaleString()} 円`
        : "- 円";
    } else {
      return info.priceKrw
        ? `${info.priceKrw.toLocaleString()} 원`
        : "- 원";
    }
  };

  const formatSub = (info: PriceInfo) => {
    if (!info) return "";

    if (lang === "jp") {
      return info.priceKrw
        ? `（${info.priceKrw.toLocaleString()} KRW）`
        : "";
    } else {
      return info.priceJpy
        ? `（${info.priceJpy.toLocaleString()} 円）`
        : "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {Object.entries(results).map(([platform, info]) => (
        <div
          key={platform}
          className="p-4 bg-white border rounded shadow-sm flex flex-col gap-3"
        >
          <h3 className="text-xl font-semibold">{platform}</h3>

          {/* 이미지 */}
          {info?.productImage && (
            <img
              src={info.productImage}
              alt={info.productName}
              className="w-32 h-32 object-contain border rounded"
            />
          )}

          {/* 상품명 */}
          <p className="font-medium">{info?.productName ?? "-"}</p>

          {/* 가격 */}
          <p className="text-lg font-bold">
            {formatPrice(info)}{" "}
            <span className="text-gray-600">{formatSub(info)}</span>
          </p>

          {/* 상품링크 */}
          {info?.productUrl && (
            <a
              href={info.productUrl}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              {lang === "jp" ? "商品ページを見る" : "상품 페이지 보기"}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlatformCards;
