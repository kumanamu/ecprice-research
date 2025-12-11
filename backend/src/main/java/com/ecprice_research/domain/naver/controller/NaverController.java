package com.ecprice_research.domain.naver.controller;

import com.ecprice_research.domain.naver.service.NaverService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/naver")
public class NaverController {

    private final NaverService naverService;

    @GetMapping("/search")
    public PriceInfo search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ko") String lang
    ) {
        log.info("🔍 [NaverController] keyword={}, lang={}", keyword, lang);
        return naverService.search(keyword);
    }
}
