import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

const DEV = "𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵";

const SOCIAL = [
  { href:"https://github.com/Med12-q/HUB-BUG-SYSTEM", label:"GitHub", color:"#fff",
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  { href:"https://whatsapp.com/channel/0029Vb7q4urGehEDh39zll3H", label:"WhatsApp", color:"#25d366",
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { href:"https://t.me/varnox_official", label:"Telegram", color:"#2aabee",
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
  { href:"mailto:varnoxnovark@gmail.com", label:"Email", color:"#ea4335",
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg> },
];

const STATS = [
  { label:"Android Modules", val:92,  color:"#3ddc84" },
  { label:"iOS Modules",     val:87,  color:"#3b82f6" },
  { label:"WhatsApp Engine", val:100, color:"#a855f7" },
  { label:"Encrypt Layer",   val:95,  color:"#ec4899" },
];

/* ── Neural-network canvas ── */
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = 55;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: 1.2 + Math.random() * 1.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 1000;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.pulse += .018;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const alpha = (1 - d / 160) * .18;
            const hue = 270 + Math.sin(t * .3 + i * .1) * 30;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue},80%,70%,${alpha})`;
            ctx.lineWidth = .8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse = .6 + Math.sin(n.pulse) * .4;
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4 * pulse);
        grd.addColorStop(0,  `rgba(168,85,247,${.7 * pulse})`);
        grd.addColorStop(.5, `rgba(200,40,255,${.25 * pulse})`);
        grd.addColorStop(1,  `rgba(168,85,247,0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,180,255,${.85 * pulse})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:.55 }} />;
}

/* ── Liquid glow orbs ── */
function GlowOrbs() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none", overflow:"hidden" }}>
      <div className="glow-orb glow-a"/>
      <div className="glow-orb glow-b"/>
      <div className="glow-orb glow-c"/>
      <div className="glow-orb glow-d"/>
      <div className="glow-orb glow-e"/>
    </div>
  );
}

/* ── Entrance stagger hook ── */
function useVisible(delay = 0) {
  const [v, setV] = useState(false);
  useEffect(() => { const id = setTimeout(() => setV(true), delay); return () => clearTimeout(id); }, [delay]);
  return v;
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const { lang } = useApp();
  const tr = t(lang ?? "fr");
  const [stats, setStats] = useState([0,0,0,0]);
  const [time, setTime]   = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);

  const v0 = useVisible(80);
  const v1 = useVisible(220);
  const v2 = useVisible(380);
  const v3 = useVisible(520);
  const v4 = useVisible(680);
  const v5 = useVisible(840);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  }, []);

  useEffect(() => {
    STATS.forEach((_,i) => setTimeout(()=> setStats(p=>{const n=[...p];n[i]=STATS[i].val;return n;}), 900+i*200));
  }, []);

  const fadeUp = (visible: boolean, extra?: React.CSSProperties): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: "opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1)",
    ...extra,
  });

  return (
    <>
      {/* ── Deep dark base ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, background:"radial-gradient(ellipse 120% 80% at 50% -5%, rgba(80,20,180,.45) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 90% 50%, rgba(180,20,120,.22) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 10% 90%, rgba(40,10,160,.22) 0%, transparent 55%), #03020a" }}/>

      {/* ── Grid ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(168,85,247,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.018) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>

      <NeuralCanvas/>
      <GlowOrbs/>

      {/* ── Scanline ── */}
      <div style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none", backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px)", backgroundSize:"100% 4px" }}/>

      <div style={{ position:"relative", zIndex:10, minHeight:"100vh", maxWidth:600, margin:"0 auto", padding:"22px 16px 48px", display:"flex", flexDirection:"column" }}>

        {/* ── Status bar ── */}
        <div style={{ ...fadeUp(v0), display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div className="dot dot-green"/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".2em", color:"rgba(255,255,255,.28)", textTransform:"uppercase" }}>{tr.systemOnline}</span>
          </div>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"rgba(168,85,247,.4)", letterSpacing:".08em" }}>{time}</span>
        </div>

        {/* ── Hero ── */}
        <div style={{ ...fadeUp(v1), textAlign:"center", marginBottom:40, position:"relative" }}>
          {/* Pill badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:99, border:"1px solid rgba(168,85,247,.4)", background:"rgba(168,85,247,.09)", marginBottom:28, backdropFilter:"blur(12px)", boxShadow:"0 0 30px rgba(168,85,247,.15), inset 0 1px 0 rgba(255,255,255,.06)" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#a855f7", boxShadow:"0 0 10px #a855f7, 0 0 20px rgba(168,85,247,.8)", animation:"pulse-dot 2s infinite" }}/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#d8b4fe", letterSpacing:".2em" }}>WHATSAPP EXPLOIT ENGINE v3.0</span>
          </div>

          {/* Main title */}
          <div style={{ position:"relative", marginBottom:20 }}>
            {/* Glow behind title */}
            <div style={{ position:"absolute", inset:"-30px -40px", background:"radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,85,247,.18) 0%, transparent 70%)", pointerEvents:"none", filter:"blur(20px)" }}/>
            <h1 style={{ position:"relative", fontSize:"clamp(30px,9vw,54px)", fontWeight:900, letterSpacing:".03em", lineHeight:1.05, background:"linear-gradient(135deg, #f0e6ff 0%, #c084fc 30%, #ffffff 50%, #e879f9 70%, #c084fc 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"200% auto", animation:"shimmer-move 4s linear infinite, title-glow 3s ease-in-out infinite" }}>
              𝗛𝗨𝗕 𝗕𝗨𝗚 𝗦𝗬𝗦𝗧𝗘𝗠𝗘
            </h1>
          </div>

          <p style={{ color:"rgba(255,255,255,.38)", fontSize:13, lineHeight:1.8, maxWidth:340, margin:"0 auto 34px", letterSpacing:".01em" }}>
            {tr.tagline}
          </p>

          {/* CTA button — glow ring + pulse */}
          <div style={{ position:"relative", display:"inline-block" }}>
            <div style={{ position:"absolute", inset:-12, borderRadius:26, border:"1px solid rgba(168,85,247,.25)", animation:"ring-expand 2s ease-in-out infinite", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", inset:-24, borderRadius:34, border:"1px solid rgba(168,85,247,.12)", animation:"ring-expand 2s ease-in-out .5s infinite", pointerEvents:"none" }}/>
            <button
              className="btn-main"
              onClick={() => setLocation("/system")}
              onMouseOver={() => setHoverBtn(true)}
              onMouseOut={() => setHoverBtn(false)}
              style={{ padding:"17px 50px", fontSize:15, letterSpacing:".08em", fontFamily:"var(--font-mono)", boxShadow: hoverBtn ? "0 0 50px rgba(168,85,247,.7), 0 0 100px rgba(168,85,247,.3), 0 0 200px rgba(168,85,247,.1)" : "0 0 30px rgba(168,85,247,.45), 0 0 60px rgba(168,85,247,.15)" }}>
              <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:10 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                {tr.accessSystem}
              </span>
            </button>
          </div>
        </div>

        {/* ── Video ── */}
        <div style={{ ...fadeUp(v2), position:"relative", borderRadius:22, overflow:"hidden", marginBottom:28, border:"1px solid rgba(168,85,247,.3)", boxShadow:"0 0 60px rgba(168,85,247,.18), 0 0 120px rgba(168,85,247,.08), inset 0 1px 0 rgba(255,255,255,.05)", aspectRatio:"16/9" }}>
          <video src="https://files.catbox.moe/7o30ye.mp4" autoPlay loop muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(3,2,10,.8) 100%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(168,85,247,.06) 0%, transparent 50%, rgba(236,72,153,.04) 100%)", pointerEvents:"none" }}/>
          <div className="cmark-tl"/><div className="cmark-tr"/><div className="cmark-bl"/><div className="cmark-br"/>
          <div style={{ position:"absolute", bottom:12, left:14, display:"flex", alignItems:"center", gap:6 }}>
            <div className="dot dot-red"/><span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.45)", letterSpacing:".12em" }}>LIVE DEMO</span>
          </div>
        </div>

        {/* ── Action grid ── */}
        <div style={{ ...fadeUp(v3), display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
          {/* K-AI */}
          <button onClick={() => setLocation("/ai")} className="action-card action-card-ai">
            <div className="action-icon-wrap" style={{ background:"linear-gradient(135deg,#7c3aed,#c026d3)", boxShadow:"0 0 20px rgba(168,85,247,.55)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <p className="action-name" style={{ color:"#d8b4fe" }}>K-AI</p>
            <p className="action-sub">{tr.aiAssistant}</p>
            <div style={{ position:"absolute", top:12, right:12 }}><div className="dot dot-green" style={{ width:6, height:6 }}/></div>
          </button>

          {/* Bug System */}
          <button onClick={() => setLocation("/system")} className="action-card action-card-bug">
            <div className="action-icon-wrap" style={{ background:"linear-gradient(135deg,#dc2626,#f97316)", boxShadow:"0 0 20px rgba(239,68,68,.5)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <p className="action-name" style={{ color:"#fca5a5" }}>BUG SYSTEM</p>
            <p className="action-sub">Android · iOS · SC · 10 min</p>
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ ...fadeUp(v4) }} className="glass" style2={{ padding:22, marginBottom:28 }}>
          <div className="glass" style={{ padding:22, marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:3, height:14, borderRadius:2, background:"linear-gradient(to bottom,#a855f7,#ec4899)", boxShadow:"0 0 8px #a855f7" }}/>
              <p className="sect-label">STATUS MODULES</p>
            </div>
            {STATS.map((s,i) => (
              <div key={s.label} style={{ marginBottom:i<STATS.length-1?15:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"rgba(255,255,255,.45)" }}>{s.label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, fontWeight:700, color:s.color, textShadow:`0 0 10px ${s.color}88` }}>{stats[i]}%</span>
                </div>
                <div className="prog-track" style={{ height:4 }}>
                  <div className="prog-fill" style={{ width:`${stats[i]}%`, background:`linear-gradient(90deg,${s.color}88,${s.color})`, boxShadow:`0 0 10px ${s.color}55` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social ── */}
        <div style={{ ...fadeUp(v5), marginBottom:28 }}>
          <div className="sep" style={{ marginBottom:22 }}/>
          <p className="sect-label" style={{ textAlign:"center", marginBottom:18 }}>REJOINDRE LA COMMUNAUTÉ</p>
          <div style={{ display:"flex", justifyContent:"center", gap:14 }}>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                className="social-btn" style={{ "--sc":s.color } as React.CSSProperties}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign:"center", marginTop:"auto" }}>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,.15)", letterSpacing:".06em", marginBottom:5 }}>{tr.devBy}</p>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"rgba(168,85,247,.45)", letterSpacing:".04em", marginBottom:10 }}>{DEV}</p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"4px 14px", borderRadius:99, border:"1px solid rgba(168,85,247,.12)", background:"rgba(168,85,247,.04)" }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(255,255,255,.18)", letterSpacing:".12em" }}>HUB BUG SYSTEME v3.0</span>
          </div>
        </div>
      </div>

      <style>{`
        /* Fluid glow orbs */
        .glow-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .glow-a { width:800px; height:800px; top:-250px; left:-220px; background:radial-gradient(circle,rgba(100,30,220,.28) 0%,transparent 70%); animation:glow-float 22s ease-in-out infinite; }
        .glow-b { width:600px; height:600px; top:25%; right:-220px; background:radial-gradient(circle,rgba(220,30,160,.2) 0%,transparent 70%); animation:glow-float 28s ease-in-out infinite reverse; animation-delay:-10s; }
        .glow-c { width:700px; height:700px; bottom:-220px; left:10%; background:radial-gradient(circle,rgba(50,10,200,.2) 0%,transparent 70%); animation:glow-float 34s ease-in-out infinite; animation-delay:-18s; }
        .glow-d { width:350px; height:350px; top:50%; right:10%; background:radial-gradient(circle,rgba(220,80,255,.18) 0%,transparent 70%); filter:blur(60px); animation:glow-float 16s ease-in-out infinite; animation-delay:-5s; }
        .glow-e { width:400px; height:400px; top:35%; left:35%; background:radial-gradient(circle,rgba(60,140,255,.1) 0%,transparent 70%); filter:blur(70px); animation:glow-float 24s ease-in-out infinite reverse; animation-delay:-12s; }
        @keyframes glow-float {
          0%,100%{transform:translate(0,0) scale(1);}
          20%{transform:translate(60px,-80px) scale(1.1);}
          40%{transform:translate(-40px,60px) scale(.93);}
          60%{transform:translate(70px,40px) scale(1.08);}
          80%{transform:translate(-50px,-40px) scale(.96);}
        }

        /* Title glow pulse */
        @keyframes title-glow {
          0%,100%{filter:drop-shadow(0 0 20px rgba(168,85,247,.4));}
          50%{filter:drop-shadow(0 0 40px rgba(200,100,255,.7));}
        }

        /* Expand rings */
        @keyframes ring-expand {
          0%{opacity:.6;transform:scale(1);}
          100%{opacity:0;transform:scale(1.35);}
        }

        /* Action cards */
        .action-card {
          padding:20px 16px; border-radius:18px; cursor:pointer; text-align:left;
          transition:all .25s ease; position:relative; overflow:hidden; display:flex;
          flex-direction:column; gap:0; border:none; font-family:var(--font-sans);
          backdrop-filter:blur(16px);
        }
        .action-card::before { content:''; position:absolute; inset:0; border-radius:18px; padding:1px; background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.03)); -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
        .action-card-ai  { background:rgba(168,85,247,.07); border:1px solid rgba(168,85,247,.22); }
        .action-card-bug { background:rgba(239,68,68,.06);  border:1px solid rgba(239,68,68,.2);  }
        .action-card:hover { transform:translateY(-4px); }
        .action-card-ai:hover  { background:rgba(168,85,247,.14); border-color:rgba(168,85,247,.5); box-shadow:0 12px 40px rgba(168,85,247,.22), 0 0 0 1px rgba(168,85,247,.1); }
        .action-card-bug:hover { background:rgba(239,68,68,.12);  border-color:rgba(239,68,68,.45); box-shadow:0 12px 40px rgba(239,68,68,.18), 0 0 0 1px rgba(239,68,68,.08); }
        .action-icon-wrap { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        .action-name { font-family:var(--font-mono); font-size:13px; font-weight:700; letter-spacing:.05em; margin-bottom:5px; }
        .action-sub  { font-size:11px; color:rgba(255,255,255,.35); line-height:1.5; }

        /* Social buttons */
        .social-btn {
          width:50px; height:50px; border-radius:14px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          display:flex; align-items:center; justify-content:center;
          text-decoration:none; transition:all .25s ease; flex-shrink:0;
          backdrop-filter:blur(12px);
        }
        .social-btn:hover {
          background:color-mix(in srgb,var(--sc) 12%,transparent);
          border-color:color-mix(in srgb,var(--sc) 45%,transparent);
          box-shadow:0 0 24px color-mix(in srgb,var(--sc) 35%,transparent);
          transform:translateY(-4px) scale(1.05);
        }

        @keyframes float-up {
          0%{transform:translateY(0) scale(1);opacity:0;}
          10%{opacity:1;}
          90%{opacity:.5;}
          100%{transform:translateY(-100vh) scale(.5);opacity:0;}
        }
      `}</style>
    </>
  );
}
