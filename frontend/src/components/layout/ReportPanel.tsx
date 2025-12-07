// src/components/layout/ReportPanel.tsx
import React from "react";
import { useLang } from "../../context/LangContext";

export default function ReportPanel({ basicAi, premiumAi, activeTab }) {
  const { lang } = useLang();

  return (
    <div className="bg-white p-6 rounded shadow">
      {activeTab === "basic" ? (
        <>
          <h2 className="text-xl font-bold mb-2">
            {lang === "jp" ? "基本分析" : "기본 분석"}
          </h2>
          <p className="whitespace-pre-line">{basicAi}</p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">
            {lang === "jp" ? "プレミアム分析" : "프리미엄 분석"}
          </h2>
          <p className="whitespace-pre-line">{premiumAi}</p>
        </>
      )}
    </div>
  );
}
