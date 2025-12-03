import React from "react";
import { Link } from "react-router-dom";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

export default function Header() {
  return (
    <header className="w-full h-14 bg-white shadow px-6 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-700">
        ECPriceResearch
      </Link>
    </header>
  );
}
