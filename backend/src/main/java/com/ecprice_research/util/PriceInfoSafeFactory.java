package com.ecprice_research.util;

import com.ecprice_research.domain.margin.dto.PriceInfo;

import java.time.LocalDateTime;

public class PriceInfoSafeFactory {

    // ============================================================
    // 1) 플랫폼 정상 데이터 → MINIMUM PriceInfo 생성
    // ============================================================
    public static PriceInfo safe(
            String platform,
            Object rawName,
            Object rawPrice,
            String currency,
            Object rawImg,
            Object rawUrl
    ) {
        String name = rawName != null ? rawName.toString() : platform + " 상품정보 없음";

        int price;
        try {
            price = rawPrice != null ? Integer.parseInt(rawPrice.toString()) : -1;
        } catch (Exception e) {
            price = -1;
        }

        String img = rawImg != null ? rawImg.toString() : "";
        String url = rawUrl != null ? rawUrl.toString() : "";

        return PriceInfo.builder()
                .platform(platform)
                .productName(name)
                .productUrl(url)
                .productImage(img)
                .priceOriginal(price)
                .currencyOriginal(currency)
                .shippingOriginal(0)
                .status(price > 0 ? "SUCCESS" : "NOT_FOUND")
                .reason(price > 0 ? "" : "INVALID_PRICE")
                .timestamp(LocalDateTime.now())
                .build();
    }

    // ============================================================
    // 2) 실패케이스 → 기본값 강제
    // ============================================================
    public static PriceInfo fail(String platform) {
        return PriceInfo.builder()
                .platform(platform)
                .productName(platform + " 결과 없음")
                .productUrl("")
                .productImage("")
                .priceOriginal(-1)
                .currencyOriginal("KRW")
                .shippingOriginal(0)
                .status("NOT_FOUND")
                .reason("NO_DATA")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
