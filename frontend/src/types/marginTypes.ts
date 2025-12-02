export interface ItemInfo {
  title: string;
  price: number;
  rawPrice: number;
  currency: string;
  image: string;
  url: string;
}

export interface PlatformPrice {
  priceJpy: number | null;
  priceKrw: number | null;
  items: ItemInfo[];
}

export interface PlatformRaw {
  platform: string;
  productName: string | null;
  productUrl: string | null;
  productImage: string | null;
  priceOriginal: number | null;
  priceConverted: number | null;
}

export interface AiDetail {
  reason: string;
  text: string;
}

export interface MarginResponse {
  keyword: string;
  lang: string;

  platformPrices: {
    amazonJp: PlatformRaw;
    rakuten: PlatformRaw;
    naver: PlatformRaw;
    coupang: PlatformRaw;
  };

  basicAi: AiDetail;
  premiumAi: AiDetail;

  bestPlatform: string;
  profitKrw: number;
  profitJpy: number;
}
