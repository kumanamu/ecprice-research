// src/components/layout/Header.tsx
import ToggleLanguage from "../search/ToggleLanguage";

interface Props {
  aiMode: "basic" | "premium";
  onChangeAiMode: (mode: "basic" | "premium") => void;
  lang: string;
}

export default function Header({ aiMode, onChangeAiMode, lang }: Props) {
  // ⚠️ 지금은 UI에 노출하지 않지만
  // 전역 상태로 "의미 있게 소비"만 한다 (eslint 방어 + 구조 유지)
  void aiMode;
  void onChangeAiMode;
  void lang;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            analytics
          </span>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            EC Analyzer
          </h1>
        </div>

        {/* 언어 토글 */}
        <div className="flex items-center gap-2">
          <ToggleLanguage />
        </div>
      </div>
    </header>
  );
}
