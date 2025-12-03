import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import type { PriceInfo, MarginResponse, AiMarginAnalysis } 
  from "../../types/marginTypes";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />

      <div className="flex flex-row w-full h-full">
        <Sidebar />

        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
