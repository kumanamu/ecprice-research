package com.ecprice_research.domain.margin.controller;

import com.ecprice_research.domain.amazon.service.AmazonService;
import com.ecprice_research.domain.coupang.service.CoupangService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.margin.service.MarginService;
import com.ecprice_research.domain.naver.service.NaverService;
import com.ecprice_research.domain.rakuten.service.RakutenService;
import com.ecprice_research.domain.translate.service.TranslateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/margin")
@RequiredArgsConstructor
public class MarginPlatformController {

    private final AmazonService amazonService;
    private final RakutenService rakutenService;
    private final NaverService naverService;
    private final CoupangService coupangService;
    private final TranslateService translateService;

    // ============================================================
    // 플랫폼별 병렬 검색 엔드포인트
    // ============================================================

    @GetMapping("/amazon")
    public PriceInfo getAmazon(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("📡 [PlatformAPI] AMAZON keyword='{}', lang='{}'", keyword, lang);

        // AMAZON은 일본어 검색 필요
        String jp = convertKeywordForOne(keyword, lang).jp();
        return amazonService.search(jp);
    }

    @GetMapping("/rakuten")
    public PriceInfo getRakuten(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("📡 [PlatformAPI] RAKUTEN keyword='{}', lang='{}'", keyword, lang);

        // RAKUTEN도 일본어 검색 필요
        String jp = convertKeywordForOne(keyword, lang).jp();
        return rakutenService.search(jp);
    }

    @GetMapping("/naver")
    public PriceInfo getNaver(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("📡 [PlatformAPI] NAVER keyword='{}', lang='{}'", keyword, lang);

        // NAVER는 한국어 검색 필요
        String kr = convertKeywordForOne(keyword, lang).kr();
        return naverService.search(kr);
    }

    @GetMapping("/coupang")
    public PriceInfo getCoupang(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("📡 [PlatformAPI] COUPANG keyword='{}', lang='{}'", keyword, lang);

        // COUPANG은 한국어 검색 필요
        String kr = convertKeywordForOne(keyword, lang).kr();
        return coupangService.search(kr);
    }


    // ============================================================
    // 🔥 병렬 엔드포인트용 최소 변환기
    // (MarginService.convertKeyword()의 축소 버전)
    // ============================================================
    private record SearchKey(String jp, String kr) {}

    private SearchKey convertKeywordForOne(String keyword, String lang) {

        // -----------------------------
        // 헌법 규칙 1: 일본 사이트(JP)는 무조건 일본어 검색어 필요
        // 헌법 규칙 2: 한국 사이트(KR)는 무조건 한국어 검색어 필요
        // 헌법 규칙 3: 영어는 그대로 (EN 유지)
        // -----------------------------

        boolean hasKo = keyword.matches(".*[가-힣].*");
        boolean hasJp = keyword.matches(".*[ぁ-んァ-ン一-龥].*");

        // 🔥 한국어 입력
        if (lang.equalsIgnoreCase("ko")) {
            // 일본 사이트 검색용: 한국어 → 일본어
            String jp = translateService.koToJp(keyword);
            return new SearchKey(jp, keyword);
        }

        // 🔥 일본어 입력
        if (lang.equalsIgnoreCase("jp")) {
            // 한국 사이트 검색용: 일본어 → 한국어
            String kr = translateService.jpToKo(keyword);
            return new SearchKey(keyword, kr);
        }

        // 🔥 영어 입력 → 그대로 사용
        return new SearchKey(keyword, keyword);
    }
}
