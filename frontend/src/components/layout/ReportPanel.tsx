// src/components/layout/ReportPanel.tsx
import { useLang } from "../../context/LangContext";

interface Props {
  basicAi: string;
  premiumAi: string;
  activeTab: "basic" | "premium";
}

export default function ReportPanel({
  basicAi,
  premiumAi,
  activeTab,
}: Props) {
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
