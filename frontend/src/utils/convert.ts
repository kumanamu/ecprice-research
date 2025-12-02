import type { PlatformRaw, PlatformPrice } from "../types/marginTypes";

export function convertToPlatformPrice(raw: PlatformRaw): PlatformPrice {
  return {
    priceJpy: raw.priceConverted,
    priceKrw: raw.priceOriginal,
    items: raw.productName
      ? [
          {
            title: raw.productName,
            price: raw.priceConverted ?? 0,
            rawPrice: raw.priceOriginal ?? 0,
            currency:
              raw.platform === "AMAZON_JP" || raw.platform === "RAKUTEN"
                ? "JPY"
                : "KRW",
            image: raw.productImage ?? "",
            url: raw.productUrl ?? "",
          },
        ]
      : [],
  };
}
