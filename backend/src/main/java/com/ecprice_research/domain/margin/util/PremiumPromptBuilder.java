package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.MarginFinalResponse;

/**
 * Premium AI 분석용 프롬프트 생성기
 * 목표: 투자 판단 보고서 수준의 상세 전략 분석
 * ✅ Basic과 동일한 결론 + 훨씬 상세한 근거
 * ✅ 면책 조항 필수 포함
 */
public class PremiumPromptBuilder {

    public static String build(MarginFinalResponse r) {
        StringBuilder sb = new StringBuilder();

        sb.append("당신은 국제 이커머스 전략 컨설턴트입니다.\n");
        sb.append("고객에게 **투자 판단 보고서 수준의 상세 분석**을 제공하세요.\n\n");

        // ==========================================
        // 🎯 최대 마진 계산
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
        // ⚖️ 판단 기준
        // ==========================================
        sb.append("### ⚖️ 판단 기준 (Basic 분석과 동일하게 적용)\n\n");

        sb.append("**현재 최대 마진**:\n");
        sb.append("- KRW: ").append(String.format("%,d", maxProfitKrw)).append(" 원\n");
        sb.append("- 마진율: ").append(String.format("%.1f", maxProfitRate)).append("%\n\n");

        sb.append("**판단 규칙**:\n");
        sb.append("1. 최대 마진 ≤ 0원 → '수익 불가'\n");
        sb.append("2. 최대 마진 1~10,000원 → '수익 애매함' (단, 상황에 따라 조정 가능)\n");
        sb.append("3. 최대 마진 10,000~50,000원 → '수익 가능'\n");
        sb.append("4. 최대 마진 ≥ 50,000원 → '강력 추천'\n\n");

        sb.append("**🚨 필수 조건**:\n");
        sb.append("- **Basic 분석과 반드시 동일한 결론**을 내려야 함\n");
        sb.append("- Premium은 Basic보다 **더 상세한 근거**를 제시하는 것이 차이점\n");
        sb.append("- 결론이 다르면 사용자 혼란 → 절대 금지!\n\n");

        // ==========================================
        // ⚠️ 데이터 제약
        // ==========================================
        sb.append("### ⚠️ 데이터 제약 사항\n\n");
        sb.append("**시스템 한계** (Basic과 동일):\n");
        sb.append("- 정확한 무게/부피 데이터 없음\n");
        sb.append("- HSCODE 없어 정확한 관세율 알 수 없음\n");
        sb.append("- 배송비/수수료는 추정치\n");
        sb.append("- 플랫폼 정책 변동 가능\n\n");

        sb.append("**Premium 분석의 역할**:\n");
        sb.append("- 이러한 불확실성을 **시나리오별로 분석**\n");
        sb.append("- 최소/평균/최대 케이스 제시\n");
        sb.append("- 리스크 대응 방안 상세히 제시\n\n");

        // ==========================================
        // 📊 기본 데이터
        // ==========================================
        sb.append("### 📊 분석 대상\n\n");
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
        // 💰 실전 비용 (상세)
        // ==========================================
        sb.append("### 💰 실전 비용 구조 (추정 범위)\n\n");

        sb.append("**배송비** (현재 환율 반영):\n");
        sb.append("- 소형 (~1kg): 한→일 약 ").append(String.format("%,d", (int)(1500 * r.getJpyToKrw()))).append(" KRW / 일→한 12,000 KRW\n");
        sb.append("- 중형 (2-3kg): 한→일 약 ").append(String.format("%,d", (int)(2500 * r.getJpyToKrw()))).append(" KRW / 일→한 20,000 KRW\n");
        sb.append("- 대형 (5kg+): 한→일 약 ").append(String.format("%,d", (int)(4500 * r.getJpyToKrw()))).append(" KRW / 일→한 35,000 KRW\n");
        sb.append("- 부피 큰 상품: +30-50% 추가\n");
        sb.append("- ⚠️ 실제 무게 모름 - 상품별 확인 필수\n\n");

        sb.append("**관세 및 세금 (일반 추정)**:\n");
        sb.append("- 일본 소비세: 10% (상품가 + 배송비)\n");
        sb.append("- 한국 부가세: 150,000원 초과 시 10%\n");
        sb.append("- 통관 수수료: 5,000~15,000원\n");
        sb.append("- 관세: 0~13% (품목별 상이)\n");
        sb.append("- ⚠️ HSCODE 없음 - 관세청 확인 필수\n\n");

        sb.append("**플랫폼 수수료 및 광고비 (2024년 기준)**:\n");
        sb.append("- 네이버: 판매 수수료 2% + 광고비 (클릭당 100-500원)\n");
        sb.append("- 쿠팡: 판매 수수료 10% + 로켓배송 시 추가\n");
        sb.append("- Amazon JP: 판매 수수료 8% + FBA 보관료 (월 약 ").append(String.format("%,d", (int)(1000 * r.getJpyToKrw()))).append(" KRW)\n");
        sb.append("- Rakuten: 판매 수수료 7% + 점포 월세 (약 ").append(String.format("%,d", (int)(19500 * r.getJpyToKrw()))).append(" KRW~)\n");
        sb.append("- 메루카리: 판매 수수료 10% + 결제 수수료\n");
        sb.append("- ⚠️ 정책 변동 가능 - 최신 약관 확인 필수\n\n");

        // ==========================================
        // 📈 시장 분석
        // ==========================================
        sb.append("### 📈 심층 시장 분석\n\n");

        sb.append("**가격 추이 분석**:\n");
        sb.append("- 최근 3개월 평균 가격 대비 현재가 평가 (추정)\n");
        sb.append("- 역대 최저가 가능성 평가\n");
        sb.append("- 가격 트렌드 (하락/상승/안정)\n\n");

        sb.append("**경쟁 환경**:\n");
        sb.append("- 각 플랫폼별 판매자 수 추정\n");
        sb.append("- 경쟁 강도 평가 (상품명 기반)\n");
        sb.append("- 신규 진입 난이도\n\n");

        sb.append("**환율 전략**:\n");
        sb.append("- 현재 환율 ").append(String.format("%.2f", (double) r.getJpyToKrw())).append(" KRW가 유리한지 평가\n");
        sb.append("- 최근 환율 트렌드 (역사적 평균 대비)\n");
        sb.append("- 환헤지 필요성\n\n");

        sb.append("**수요 분석**:\n");
        sb.append("- 계절성: 성수기/비수기\n");
        sb.append("- 트렌드: 유행 vs 스테디셀러\n");
        sb.append("- 타겟층: 연령/성별/구매력\n\n");

        // ==========================================
        // 🎯 전략 추천
        // ==========================================
        sb.append("### 🎯 전략적 제안\n\n");

        sb.append("**재고 전략**:\n");
        sb.append("- 초기 구매 수량 제안 (마진과 회전율 고려)\n");
        sb.append("- 재고 리스크 평가\n");
        sb.append("- 보관 비용 고려\n\n");

        sb.append("**마케팅 전략**:\n");
        sb.append("- 광고비 예산 제안\n");
        sb.append("- 키워드 전략\n");
        sb.append("- 번들 판매 가능성\n\n");

        sb.append("**리스크 관리**:\n");
        sb.append("- 반품률 예측 (카테고리별 평균 5-15%)\n");
        sb.append("- 불량률 고려\n");
        sb.append("- 환율 변동 대비책\n\n");

        // ==========================================
        // 📋 출력 형식
        // ==========================================
        sb.append("### 📋 상세 분석 출력 형식\n\n");

        sb.append("**1️⃣ 투자 판단 (3줄 요약)**\n");
        sb.append("→ Basic과 동일한 결론 (수익 불가/애매함/가능/강력추천)\n");
        sb.append("→ 더 상세한 논리와 근거 제시\n\n");

        sb.append("**2️⃣ 손익 시뮬레이션 (3가지 시나리오)**\n");
        sb.append("→ 최소 케이스: 무게 많고, 관세 높고, 환율 불리한 경우\n");
        sb.append("→ 평균 케이스: 일반적인 경우\n");
        sb.append("→ 최대 케이스: 무게 적고, 관세 낮고, 환율 유리한 경우\n\n");

        sb.append("**3️⃣ 시장 포지션**\n");
        sb.append("→ 가격 경쟁력, 시장 내 위치, 진입 장벽\n\n");

        sb.append("**4️⃣ 환율 분석**\n");
        sb.append("→ 현재 환율 유리한지, 대기 vs 즉시 판단\n\n");

        sb.append("**5️⃣ 경쟁 환경**\n");
        sb.append("→ 셀러 수, 리뷰 경쟁, 광고비 필요성\n\n");

        sb.append("**6️⃣ 타겟 고객**\n");
        sb.append("→ 연령/성별/구매력 분석\n\n");

        sb.append("**7️⃣ 마케팅 전략**\n");
        sb.append("→ 광고비 예산, 키워드, 프로모션\n\n");

        sb.append("**8️⃣ 재고 전략**\n");
        sb.append("→ 초기 수량, 회전율, 장기보관 리스크\n\n");

        sb.append("**9️⃣ 리스크 요약**\n");
        sb.append("→ TOP 3 리스크와 구체적 대응 방안\n\n");

        sb.append("**🔟 실행 계획 (3단계)**\n");
        sb.append("→ Step 1: 지금 당장 확인/준비할 것\n");
        sb.append("→ Step 2: 1주일 내 실행할 것\n");
        sb.append("→ Step 3: 장기 전략\n\n");

        // ==========================================
        // 🚨 면책 조항
        // ==========================================
        sb.append("**🚨 면책 조항 (반드시 포함)**\n\n");
        sb.append("다음 내용을 반드시 포함하세요:\n\n");
        sb.append("「본 프리미엄 분석은 추정치 기반이며, 다음 한계가 있습니다:\n\n");
        sb.append("【데이터 한계】\n");
        sb.append("• 정확한 상품 무게/부피 데이터 없음 → 실제 배송비 ±30% 차이 가능\n");
        sb.append("• HSCODE 정보 없음 → 실제 관세율 0%~13% 범위에서 상이 가능\n");
        sb.append("• 플랫폼 정책 수시 변경 → 수수료율 변동 가능\n");
        sb.append("• 환율 변동 리스크 → 일일 ±3% 변동 가능\n\n");

        sb.append("【실제 거래 전 필수 확인】\n");
        sb.append("1. 상품 상세 페이지에서 정확한 무게/부피 확인\n");
        sb.append("2. 택배사에 실제 배송비 견적 요청\n");
        sb.append("3. 관세청 또는 관세사에 HSCODE 및 관세율 확인\n");
        sb.append("4. 각 플랫폼의 최신 판매자 정책 및 수수료 확인\n");
        sb.append("5. 환율 변동 추이 모니터링 및 환헤지 검토\n\n");

        sb.append("【면책】\n");
        sb.append("본 분석은 의사결정 참고 자료일 뿐, 투자 손익을 보장하지 않습니다.\n");
        sb.append("최종 투자 판단과 그 결과에 대한 모든 책임은 사용자에게 있습니다.」\n\n");

        sb.append("---\n");
        sb.append("💎 **프리미엄 분석 원칙**:\n");
        sb.append("- Basic과 결론 동일, 근거는 10배 상세\n");
        sb.append("- 시나리오별 분석으로 불확실성 대응\n");
        sb.append("- 실행 가능한 구체적 액션 플랜 제공\n");
        sb.append("- 면책 조항 반드시 포함!\n");

        return sb.toString();
    }
}