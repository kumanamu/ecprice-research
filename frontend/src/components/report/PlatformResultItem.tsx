// src/components/report/PlatformResultItem.tsx
import type { PriceInfo } from "../../types/marginTypes";
import { useLang } from "../../context/LangContext";

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

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200
                 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      {/* 플랫폼명 */}
      <h3 className="text-lg font-black tracking-tight mb-2">
        {platform.toUpperCase()}
      </h3>

      {/* 상품 이미지 */}
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

      {/* 상품명 */}
      <p className="text-sm font-medium line-clamp-2 mb-1">
        {data.productName}
      </p>

      {/* 가격 (백이 내려준 displayPrice만 사용) */}
      <p className="text-base font-bold text-slate-900">
        {data.displayPrice}
      </p>
    </div>
  );
}
