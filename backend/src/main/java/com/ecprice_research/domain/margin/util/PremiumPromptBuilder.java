package com.ecprice_research.domain.margin.util;

import com.ecprice_research.domain.margin.dto.MarginFinalResponse;
import com.ecprice_research.domain.margin.dto.PriceInfo;

public class PremiumPromptBuilder {

    public static String build(MarginFinalResponse r) {

        StringBuilder sb = new StringBuilder();

        sb.append("다음은 ECPriceResearch의 프리미엄 분석 요청입니다.\n");
        sb.append("매우 정교하고, 수치 기반이며, 실전 비즈니스 전략 보고서처럼 작성하십시오.\n");
        sb.append("주어진 가격 데이터를 기반으로 '국가별 판매 마진'을 계산하고 최적의 전략을 도출하세요.\n\n");

        sb.append("검색어: ").append(r.getKeyword()).append("\n");
        sb.append("환율: 1 JPY = ").append(r.getJpyToKrw()).append(" KRW\n\n");

        sb.append("📦 플랫폼별 가격 데이터\n");
        r.getPlatformPrices().forEach((p, info) -> {
            sb.append("- ").append(p).append(":\n");
            sb.append("  KRW: ").append(info.getPriceKrw()).append("\n");
            sb.append("  JPY: ").append(info.getPriceJpy()).append("\n");
        });
        sb.append("\n");

        sb.append("※ 반드시 아래의 '계산 기준'을 사용해 실전 마진을 계산하십시오.\n\n");

        sb.append("────────────────────────────────────\n");
        sb.append("📐 [필수] 국가별 마진 계산 기준 (정확하게 이 공식을 사용)\n");
        sb.append("1) 한국 → 일본 판매 시 비용 공식\n");
        sb.append("   - 국제배송비(EMS or Yamato 평균): 18,000 ~ 28,000 KRW\n");
        sb.append("   - 일본 통관 소비세: 상품가(JPY)의 10%\n");
        sb.append("   - 플랫폼 수수료(메루카리): 판매가의 10%\n");
        sb.append("   - 최종 순이익 = 판매가(JPY) - 소비세 - 수수료 - 국제배송비(환산 JPY)\n\n");

        sb.append("2) 일본 → 한국 판매 시 비용 공식\n");
        sb.append("   - 국제배송비: 1,500 ~ 2,800 JPY\n");
        sb.append("   - 한국 관부가세: 150,000 KRW 초과 시 10% 부가세\n");
        sb.append("   - 국내 배송비: 3,000 KRW\n");
        sb.append("   - 최종 순이익 = 판매가(KRW) - 부가세 - 국내배송비 - 국제배송비(환산 KRW)\n\n");

        sb.append("3) 동일 국가 내 판매 (JP→JP / KR→KR)\n");
        sb.append("   - 배송비: 일본 700~900엔 / 한국 3,000원\n");
        sb.append("   - 플랫폼 수수료: 7% ~ 10%\n");
        sb.append("   - 최종 순이익 = 판매가 - 수수료 - 배송비\n\n");

        sb.append("※ 위의 공식에 따라 국가별 순이익을 정량적으로 계산하라.\n");
        sb.append("※ 반드시 계산 결과를 표로 정리하라.\n");
        sb.append("────────────────────────────────────\n\n");

        sb.append("🧩 분석 보고서 구성은 아래 형식을 그대로 따라 작성\n\n");

        sb.append("────────────────────────────────────\n");
        sb.append("📘 1) EXECUTIVE SUMMARY (요약)\n");
        sb.append("- 핵심 결론\n");
        sb.append("- 최저가 플랫폼\n");
        sb.append("- 어떤 국가로 판매할 때 가장 높은 순이익이 발생하는지\n");
        sb.append("- 추천 판매 국가의 이유\n\n");

        sb.append("────────────────────────────────────\n");
        sb.append("📊 2) PRICE COMPARISON TABLE (가격 비교)\n");
        sb.append("플랫폼 | KRW | JPY\n");
        sb.append("-------------------------\n");
        r.getPlatformPrices().forEach((p, info) -> {
            sb.append(p).append(" | ")
                    .append(info.getPriceKrw()).append(" KRW | ")
                    .append(info.getPriceJpy()).append(" JPY\n");
        });
        sb.append("\n");

        sb.append("────────────────────────────────────\n");
        sb.append("📈 3) COUNTRIES PROFIT SIMULATION (국가별 순이익 비교)\n");
        sb.append("아래 항목을 반드시 포함:\n");
        sb.append("- 한국 → 일본 판매 시 총비용/순이익 계산\n");
        sb.append("- 일본 → 한국 판매 시 총비용/순이익 계산\n");
        sb.append("- 한국 → 한국 판매 순이익\n");
        sb.append("- 일본 → 일본 판매 순이익\n");
        sb.append("- 국가별 순이익을 표 형태로 비교\n");
        sb.append("- 어느 국가 판매가 가장 이득인지 명확하게 결론\n\n");

        sb.append("────────────────────────────────────\n");
        sb.append("🌍 4) COUNTRY STRATEGY (국가 전략)\n");
        sb.append("- 한국 판매 장단점\n");
        sb.append("- 일본 판매 장단점\n");
        sb.append("- 플랫폼 수요/경쟁도 분석\n");
        sb.append("- 물류/배송 위험 요소 분석\n\n");

        sb.append("────────────────────────────────────\n");
        sb.append("💰 5) FINAL RECOMMENDATION (최종 전략)\n");
        sb.append("- 구매 추천 플랫폼\n");
        sb.append("- 판매 추천 국가\n");
        sb.append("- 예상 순이익 범위\n");
        sb.append("- 최종 한 문장 전략 요약\n");
        sb.append("────────────────────────────────────\n");

        return sb.toString();
    }
}