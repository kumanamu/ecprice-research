import React, { useEffect, useState } from "react";
import ReportPanel from "../components/layout/ReportPanel";
import Loader from "../components/common/Loader";

const Report: React.FC = () => {
  const [basicAi, setBasicAi] = useState<string | null>(null);
  const [premiumAi, setPremiumAi] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/margin/ai")
      .then((r) => r.json())
      .then((data) => {
        setBasicAi(data.basicAi);
        setPremiumAi(data.premiumAi);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        <Loader label="AI 분석 준비 중..." />
      ) : (
        <ReportPanel basicAi={basicAi} premiumAi={premiumAi} />
      )}
    </>
  );
};

export default Report;
