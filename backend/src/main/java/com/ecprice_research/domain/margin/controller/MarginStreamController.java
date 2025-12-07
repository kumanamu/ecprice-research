package com.ecprice_research.domain.margin.controller;

import com.ecprice_research.domain.amazon.service.AmazonService;
import com.ecprice_research.domain.coupang.service.CoupangService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.naver.service.NaverService;
import com.ecprice_research.domain.rakuten.service.RakutenService;
import com.ecprice_research.domain.translate.service.TranslateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequestMapping("/api/margin")
@RequiredArgsConstructor
public class MarginStreamController {

    private final AmazonService amazonService;
    private final RakutenService rakutenService;
    private final NaverService naverService;
    private final CoupangService coupangService;
    private final TranslateService translateService;

    // ==========================================================
    // 플랫폼별 가격 조회 + SSE 전송
    // ==========================================================
    private PriceInfo fetchPlatform(String platform, String keyword) {

        return switch (platform) {
            case "amazon" -> amazonService.search(keyword);
            case "rakuten" -> rakutenService.search(keyword);
            case "naver" -> naverService.search(keyword);
            case "coupang" -> coupangService.search(keyword);
            default -> null;
        };
    }

    private void sendPlatform(SseEmitter emitter, String platform, PriceInfo data) {
        try {
            emitter.send(
                    SseEmitter.event()
                            .name("platform")
                            .data(Map.of(
                                    "platform", platform,
                                    "data", data
                            ))
            );
            log.info("🟢 [{}] 전송 완료", platform);
        } catch (Exception e) {
            log.error("❌ [{}] 전송 실패", platform, e);
        }
    }

    // ==========================================================
    // SSE 2 — 병렬 가격 스트리밍
    // ==========================================================
    @GetMapping("/stream2")
    public SseEmitter stream2(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        SseEmitter emitter = new SseEmitter(30_000L);

        log.info("🔥 [SSE] START keyword='{}', lang='{}'", keyword, lang);

        // 🔥 연결 유지를 위해 즉시 한번 전송
        try {
            emitter.send(SseEmitter.event().name("init").data("ok"));
        } catch (Exception ignored) {}

        // 병렬 요청
        CompletableFuture<Void> amazon = CompletableFuture.runAsync(() -> {
            PriceInfo r = fetchPlatform("amazon", keyword);
            sendPlatform(emitter, "amazon", r);
        });

        CompletableFuture<Void> rakuten = CompletableFuture.runAsync(() -> {
            PriceInfo r = fetchPlatform("rakuten", keyword);
            sendPlatform(emitter, "rakuten", r);
        });

        CompletableFuture<Void> naver = CompletableFuture.runAsync(() -> {
            PriceInfo r = fetchPlatform("naver", keyword);
            sendPlatform(emitter, "naver", r);
        });

        CompletableFuture<Void> coupang = CompletableFuture.runAsync(() -> {
            PriceInfo r = fetchPlatform("coupang", keyword);
            sendPlatform(emitter, "coupang", r);
        });

        // 모든 플랫폼 완료 → DONE 신호 한 번만 전송
        CompletableFuture.allOf(amazon, rakuten, naver, coupang)
                .thenRun(() -> {
                    try {
                        emitter.send(SseEmitter.event().name("done").data("finish"));
                        emitter.complete();
                    } catch (Exception e) {
                        log.error("❌ DONE 전송 실패", e);
                    }
                });

        return emitter;
    }
}
