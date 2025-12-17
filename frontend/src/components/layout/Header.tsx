// src/components/layout/Header.tsx
import React from "react";
import ToggleLanguage from "../search/ToggleLanguage";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            analytics
          </span>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            EC Analyzer
          </h1>
        </div>

        {/* 🔥 번역 토글 (STEP 10-1 핵심) */}
        <div className="flex items-center gap-2">
          <ToggleLanguage />
        </div>
      </div>
    </header>
  );
}
