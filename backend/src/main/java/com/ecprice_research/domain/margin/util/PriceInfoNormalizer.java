package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.PriceInfo;
import java.time.LocalDateTime;

public class PriceInfoNormalizer {

    /**
     * SSE로 내려가기 전에 PriceInfo를 "완성된 형태"로 정제하는 단계.
     * 프론트의 marginTypes.ts 구조와 1:1로 맞춘다.
     */
    public static PriceInfo finalizeForSse(PriceInfo p) {

        if (p == null) return null;

        // ============================================================
        // 기본값 보정
        // ============================================================
        if (p.getShippingOriginal() == null) p.setShippingOriginal(0);
        if (p.getStatus() == null) p.setStatus(
                (p.getPriceOriginal() != null && p.getPriceOriginal() > 0)
                        ? "SUCCESS"
                        : "NOT_FOUND"
        );
        if (p.getReason() == null) p.setReason("");

        if (p.getTimestamp() == null)
            p.setTimestamp(LocalDateTime.now());

        // ============================================================
        // 국가 설정 (통화 기준)
        // ============================================================
        if ("JPY".equalsIgnoreCase(p.getCurrencyOriginal())) {
            p.setCountry("JP");
        } else if ("KRW".equalsIgnoreCase(p.getCurrencyOriginal())) {
            p.setCountry("KR");
        } else {
            p.setCountry("UNKNOWN");
        }

        // ============================================================
        // displayPrice 생성 (프론트 기본 노출용)
        // ============================================================
        if (p.getPriceOriginal() != null && p.getPriceOriginal() > 0) {

            if ("JPY".equalsIgnoreCase(p.getCurrencyOriginal())) {
                p.setDisplayPrice(p.getPriceOriginal() + " 円");
            } else {
                p.setDisplayPrice(p.getPriceOriginal() + " 원");
            }

        } else {
            p.setDisplayPrice("가격 정보 없음");
        }

        // ============================================================
        // priceKrw / priceJpy는 여기서 채우지 않음
        // finalCompare에서 환율로 다시 계산됨
        // ============================================================

        return p;
    }
}
