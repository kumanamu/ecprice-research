package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.MarginFinalResponse;

/**
 * Basic AI 분석용 프롬프트 생성기
 * 목표: 30초 안에 GO/NO-GO 판단 가능한 실전 분석
 */
public class BasicPromptBuilder {

    public static String build(MarginFinalResponse r) {
        StringBuilder sb = new StringBuilder();

        // ==========================================
        // 🎯 역할 설정
        // ==========================================
        sb.append("당신은 10년 경력의 국제 이커머스 전문가입니다.\n");
        sb.append("아래 데이터를 분석하여 **30초 안에 투자 결정**을 내릴 수 있는 보고서를 작성하세요.\n\n");

        // ==========================================
        // 📊 데이터 제공
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

        sb.append("## 📊 분석 데이터\n\n");
        sb.append("**상품**: ").append(r.getKeyword()).append("\n");
        sb.append("**환율**: ¥1 = ₩").append(String.format("%.2f", (double) r.getJpyToKrw())).append("\n");
        sb.append("**최대 마진**: ").append(String.format("%,d", maxProfitKrw)).append("원 (").append(String.format("%.1f", maxProfitRate)).append("%)\n\n");

        sb.append("**플랫폼별 가격**:\n");
        r.getPlatformPrices().forEach((platform, info) -> {
            if (info == null) return;
            sb.append("• ").append(platform).append(": ₩")
                    .append(String.format("%,d", info.getPriceKrw()));
            if (info.getPriceJpy() != null) {
                sb.append(" (¥").append(String.format("%,d", info.getPriceJpy())).append(")");
            }
            sb.append("\n");
        });
        sb.append("\n**최저가 플랫폼**: ").append(r.getBestPlatform()).append("\n\n");

        // ==========================================
        // 📋 출력 형식 지시
        // ==========================================
        sb.append("## 📋 출력 형식\n\n");
        sb.append("다음 구조로 작성하세요:\n\n");

        sb.append("**🎯 결론**\n");
        sb.append("마진 기준:\n");
        sb.append("• ≤0원 → \"수익 불가 ❌\"\n");
        sb.append("• 1~10,000원 → \"수익 애매함 ⚠️\"\n");
        sb.append("• 10,000~50,000원 → \"수익 가능 ✅\"\n");
        sb.append("• ≥50,000원 → \"강력 추천 💎\"\n\n");
        sb.append("→ 판단 결과 + 핵심 이유 1문장\n\n");

        sb.append("**💵 비용 계산**\n");
        sb.append("→ 상품가 + 배송비(추정) + 관세(추정) + 수수료(추정) = 총비용\n");
        sb.append("→ 각 항목별 금액 명시 (추정치임을 표시)\n\n");

        sb.append("**📊 가격 포지션**\n");
        sb.append("→ 시장 대비 가격 수준 (저렴/적정/비쌈)\n");
        sb.append("→ 이유 1줄\n\n");

        sb.append("**⚡ 판매 전망**\n");
        sb.append("→ 회전율 예상 (상/중/하)\n");
        sb.append("→ 수요 안정성 평가\n\n");

        sb.append("**⚠️ 리스크**\n");
        sb.append("→ 핵심 리스크 2개만 간결하게\n\n");

        sb.append("**👉 추천 행동**\n");
        sb.append("→ \"즉시 진입\" / \"1주일 관망\" / \"프리미엄 분석 필요\"\n");
        sb.append("→ 이유 1줄\n\n");

        // ==========================================
        // 💡 참고 정보
        // ==========================================
        sb.append("## 💡 추정 기준 (참고용)\n\n");

        sb.append("**배송비 평균** (환율 반영):\n");
        sb.append("• 한→일: ~3kg ≈ ₩").append(String.format("%,d", (int)(3000 * r.getJpyToKrw()))).append("\n");
        sb.append("• 일→한: ~3kg ≈ ₩25,000\n\n");

        sb.append("**세금**:\n");
        sb.append("• 일본 소비세: 10%\n");
        sb.append("• 한국 부가세: ₩150,000 초과 시 10%\n");
        sb.append("• 통관 수수료: ₩5,000~10,000\n\n");

        sb.append("**플랫폼 수수료**:\n");
        sb.append("• 네이버: 2%\n");
        sb.append("• 쿠팡: 10%\n");
        sb.append("• Amazon JP: 8%\n");
        sb.append("• Rakuten: 7%\n\n");

        // ==========================================
        // 🚨 필수 포함 사항
        // ==========================================
        sb.append("## 🚨 중요 안내 (반드시 마지막에 포함)\n\n");
        sb.append("다음 내용을 포함하세요:\n\n");
        sb.append("「이 분석은 추정치 기반이며, 실제와 20-30% 차이날 수 있습니다.\n");
        sb.append("거래 전 반드시 확인하세요:\n");
        sb.append("• 정확한 무게/부피 (상품 페이지)\n");
        sb.append("• 실제 배송비 (택배사 견적)\n");
        sb.append("• HSCODE 및 관세율 (관세청)\n");
        sb.append("• 플랫폼 최신 정책\n");
        sb.append("• 환율 변동 리스크\n\n");
        sb.append("최종 판단과 책임은 사용자에게 있습니다.」\n\n");

        sb.append("---\n");
        sb.append("💡 **작성 원칙**: 간결하고, 명확하게, 숫자는 구체적으로!\n");

        return sb.toString();
    }
}