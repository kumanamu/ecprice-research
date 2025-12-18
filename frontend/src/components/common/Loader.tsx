import { useLang } from "../../context/LangContext";

interface Props {
  label?: string;
}

export default function Loader({ label }: Props) {
  const { lang } = useLang();

  return (
    <div className="flex items-center justify-center py-10 text-slate-500">
      {label ??
        (lang === "ko"
          ? "데이터를 불러오는 중입니다..."
          : "データを読み込んでいます...")}
    </div>
  );
}
