import React, { useState, useRef } from "react";
import SearchBar from "../components/search/SearchBar";
import SummaryHeader from "../components/report/SummaryHeader";
import PlatformCards from "../components/report/PlatformCards";
import Loader from "../components/common/Loader";
import { useLang } from "../context/LangContext";
import type { MarginResponse, PriceInfo } from "../types/marginTypes";

const Home: React.FC = () => {
  const { lang } = useLang();

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [platformResults, setPlatformResults] = useState<Record<string, PriceInfo>>({});
  const [finalResult, setFinalResult] = useState<MarginResponse | null>(null);

  const platformRef = useRef<Record<string, PriceInfo>>({});
  const requestIdRef = useRef<string | null>(null); // ✅ [보안] 요청 식별자

  const onSearch = () => {
    if (!keyword.trim()) return;

    const requestId = crypto.randomUUID(); // ✅ [보안] 요청 ID 생성
    requestIdRef.current = requestId;

    setLoading(true);
    setPlatformResults({});
    platformRef.current = {};
    setFinalResult(null);

const API_KEY = import.meta.env.VITE_ECPRICE_ACCESS_KEY;

const socket = new EventSource(
  `/api/margin/stream?keyword=${encodeURIComponent(keyword)}&lang=${lang}&key=${API_KEY}`
);
console.log("API KEY =", import.meta.env.VITE_ECPRICE_API_KEY);

    socket.addEventListener("platform", (event: MessageEvent) => {
      const parsed = JSON.parse(event.data);
      const platform = parsed.platform;
      const data: PriceInfo = parsed.data;
console.log("ALL ENV =", import.meta.env);

      platformRef.current[platform] = data;
      setPlatformResults({ ...platformRef.current });
    });

    socket.addEventListener("done", () => {
      socket.close();

      const postBody = platformRef.current;

      fetch(
  `/api/margin/finalCompare?keyword=${encodeURIComponent(keyword)}&lang=${lang}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-EC-ACCESS": import.meta.env.VITE_ECPRICE_ACCESS_KEY, // ← 이 줄 추가
    },
    body: JSON.stringify(postBody),
  }
)
        .then((res) => res.json())
        .then((data: MarginResponse) => {
          setFinalResult(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("FINAL ERROR:", err);
          setLoading(false);
        });
    });

    socket.onerror = () => {
      console.error("SSE ERROR");
      socket.close();
      setLoading(false);
    };
  };

  return (
    <>
      <SearchBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={onSearch}
        lang={lang}
      />

      {loading && <Loader label="Loading..." />}

      {Object.keys(platformResults).length > 0 && (
        <>
          <SummaryHeader platformResults={platformResults} />
          <PlatformCards platformResults={platformResults} />
        </>
      )}

      {finalResult && (
        <div style={{ marginTop: "30px" }}>
          <h2>🔍 최종 AI 분석 결과</h2>

          <div className="analysis-box">
            <h3>📌 Basic 분석</h3>
            <pre>
              {lang === "jp"
                ? finalResult.basicAi.textJp
                : finalResult.basicAi.textKo}
            </pre>

            <h3>🌟 Premium 분석</h3>
            <pre>
              {lang === "jp"
                ? finalResult.premiumAi.textJp
                : finalResult.premiumAi.textKo}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
