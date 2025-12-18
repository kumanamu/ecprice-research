/* eslint-disable react-refresh/only-export-components */

// src/context/LangContext.tsx
import React, { createContext, useContext, useState } from "react";

type LangType = "ko" | "jp";

interface LangContextValue {
  lang: LangType;
  setLang: (v: LangType) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LangType>("jp");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("LangContext Provider missing!");
  return ctx;
};