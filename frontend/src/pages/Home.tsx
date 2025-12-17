// src/pages/Home.tsx
import React, { useRef, useState } from "react";
import HomeHeroRaw from "../components/home/HomeHeroRaw";
import PlatformResultGrid from "../components/report/PlatformResultGrid";
import PlatformDetailPanel from "../components/report/PlatformDetailPanel";
import SummaryHeader from "../components/report/SummaryHeader";
import AiAnalysisPanel from "../components/report/AiAnalysisPanel";
import Loader from "../components/common/Loader";
import ReportSaveBar from "../components/report/ReportSaveBar";
import ReportHistoryPreview from "../components/report/ReportHistoryPreview";
import { useLang } from "../context/LangContext";
import type { MarginResponse, PriceInfo } from "../types/marginTypes";

export default function Home() {
  const { lang } = useLang();
  const [keyword, setKeyword] = useState("");

  const [platformResults, setPlatformResults] = useState<
    Record<string, PriceInfo>
  >({});
  const [finalResult, setFinalResult] = useState<MarginResponse | null>(null);

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<PriceInfo | null>(null);

  const platformRef = useRef<Record<string, PriceInfo>>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  const onSearch = () => {
    if (!keyword.trim()) return;

    setPlatformResults({});
    setFinalResult(null);
    platformRef.current = {};

    setLoadingPrices(true);
    setLoadingAi(false);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(
      `/api/margin/stream?keyword=${encodeURIComponent(keyword)}&lang=${lang}`
    );
    eventSourceRef.current = es;

    // ✅ SSE platform 이벤트 — 백 계약 그대로
    es.addEventListener("platform", (e) => {
      const parsed = JSON.parse((e as MessageEvent).data);

      const platform: string = parsed.platform;
      const data: PriceInfo = parsed.data;

      platformRef.current[platform] = data;
      setPlatformResults({ ...platformRef.current });
    });

    es.addEventListener("done", () => {
      es.close();
      eventSourceRef.current = null;

      setLoadingPrices(false);
      setLoadingAi(true);

      fetch(
        `/api/margin/finalCompare?keyword=${encodeURIComponent(
          keyword
        )}&lang=${lang}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(platformRef.current),
        }
      )
        .then((res) => res.json())
        .then((data: MarginResponse) => {
          setFinalResult(data);
        })
        .finally(() => setLoadingAi(false));
    });

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      setLoadingPrices(false);
      setLoadingAi(false);
    };
  };

  return (
    <>
      <HomeHeroRaw
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={onSearch}
      />

      {loadingPrices && (
        <Loader
          label={
            lang === "ko"
              ? "플랫폼별 가격 수집 중..."
              : "プラットフォーム価格取得中..."
          }
        />
      )}

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {Object.keys(platformResults).length > 0 && (
          <PlatformResultGrid
            platformResults={platformResults}
            onSelect={(platform, data) => {
              setSelectedPlatform(platform);
              setSelectedData(data);
            }}
          />
        )}

        {loadingAi && (
          <Loader label={lang === "ko" ? "AI 분석 중..." : "AI分析中..."} />
        )}

        {finalResult && (
          <>
            <SummaryHeader result={finalResult} />
            <ReportSaveBar onSave={() => {}} />
            <AiAnalysisPanel result={finalResult} />
          </>
        )}
      </div>

      <ReportHistoryPreview items={[]} />

      {selectedPlatform && selectedData && (
        <PlatformDetailPanel
          platform={selectedPlatform}
          data={selectedData}
          onClose={() => {
            setSelectedPlatform(null);
            setSelectedData(null);
          }}
        />
      )}
    </>
  );
}
