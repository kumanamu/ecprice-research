package com.ecprice_research.domain.margin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiMarginAnalysis {

    private String buyPlatform;
    private String sellPlatform;
    private long profitKrw;
    private double profitRate;

    // ✅ 한국어 분석 결과
    private String textKo;

    // ✅ 일본어 분석 결과
    private String textJp;

    private String reason;

    public String summary() {
        return "Buy: " + buyPlatform
                + "\nSell: " + sellPlatform
                + "\nProfit: " + profitKrw + " KRW (" + profitRate + "%)"
                + "\nReason: " + reason;
    }
}