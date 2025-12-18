// src/components/report/AIRecommendationCard.tsx
import { t } from "../../utils/t";

interface Props {
  basicTextKo: string;
  basicTextJp: string;
  premiumTextKo?: string;
  premiumTextJp?: string;
  type: "basic" | "premium";
  lang: "ko" | "jp";
}

export default function AIRecommendationCard({
  basicTextKo,
  basicTextJp,
  premiumTextKo,
  premiumTextJp,
  type,
  lang
}: Props) {
  const title = type === "basic" ? t("aiBasicAnalysis", lang) : t("aiPremiumAnalysis", lang);

  // ✅ 토글 언어에 맞춰서 출력
  const content = type === "basic"
    ? (lang === "ko" ? basicTextKo : basicTextJp)
    : (lang === "ko" ? premiumTextKo : premiumTextJp) ?? "";

  return (
    <div className="p-5 rounded-xl shadow bg-white mt-6">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-700">
        {content || t("aiAnalyzing", lang)}
      </pre>
    </div>
  );
}