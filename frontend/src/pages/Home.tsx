// src/pages/Home.tsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ 추가
import HomeHeroRaw from "../components/home/HomeHeroRaw";
import PlatformResultGrid from "../components/report/PlatformResultGrid";
import PlatformDetailPanel from "../components/report/PlatformDetailPanel";
import SummaryHeader from "../components/report/SummaryHeader";
import KeyMetricsSection from "../components/report/KeyMetricsSection";
import ChartsSection from "../components/report/ChartsSection";
import AiAnalysisPanel from "../components/report/AiAnalysisPanel";
import Loader from "../components/common/Loader";
import LoginRequiredModal from "../components/common/LoginRequiredModal";

import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";
import { marginStreamUrl } from "../api/marginApi";  // ✅ 수정
import { removeToken } from "../api/axios";  // ✅ 수정
import type {
  MarginResponse,
  PriceInfo,
  AiMarginAnalysis,
} from "../types/marginTypes";

const EXPECTED_PLATFORMS = ["naver", "coupang", "amazon", "rakuten"];

export default function Home() {
  const { lang } = useLang();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();  // ✅ 추가

  const [keyword, setKeyword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [platformResults, setPlatformResults] = useState<Record<string, PriceInfo>>({});
  const platformRef = useRef<Record<string, PriceInfo>>({});

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [finalResult, setFinalResult] = useState<MarginResponse | null>(null);

  const [basicAi, setBasicAi] = useState<AiMarginAnalysis | null>(null);
  const [premiumAi, setPremiumAi] = useState<AiMarginAnalysis | null>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<PriceInfo | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  const startSearch = () => {
    if (!keyword.trim()) return;

    // ✅ 토큰 체크 추가
    const token = localStorage.getItem("accessToken");  // ✅ accessToken으로 수정
    if (!token) {
      console.log("🚨 토큰 없음 - 로그인 필요");
      setShowLoginModal(true);
      return;
    }

    setPlatformResults({});
    setFinalResult(null);
    setBasicAi(null);
    setPremiumAi(null);
    platformRef.current = {};
    setLoadingPrices(true);
    setLoadingAi(false);

    eventSourceRef.current?.close();

    // ✅ marginStreamUrl 사용 (토큰 자동 포함)
    const streamUrl = marginStreamUrl(keyword, lang);
    console.log("🔗 SSE URL:", streamUrl);

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener("platform", (e) => {
      const parsed = JSON.parse((e as MessageEvent).data);

      console.log("📦 플랫폼 수신:", parsed.platform, parsed.data);

      platformRef.current[parsed.platform] = parsed.data;
      setPlatformResults({ ...platformRef.current });

      const receivedPlatforms = Object.keys(platformRef.current);
      console.log("📊 현재 받은 플랫폼:", receivedPlatforms);

      const receivedLower = receivedPlatforms.map((p) => p.toLowerCase());
      const allReceived = EXPECTED_PLATFORMS.every((p) => receivedLower.includes(p));

      console.log("🔍 allReceived:", allReceived);

      if (allReceived) {
        console.log("✅ 모든 플랫폼 수신 완료! finalCompareStream 호출");

        es.close();
        eventSourceRef.current = null;

        setLoadingPrices(false);
        setLoadingAi(true);

        console.log("🚀 finalCompareStream 요청 시작");

        // ✅ 절대 URL 사용
        const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";

        fetch(
          `${baseURL}/margin/finalCompareStream?keyword=${encodeURIComponent(keyword)}&lang=${lang}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(platformRef.current),
          }
        ).then((response) => {
          console.log("📡 finalCompareStream 응답:", response.status);

          // ✅ 401 에러 처리 추가
          if (response.status === 401) {
            console.error("🚨 인증 만료 - 로그아웃 처리");
            removeToken();
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate("/login");
            setLoadingAi(false);
            return;
          }

          if (!response.ok) {
            console.error("❌ finalCompareStream 실패:", response.status);
            setLoadingAi(false);
            return;
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            console.error("❌ Reader 없음");
            setLoadingAi(false);
            return;
          }

          let buffer = "";

          function readStream(): void {
            reader!.read().then(({ done, value }) => {
              if (done) {
                setLoadingAi(false);
                console.log("✅ SSE 스트림 종료");
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              console.log("📦 받은 청크:", chunk);

              buffer += chunk;
              const messages = buffer.split("\n\n");
              buffer = messages.pop() || "";

              for (const msg of messages) {
                if (!msg.trim()) continue;

                console.log("📨 메시지:", msg);

                const lines = msg.split("\n");
                let eventName = "";
                let eventData = "";

                for (const line of lines) {
                  if (line.startsWith("event:")) {
                    eventName = line.substring(6).trim();
                  } else if (line.startsWith("data:")) {
                    eventData = line.substring(5).trim();
                  }
                }

                if (eventName && eventData) {
                  console.log(`✅ 이벤트: ${eventName}`);
                  const data = JSON.parse(eventData);

                  if (eventName === "basic") {
                    console.log("✅ Basic AI 수신:", data);
                    setFinalResult(data);
                    setPlatformResults(data.platformPrices);
                    setBasicAi(data.basicAi);
                  } else if (eventName === "premium") {
                    console.log("✅ Premium AI 수신:", data);
                    setPremiumAi(data.premiumAi);
                    setLoadingAi(false);
                  }
                }
              }

              readStream();
            }).catch((err) => {
              console.error("❌ 스트림 읽기 에러:", err);
              setLoadingAi(false);
            });
          }

          readStream();
        }).catch((err) => {
          console.error("❌ finalCompareStream 에러:", err);
          setLoadingAi(false);
        });
      }
    });

    // ✅ 에러 핸들링 강화
    es.onerror = (error) => {
      console.error("🚨 [SSE] 연결 에러:", error);

      // EventSource가 닫혔으면 = 서버에서 연결 거부 (401 등)
      if (es.readyState === EventSource.CLOSED) {
        console.log("🚨 [SSE] 인증 실패 - 로그아웃 처리");

        es.close();
        eventSourceRef.current = null;

        // 토큰 삭제
        removeToken();

        // 로딩 상태 해제
        setLoadingPrices(false);
        setLoadingAi(false);

        // 로그아웃 알림
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");

        // 로그인 페이지로 이동
        navigate("/login");
      } else {
        // 일반 네트워크 에러
        es.close();
        eventSourceRef.current = null;
        setLoadingPrices(false);
        setLoadingAi(false);
      }
    };
  };

  const onSearch = isAuthenticated ? startSearch : () => setShowLoginModal(true);

  return (
    <>
      <HomeHeroRaw
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={onSearch}
        loading={loadingPrices || loadingAi}
      />

      {loadingPrices && <Loader label="가격 수집 중..." />}
      {loadingAi && <Loader label="AI 분석 중..." />}

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {Object.keys(platformResults).length > 0 && (
          <PlatformResultGrid
            platformResults={platformResults}
            onSelect={(p, d) => {
              setSelectedPlatform(p);
              setSelectedData(d);
            }}
            isAnalyzing={loadingAi}
          />
        )}

        {finalResult && (
          <>
            <SummaryHeader result={finalResult} />
            <KeyMetricsSection
              platform={finalResult.bestPlatform}
              profitKrw={finalResult.profitKrw}
              profitJpy={finalResult.profitJpy}
              lang={lang}
              prices={platformResults}
              jpyToKrw={finalResult.jpyToKrw}
            />
            <ChartsSection
              prices={platformResults}
              bestPlatform={finalResult.bestPlatform}
            />
            <AiAnalysisPanel basicAi={basicAi} premiumAi={premiumAi} />
          </>
        )}
      </div>

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

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}