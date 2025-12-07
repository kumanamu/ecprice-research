import React, { useState } from "react";
import ToggleLanguage from "../search/ToggleLanguage";
import TogglePremium from "../search/TogglePremium";

export default function Header() {
  const [aiMode, setAiMode] = useState<"basic" | "premium">("basic");

  return (
    <header className="w-full flex justify-between items-center p-4 border-b bg-white">
      <h1 className="text-xl font-bold">ECPriceResearch</h1>

      <div className="flex items-center gap-2">
        {/* 🔥 여기에 실제 동작하는 토글키 */}
        <TogglePremium
          type={aiMode}
          onChange={(v) => setAiMode(v)}
          lang="ko"   // ← 필요하면 나중에 lang context와 연결
        />

        <ToggleLanguage />
      </div>
    </header>
  );
}
