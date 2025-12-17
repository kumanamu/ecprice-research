import React from "react";
import HomeHeroRaw from "./HomeHeroRaw";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
}

export default function HomeHero({
  keyword,
  onKeywordChange,
  onSearch,
}: Props) {
  /**
   * ❗️중요
   * - 디자인은 HomeHeroRaw
   * - 여긴 "연결만" 한다
   * - JSX 구조 절대 건드리지 않는다
   */

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch();
        }
      }}
    >
      {/* 
        Step 2에서는 아직 직접 바인딩 안 한다.
        Step 3에서 input/button만 props로 교체 예정
      */}
      <HomeHeroRaw />
    </div>
  );
}
