import React from "react";
import { NavLink } from "react-router-dom";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white shadow h-screen p-5 flex flex-col gap-4">

      <NavLink
        to="/"
        className="px-3 py-2 rounded hover:bg-gray-100 font-medium"
      >
        홈
      </NavLink>

      <NavLink
        to="/report"
        className="px-3 py-2 rounded hover:bg-gray-100 font-medium"
      >
        리포트
      </NavLink>
    </aside>
  );
}
