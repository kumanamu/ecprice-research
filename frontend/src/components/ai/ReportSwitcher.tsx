import React from "react";
import BasicReport from "./BasicReport";
import PremiumReport from "./PremiumReport";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";



export default function ReportSwitcher({
  data,
  type,
  lang
}: {
  data: any;
  type: "basic" | "premium";
  lang: "ko" | "jp";
}) {
  if (!data) return null;

  return type === "basic" ? (
    <BasicReport data={data} lang={lang} />
  ) : (
    <PremiumReport data={data} lang={lang} />
  );
}
