import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

const DEV = "𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵";

const SOCIAL = [
  {
    href: "https://github.com/Med12-q/HUB-BUG-SYSTEM",
    label: "GitHub",
    color: "#fff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    href: "https://whatsapp.com/channel/0029Vb7q4urGehEDh39zll3H",
    label: "WhatsApp",
    color: "#25d366",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    href: "https://t.me/varnox_official",
    label: "Telegram",
    color: "#2aabee",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: "mailto:varnoxnovark@gmail.com",
    label: "Email",
    color: "#ea4335",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
  },
];

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 12,
  opacity: 0.15 + Math.random() * 0.25,
}));

const STATS = [
  { label: "Android Modules", val: 92, color: "#3ddc84" },
  { label: "iOS Modules",     val: 87, color: "#3b82f6" },
  { label: "WhatsApp Engine", val: 100, color: "#a855f7" },
  { label: "Encrypt Layer",   val: 95, color: "#ec4899" },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { lang, user, logout } = useApp();
  const tr = t(lang ?? "fr");
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [time, setTime] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    STATS.forEach((_, i) => setTimeout(() => setStats(p => { const n = [...p]; n[i] = STATS[i].val; return n; }), 600 + i * 180));
  }, []);

  return (
    <>
      {/* Animated background */}
      <div className="bg-scene" />
      <div className="bg-grid" />
      <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
        <div className="orb orb-a" /><div className="orb orb-b" />
        <div className="orb orb-c" /><div className="orb orb-d" />
        {/* Floating particles */}
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, bottom: "-20px",
            width: p.size, height: p.size, borderRadius: "50%",
            background: `rgba(168,85,247,${p.opacity})`,
            animation: `float-up ${p.duration}s ${p.delay}s ease-in infinite`,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", maxWidth: 600, margin: "0 auto", padding: "22px 16px 40px", display: "flex", flexDirection: "column" }}>

        {/* ── Top Bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="dot dot-green" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "rgba(255,255,255,.3)", textTransform: "uppercase" }}>{tr.systemOnline}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,.22)" }}>{time}</span>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(168,85,247,.7)" }}>@{user.username}</span>
                <button onClick={logout} style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#ef4444", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 99, border: "1px solid rgba(168,85,247,.35)", background: "rgba(168,85,247,.08)", marginBottom: 22, animation: "pop-in .5s ease" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#c084fc", letterSpacing: ".18em" }}>WHATSAPP EXPLOIT ENGINE v3.0</span>
          </div>

          <h1 className="shimmer" style={{ fontSize: "clamp(28px,8vw,48px)", fontWeight: 900, letterSpacing: ".04em", lineHeight: 1.08, marginBottom: 16, animation: "pop-in .6s ease" }}>
            𝗛𝗨𝗕 𝗕𝗨𝗚 𝗦𝗬𝗦𝗧𝗘𝗠𝗘
          </h1>

          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 28px", animation: "pop-in .7s ease" }}>
            {tr.tagline}
          </p>

          {/* CTA Button */}
          <button className="btn-main" onClick={() => setLocation("/system")}
            style={{ padding: "16px 44px", fontSize: 15, animation: "pop-in .8s ease" }}>
            <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              {tr.accessSystem}
            </span>
          </button>
        </div>

        {/* ── Video ── */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 24, border: "1px solid rgba(168,85,247,.22)", boxShadow: "0 0 50px rgba(168,85,247,.15), 0 0 100px rgba(168,85,247,.06)", aspectRatio: "16/9" }}>
          <video ref={videoRef} src="https://files.catbox.moe/7o30ye.mp4" autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(5,5,7,.75) 100%)", pointerEvents: "none" }} />
          <div className="cmark-tl"/><div className="cmark-tr"/><div className="cmark-bl"/><div className="cmark-br"/>
          <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <div className="dot dot-red" /><span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: ".12em" }}>LIVE DEMO</span>
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {/* AI Button */}
          <button onClick={() => setLocation("/ai")}
            style={{ padding: "18px 16px", borderRadius: 16, background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.3)", cursor: "pointer", textAlign: "left", transition: "all .22s ease", position: "relative", overflow: "hidden" }}
            onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,85,247,.15)"; el.style.borderColor = "rgba(168,85,247,.6)"; el.style.boxShadow = "0 0 30px rgba(168,85,247,.2)"; el.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,85,247,.08)"; el.style.borderColor = "rgba(168,85,247,.3)"; el.style.boxShadow = "none"; el.style.transform = "none"; }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, boxShadow: "0 0 16px rgba(168,85,247,.5)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#c084fc", letterSpacing: ".04em", marginBottom: 4 }}>K-AI</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{tr.aiAssistant}</p>
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <div className="dot dot-green" style={{ width: 6, height: 6 }} />
            </div>
          </button>

          {/* Bug System Button */}
          <button onClick={() => setLocation("/system")}
            style={{ padding: "18px 16px", borderRadius: 16, background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.25)", cursor: "pointer", textAlign: "left", transition: "all .22s ease", position: "relative", overflow: "hidden" }}
            onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(239,68,68,.12)"; el.style.borderColor = "rgba(239,68,68,.5)"; el.style.boxShadow = "0 0 30px rgba(239,68,68,.15)"; el.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(239,68,68,.06)"; el.style.borderColor = "rgba(239,68,68,.25)"; el.style.boxShadow = "none"; el.style.transform = "none"; }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#dc2626,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, boxShadow: "0 0 16px rgba(239,68,68,.4)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#f87171", letterSpacing: ".04em", marginBottom: 4 }}>BUG SYSTEM</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>Android · iOS · 10 min</p>
          </button>
        </div>

        {/* ── System Stats ── */}
        <div className="glass" style={{ padding: 20, marginBottom: 24 }}>
          <p className="sect-label" style={{ marginBottom: 16 }}>STATUS MODULES</p>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ marginBottom: i < STATS.length - 1 ? 14 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,.5)" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: s.color }}>{stats[i]}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${stats[i]}%`, background: s.color, boxShadow: `0 0 8px ${s.color}66` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Social Links ── */}
        <div className="sep" style={{ marginBottom: 20 }} />
        <div style={{ marginBottom: 24 }}>
          <p className="sect-label" style={{ marginBottom: 14, textAlign: "center" }}>REJOINDRE LA COMMUNAUTÉ</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.label}
                style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, textDecoration: "none", transition: "all .2s ease", flexShrink: 0 }}
                onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${s.color}18`; el.style.borderColor = `${s.color}55`; el.style.boxShadow = `0 0 20px ${s.color}44`; el.style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,.04)"; el.style.borderColor = "rgba(255,255,255,.09)"; el.style.boxShadow = "none"; el.style.transform = "none"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", marginTop: "auto" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,.2)", letterSpacing: ".06em", marginBottom: 4 }}>
            {tr.devBy}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(168,85,247,.5)", letterSpacing: ".04em", marginBottom: 12 }}>
            {DEV}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,.1)", letterSpacing: ".12em" }}>
            HUB BUG SYSTEME v3.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}
