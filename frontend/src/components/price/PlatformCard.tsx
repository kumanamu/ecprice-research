import type { PlatformPrice } from "../../types/marginTypes";

export default function PlatformCard({
  title,
  info,
  highlight
}: {
  title: string;
  info: PlatformPrice;
  highlight: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg text-white ${
        highlight ? "border-2 border-yellow-400" : "bg-white/10"
      }`}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>

      {info.priceKrw ? (
        <>
          <div className="text-xl font-bold">
            {info.priceKrw.toLocaleString()} 원
          </div>
          <div className="text-sm opacity-80">
            {info.priceJpy?.toLocaleString()} 円
          </div>
        </>
      ) : (
        <div className="opacity-70">데이터 없음</div>
      )}
    </div>
  );
}
