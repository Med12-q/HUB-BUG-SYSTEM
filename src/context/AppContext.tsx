import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { LangCode } from "@/lib/i18n";

interface User { username: string; email: string; }
interface AppState {
  lang: LangCode | null;
  user: User | null;
  setLang: (l: LangCode) => void;
  register: (username: string, email: string, password: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const l = localStorage.getItem("hbs_lang") as LangCode | null;
    const u = localStorage.getItem("hbs_user");
    if (l) setLangState(l);
    if (u) { try { setUser(JSON.parse(u)); } catch {} }
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("hbs_lang", l);
  };

  const register = (username: string, email: string, password: string) => {
    const users: Record<string, { username: string; password: string }> = JSON.parse(localStorage.getItem("hbs_users") || "{}");
    users[email] = { username, password };
    localStorage.setItem("hbs_users", JSON.stringify(users));
    const u = { username, email };
    setUser(u);
    localStorage.setItem("hbs_user", JSON.stringify(u));
  };

  const login = (email: string, password: string): boolean => {
    const users: Record<string, { username: string; password: string }> = JSON.parse(localStorage.getItem("hbs_users") || "{}");
    const found = users[email];
    if (found && found.password === password) {
      const u = { username: found.username, email };
      setUser(u);
      localStorage.setItem("hbs_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hbs_user");
  };

  return <Ctx.Provider value={{ lang, user, setLang, register, login, logout }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
