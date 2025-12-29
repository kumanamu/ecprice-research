package com.ecprice_research.domain.margin.service;

import com.ecprice_research.domain.margin.dto.AiMarginAnalysis;
import com.ecprice_research.domain.margin.dto.MarginCompareResult;
import com.ecprice_research.domain.margin.util.BasicPromptBuilder;
import com.ecprice_research.domain.margin.util.PremiumPromptBuilder;
import com.ecprice_research.domain.openai.OpenAiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiAnalysisService {

    private final OpenAiClient openAiClient;

    /**
     * ✅ analyze 메서드 시그니처 변경: lang 파라미터 추가
     */
    public AiMarginAnalysis analyze(MarginCompareResult result, boolean premium, String lang) {

        try {
            // 1️⃣ 프롬프트 생성
            String promptCore = premium
                    ? PremiumPromptBuilder.build(result)
                    : BasicPromptBuilder.build(result);

            // 2️⃣ 언어별 지시문 추가
            String prompt = "ko".equalsIgnoreCase(lang)
                    ? "모든 응답은 한국어로 작성해주세요.\n\n" + promptCore
                    : "すべての回答は日本語で書いてください。\n\n" + promptCore;

            // 3️⃣ AI 호출 (1번만!)
            log.info("🤖 [AI Analysis] premium={}, lang={}, platform={}",
                    premium, lang, result.getBestPlatform());

            String answer = openAiClient.ask(prompt);
            log.info("✅ [AI Analysis 완료] lang={}", lang);

            // 4️⃣ 선택된 언어만 채움
            return AiMarginAnalysis.builder()
                    .buyPlatform(result.getBestPlatform())
                    .sellPlatform("Amazon / Rakuten / Coupang / Naver")
                    .profitKrw(result.getProfitKrw())
                    .profitRate(result.getProfitKrw() > 0 ? 100.0 : 0.0)
                    .textKo("ko".equalsIgnoreCase(lang) ? answer : null)
                    .textJp("jp".equalsIgnoreCase(lang) ? answer : null)
                    .reason(answer)
                    .build();

        } catch (Exception e) {
            log.error("❌ AI 분석 실패", e);
            return AiMarginAnalysis.builder()
                    .buyPlatform("-")
                    .sellPlatform("-")
                    .profitKrw(0)
                    .profitRate(0)
                    .textKo("ko".equalsIgnoreCase(lang) ? "AI 분석 실패" : null)
                    .textJp("jp".equalsIgnoreCase(lang) ? "AI分析失敗" : null)
                    .reason("AI 분석 실패")
                    .build();
        }
    }
}