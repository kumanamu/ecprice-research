// src/components/common/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";

export default function Sidebar() {
  const { lang } = useLang();

  return (
    <aside className="w-56 bg-gray-100 h-screen flex flex-col p-6 border-r">
      <h1 className="text-xl font-bold mb-6">ECPriceResearch</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:underline">
          {lang === "jp" ? "ホーム" : "홈"}
        </Link>

        <Link to="/report" className="hover:underline">
          {lang === "jp" ? "レポート" : "리포트"}
        </Link>
      </nav>
    </aside>
  );
}
