import { useState } from "react";
import { LANGUAGES, type LangCode } from "@/lib/i18n";
import { useApp } from "@/context/AppContext";

export default function LanguageSelect() {
  const { setLang } = useApp();
  const [hovered, setHovered] = useState<LangCode | null>(null);
  const [selected, setSelected] = useState<LangCode | null>(null);
  const [confirming, setConfirming] = useState(false);

  const pick = (code: LangCode) => {
    setSelected(code);
  };

  const confirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => setLang(selected), 500);
  };

  return (
    <>
      <div className="bg-scene" />
      <div className="bg-grid" />
      <div style={{ position: "fixed", inset: 0 }}>
        <div className="orb orb-a" /><div className="orb orb-b" />
        <div className="orb orb-c" /><div className="orb orb-d" />
      </div>

      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, border: "1px solid rgba(168,85,247,.35)", background: "rgba(168,85,247,.08)", marginBottom: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7", animation: "pulse-dot 2s infinite" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#c084fc", letterSpacing: ".2em" }}>HUB BUG SYSTEME v3.0</span>
        </div>

        <h1 className="shimmer" style={{ fontSize: "clamp(22px,6vw,36px)", fontWeight: 900, textAlign: "center", marginBottom: 10, letterSpacing: ".03em" }}>
          Choisissez votre langue
        </h1>
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, textAlign: "center", marginBottom: 32, fontFamily: "var(--font-mono)" }}>
          Choose your language · اختر لغتك · Выберите язык
        </p>

        {/* Language grid */}
        <div style={{ width: "100%", maxWidth: 560, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 28 }}>
          {LANGUAGES.map(({ code, nativeName, flag }) => {
            const isSelected = selected === code;
            const isHovered = hovered === code;
            return (
              <button key={code} onClick={() => pick(code)}
                onMouseEnter={() => setHovered(code)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                  background: isSelected ? "rgba(168,85,247,.15)" : isHovered ? "rgba(168,85,247,.07)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${isSelected ? "rgba(168,85,247,.6)" : isHovered ? "rgba(168,85,247,.3)" : "rgba(255,255,255,.07)"}`,
                  boxShadow: isSelected ? "0 0 20px rgba(168,85,247,.2)" : "none",
                  transition: "all .18s ease",
                  display: "flex", flexDirection: "column", gap: 5, textAlign: "left",
                  position: "relative",
                }}>
                <span style={{ fontSize: 20 }}>{flag}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: isSelected ? "#c084fc" : "rgba(255,255,255,.85)", letterSpacing: ".01em" }}>{nativeName}</span>
                {isSelected && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: "50%", background: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #a855f7" }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm */}
        <button onClick={confirm} disabled={!selected || confirming}
          className="btn-main"
          style={{ padding: "14px 48px", fontSize: 14, fontFamily: "var(--font-mono)", letterSpacing: ".08em", opacity: selected ? 1 : .35 }}>
          <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            {confirming ? (
              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Chargement...</>
            ) : (
              <>{selected ? `${LANGUAGES.find(l => l.code === selected)?.flag} Continuer` : "Sélectionner une langue"}</>
            )}
          </span>
        </button>

        <p style={{ marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,.15)", letterSpacing: ".12em" }}>
          𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵
        </p>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}
