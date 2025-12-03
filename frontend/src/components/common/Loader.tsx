// src/components/common/Loader.tsx
import React from "react";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

export default function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="p-4 bg-gray-100 rounded shadow text-center text-gray-600 animate-pulse">
      {label}
    </div>
  );
}
