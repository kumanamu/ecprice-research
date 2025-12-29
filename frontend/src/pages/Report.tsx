// src/pages/Report.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ReportLayout from "../components/report/ReportLayout";
import PlatformResultGrid from "../components/report/PlatformResultGrid";
import SummaryHeader from "../components/report/SummaryHeader";
import AiAnalysisPanel from "../components/report/AiAnalysisPanel";
import LoadingStatus from "../components/common/LoadingStatus";

import { marginStreamUrl, marginApi } from "../api/marginApi";
import { useLang } from "../context/LangContext";

import type { MarginResponse, PriceInfo } from "../types/marginTypes";

const PLATFORM_ORDER = ["naver", "coupang", "amazon", "rakuten"];
const PLATFORM_COUNT = PLATFORM_ORDER.length;

export default function Report() {
  const { lang } = useLang();
  const [params] = useSearchParams();
  const keyword = params.get("keyword")?.trim() || "";

  /* ===============================
   * 상태 (헌법 기준)
   * =============================== */
  const [platformResults, setPlatformResults] = useState<
    Record<string, PriceInfo>
  >({});
  const [currentPlatform, setCurrentPlatform] = useState<string>();
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<MarginResponse | null>(null);

  /* ===============================
   * 내부 제어 ref
   * =============================== */
  const esRef = useRef<EventSource | null>(null);
  const finalCalledRef = useRef(false);

  /* ===============================
   * SSE 시작 (keyword 필수)
   * =============================== */
  useEffect(() => {
    if (!keyword) return;

    // 기존 연결 정리
    if (esRef.current) esRef.current.close();

    // 상태 초기화
    setPlatformResults({});
    setCurrentPlatform(undefined);
    setFinished(false);
    setFinalResult(null);
    finalCalledRef.current = false;

    const url = marginStreamUrl(keyword, lang);
    const es = new EventSource(url);
    esRef.current = es;

    /* ---- 플랫폼 결과 수신 ---- */
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const platform = data.platform as string;

      setPlatformResults((prev) => {
        // 이미 받은 플랫폼은 무시 (중복 방지)
        if (prev[platform]) return prev;

        const next = {
          ...prev,
          [platform]: data as PriceInfo,
        };

        // 1️⃣ 보조 종료 로직: 4개 다 모이면 종료
        if (Object.keys(next).length === PLATFORM_COUNT) {
          setFinished(true);
          es.close();
          esRef.current = null;
        }

        return next;
      });
    };

    /* ---- 1️⃣ event:end 대응 ---- */
    es.addEventListener("end", () => {
      setFinished(true);
      es.close();
      esRef.current = null;
    });

    /* ---- 에러 시 종료 ---- */
    es.onerror = () => {
      es.close();
      esRef.current = null;
      setFinished(true);
    };

    return () => {
      es.close();
    };
  }, [keyword, lang]);

  /* ===============================
   * 3️⃣ 진행 플랫폼 계산 (순서 고정)
   * =============================== */
  useEffect(() => {
    const received = Object.keys(platformResults);
    const next = PLATFORM_ORDER.find((p) => !received.includes(p));
    setCurrentPlatform(next);
  }, [platformResults]);

  /* ===============================
   * finalCompare (단 1회)
   * =============================== */
  useEffect(() => {
    if (!finished) return;
    if (finalCalledRef.current) return;
    if (!keyword) return;

    // 3️⃣ 플랫폼 결과가 하나도 없으면 호출 안 함
    if (Object.keys(platformResults).length === 0) return;

    finalCalledRef.current = true;

    marginApi
      .finalCompare(keyword, lang, platformResults)
      .then((res) => {
        setFinalResult(res.data as MarginResponse);
      })
      .catch(() => {
        // 실패해도 재호출 없음 (헌법)
      });
  }, [finished, keyword, lang, platformResults]);

  /* ===============================
   * 표시용 정렬 결과 (순서 고정)
   * =============================== */
  const orderedResults = useMemo(() => {
    const ordered: Record<string, PriceInfo> = {};
    PLATFORM_ORDER.forEach((p) => {
      if (platformResults[p]) ordered[p] = platformResults[p];
    });
    return ordered;
  }, [platformResults]);

  /* ===============================
   * LoadingStatus finished 의미 확장
   * - finished=false  → 가격 수집 중
   * - finished=true && finalResult=null → AI 분석 중
   * - finished=true && finalResult!=null → 완료
   * =============================== */

  return (
    <main className="py-10">
      <ReportLayout
        left={
          <>
            <PlatformResultGrid
              platformResults={orderedResults}
              onSelect={() => {}}
            />

            <LoadingStatus
              currentPlatform={currentPlatform}
              finished={finished}
            />

            {finalResult && <SummaryHeader result={finalResult} />}
          </>
        }
        right={finalResult ? <AiAnalysisPanel result={finalResult} /> : null}
      />
    </main>
  );
}
