package com.ecprice_research.domain.amazon.service;

import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.translate.service.TranslateService;
import com.ecprice_research.util.KeywordVariantCache;
import com.ecprice_research.util.PriceInfoSafeFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmazonService {

    @Value("${scraperapi.api.key}")
    private String scraperApiKey;

    private final RestTemplate restTemplate;
    private final TranslateService translateService;

    public PriceInfo search(String keyword, String lang) {
        try {
            String jpKeyword = resolveJapanKeyword(keyword, lang);

            String encoded = URLEncoder.encode(jpKeyword, StandardCharsets.UTF_8);
            String amazonUrl = "https://www.amazon.co.jp/s?k=" + encoded;

            String url = "https://api.scraperapi.com/"
                    + "?api_key=" + scraperApiKey
                    + "&country_code=jp"
                    + "&url=" + URLEncoder.encode(amazonUrl, StandardCharsets.UTF_8);

            log.info("🔎 AMAZON | final keyword = {}", jpKeyword);
            log.info("🔎 AMAZON | request URL = {}", url);

            String html = restTemplate.getForObject(URI.create(url), String.class);
            if (html == null || html.isBlank()) {
                log.warn("⚠ AMAZON 응답 HTML 비어있음");
                return PriceInfoSafeFactory.fail("AMAZON");
            }

            Document doc = Jsoup.parse(html);

            Elements results = doc.select("div[data-component-type=s-search-result]");
            if (results.isEmpty()) results = doc.select("div.s-result-item");
            if (results.isEmpty()) results = doc.select("div[data-asin]");

            if (results.isEmpty()) {
                log.warn("⚠ AMAZON 검색 결과 블록 없음");
                return PriceInfoSafeFactory.fail("AMAZON");
            }

            log.info("📦 AMAZON | 검색 결과 블록 개수: {}", results.size());

            List<ScoredItem> candidates = new ArrayList<>();

            for (int i = 0; i < Math.min(results.size(), 30); i++) {
                Element item = results.get(i);

                try {
                    // ===== 1) Title extraction =====
                    String title = extractTitle(item);
                    if (title.isBlank()) continue;

                    // ===== 2) Price extraction =====
                    Integer price = extractPrice(item);
                    if (price == null || price <= 0) continue;

                    // ===== 3) Image =====
                    Element imgEl = item.selectFirst("img.s-image");
                    String imageUrl = (imgEl != null) ? imgEl.attr("src") : "";

                    // ===== 4) URL =====
                    Element linkEl = item.selectFirst("h2 a");
                    String href = (linkEl != null) ? linkEl.attr("href") : "";
                    String fullUrl = href.startsWith("http")
                            ? href
                            : "https://www.amazon.co.jp" + href;

                    // ===== 5) Score 계산 =====
                    double score = scoreCandidate(title, price, imageUrl, jpKeyword);
                    log.info("   [{}] score = {} | {}엔 | {}", i, score, price, title);

                    candidates.add(new ScoredItem(title, price, imageUrl, fullUrl, score));

                } catch (Exception inner) {
                    log.error("❌ AMAZON 아이템 파싱 실패", inner);
                }
            }

            if (candidates.isEmpty()) {
                log.warn("⚠ AMAZON 후보 없음 → fallback");
                return PriceInfoSafeFactory.fail("AMAZON");
            }

            // ===== 가장 스코어 높은 후보 선택 =====
            candidates.sort((a, b) -> Double.compare(b.score, a.score));
            ScoredItem best = candidates.get(0);

            log.info("🏆 AMAZON 최종 선택: {} | {}엔", best.title, best.price);

            return PriceInfoSafeFactory.safe(
                    "amazon",
                    best.title,
                    best.price,
                    "JPY",
                    best.image,
                    best.url
            );

        } catch (Exception e) {
            log.error("❌ AMAZON 검색 실패", e);
            return PriceInfoSafeFactory.fail("AMAZON");
        }
    }


    // ------------------------- Keyword -------------------------
    private String resolveJapanKeyword(String keyword, String lang) {
        String cacheKey = "AMZ_" + keyword;

        List<String> cached = KeywordVariantCache.get(cacheKey);
        if (cached != null && !cached.isEmpty()) {
            log.info("📦 [AMAZON 캐시 히트] {}", cached.get(0));
            return cached.get(0);
        }

        String l = (lang == null) ? "" : lang.toLowerCase();
        String finalKeyword;

        if (l.equals("ko")) finalKeyword = translateService.koToJp(keyword);
        else finalKeyword = keyword;

        KeywordVariantCache.put(cacheKey, List.of(finalKeyword));

        log.info("💾 [AMAZON 캐시 저장] {}", finalKeyword);
        return finalKeyword;
    }


    // ------------------------- Extraction helpers -------------------------
    private String extractTitle(Element item) {
        String title = "";

        Elements h2Span = item.select("h2 a span");
        if (!h2Span.isEmpty()) title = h2Span.text();

        if (title.isBlank()) title = item.select("h2 span").text();
        if (title.isBlank()) title = item.select("h2").text();

        Element altTitle = item.selectFirst("[data-cy=title-recipe]");
        if (title.isBlank() && altTitle != null) title = altTitle.text();

        return title != null ? title.trim() : "";
    }

    private Integer extractPrice(Element item) {
        String priceText = null;

        Element el1 = item.selectFirst("span.a-price span.a-offscreen");
        if (el1 != null) priceText = el1.text();

        if (priceText == null || priceText.isBlank()) {
            Element el2 = item.selectFirst("span.a-price-whole");
            if (el2 != null) priceText = el2.text();
        }

        if (priceText == null || priceText.isBlank()) {
            for (Element s : item.select("span")) {
                String t = s.text();
                if (t.matches("^.*[0-9,]+円?.*$")) {
                    priceText = t;
                    break;
                }
            }
        }

        if (priceText == null) return null;

        String cleaned = priceText.replaceAll("[¥￥,円\\s]", "");
        if (cleaned.isBlank()) return null;

        try {
            return Integer.parseInt(cleaned);
        } catch (Exception e) {
            return null;
        }
    }


    // ------------------------- Scoring -------------------------
    private double scoreCandidate(String title, int price, String img, String keyword) {
        double score = 0;

        String t = title.toLowerCase();
        String k = keyword.toLowerCase();

        if (t.contains(k)) score += 60;            // 키워드 매칭 강함
        if (img != null && !img.isBlank()) score += 10;
        if (price > 30000) score += 20;           // 본품 가능성 증가
        if (t.contains("セット") || t.contains("交換")) score -= 20;

        return score;
    }


    // ------------------------- Support DTO -------------------------
    private record ScoredItem(
            String title,
            int price,
            String image,
            String url,
            double score
    ) {}
}
