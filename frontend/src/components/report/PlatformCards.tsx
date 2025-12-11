// src/components/report/PlatformCards.tsx
import React from "react";
import { useLang } from "../../context/LangContext";
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  platformResults: Record<string, PriceInfo>;
}

const PlatformCards: React.FC<Props> = ({ platformResults }) => {
  const { lang } = useLang();

  // 🛡️ 안전장치 — 데이터가 없으면 아무것도 렌더하지 않음
  if (
    !platformResults ||
    typeof platformResults !== "object" ||
    Object.keys(platformResults).length === 0
  ) {
    return null;
  }

  /** 💰 메인 가격 표시: displayPrice 우선, 없으면 priceOriginal + currencyOriginal */
  const formatPrice = (info: PriceInfo) => {
    if (!info) return lang === "jp" ? "- 円" : "- 원";

    // 1) 백에서 만들어준 displayPrice 있으면 그걸 그대로 사용
    if (info.displayPrice && info.displayPrice.trim() !== "") {
      return info.displayPrice;
    }

    // 2) displayPrice 없으면 priceOriginal + 통화 기준으로 포맷
    if (!info.priceOriginal || info.priceOriginal <= 0) {
      return lang === "jp" ? "- 円" : "- 원";
    }

    const unit =
      info.currencyOriginal === "JPY"
        ? lang === "jp"
          ? "円"
          : "엔"
        : lang === "jp"
        ? "ウォン"
        : "원";

    return `${info.priceOriginal.toLocaleString()} ${unit}`;
  };

  /** 🧾 서브 가격 (있는 경우만 KRW↔JPY 보조표시) */
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
      {Object.entries(platformResults).map(([platform, info]) => (
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

          {/* 상품 페이지 링크 */}
          {info?.productUrl && (
            <a
              href={info.productUrl}
              target="_blank"
              rel="noreferrer"
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
