package com.ecprice_research.domain.amazon.controller;

import com.ecprice_research.domain.amazon.service.AmazonService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/amazon")
public class AmazonController {

    private final AmazonService amazonService;

    @GetMapping("/search")
    public PriceInfo search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("🔍 [AmazonController] keyword={}, lang={}", keyword, lang);
        return amazonService.search(keyword, lang);
    }
}
