package com.ecprice_research.domain.margin.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarginCompareResult {

    /** 검색어 */
    private String keyword;

    /** 언어 (ko/jp/en) */
    private String lang;

    /** 플랫폼별 가격 정보 (naver, coupang, amazon, rakuten) */
    private Map<String, PriceInfo> platformPrices;

    /** 최저가 플랫폼 */
    private String bestPlatform;

    /** 엔화→원화 환율 */
    private Integer jpyToKrw;

    /** 마진(원) */
    private Integer profitKrw;

    /** 마진(엔) */
    private Integer profitJpy;

    /** Basic AI 분석 */
    private AiMarginAnalysis basicAi;

    /** Premium AI 분석 */
    private AiMarginAnalysis premiumAi;
}
