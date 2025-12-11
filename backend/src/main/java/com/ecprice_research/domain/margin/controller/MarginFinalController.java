package com.ecprice_research.domain.margin.controller;

import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.margin.dto.MarginCompareResult;
import com.ecprice_research.domain.margin.service.MarginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/margin")
@RequiredArgsConstructor
public class MarginFinalController {

    private final MarginService marginService;

    @PostMapping("/finalCompare")
    public MarginCompareResult finalCompare(
            @RequestParam String keyword,
            @RequestParam String lang,
            @RequestBody Map<String, PriceInfo> platforms
    ) {
        log.info("🔥 [FINAL COMPARE] keyword='{}', lang='{}'", keyword, lang);
        return marginService.finalCompare(keyword, lang, platforms);
    }
}
