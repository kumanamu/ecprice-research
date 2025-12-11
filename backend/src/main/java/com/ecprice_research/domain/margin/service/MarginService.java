package com.ecprice_research.domain.margin.service;

import com.ecprice_research.domain.exchange.dto.ExchangeRate;
import com.ecprice_research.domain.exchange.service.ExchangeService;
import com.ecprice_research.domain.margin.dto.AiMarginAnalysis;
import com.ecprice_research.domain.margin.dto.MarginCompareResult;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarginService {

    private final ExchangeService exchangeService;
    private final OpenAiAnalysisService aiService;

    /**
     * 🔥 SSE 병렬 결과를 프론트가 합친 뒤 최종 분석 요청할 때 사용
     */
    public MarginCompareResult finalCompare(
            String keyword,
            String lang,
            Map<String, PriceInfo> platforms
    ) {
        log.info("🔍 [FINAL COMPARE] keyword='{}', lang='{}', platformCount={}",
                keyword, lang, platforms.size());

        // 1) 환율 조회
        ExchangeRate rate = exchangeService.getRate();
        double jpyToKrw = rate.getJpyToKrw();
        double krwToJpy = rate.getKrwToJpy();

        // 2) KRW/JPY 변환
        for (PriceInfo p : platforms.values()) {
            if (p == null || p.getPriceOriginal() == null) continue;

            if ("JPY".equalsIgnoreCase(p.getCurrencyOriginal())) {
                int jpy = p.getPriceOriginal();
                p.setPriceJpy(jpy);
                p.setPriceKrw((int) Math.round(jpy * jpyToKrw));
            } else {
                int krw = p.getPriceOriginal();
                p.setPriceKrw(krw);
                p.setPriceJpy((int) Math.round(krw * krwToJpy));
            }
        }

        // 3) 최저가 선택
        String bestPlatform = "-";
        int minJpy = Integer.MAX_VALUE;

        for (var entry : platforms.entrySet()) {
            PriceInfo p = entry.getValue();
            if (p != null && p.getPriceJpy() != null && p.getPriceJpy() > 0) {
                if (p.getPriceJpy() < minJpy) {
                    minJpy = p.getPriceJpy();
                    bestPlatform = entry.getKey();
                }
            }
        }

        // 4) MarginCompareResult 구성
        MarginCompareResult base = MarginCompareResult.builder()
                .keyword(keyword)
                .lang(lang)
                .platformPrices(platforms)
                .bestPlatform(bestPlatform)
                .profitKrw(0)
                .profitJpy(0)
                .jpyToKrw((int) jpyToKrw)
                .build();

        // 5) Basic / Premium 분석 생성
        AiMarginAnalysis basic = aiService.analyze(base, false);
        AiMarginAnalysis premium = aiService.analyze(base, true);

        base.setBasicAi(basic);
        base.setPremiumAi(premium);

        return base;
    }
}
