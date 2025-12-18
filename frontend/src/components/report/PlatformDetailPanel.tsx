// src/components/report/PlatformDetailPanel.tsx
import type { PriceInfo } from "../../types/marginTypes";

interface Props {
  platform: string;
  data: PriceInfo;
  onClose: () => void;
}

export default function PlatformDetailPanel({
  platform,
  data,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      {/* Panel */}
      <div className="w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {platform} 상품 상세
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Product Image */}
        {data.productImage && (
          <img
            src={data.productImage}
            alt={data.productName}
            className="w-full h-48 object-contain mb-4 rounded"
          />
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-base mb-2">
          {data.productName}
        </h3>

        {/* Price Summary */}
        <div className="mb-4">
          {data.priceKrw !== null && (
            <p className="text-2xl font-black">
              ₩ {data.priceKrw.toLocaleString()}
            </p>
          )}
          {data.priceJpy !== null && (
            <p className="text-sm text-slate-500">
              ¥ {data.priceJpy.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {data.displayPrice}
          </p>
        </div>

        {/* Status / Reason */}
        <div className="mb-4">
          <p className="text-sm">
            <span className="font-semibold">상태:</span>{" "}
            {data.status}
          </p>
          {data.reason && (
            <p className="text-sm text-slate-600 mt-1">
              {data.reason}
            </p>
          )}
        </div>

        {/* External Link */}
        <a
          href={data.productUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 text-primary font-medium"
        >
          상품 페이지 열기 →
        </a>
      </div>
    </div>
  );
}
