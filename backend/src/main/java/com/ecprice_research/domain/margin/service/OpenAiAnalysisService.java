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
     * ✅ 한국어 + 일본어 분석 동시 생성
     */
    public AiMarginAnalysis analyze(MarginCompareResult result, boolean premium) {

        try {
            // 1️⃣ 한국어 프롬프트 생성
            String promptCoreKo = premium
                    ? PremiumPromptBuilder.build(result)
                    : BasicPromptBuilder.build(result);

            String promptKo = "모든 응답은 한국어로 작성해주세요.\n\n" + promptCoreKo;

            // 2️⃣ 일본어 프롬프트 생성
            String promptCoreJp = premium
                    ? PremiumPromptBuilder.build(result)
                    : BasicPromptBuilder.build(result);

            String promptJp = "すべての回答は日本語で書いてください。\n\n" + promptCoreJp;

            // 3️⃣ AI 호출 2번 (한국어 + 일본어)
            log.info("🤖 [AI Analysis] premium={} bestPlatform={}", premium, result.getBestPlatform());

            String answerKo = openAiClient.ask(promptKo);
            log.info("🤖 [AI Analysis KO] {}", answerKo);

            String answerJp = openAiClient.ask(promptJp);
            log.info("🤖 [AI Analysis JP] {}", answerJp);

            // 4️⃣ 결과 반환
            return AiMarginAnalysis.builder()
                    .buyPlatform(result.getBestPlatform())
                    .sellPlatform("Amazon / Rakuten / Coupang / Naver")
                    .profitKrw(result.getProfitKrw())
                    .profitRate(result.getProfitKrw() > 0 ? 100.0 : 0.0)
                    .textKo(answerKo)  // ✅ 한국어
                    .textJp(answerJp)  // ✅ 일본어
                    .reason(answerKo)
                    .build();

        } catch (Exception e) {
            log.error("AI 분석 실패", e);
            return AiMarginAnalysis.builder()
                    .buyPlatform("-")
                    .sellPlatform("-")
                    .profitKrw(0)
                    .profitRate(0)
                    .textKo("AI 분석 실패")
                    .textJp("AI分析失敗")
                    .reason("AI 분석 실패")
                    .build();
        }
    }
}