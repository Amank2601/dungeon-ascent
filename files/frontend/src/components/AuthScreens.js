// src/components/AuthScreens.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("login"); // login | register

  if (loading) return <LoadingScreen />;
  if (!user) return mode === "login"
    ? <LoginScreen onSwitch={() => setMode("register")} />
    : <RegisterScreen onSwitch={() => setMode("login")} />;
  return children;
}

function LoadingScreen() {
  return (
    <div style={s.center}>
      <div style={s.loadingIcon}>⚔️</div>
      <div style={s.loadingText}>Loading the dungeon...</div>
    </div>
  );
}

function LoginScreen({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.authPage}>
      <div style={s.authBg} />
      <div style={s.authCard}>
        <div style={s.authLogo}>⚔️</div>
        <div style={s.authTitle}>DUNGEON ASCENT</div>
        <div style={s.authSub}>CODE ARENA</div>
        <div style={s.authDivider} />
        <div style={s.authFormTitle}>Enter the Dungeon</div>
        <div style={s.authLore}>
          "The dungeon remembers those who fled. Your progress awaits within."
        </div>

        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Entering..." : "⚔️ Enter the Arena"}
        </button>

        <div style={s.switchText}>
          New warrior?{" "}
          <span style={s.switchLink} onClick={onSwitch}>
            Create your legend →
          </span>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onSwitch }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !password) { setError("Fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await register(username, email, password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.authPage}>
      <div style={s.authBg} />
      <div style={s.authCard}>
        <div style={s.authLogo}>⚔️</div>
        <div style={s.authTitle}>DUNGEON ASCENT</div>
        <div style={s.authSub}>FORGE YOUR LEGEND</div>
        <div style={s.authDivider} />
        <div style={s.authFormTitle}>Create Your Character</div>
        <div style={s.authLore}>
          "A new warrior enters the Code Arena. Your journey from the abyss begins now."
        </div>

        <div style={s.field}>
          <label style={s.label}>Warrior Name</label>
          <input
            style={s.input}
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="LegendaryKoder"
            maxLength={20}
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Min 6 characters"
          />
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Forging legend..." : "🔥 Begin My Ascent"}
        </button>

        <div style={s.switchText}>
          Already a warrior?{" "}
          <span style={s.switchLink} onClick={onSwitch}>
            Return to the arena →
          </span>
        </div>
      </div>
    </div>
  );
}

const s = {
  authPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
    background: "#050508",
  },
  authBg: {
    position: "fixed",
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 20%, rgba(255,68,0,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(100,0,200,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 70%)
    `,
    pointerEvents: "none",
  },
  authCard: {
    background: "rgba(10,10,20,0.95)",
    border: "1px solid #2a1a0a",
    borderRadius: "12px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    position: "relative",
    boxShadow: "0 0 60px rgba(255,68,0,0.1), 0 0 120px rgba(100,0,200,0.05)",
  },
  authLogo: { fontSize: "2.5rem", textAlign: "center" },
  authTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.8rem",
    color: "#ffd700",
    textAlign: "center",
    letterSpacing: "0.15em",
    textShadow: "0 0 20px rgba(255,215,0,0.4)",
  },
  authSub: {
    fontSize: "0.75rem",
    color: "#ff4444",
    textAlign: "center",
    letterSpacing: "0.5em",
    fontFamily: "'JetBrains Mono', monospace",
  },
  authDivider: { height: "1px", background: "linear-gradient(90deg, transparent, #333, transparent)" },
  authFormTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    color: "#e8d5a3",
    fontSize: "1.1rem",
    textAlign: "center",
  },
  authLore: {
    color: "#555",
    fontSize: "0.78rem",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: "1.5",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  label: { color: "#888", fontSize: "0.8rem", letterSpacing: "0.1em" },
  input: {
    background: "#0d0d18",
    border: "1px solid #2a2a3a",
    borderRadius: "6px",
    color: "#e8d5a3",
    padding: "0.7rem 0.9rem",
    fontSize: "0.9rem",
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    transition: "border-color 0.2s",
  },
  error: {
    background: "rgba(255,68,68,0.08)",
    border: "1px solid #ff444433",
    borderRadius: "4px",
    padding: "0.5rem 0.75rem",
    color: "#ff6666",
    fontSize: "0.82rem",
  },
  btn: {
    background: "linear-gradient(135deg, #7c2d12, #991b1b)",
    border: "1px solid #dc2626",
    color: "#fff",
    padding: "0.85rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
    marginTop: "0.5rem",
  },
  switchText: { color: "#555", fontSize: "0.82rem", textAlign: "center" },
  switchLink: { color: "#ffd700", cursor: "pointer", textDecoration: "underline" },
  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    background: "#050508",
  },
  loadingIcon: { fontSize: "3rem", animation: "pulse 1.5s ease-in-out infinite" },
  loadingText: { color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem" },
};
