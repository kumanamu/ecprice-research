package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.MarginFinalResponse;

/**
 * Premium AI 분석용 프롬프트 생성기
 * 목표: 투자 판단 보고서 수준의 심층 전략 분석
 */
public class PremiumPromptBuilder {

    public static String build(MarginFinalResponse r) {
        StringBuilder sb = new StringBuilder();

        // ==========================================
        // 🎯 역할 설정
        // ==========================================
        sb.append("당신은 국제 이커머스 전략 컨설턴트입니다.\n");
        sb.append("고객에게 **투자 판단 보고서 수준의 심층 분석**을 제공하세요.\n\n");

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
        sb.append("다음 구조로 **상세하고 전문적으로** 작성하세요:\n\n");

        sb.append("**🎯 결론 (투자 판단)**\n");
        sb.append("마진 기준:\n");
        sb.append("• ≤0원 → \"수익 불가 ❌\"\n");
        sb.append("• 1~10,000원 → \"수익 애매함 ⚠️\"\n");
        sb.append("• 10,000~50,000원 → \"수익 가능 ✅\"\n");
        sb.append("• ≥50,000원 → \"강력 추천 💎\"\n\n");
        sb.append("→ **Basic 분석과 동일한 결론** + 더 상세한 논리와 근거 (3-4줄)\n\n");

        sb.append("**💰 손익 시나리오**\n");
        sb.append("3가지 케이스 분석:\n");
        sb.append("• 최악 케이스: 무게↑ 관세↑ 환율↓ → 총비용 ₩X\n");
        sb.append("• 평균 케이스: 일반적 상황 → 총비용 ₩Y\n");
        sb.append("• 최선 케이스: 무게↓ 관세↓ 환율↑ → 총비용 ₩Z\n");
        sb.append("→ 각 케이스별 예상 마진 명시\n\n");

        sb.append("**📊 시장 포지션**\n");
        sb.append("→ 가격 경쟁력 (시장 대비 위치)\n");
        sb.append("→ 진입 장벽 (낮음/보통/높음)\n");
        sb.append("→ 경쟁 강도 평가\n\n");

        sb.append("**💱 환율 분석**\n");
        sb.append("→ 현재 환율 유리한지 평가\n");
        sb.append("→ 역사적 평균 대비 현재 위치\n");
        sb.append("→ 즉시 진입 vs 대기 판단\n\n");

        sb.append("**🎯 타겟 시장**\n");
        sb.append("→ 주 타겟층 (연령/성별/구매력)\n");
        sb.append("→ 수요 특성 (계절성/트렌드/스테디셀러)\n");
        sb.append("→ 예상 회전율\n\n");

        sb.append("**💹 ROI 분석**\n");
        sb.append("→ 예상 투자 총액 (상품가+배송+관세+수수료)\n");
        sb.append("→ 1개 판매 시 순수익\n");
        sb.append("→ ROI (%) 계산: (순수익/투자액) × 100\n");
        sb.append("→ 월 예상 판매량 고려 시 월 수익률\n\n");

        sb.append("**📊 손익분기점 (BEP)**\n");
        sb.append("→ 몇 개 판매 시 본전인지 계산\n");
        sb.append("→ 목표 마진 달성 필요 판매량\n");
        sb.append("→ 회수 기간 (예상 판매 속도 고려)\n\n");

        sb.append("**🎯 경쟁 강도 분석**\n");
        sb.append("→ 시장 진입 장벽 (낮음/보통/높음)\n");
        sb.append("→ 경쟁사 수 및 가격대 분포\n");
        sb.append("→ 차별화 가능성 평가\n");
        sb.append("→ 신규 진입자 성공 확률 (상/중/하)\n\n");

        sb.append("**📈 가격 탄력성**\n");
        sb.append("→ 가격 변동 시 수요 민감도\n");
        sb.append("→ 최적 가격대 제안\n");
        sb.append("→ 할인 전략 효과 예측\n\n");

        sb.append("**📦 재고 회전 분석**\n");
        sb.append("→ 예상 재고 회전율 (월 X회)\n");
        sb.append("→ 적정 초기 재고량\n");
        sb.append("→ 재고 자금 회수 기간\n");
        sb.append("→ 장기 보관 시 비용 증가율\n\n");

        sb.append("**⚠️ 리스크 정량화**\n");
        sb.append("각 리스크의 영향도(상/중/하)와 발생 확률(%) 제시:\n");
        sb.append("1. 환율 변동 리스크 → 영향도 / 확률 / 대응방안\n");
        sb.append("2. 관세 리스크 → 영향도 / 확률 / 대응방안\n");
        sb.append("3. 경쟁 심화 리스크 → 영향도 / 확률 / 대응방안\n");
        sb.append("→ 종합 리스크 점수 (100점 만점)\n\n");

        sb.append("**📊 수익성 지표**\n");
        sb.append("→ 순마진율 (%)\n");
        sb.append("→ ROAS (Return on Ad Spend) 예상\n");
        sb.append("→ 투자금 회수 기간 (일)\n");
        sb.append("→ 연환산 수익률 (%)\n\n");

        // ==========================================
        // 💡 참고 정보 (상세)
        // ==========================================
        sb.append("## 💡 추정 기준 (상세)\n\n");

        sb.append("**배송비 범위** (환율 반영):\n");
        sb.append("• 소형 (~1kg): 한→일 ₩").append(String.format("%,d", (int)(1500 * r.getJpyToKrw()))).append(" / 일→한 ₩12,000\n");
        sb.append("• 중형 (2-3kg): 한→일 ₩").append(String.format("%,d", (int)(2500 * r.getJpyToKrw()))).append(" / 일→한 ₩20,000\n");
        sb.append("• 대형 (5kg+): 한→일 ₩").append(String.format("%,d", (int)(4500 * r.getJpyToKrw()))).append(" / 일→한 ₩35,000\n");
        sb.append("• 부피 큰 상품: +30-50% 추가\n\n");

        sb.append("**세금 상세**:\n");
        sb.append("• 일본 소비세: 10% (상품가+배송비)\n");
        sb.append("• 한국 부가세: ₩150,000 초과 시 10%\n");
        sb.append("• 통관 수수료: ₩5,000~15,000\n");
        sb.append("• 관세: 0~13% (품목별 상이)\n\n");

        sb.append("**플랫폼 비용**:\n");
        sb.append("• 네이버: 수수료 2% + 광고비\n");
        sb.append("• 쿠팡: 수수료 10% + 로켓배송비\n");
        sb.append("• Amazon JP: 수수료 8% + FBA 보관료 월₩").append(String.format("%,d", (int)(1000 * r.getJpyToKrw()))).append("\n");
        sb.append("• Rakuten: 수수료 7% + 점포 월세 ₩").append(String.format("%,d", (int)(19500 * r.getJpyToKrw()))).append("~\n\n");

        // ==========================================
        // 🚨 필수 포함 사항
        // ==========================================
        sb.append("## 🚨 중요 안내 (반드시 마지막에 포함)\n\n");
        sb.append("다음 내용을 포함하세요:\n\n");
        sb.append("「본 프리미엄 분석은 추정치 기반이며, 다음 한계가 있습니다:\n\n");
        sb.append("**데이터 한계**:\n");
        sb.append("• 정확한 무게/부피 없음 → 배송비 ±30% 차이 가능\n");
        sb.append("• HSCODE 없음 → 관세율 0%~13% 범위에서 상이\n");
        sb.append("• 플랫폼 정책 변동 가능 → 수수료 변동 가능\n");
        sb.append("• 환율 변동 리스크 → 일일 ±3% 변동 가능\n\n");

        sb.append("**거래 전 필수 확인**:\n");
        sb.append("1. 상품 페이지에서 정확한 무게/부피\n");
        sb.append("2. 택배사에 실제 배송비 견적\n");
        sb.append("3. 관세청/관세사에 HSCODE 및 관세율\n");
        sb.append("4. 각 플랫폼의 최신 정책 및 수수료\n");
        sb.append("5. 환율 추이 모니터링 및 환헤지 검토\n\n");

        sb.append("본 분석은 참고 자료이며, 손익을 보장하지 않습니다.\n");
        sb.append("최종 판단과 책임은 사용자에게 있습니다.」\n\n");

        sb.append("---\n");
        sb.append("💎 **프리미엄 분석 원칙**:\n");
        sb.append("• Basic과 결론 동일, 근거는 10배 상세\n");
        sb.append("• 시나리오 분석으로 불확실성 대응\n");
        sb.append("• 실행 가능한 구체적 액션 제공\n");
        sb.append("• 전문적이고 임팩트 있게!\n");

        return sb.toString();
    }
}