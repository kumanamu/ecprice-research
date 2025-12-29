// src/components/common/LoginRequiredModal.tsx
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import ModalBackdrop from "./ModalBackdrop";

interface Props {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose }: Props) {
  const navigate = useNavigate();
  const { lang } = useLang();

  return (
    <>
      <ModalBackdrop onClose={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[360px] rounded-xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-3 text-center">
            {lang === "ko" ? "로그인이 필요합니다" : "ログインが必要です"}
          </h2>

          <p className="text-sm text-slate-600 mb-6 text-center">
            {lang === "ko"
              ? "검색 및 AI 분석 기능은 로그인 후 이용할 수 있습니다."
              : "検索およびAI分析機能はログイン後に利用できます。"}
          </p>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-lg bg-blue-600 py-2 text-white font-semibold"
              onClick={() => navigate("/login")}
            >
              {lang === "ko" ? "로그인" : "ログイン"}
            </button>

            <button
              className="flex-1 rounded-lg bg-slate-100 py-2 text-slate-700 font-semibold"
              onClick={() => navigate("/signup")}
            >
              {lang === "ko" ? "회원가입" : "新規登録"}
            </button>
          </div>

          <button
            className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            {lang === "ko" ? "닫기" : "閉じる"}
          </button>
        </div>
      </div>
    </>
  );
}
