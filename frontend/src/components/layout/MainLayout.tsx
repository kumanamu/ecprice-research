// src/components/layout/MainLayout.tsx
import React, { useState } from "react";
import Sidebar from "../common/Sidebar";
import Header from "./Header";
import { useLang } from "../../context/LangContext";
import { Outlet } from "react-router-dom";


export default function MainLayout() {
  const { lang } = useLang();

  // 🔹 전역 AI 모드 (Basic / Premium)
  const [aiMode, setAiMode] = useState<"basic" | "premium">("basic");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header aiMode={aiMode} onChangeAiMode={setAiMode} lang={lang} />

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet context={{ aiMode }} />
        </main>
      </div>
    </div>
  );
}
