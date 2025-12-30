package com.ecprice_research.domain.rakuten.service;

import com.ecprice_research.domain.margin.dto.PriceInfo;
import com.ecprice_research.domain.translate.service.TranslateService;
import com.ecprice_research.util.KeywordVariantCache;
import com.ecprice_research.util.PriceInfoSafeFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class RakutenService {

    @Value("${rakuten.api.key}")
    private String applicationId;

    @Value("${rakuten.api.secret}")
    private String applicationSecret;

    @Value("${rakuten.api.affiliate}")
    private String affiliateId;

    @Value("${rakuten.api.apiUrl}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final TranslateService translateService;


    public PriceInfo search(String keyword, String lang) {

        try {
            String jpKeyword = resolveJapanKeyword(keyword, lang);
            String encoded = URLEncoder.encode(jpKeyword, StandardCharsets.UTF_8);

            // === 라쿠텐 공식 API (정렬 제거, 안정성 ↑)
            String url =
                    "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601"
                            + "?applicationId=" + applicationId
                            + "&affiliateId=" + affiliateId
                            + "&keyword=" + encoded
                            + "&hits=30"
                            + "&format=json";

            log.info("🔎 RAKUTEN | final keyword = {}", jpKeyword);
            log.info("🔎 RAKUTEN | request URL = {}", url);

            Map body = restTemplate.getForObject(URI.create(url), Map.class);
            if (body == null || body.get("Items") == null) {
                log.warn("⚠ RAKUTEN body == null");
                return PriceInfoSafeFactory.fail("RAKUTEN");
            }

            List<Map> items = (List<Map>) body.get("Items");
            if (items.isEmpty()) {
                log.warn("⚠ RAKUTEN 검색 결과 없음");
                return PriceInfoSafeFactory.fail("RAKUTEN");
            }

            log.info("📦 RAKUTEN | 검색 후보 개수: {}", items.size());

            List<ScoredItem> candidates = new ArrayList<>();

            // 최대 30개까지만 스코어링
            for (int i = 0; i < Math.min(items.size(), 30); i++) {
                try {
                    Map wrap = items.get(i);
                    Map item = (Map) wrap.get("Item");

                    if (item == null) continue;

                    String title = (String) item.get("itemName");
                    Integer price = (Integer) item.get("itemPrice");
                    String url0 = (String) item.get("itemUrl");

                    List<Map> images = (List<Map>) item.get("mediumImageUrls");
                    String img = "";
                    if (images != null && !images.isEmpty()) {
                        img = (String) images.get(0).get("imageUrl");
                    }

                    if (title == null || title.isBlank()) continue;
                    if (price == null || price <= 0) continue;

                    // ========================================
                    // ✅ 여기만 추가! (유효성 검증)
                    // ========================================
                    if (!isValidProduct(title)) {
                        continue;  // 유효하지 않으면 스킵
                    }
                    // ========================================

                    double score = scoreCandidate(title, price, img, jpKeyword);

                    log.info("   [{}] score = {} | {}엔 | {}", i, score, price, title);

                    candidates.add(new ScoredItem(title, price, img, url0, score));

                } catch (Exception inner) {
                    log.error("❌ RAKUTEN 아이템 파싱 실패", inner);
                }
            }

            if (candidates.isEmpty()) {
                log.warn("⚠ RAKUTEN 후보 없음");
                return PriceInfoSafeFactory.fail("RAKUTEN");
            }

            candidates.sort((a, b) -> Double.compare(b.score, a.score));
            ScoredItem best = candidates.get(0);

            log.info("🏆 RAKUTEN 최종 선택: {} | {}엔", best.title, best.price);

            return PriceInfoSafeFactory.safe(
                    "RAKUTEN",
                    best.title,
                    best.price,
                    "JPY",
                    best.image,
                    best.url
            );

        } catch (Exception e) {
            log.error("❌ RAKUTEN 검색 실패", e);
            return PriceInfoSafeFactory.fail("RAKUTEN");
        }
    }


    // ------------------------- Keyword -------------------------
    private String resolveJapanKeyword(String keyword, String lang) {
        String cacheKey = "RAK_" + keyword;

        List<String> cached = KeywordVariantCache.get(cacheKey);
        if (cached != null && !cached.isEmpty()) {
            log.info("📦 [RAKUTEN 캐시 히트] {}", cached.get(0));
            return cached.get(0);
        }

        String l = (lang == null) ? "" : lang.toLowerCase();
        String finalKeyword;

        if (l.equals("ko")) finalKeyword = translateService.koToJp(keyword);
        else finalKeyword = keyword;

        KeywordVariantCache.put(cacheKey, List.of(finalKeyword));

        log.info("💾 [RAKUTEN 캐시 저장] RAK_{} → {}", keyword, finalKeyword);
        return finalKeyword;
    }


    // ------------------------- Scoring -------------------------
    private double scoreCandidate(String title, int price, String img, String keyword) {
        double score = 0;

        String t = title.toLowerCase();
        String k = keyword.toLowerCase();

        if (t.contains(k)) score += 60;
        if (img != null && !img.isBlank()) score += 10;
        if (price > 30000) score += 20;
        if (t.contains("セット") || t.contains("交換")) score -= 20;
        if (t.contains("互換") || t.contains("パーツ")) score -= 30;

        return score;
    }


    // ========================================
    // ✅ 새로 추가: 유효한 제품인지 검증
    // ========================================
    /**
     * 유효하지 않은 제품 필터링
     * - 고향세 납부 제품 제외
     * - 스탠드/배터리/부품 단독 제외
     */
    private boolean isValidProduct(String title) {

        // 🚫 1. 고향세 납부 제품 제외
        if (title.contains("ふるさと納税") ||
                title.contains("【ふるさと納税】")) {
            log.info("❌ [RAKUTEN] 고향세 납부 제품 제외: {}", title);
            return false;
        }

        // 🚫 2. 스탠드 단독 제품 제외 (청소기 본체 없음)
        if (title.contains("スタンド") &&
                !title.contains("掃除機") &&
                !title.contains("クリーナー") &&
                !title.contains("本体")) {
            log.info("❌ [RAKUTEN] 스탠드 단독 제품 제외: {}", title);
            return false;
        }

        // 🚫 3. 배터리 단독 제품 제외
        if ((title.contains("バッテリー") || title.contains("電池")) &&
                title.contains("のみ") &&
                !title.contains("本体")) {
            log.info("❌ [RAKUTEN] 배터리 단독 제품 제외: {}", title);
            return false;
        }

        // 🚫 4. 수리/부품 전용 제품 제외
        if ((title.contains("修理") || title.contains("部品")) &&
                title.contains("専用") &&
                !title.contains("本体") &&
                !title.contains("セット")) {
            log.info("❌ [RAKUTEN] 수리/부품 전용 제품 제외: {}", title);
            return false;
        }

        return true;
    }


    // ------------------------- DTO -------------------------
    private record ScoredItem(
            String title,
            int price,
            String image,
            String url,
            double score
    ) {}
}