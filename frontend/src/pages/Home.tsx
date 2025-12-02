import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import SearchBar from "../components/search/SearchBar";
import ToggleLanguage from "../components/search/ToggleLanguage";
import TogglePremium from "../components/search/TogglePremium";

import PriceSection from "../components/price/PriceSection";
import ProductList from "../components/price/ProductList";
import ReportPanel from "../components/layout/ReportPanel";

import { MarginResponse } from "../types/marginTypes";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [lang, setLang] = useState<"ko" | "jp">("ko");
  const [premium, setPremium] = useState(false);

  const [data, setData] = useState<MarginResponse | null>(null);

  return (
    <MainLayout>
      {/* 왼쪽 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingRight: "20px",
        }}
      >
        {/* 검색 섹션 */}
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          setData={setData}
          lang={lang}
          premium={premium}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <ToggleLanguage lang={lang} setLang={setLang} />
          <TogglePremium premium={premium} setPremium={setPremium} />
        </div>

        {/* 가격 비교 */}
        <PriceSection data={data} />

        {/* 상품 리스트 */}
        <ProductList data={data} />
      </div>

      {/* 오른쪽: 보고서 패널 (AI 분석 결과) */}
      <ReportPanel data={data} premium={premium} />
    </MainLayout>
  );
}
