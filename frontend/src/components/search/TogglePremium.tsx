// src/components/search/TogglePremium.tsx
import { t } from "../../utils/t";

interface Props {
  type: "basic" | "premium";
  onChange: (v: "basic" | "premium") => void;
  lang: "ko" | "jp";
}

export default function TogglePremium({ type, onChange, lang }: Props) {
  return (
    <button
      onClick={() => onChange(type === "basic" ? "premium" : "basic")}
      className="px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded-lg shadow text-sm font-semibold"
    >
      {t(type === "basic" ? "premium" : "basic", lang)}
    </button>
  );
}
