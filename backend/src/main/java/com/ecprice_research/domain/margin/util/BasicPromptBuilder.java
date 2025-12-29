package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.MarginFinalResponse;

/**
 * Basic AI 분석용 프롬프트 생성기
 * 목표: 30초 안에 GO/NO-GO 판단 가능한 실전 분석
 * ✅ AI가 직접 판단하되, 명확한 기준 제시로 일관성 보장
 * ✅ 면책 조항 필수 포함
 */
public class BasicPromptBuilder {

    public static String build(MarginFinalResponse r) {
        StringBuilder sb = new StringBuilder();

        sb.append("당신은 10년 경력의 국제 이커머스 전문가입니다.\n");
        sb.append("사용자가 **30초 안에 GO/NO-GO 판단**을 내릴 수 있도록 분석하세요.\n\n");

        // ==========================================
        // 🎯 최대 마진 계산 (AI 판단용)
        // ==========================================
        int maxProfitKrw = r.getPlatformMargins() != null
                ? r.getPlatformMargins().values().stream()
                .mapToInt(m -> m.getProfitKrw())
                .max()
                .orElse(0)
                : 0;

        double maxProfitRate = r.getPlatformMargins() != null
                ? r.getPlatformMargins().values().stream()
                .mapToDouble(m -> m.getProfitRate())
                .max()
                .orElse(0.0)
                : 0.0;

        // ==========================================
        // ⚖️ 판단 기준 (명확히 제시)
        // ==========================================
        sb.append("### ⚖️ 판단 기준 (반드시 준수)\n\n");

        sb.append("**현재 최대 마진**:\n");
        sb.append("- KRW: ").append(String.format("%,d", maxProfitKrw)).append(" 원\n");
        sb.append("- 마진율: ").append(String.format("%.1f", maxProfitRate)).append("%\n\n");

        sb.append("**판단 규칙** (이 순서대로 평가):\n\n");

        sb.append("1️⃣ **최대 마진 ≤ 0원**\n");
        sb.append("   → 결론: '수익 불가 ❌'\n");
        sb.append("   → 이유: 모든 플랫폼에서 손실 발생\n\n");

        sb.append("2️⃣ **최대 마진 1원~10,000원**\n");
        sb.append("   → 기본: '수익 애매함 ⚠️'\n");
        sb.append("   → 단, 회전율 빠르고 경쟁 낮으면 '수익 가능'\n");
        sb.append("   → 배송비/수수료 고려 시 실제 마진 거의 없을 가능성 높음\n\n");

        sb.append("3️⃣ **최대 마진 10,000원~50,000원**\n");
        sb.append("   → 결론: '수익 가능 ✅'\n");
        sb.append("   → 소량 테스트 후 확대 권장\n\n");

        sb.append("4️⃣ **최대 마진 ≥ 50,000원**\n");
        sb.append("   → 결론: '강력 추천 💎'\n");
        sb.append("   → 적극 진입 권장\n\n");

        sb.append("**🚨 중요 원칙**:\n");
        sb.append("- 위 기준을 **최우선**으로 적용\n");
        sb.append("- 시장 상황, 리스크를 고려해 **근거 있는 판단**\n");
        sb.append("- 애매한 표현 금지 (명확히 '추천' 또는 '비추천')\n");
        sb.append("- **이 분석과 Premium 분석은 반드시 같은 결론**을 내려야 함\n\n");

        // ==========================================
        // ⚠️ 데이터 제약 사항
        // ==========================================
        sb.append("### ⚠️ 데이터 제약 사항 (중요!)\n\n");
        sb.append("**현재 시스템의 한계**:\n");
        sb.append("- 상품의 정확한 무게/부피 데이터 없음 → 카테고리 평균으로 추정 필요\n");
        sb.append("- HSCODE 데이터 없음 → 일반적인 관세율로 추정 필요\n");
        sb.append("- 실제 배송비는 무게/부피/배송사/시기에 따라 ±30% 변동 가능\n");
        sb.append("- 실제 관세는 HSCODE에 따라 0%~13% 범위에서 크게 달라질 수 있음\n");
        sb.append("- 플랫폼 수수료 및 정책은 수시로 변경됨\n\n");

        sb.append("**따라서 분석 작성 시 반드시**:\n");
        sb.append("1. 모든 비용은 '추정치'임을 명시\n");
        sb.append("2. 실제와 ±20-30% 차이날 수 있다는 경고\n");
        sb.append("3. 사용자가 직접 확인해야 할 항목 안내\n\n");

        // ==========================================
        // 📊 기본 데이터
        // ==========================================
        sb.append("### 📊 검색 결과\n\n");
        sb.append("**상품**: ").append(r.getKeyword()).append("\n");
        sb.append("**환율**: 1 JPY = ").append(String.format("%.2f", (double) r.getJpyToKrw())).append(" KRW\n\n");

        sb.append("**플랫폼별 가격**:\n");
        r.getPlatformPrices().forEach((platform, info) -> {
            if (info == null) return;
            sb.append("- ").append(platform).append(": ")
                    .append(String.format("%,d", info.getPriceKrw())).append(" KRW");
            if (info.getPriceJpy() != null) {
                sb.append(" (").append(String.format("%,d", info.getPriceJpy())).append(" JPY)");
            }
            sb.append("\n");
        });
        sb.append("\n**최저가 플랫폼**: ").append(r.getBestPlatform()).append("\n\n");

        // ==========================================
        // 💰 실전 비용 정보 (추정치)
        // ==========================================
        sb.append("### 💰 실전 거래 비용 (추정치 - 참고용)\n\n");

        sb.append("**국제 배송비 (평균)**:\n");
        sb.append("- 한국 → 일본: 2~3kg 약 2,500~3,500 JPY (환율 적용 시 약 ").append(String.format("%,d", (int)(2500 * r.getJpyToKrw()))).append("~").append(String.format("%,d", (int)(3500 * r.getJpyToKrw()))).append(" KRW)\n");
        sb.append("- 일본 → 한국: 2~3kg 약 18,000~28,000 KRW\n");
        sb.append("- 5kg 이상: +50% 추가, 부피 큰 상품: +30% 추가\n");
        sb.append("- ⚠️ 실제 무게/부피 모름 - 사용자 확인 필수\n\n");

        sb.append("**관세 및 세금 (일반 기준)**:\n");
        sb.append("- 일본 소비세: 상품가의 10%\n");
        sb.append("- 한국 부가세: 150,000원 초과 시 10%\n");
        sb.append("- 통관 수수료: 5,000~10,000원\n");
        sb.append("- ⚠️ 정확한 HSCODE 모름 - 실제 관세율 다를 수 있음\n\n");

        sb.append("**플랫폼 수수료 (2024년 기준)**:\n");
        sb.append("- 네이버: 2% + 3,000원\n");
        sb.append("- 쿠팡: 10% + 3,000원\n");
        sb.append("- Amazon JP: 8% + 700엔 (약 ").append(String.format("%,d", (int)(700 * r.getJpyToKrw()))).append(" KRW)\n");
        sb.append("- Rakuten: 7% + 700엔 (약 ").append(String.format("%,d", (int)(700 * r.getJpyToKrw()))).append(" KRW)\n");
        sb.append("- ⚠️ 정책 변동 가능 - 최신 정보 확인 필수\n\n");

        // ==========================================
        // 🎯 시장 상황
        // ==========================================
        sb.append("### 🎯 시장 분석 기준\n\n");

        sb.append("**시장 가격대 판단**:\n");
        sb.append("- 이 상품이 일반적인 시장가 대비 비싼지 싼지 평가\n");
        sb.append("- 동일 카테고리 제품들과 비교\n\n");

        sb.append("**구매 타이밍**:\n");
        sb.append("- 계절 상품인가? (여름/겨울 시즌 영향)\n");
        sb.append("- 할인 시즌인가? (블랙프라이데이, 연말 등)\n");
        sb.append("- 신제품 출시 임박 여부\n\n");

        sb.append("**판매 가능성**:\n");
        sb.append("- 빠르게 팔릴 상품인가? (회전율)\n");
        sb.append("- 수요가 안정적인가? 트렌드 상품인가?\n");
        sb.append("- 경쟁이 심한가? (많은 셀러가 이미 팔고 있는가)\n\n");

        // ==========================================
        // 📋 출력 형식
        // ==========================================
        sb.append("### 📋 분석 출력 형식\n\n");

        sb.append("**🎯 결론 (1-2문장)**\n");
        sb.append("→ '수익 불가/애매함/가능/강력추천' 중 하나를 **명확히** 선택\n");
        sb.append("→ 핵심 이유를 1문장으로 설명\n\n");

        sb.append("**💵 실제 총비용 계산 (추정)**\n");
        sb.append("→ 상품가 + 배송비 + 관세 + 수수료 = ○○○원\n");
        sb.append("→ 각 항목별 구체적 금액 제시 (추정치임을 명시)\n\n");

        sb.append("**📊 가격 포지션**\n");
        sb.append("→ 이 가격이 시장 대비 어떤 위치인지 (싸다/비싸다/적정)\n\n");

        sb.append("**⚡ 판매 전망**\n");
        sb.append("→ 빠르게 팔릴 가능성 (상/중/하)\n");
        sb.append("→ 이유 1줄\n\n");

        sb.append("**⚠️ 핵심 리스크**\n");
        sb.append("→ 가장 중요한 리스크 2개만 간결히\n\n");

        sb.append("**👉 추천 행동**\n");
        sb.append("→ '즉시 구매', '1주일 관망', '프리미엄 분석 필요' 중 하나\n");
        sb.append("→ 선택 이유 명확히\n\n");

        // ==========================================
        // 🚨 면책 조항 (필수!)
        // ==========================================
        sb.append("**🚨 면책 조항 (반드시 마지막에 포함)**\n\n");
        sb.append("다음 내용을 반드시 포함하세요:\n\n");
        sb.append("「이 분석은 추정치 기반이며, 실제 비용과 20-30% 차이날 수 있습니다.\n");
        sb.append("실제 거래 전 반드시 다음을 직접 확인하세요:\n");
        sb.append("• 정확한 상품 무게/부피 (판매 페이지)\n");
        sb.append("• 실제 배송비 견적 (택배사 문의)\n");
        sb.append("• HSCODE 및 정확한 관세율 (관세청)\n");
        sb.append("• 플랫폼 최신 수수료 및 정책\n");
        sb.append("• 환율 변동 리스크\n\n");
        sb.append("최종 투자 판단과 그 결과에 대한 책임은 사용자에게 있습니다.」\n\n");

        sb.append("---\n");
        sb.append("💡 **작성 규칙**: 숫자는 구체적으로, 판단은 명확하게, 경고는 반드시!\n");

        return sb.toString();
    }
}