package com.ecprice_research.domain.rakuten.controller;

import com.ecprice_research.domain.rakuten.service.RakutenService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rakuten")
public class RakutenController {

    private final RakutenService rakutenService;

    @GetMapping("/search")
    public PriceInfo search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("🔍 [RakutenController] keyword={}, lang={}", keyword, lang);
        return rakutenService.search(keyword, lang);
    }
}
