import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { LangCode } from "@/lib/i18n";

interface AppState {
  lang: LangCode | null;
  setLang: (l: LangCode) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode | null>(null);

  useEffect(() => {
    const l = localStorage.getItem("hbs_lang") as LangCode | null;
    if (l) setLangState(l);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("hbs_lang", l);
  };

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
