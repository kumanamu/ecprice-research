import React, { useState } from "react";
import SearchBar from "../components/search/SearchBar";
import SummaryHeader from "../components/report/SummaryHeader";
import PlatformCards from "../components/report/PlatformCards";
import Loader from "../components/common/Loader";
import { useLang } from "../context/LangContext";

const Home: React.FC = () => {
  const { lang } = useLang();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // 플랫폼별 수신 데이터
  const [platformResults, setPlatformResults] = useState<any>({});
  const [done, setDone] = useState(false);

  const onSearch = () => {
  if (!keyword.trim()) return;

  console.log("🔥 SSE START keyword=", keyword, "lang=", lang);

  setLoading(true);
  setPlatformResults({});

  // ❗ 절대 localhost:8080 쓰지 마라
  const es = new EventSource(
    `/api/margin/stream2?keyword=${encodeURIComponent(keyword)}&lang=${lang}`
  );

  es.onopen = () => console.log("🔗 SSE CONNECTED");

  es.onerror = (err) => {
    console.error("❌ SSE ERROR", err);
    es.close();
    setLoading(false);
  };

  es.addEventListener("platform", (event) => {
    const parsed = JSON.parse(event.data);
    console.log("📨 PLATFORM DATA:", parsed);

    setPlatformResults((prev) => ({
      ...prev,
      [parsed.platform]: parsed.data,
    }));
  });

  es.addEventListener("done", () => {
    console.log("🏁 SSE DONE");
    es.close();
    setLoading(false);
  });
};

  return (
    <>
      <SearchBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={onSearch}
        lang={lang}
      />

      {loading && <Loader label="데이터 수신 중..." />}

      {/* 플랫폼 가격 카드 */}
      {Object.keys(platformResults).length > 0 && (
        <PlatformCards results={platformResults} />
      )}

      {/* 가격 도착 후 요약 */}
      {done && (
        <SummaryHeader
          platformResults={platformResults}
          keyword={keyword}
          lang={lang}
        />
      )}
    </>
  );
};

export default Home;
