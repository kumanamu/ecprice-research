// src/types/marginTypes.ts

// ===============================
// PriceInfo ← 백엔드 DTO 그대로
// ===============================
export interface PriceInfo {
  platform: string;
  productName: string;
  productUrl: string;
  productImage: string;

  priceOriginal: number | null;
  shippingOriginal: number | null;

  currencyOriginal: string;

  priceKrw: number | null;
  priceJpy: number | null;
  displayPrice: string;

  status: string;
  reason: string;

  country: string;
  timestamp: string;
}

// ===============================
// AiMarginAnalysis ← ✅ 수정: textKo, textJp 추가
// ===============================
export interface AiMarginAnalysis {
  buyPlatform: string;
  sellPlatform: string;
  profitKrw: number;
  profitRate: number;

  textKo: string;  // ✅ 한국어 분석
  textJp: string;  // ✅ 일본어 분석

  reason: string;
}

// ===============================
// MarginResponse ← 백 DTO 그대로
// ===============================
export interface MarginResponse {
  keyword: string;
  lang: "ko" | "jp";

  platformPrices: {
    [platform: string]: PriceInfo;
  };

  bestPlatform: string;
  profitKrw: number;
  profitJpy: number;

  jpyToKrw: number;

  basicAi: AiMarginAnalysis;
  premiumAi: AiMarginAnalysis;
}