package com.ecprice_research.domain.margin.service;

import com.ecprice_research.domain.exchange.dto.ExchangeRate;
import com.ecprice_research.domain.exchange.service.ExchangeService;
import com.ecprice_research.domain.margin.dto.AiMarginAnalysis;
import com.ecprice_research.domain.margin.dto.MarginFinalResponse;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.translate.service.TranslateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarginService {

    private final ExchangeService exchangeService;
    private final TranslateService translateService;
    private final OpenAiAnalysisService aiService;

    /**
     * SSE 스트리밍 방식
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

            // 4) 플랫폼별 마진 계산
            Map<String, MarginFinalResponse.PlatformMarginInfo> platformMargins =
                    calculateAllPlatformMargins(platforms, bestPlatform, jpyToKrw);
            log.info("💰 [마진 계산 완료] {} 개 플랫폼", platformMargins.size());

            // 5) Base 구성
            MarginFinalResponse base = MarginFinalResponse.builder()
                    .keyword(keyword)
                    .lang(lang)
                    .platformPrices(platforms)
                    .bestPlatform(bestPlatform)
                    .profitKrw(0)
                    .profitJpy(0)
                    .jpyToKrw((int) jpyToKrw)
                    .platformMargins(platformMargins)
                    .build();

            // 6) Basic/Premium AI 병렬 실행
            log.info("🚀 [AI 병렬 분석 시작] lang={}", lang);

            CompletableFuture<AiMarginAnalysis> basicFuture = CompletableFuture.supplyAsync(() ->
                    aiService.analyze(base, false, lang)
            );

            CompletableFuture<AiMarginAnalysis> premiumFuture = CompletableFuture.supplyAsync(() ->
                    aiService.analyze(base, true, lang)
            );

            // 7) Basic 완료 대기 → 전송
            AiMarginAnalysis basic = basicFuture.join();
            base.setBasicAi(basic);
            emitter.send(SseEmitter.event().name("basic").data(base));
            log.info("📤 [Basic 전송 완료]");

            // 8) Premium 완료 대기 → 전송
            AiMarginAnalysis premium = premiumFuture.join();
            base.setPremiumAi(premium);
            emitter.send(SseEmitter.event().name("premium").data(base));
            log.info("📤 [Premium 전송 완료]");

            // 9) 스트림 종료
            emitter.complete();
            log.info("✅ [SSE 스트림 완료]");

        } catch (Exception e) {
            log.error("❌ finalCompareStream 에러", e);
            emitter.completeWithError(e);
        }
    }

    /**
     * 플랫폼별 마진 계산
     */
    private Map<String, MarginFinalResponse.PlatformMarginInfo> calculateAllPlatformMargins(
            Map<String, PriceInfo> platforms,
            String bestPlatform,
            double jpyToKrw
    ) {
        Map<String, MarginFinalResponse.PlatformMarginInfo> result = new HashMap<>();

        // 최저가 찾기
        int minPriceKrw = platforms.values().stream()
                .filter(p -> p.getPriceKrw() != null && p.getPriceKrw() > 0)
                .mapToInt(PriceInfo::getPriceKrw)
                .min()
                .orElse(0);

        int minPriceJpy = (int) Math.round(minPriceKrw / jpyToKrw);

        // 각 플랫폼을 판매처로 가정하고 마진 계산
        platforms.forEach((platform, info) -> {
            if (info.getPriceKrw() == null || info.getPriceKrw() <= 0) {
                return;
            }

            int sellPriceKrw = info.getPriceKrw();
            int sellPriceJpy = info.getPriceJpy() != null
                    ? info.getPriceJpy()
                    : (int) Math.round(sellPriceKrw / jpyToKrw);

            int profitKrw = sellPriceKrw - minPriceKrw;
            int profitJpy = sellPriceJpy - minPriceJpy;

            double profitRate = minPriceKrw > 0
                    ? ((double) profitKrw / minPriceKrw * 100)
                    : 0.0;

            String feasibility;
            if (profitKrw > 0) {
                feasibility = "PROFIT";
            } else if (profitKrw < 0) {
                feasibility = "LOSS";
            } else {
                feasibility = "NEUTRAL";
            }

            MarginFinalResponse.PlatformMarginInfo margin =
                    MarginFinalResponse.PlatformMarginInfo.builder()
                            .sellPlatform(platform)
                            .buyFrom(bestPlatform)
                            .buyPriceKrw(minPriceKrw)
                            .buyPriceJpy(minPriceJpy)
                            .sellPriceKrw(sellPriceKrw)
                            .sellPriceJpy(sellPriceJpy)
                            .profitKrw(profitKrw)
                            .profitJpy(profitJpy)
                            .profitRate(profitRate)
                            .feasibility(feasibility)
                            .build();

            result.put(platform, margin);
        });

        return result;
    }
}