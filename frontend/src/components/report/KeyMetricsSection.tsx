import { t } from "../../utils/t";

interface Props {
  platform: string;
  profitKrw: number;
  profitJpy: number;
  lang: "ko" | "jp";
}

export default function KeyMetricsSection({
  platform,
  profitKrw,
  profitJpy,
  lang,
}: Props) {
  const safeProfitKrw =
    typeof profitKrw === "number" && !isNaN(profitKrw) ? profitKrw : 0;

  const safeProfitJpy =
    typeof profitJpy === "number" && !isNaN(profitJpy) ? profitJpy : 0;

  return (
    <div className="p-5 rounded-xl shadow bg-white">
      <div className="font-bold text-lg mb-3">
        {t("keyMetrics", lang)}
      </div>

      <ul className="list-disc ml-5 text-gray-700">
        <li>
          {t("bestPlatform", lang)}: <b>{platform || "-"}</b>
        </li>

        <li>
          {t("expectedProfitKrw", lang)}:{" "}
          {safeProfitKrw.toLocaleString()}
        </li>

        <li>
          {t("expectedProfitJpy", lang)}:{" "}
          {safeProfitJpy.toLocaleString()}
        </li>
      </ul>
    </div>
  );
}
