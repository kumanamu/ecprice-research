package com.ecprice_research.domain.margin.controller;

import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.margin.dto.MarginCompareResult;
import com.ecprice_research.domain.margin.service.MarginService;
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
public class MarginFinalController {

    private final MarginService marginService;

    // ✅ 기존 POST 방식 (호환성 유지)
    @PostMapping("/finalCompare")
    public MarginCompareResult finalCompare(
            @RequestParam String keyword,
            @RequestParam String lang,
            @RequestBody Map<String, PriceInfo> platforms
    ) {
        log.info("🔥 [FINAL COMPARE] keyword='{}', lang='{}'", keyword, lang);
        return marginService.finalCompare(keyword, lang, platforms);
    }

    // ✅ 새로운 SSE 스트리밍 방식
    @PostMapping(value = "/finalCompareStream", produces = "text/event-stream")
    public SseEmitter finalCompareStream(
            @RequestParam String keyword,
            @RequestParam String lang,
            @RequestBody Map<String, PriceInfo> platforms
    ) {
        log.info("🔥 [FINAL COMPARE STREAM] keyword='{}', lang='{}'", keyword, lang);

        SseEmitter emitter = new SseEmitter(120_000L); // 2분 타임아웃

        CompletableFuture.runAsync(() -> {
            try {
                marginService.finalCompareStream(keyword, lang, platforms, emitter);
            } catch (Exception e) {
                log.error("❌ SSE 에러", e);
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}