package com.ecprice_research.domain.margin.dto;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarginFinalResponse {

    private String keyword;
    private String lang;

    private Map<String, PriceInfo> platformPrices;

    private String bestPlatform;

    private int profitKrw;
    private int profitJpy;

    private int jpyToKrw;

    // ✅ 추가: 플랫폼별 마진 계산 결과
    private Map<String, PlatformMarginInfo> platformMargins;

    private AiMarginAnalysis basicAi;
    private AiMarginAnalysis premiumAi;

    // ✅ Inner Class 추가
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformMarginInfo {

        private String sellPlatform;     // 판매 플랫폼
        private String buyFrom;          // 구매처 (최저가 플랫폼)

        private int buyPriceKrw;         // 구매 가격 (KRW)
        private int buyPriceJpy;         // 구매 가격 (JPY)

        private int sellPriceKrw;        // 판매 가격 (KRW)
        private int sellPriceJpy;        // 판매 가격 (JPY)

        private int profitKrw;           // 마진 (KRW)
        private int profitJpy;           // 마진 (JPY)

        private double profitRate;       // 수익률 (%)

        private String feasibility;      // "PROFIT" | "LOSS" | "NEUTRAL"
    }
}