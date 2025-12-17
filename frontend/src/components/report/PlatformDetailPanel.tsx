// src/components/report/PlatformDetailPanel.tsx
import React from "react";
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
          <h2 className="text-xl font-bold">{platform} 상품 상세</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Price Summary */}
        <div className="mb-6">
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
        </div>

        {/* Item List */}
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg p-3"
            >
              <p className="font-semibold text-sm mb-1">
                {item.title}
              </p>

              <div className="flex justify-between text-sm">
                <span>
                  {item.currency} {item.rawPrice.toLocaleString()}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-medium"
                >
                  보기
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
