import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

interface Msg { role: "ai" | "user"; text: string; ts: string; }

const KB: Record<string, (lang: string) => string> = {
  how: () => "**Fonctionnement :**\n1. Accédez au Système\n2. Entrez le numéro complet de la cible (ex: 224669288332)\n3. Sélectionnez Android ou iOS\n4. Choisissez un module de bug\n5. Cliquez GÉNÉRER puis LANCER\n6. Le payload est envoyé via WhatsApp — la cible perd accès à ses discussions pendant **10 minutes**.",
  number: () => "**Format du numéro :**\nEntrez le numéro complet avec l'indicatif pays :\n• Guinée : 224669288332\n• France : 33612345678\n• Sénégal : 221771234567\n• Côte d'Ivoire : 2250701234567\n• USA : 12025551234\n• UK : 447911123456",
  android: () => "**Modules Android (6) :**\n• 💥 Crash Loop RTL — crash cyclique EXTRÊME\n• 🧨 Memory Overflow — OOM Kill EXTRÊME\n• ❄️ Unicode Freeze — gel UI ÉLEVÉ\n• 👁️ Zalgo Corruption — chat corrompu ÉLEVÉ\n• 😵 Emoji Stack Bomb — overload emoji ÉLEVÉ\n• 🔔 Notification Flood — spam push MOYEN",
  ios: () => "**Modules iOS (6) :**\n• 💥 Arabic RTL Crash — crash SpringBoard EXTRÊME\n• 📱 CoreText Exploit — blocage CoreText EXTRÊME\n• 🧊 Render Freeze Pro — freeze UIKit ÉLEVÉ\n• 🗑️ Memory Leak iOS — watchdog kill EXTRÊME\n• 💣 Emoji CoreText Kill — KO rendu ÉLEVÉ\n• 🔕 Push Flood iOS — flood APNs MOYEN",
  effect: () => "**Effets du bug :**\nAprès réception du payload :\n• WhatsApp crash et redémarre en boucle\n• La cible ne peut plus accéder à ses discussions\n• Elle ne peut pas lire ni envoyer de messages\n• L'écran peut devenir blanc ou gelé\n• Durée exacte : **10 minutes** — minuteur en temps réel affiché",
  duration: () => "**Durée du bug : 10 minutes exactes.**\nUn minuteur en temps réel s'affiche après le lancement. À l'expiration, WhatsApp reprend son fonctionnement normal automatiquement.",
  dev: () => "**Développeur :** 𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵\n\nPour contacter l'équipe :\n• 📧 varnoxnovark@gmail.com\n• 📱 WhatsApp : whatsapp.com/channel/0029Vb7q4urGehEDh39zll3H\n• ✈️ Telegram : t.me/varnox_official\n• 💻 GitHub : github.com/Med12-q/HUB-BUG-SYSTEM",
  hello: () => "Salut ! Je suis **K-AI**, l'IA du Hub Bug Systeme. Je peux t'expliquer :\n• Le fonctionnement du système\n• Les modules Android et iOS disponibles\n• Le format du numéro cible\n• Les effets du bug et sa durée\n\nQue veux-tu savoir ?",
};

function getReply(input: string): string {
  const q = input.toLowerCase();
  if (q.match(/bonjour|salut|hello|hi|bonsoir|yo/)) return KB.hello("");
  if (q.match(/comment.*(marche|fonc|utilis|faire|lancer)/)) return KB.how("");
  if (q.match(/numéro|numero|indicatif|format|pays|entrer/)) return KB.number("");
  if (q.match(/android/)) return KB.android("");
  if (q.match(/ios|iphone|apple/)) return KB.ios("");
  if (q.match(/effet|effets|que.*(fait|arrive|passe)|résultat/)) return KB.effect("");
  if (q.match(/durée|duree|combien.*(temps|min)|10 min/)) return KB.duration("");
  if (q.match(/dev|contact|email|telegram|github|créateur|auteur/)) return KB.dev("");
  if (q.match(/module|commande|type|quels|liste/)) return `${KB.android("")}\n\n${KB.ios("")}`;
  return "Je n'ai pas compris. Tu peux me demander :\n• **Comment ça marche**\n• **Modules disponibles**\n• **Format du numéro**\n• **Effets du bug**\n• **Durée**\n• **Contact / Développeur**";
}

function renderText(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((s, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#c084fc", fontWeight: 700 }}>{s}</strong>
      : s.split("\n").map((line, j, arr) => <span key={j}>{line}{j < arr.length - 1 ? <br /> : null}</span>)
  );
}

const SUGGESTIONS = [
  "Comment ça marche ?", "Modules Android", "Modules iOS",
  "Effets du bug", "Format numéro", "Contact dev",
];

export default function AIChat() {
  const [, setLocation] = useLocation();
  const { lang } = useApp();
  const tr = t(lang ?? "fr");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Bonjour ! Je suis **K-AI**, l'intelligence artificielle du Hub Bug Systeme. Comment puis-je t'aider ?", ts: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setInput("");
    const ts = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMsgs(prev => [...prev, { role: "user", text: msg, ts }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [...prev, { role: "ai", text: getReply(msg), ts: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 600 + Math.random() * 500);
  };

  return (
    <>
      <div className="bg-scene" />
      <div className="bg-grid" />
      <div style={{ position: "fixed", inset: 0 }}>
        <div className="orb orb-a" /><div className="orb orb-b" /><div className="orb orb-c" />
      </div>

      <div style={{ position: "relative", zIndex: 10, height: "100vh", display: "flex", flexDirection: "column", maxWidth: 620, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
          <div className="glass" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setLocation("/")}
              style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,.9)" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(168,85,247,.5)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>K-AI</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(168,85,247,.7)", marginTop: 1 }}>{tr.aiAssistant} — Hub Bug Systeme</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="dot dot-green" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#22c55e" }}>ACTIF</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "ai" ? "flex-start" : "flex-end", gap: 4 }}>
                {m.role === "ai" && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                    </div>
                    <div className="chat-bubble-ai" style={{ animation: "pop-in .2s ease" }}>
                      {renderText(m.text)}
                    </div>
                  </div>
                )}
                {m.role === "user" && (
                  <div className="chat-bubble-user" style={{ animation: "pop-in .2s ease" }}>
                    {m.text}
                  </div>
                )}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,.2)", paddingLeft: m.role === "ai" ? 36 : 0 }}>{m.ts}</span>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                </div>
                <div className="chat-bubble-ai" style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0,.25,.5].map(d => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", animation: `pulse-dot 1.2s ${d}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ padding: "0 16px 10px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              style={{ padding: "5px 12px", borderRadius: 99, background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.2)", color: "rgba(168,85,247,.8)", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer", transition: "all .15s" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,.18)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,.08)"; }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "0 16px 20px", display: "flex", gap: 8, flexShrink: 0 }}>
          <input className="chat-input" style={{ flex: 1 }} placeholder={tr.aiPlaceholder} value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={() => send()} disabled={!input.trim() || typing}
            style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: input.trim() ? 1 : .4, transition: "opacity .2s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}
