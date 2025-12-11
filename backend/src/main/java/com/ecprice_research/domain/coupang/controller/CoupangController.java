package com.ecprice_research.domain.coupang.controller;

import com.ecprice_research.domain.coupang.service.CoupangService;
import com.ecprice_research.domain.margin.dto.PriceInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupang")
public class CoupangController {

    private final CoupangService coupangService;

    @GetMapping("/search")
    public PriceInfo search(@RequestParam String keyword) {
        log.info("🔍 [CoupangController] keyword={}", keyword);
        return coupangService.search(keyword);
    }
}
