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

    private AiMarginAnalysis basicAi;
    private AiMarginAnalysis premiumAi;
}
