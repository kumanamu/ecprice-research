import React from "react";
import { useLang } from "../../context/LangContext";
import { t } from "../../utils/t";

interface Props {
  onSave: () => void;
}

export default function ReportSaveBar({ onSave }: Props) {
  const { lang } = useLang();

  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onSave}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
      >
        {lang === "ko" ? "리포트 저장" : "レポート保存"}
      </button>
    </div>
  );
}
