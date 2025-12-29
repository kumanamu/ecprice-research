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
// AiMarginAnalysis ← 한국어/일본어 분석
// ===============================
export interface AiMarginAnalysis {
  buyPlatform: string;
  sellPlatform: string;
  profitKrw: number;
  profitRate: number;

  textKo: string;  // 한국어 분석
  textJp: string;  // 일본어 분석

  reason: string;
}

// ===============================
// ✅ PlatformMarginInfo (신규 추가)
// ===============================
export interface PlatformMarginInfo {
  sellPlatform: string;
  buyFrom: string;
  buyPriceKrw: number;
  buyPriceJpy: number;
  sellPriceKrw: number;
  sellPriceJpy: number;
  profitKrw: number;
  profitJpy: number;
  profitRate: number;
  feasibility: "PROFIT" | "LOSS" | "NEUTRAL";
}

// ===============================
// MarginResponse ← 백엔드 DTO
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

  // ✅ 추가: 플랫폼별 마진 계산
  platformMargins?: {
    [platform: string]: PlatformMarginInfo;
  };

  basicAi: AiMarginAnalysis;
  premiumAi: AiMarginAnalysis;
}