import type { ItemInfo } from "../../types/marginTypes";

export default function ProductList({ items }: { items: ItemInfo[] }) {
  if (!items || items.length === 0) {
    return <div className="p-3 mt-3 bg-white/10 text-white rounded">상품 없음</div>;
  }

  return (
    <div className="mt-3 space-y-3">
      {items.map((p, idx) => (
        <div
          key={idx}
          className="flex items-center bg-white/10 p-3 rounded text-white gap-3"
        >
          <img src={p.image} className="w-16 h-16 rounded object-cover" />
          <div className="flex flex-col">
            <a href={p.url} target="_blank" className="font-bold underline">
              {p.title}
            </a>
            <span>
              {p.price.toLocaleString()} {p.currency}
            </span>
            <span className="text-sm opacity-70">
              원가: {p.rawPrice.toLocaleString()} {p.currency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
