package com.ecprice_research.domain.margin.dto;

import lombok.*;
import org.json.JSONObject;  // ⭐ JSON 파싱 추가

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PriceInfo {

    private String platform;
    private String productName;
    private String productUrl;
    private String productImage;

    private Integer priceOriginal;   // null 허용
    private Integer shippingOriginal;

    private String currencyOriginal;

    private Integer priceKrw;
    private Integer priceJpy;
    private String displayPrice;

    private String status; // SUCCESS / NOT_FOUND
    private String reason;

    private String country;
    private java.time.LocalDateTime timestamp;

    // ⭐ 추가: 검색 품질 점수 (라쿠텐/아마존 알고리즘용)
    private Integer score;

    public static PriceInfo notFound(String platform, String reason) {
        return PriceInfo.builder()
                .platform(platform)
                .status("NOT_FOUND")
                .priceOriginal(null)
                .shippingOriginal(null)
                .priceKrw(null)
                .priceJpy(null)
                .displayPrice("검색 결과 없음")
                .reason(reason)
                .timestamp(java.time.LocalDateTime.now())
                .build();
    }

    // ⭐ 추가: PriceInfo → JSON 변환
    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        obj.put("platform", platform);
        obj.put("productName", productName);
        obj.put("productUrl", productUrl);
        obj.put("productImage", productImage);

        obj.put("priceOriginal", priceOriginal);
        obj.put("shippingOriginal", shippingOriginal);
        obj.put("currencyOriginal", currencyOriginal);

        obj.put("priceKrw", priceKrw);
        obj.put("priceJpy", priceJpy);
        obj.put("displayPrice", displayPrice);

        obj.put("status", status);
        obj.put("reason", reason);

        obj.put("country", country);
        obj.put("timestamp", timestamp != null ? timestamp.toString() : null);

        obj.put("score", score);

        return obj;
    }

    // ⭐ 추가: JSON → PriceInfo 변환
    public static PriceInfo fromJson(JSONObject json) {
        return PriceInfo.builder()
                .platform(json.optString("platform"))
                .productName(json.optString("productName"))
                .productUrl(json.optString("productUrl"))
                .productImage(json.optString("productImage"))

                .priceOriginal(json.has("priceOriginal") ? json.optInt("priceOriginal") : null)
                .shippingOriginal(json.has("shippingOriginal") ? json.optInt("shippingOriginal") : null)
                .currencyOriginal(json.optString("currencyOriginal"))

                .priceKrw(json.has("priceKrw") ? json.optInt("priceKrw") : null)
                .priceJpy(json.has("priceJpy") ? json.optInt("priceJpy") : null)
                .displayPrice(json.optString("displayPrice"))

                .status(json.optString("status"))
                .reason(json.optString("reason"))

                .country(json.optString("country"))
                .score(json.has("score") ? json.getInt("score") : null)

                .timestamp(java.time.LocalDateTime.now())
                .build();
    }

    // ⭐ 추가: Builder에 score 지원
    public static class PriceInfoBuilder {
        private Integer score;

        public PriceInfoBuilder score(Integer score) {
            this.score = score;
            return this;
        }
    }
}
