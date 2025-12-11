package com.ecprice_research.domain.margin.controller;

import com.ecprice_research.domain.amazon.service.AmazonService;
import com.ecprice_research.domain.coupang.service.CoupangService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.margin.util.PriceInfoNormalizer;
import com.ecprice_research.domain.naver.service.NaverService;
import com.ecprice_research.domain.rakuten.service.RakutenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Flux;

import java.time.Duration;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/margin")
public class MarginStreamController {

    private final AmazonService amazonService;
    private final RakutenService rakutenService;
    private final NaverService naverService;
    private final CoupangService coupangService;

    // ========================================================================
    // 🔥 플랫폼별 서비스 호출
    // ========================================================================
    private PriceInfo callPlatformService(String platform, String keyword, String lang) {

        try {
            return switch (platform) {
                case "naver" -> naverService.search(keyword);
                case "coupang" -> coupangService.search(keyword);
                case "amazon" -> amazonService.search(keyword, lang);
                case "rakuten" -> rakutenService.search(keyword, lang);
                default -> PriceInfo.notFound(platform.toUpperCase(), "UNKNOWN_PLATFORM");
            };
        } catch (Exception e) {
            log.error("❌ {} 서비스 호출 실패", platform, e);
            return PriceInfo.notFound(platform.toUpperCase(), "EXCEPTION");
        }
    }

    // ========================================================================
    // 🔥 SSE STREAM
    // ========================================================================
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> stream(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {

        log.info("🔥 SSE /stream 호출: keyword={}, lang={}", keyword, lang);

        return Flux.just("naver", "coupang", "amazon", "rakuten")

                // 💧 흐름 조절 (150ms 간격으로 전송)
                .delayElements(Duration.ofMillis(150))

                .map(platform -> {

                    // 1️⃣ 각 플랫폼 검색
                    PriceInfo raw = callPlatformService(platform, keyword, lang);

                    // 2️⃣ SSE 전용 정규화
                    PriceInfo normalized = PriceInfoNormalizer.finalizeForSse(raw);

                    // 3️⃣ 프론트에서 그대로 JSON.parse 가능하도록 JSON 문자열 전송
                    String json = normalized.toJson().toString();

                    log.info("📤 SSE [{}] → {}", platform, json);

                    return ServerSentEvent.<String>builder()
                            .event("platform")
                            .data("{\"platform\":\"" + platform + "\", \"data\": " + json + "}")
                            .build();
                })

                // 4️⃣ 모든 플랫폼 완료 후 done 이벤트
                .concatWith(
                        Flux.just(
                                ServerSentEvent.<String>builder()
                                        .event("done")
                                        .data("completed")
                                        .build()
                        )
                );
    }
}
