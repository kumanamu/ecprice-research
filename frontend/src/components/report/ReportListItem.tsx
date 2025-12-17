import React from "react";

interface Props {
  id: string;
  keyword: string;
  createdAt: string;
  onClick: (id: string) => void;
}

export default function ReportListItem({
  id,
  keyword,
  createdAt,
  onClick,
}: Props) {
  return (
    <div
      onClick={() => onClick(id)}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <h4 className="font-bold text-slate-800">{keyword}</h4>
      <p className="text-xs text-slate-500 mt-1">{createdAt}</p>
    </div>
  );
}
