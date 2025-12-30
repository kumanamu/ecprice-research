// src/components/report/PlatformResultItem.tsx
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";
import { formatPrice } from "../../utils/t";

interface Props {
  platform: string;
  data: PriceInfo;
  onClick: () => void;
}

export default function PlatformResultItem({
  platform,
  data,
  onClick,
}: Props) {
  const { lang } = useLang();

  // ✅ 완전한 데이터 체크
  const hasFullData =
    data.priceKrw != null &&
    data.priceJpy != null &&
    data.country != null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200
                 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-lg font-black tracking-tight mb-2">
        {platform.toUpperCase()}
      </h3>

      {data.productImage ? (
        <img
          src={data.productImage}
          alt={data.productName}
          className="w-full h-32 object-contain mb-3"
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center
                        text-xs text-slate-400 bg-slate-50 mb-3">
          {lang === "ko" ? "이미지 없음" : "画像なし"}
        </div>
      )}

      <p className="text-sm font-medium line-clamp-2 mb-1">
        {data.productName}
      </p>

      {/* ✅ 가격 표시 */}
      {hasFullData ? (
        (() => {
          const { main, sub } = formatPrice(
            data.priceKrw!,
            data.priceJpy!,
            data.country!,
            lang
          );
          return (
            <div className="space-y-0.5">
              <p className="text-base font-bold text-slate-900">{main}</p>
              {sub && <p className="text-xs text-slate-500">{sub}</p>}
            </div>
          );
        })()
      ) : (
        <p className="text-base font-bold text-slate-900">
          {data.displayPrice || "-"}
        </p>
      )}

      {/* 🔥 상품 링크 추가 */}
      {data.productUrl && (
        <a
          href={data.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 block text-center text-sm text-blue-600
                     hover:text-blue-800 hover:underline font-medium"
        >
          🔗 {lang === "ko" ? "상품 페이지" : "商品ページ"}
        </a>
      )}
    </div>
  );
}