package com.ecprice_research.domain.margin.service;

import com.ecprice_research.domain.exchange.dto.ExchangeRate;
import com.ecprice_research.domain.exchange.service.ExchangeService;
import com.ecprice_research.domain.margin.dto.AiMarginAnalysis;
import com.ecprice_research.domain.margin.dto.MarginCompareResult;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.translate.service.TranslateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarginService {

    private final ExchangeService exchangeService;
    private final OpenAiAnalysisService aiService;
    private final TranslateService translateService;

    /**
     * 🔥 기존 동기 방식 (호환성 유지)
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

        // 2.5) 상품명 번역
        for (var entry : platforms.entrySet()) {
            String platform = entry.getKey().toLowerCase();
            PriceInfo p = entry.getValue();
            if (p == null || p.getProductName() == null) continue;

            if ("ko".equalsIgnoreCase(lang)) {
                if ("amazon".equals(platform) || "rakuten".equals(platform)) {
                    String translated = translateService.jpToKo(p.getProductName());
                    p.setProductName(translated);
                    log.info("🔄 [번역] {} 상품명: JP → KO", platform);
                }
            } else if ("jp".equalsIgnoreCase(lang)) {
                if ("naver".equals(platform) || "coupang".equals(platform)) {
                    String translated = translateService.koToJp(p.getProductName());
                    p.setProductName(translated);
                    log.info("🔄 [번역] {} 상품명: KO → JP", platform);
                }
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

    /**
     * ✅ 새로운 SSE 스트리밍 방식
     */
    public void finalCompareStream(
            String keyword,
            String lang,
            Map<String, PriceInfo> platforms,
            SseEmitter emitter
    ) {
        try {
            log.info("🔍 [FINAL COMPARE STREAM] keyword='{}', lang='{}', platformCount={}",
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

            // 2.5) 상품명 번역
            for (var entry : platforms.entrySet()) {
                String platform = entry.getKey().toLowerCase();
                PriceInfo p = entry.getValue();
                if (p == null || p.getProductName() == null) continue;

                if ("ko".equalsIgnoreCase(lang)) {
                    if ("amazon".equals(platform) || "rakuten".equals(platform)) {
                        p.setProductName(translateService.jpToKo(p.getProductName()));
                        log.info("🔄 [번역] {} 상품명: JP → KO", platform);
                    }
                } else if ("jp".equalsIgnoreCase(lang)) {
                    if ("naver".equals(platform) || "coupang".equals(platform)) {
                        p.setProductName(translateService.koToJp(p.getProductName()));
                        log.info("🔄 [번역] {} 상품명: KO → JP", platform);
                    }
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

            // 4) Base 구성
            MarginCompareResult base = MarginCompareResult.builder()
                    .keyword(keyword)
                    .lang(lang)
                    .platformPrices(platforms)
                    .bestPlatform(bestPlatform)
                    .profitKrw(0)
                    .profitJpy(0)
                    .jpyToKrw((int) jpyToKrw)
                    .build();

            // ✅ 5) Basic 분석 → 즉시 전송
            log.info("🤖 [Basic 분석 시작]");
            AiMarginAnalysis basic = aiService.analyze(base, false);
            base.setBasicAi(basic);

            emitter.send(SseEmitter.event()
                    .name("basic")
                    .data(base));
            log.info("📤 [Basic 전송 완료]");

            // ✅ 6) Premium 분석 → 즉시 전송
            log.info("🤖 [Premium 분석 시작]");
            AiMarginAnalysis premium = aiService.analyze(base, true);
            base.setPremiumAi(premium);

            emitter.send(SseEmitter.event()
                    .name("premium")
                    .data(base));
            log.info("📤 [Premium 전송 완료]");

            emitter.complete();

        } catch (Exception e) {
            log.error("❌ finalCompareStream 에러", e);
            emitter.completeWithError(e);
        }
    }
}