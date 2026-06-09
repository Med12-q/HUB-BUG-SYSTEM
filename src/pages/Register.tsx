import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

export default function Register() {
  const { lang, register, login } = useApp();
  const tr = t(lang ?? "fr");

  const [mode, setMode] = useState<"register" | "login">("register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setError("");
    if (mode === "register") {
      if (!username.trim() || !email.trim() || !password.trim()) { setError(tr.required); return; }
      if (password !== confirm) { setError(tr.passwordMismatch); return; }
    } else {
      if (!email.trim() || !password.trim()) { setError(tr.required); return; }
    }
    setLoading(true);
    setTimeout(() => {
      if (mode === "register") {
        register(username.trim(), email.trim(), password);
      } else {
        const ok = login(email.trim(), password);
        if (!ok) { setError("Email ou mot de passe incorrect"); setLoading(false); return; }
      }
      setLoading(false);
    }, 800);
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

        {/* Logo */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 30px rgba(168,85,247,.5)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
              <path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/>
              <path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <h1 className="shimmer" style={{ fontSize: 26, fontWeight: 900, letterSpacing: ".04em" }}>HUB BUG SYSTEME</h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(168,85,247,.6)", letterSpacing: ".15em", marginTop: 4 }}>
            {mode === "register" ? tr.createAccount.toUpperCase() : tr.welcomeBack.toUpperCase()}
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ width: "100%", maxWidth: 400, padding: 28 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", marginBottom: 24, border: "1px solid rgba(255,255,255,.07)" }}>
            {(["register","login"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "11px", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: ".06em", cursor: "pointer", border: "none", transition: "all .2s",
                  background: mode === m ? "rgba(168,85,247,.2)" : "transparent",
                  color: mode === m ? "#c084fc" : "rgba(255,255,255,.3)",
                  borderBottom: mode === m ? "2px solid #a855f7" : "2px solid transparent",
                }}>
                {m === "register" ? tr.register.toUpperCase() : tr.login.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && (
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(168,85,247,.7)", letterSpacing: ".15em", display: "block", marginBottom: 6 }}>{tr.username.toUpperCase()}</label>
                <input className="input" placeholder={tr.username} value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(168,85,247,.7)", letterSpacing: ".15em", display: "block", marginBottom: 6 }}>{tr.email.toUpperCase()}</label>
              <input className="input" type="email" placeholder={tr.email} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(168,85,247,.7)", letterSpacing: ".15em", display: "block", marginBottom: 6 }}>{tr.password.toUpperCase()}</label>
              <input className="input" type="password" placeholder={tr.password} value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            {mode === "register" && (
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(168,85,247,.7)", letterSpacing: ".15em", display: "block", marginBottom: 6 }}>{tr.confirmPassword.toUpperCase()}</label>
                <input className="input" type="password" placeholder={tr.confirmPassword} value={confirm} onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()} />
              </div>
            )}

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "#ef4444" }}>
                {error}
              </div>
            )}

            <button onClick={submit} disabled={loading} className="btn-main" style={{ width: "100%", padding: "14px", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: ".08em" }}>
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading
                  ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .8s linear infinite" }} />{tr.sending}</>
                  : mode === "register" ? tr.createAccount : tr.signIn
                }
              </span>
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,.3)" }}>
            {mode === "register" ? tr.alreadyAccount : tr.noAccount}{" "}
            <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}
              style={{ background: "none", border: "none", color: "#c084fc", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, textDecoration: "underline" }}>
              {mode === "register" ? tr.signIn : tr.createAccount}
            </button>
          </p>
        </div>

        <p style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,.12)", letterSpacing: ".1em" }}>
          𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵
        </p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
