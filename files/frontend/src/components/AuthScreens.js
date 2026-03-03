// src/components/AuthScreens.js
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("login");
  // For Google new users who need to pick a username
  const [pickUsername, setPickUsername] = useState(null);
  // { credential, suggestedUsername, email }

  if (loading) return <LoadingScreen />;
  if (!user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {pickUsername
          ? <PickUsernameScreen
              {...pickUsername}
              onBack={() => setPickUsername(null)}
            />
          : mode === "login"
            ? <LoginScreen
                onSwitch={() => setMode("register")}
                onNeedsUsername={(cred, sug, email) => setPickUsername({ credential: cred, suggestedUsername: sug, email })}
              />
            : <RegisterScreen
                onSwitch={() => setMode("login")}
                onNeedsUsername={(cred, sug, email) => setPickUsername({ credential: cred, suggestedUsername: sug, email })}
              />
        }
      </GoogleOAuthProvider>
    );
  }
  return children;
}

function LoadingScreen() {
  return (
    <div style={s.center}>
      <div style={{ fontSize:"3rem", animation:"pulse 1.5s ease-in-out infinite" }}>⚔️</div>
      <div style={{ color:"#555", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.9rem" }}>
        Loading the dungeon...
      </div>
    </div>
  );
}

// ─── Shared Google button logic ───────────────────────────────────────────────
function useGoogleAuth(onNeedsUsername) {
  const { loginWithToken } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = useCallback(async (credentialResponse) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");
      
      // New user needs to pick a username
      if (data.needsUsername) {
        onNeedsUsername(credentialResponse.credential, data.suggestedUsername, data.email);
        return;
      }
      loginWithToken(data.token, data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [loginWithToken, onNeedsUsername]);

  return { handleGoogle, error, setError, loading };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onSwitch, onNeedsUsername }) {
  const { login } = useAuth();
  const { handleGoogle, error: googleError, setError, loading: googleLoading } = useGoogleAuth(onNeedsUsername);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setLocalErr] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setLocalErr("Fill in all fields."); return; }
    setLoading(true); setLocalErr("");
    try {
      await login(email, password);
    } catch (e) {
      setLocalErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const anyError = googleError || error;

  return (
    <div style={s.page}>
      <div style={s.bg} />
      <div style={s.card}>
        <div style={s.logo}>⚔️</div>
        <div style={s.gameTitle}>DUNGEON ASCENT</div>
        <div style={s.gameSub}>CODE ARENA</div>
        <div style={s.divider} />

        {/* Google Sign In — primary method */}
        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError("Google sign-in was cancelled.")}
            theme="filled_black"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        <div style={s.orDivider}><span style={s.orText}>or sign in with email</span></div>

        {/* Email/password fallback */}
        <Field label="Email" type="email" value={email} onChange={setEmail}
          placeholder="your@email.com" onEnter={handleLogin} />
        <Field label="Password" type="password" value={password} onChange={setPassword}
          placeholder="••••••••" onEnter={handleLogin} />

        {anyError && <ErrorBox msg={anyError} />}

        <button style={s.btn} onClick={handleLogin} disabled={loading || googleLoading}>
          {loading ? "Entering..." : "Enter the Arena →"}
        </button>

        <div style={s.switchText}>
          New warrior?{" "}
          <span style={s.switchLink} onClick={onSwitch}>Create your legend →</span>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function RegisterScreen({ onSwitch, onNeedsUsername }) {
  const { login } = useAuth();
  const { handleGoogle, error: googleError, setError, loading: googleLoading } = useGoogleAuth(onNeedsUsername);
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setLocalErr] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) { setLocalErr("Fill in all fields."); return; }
    if (username.trim().length < 3) { setLocalErr("Username must be at least 3 characters."); return; }
    if (password.length < 6) { setLocalErr("Password must be at least 6 characters."); return; }
    setLoading(true); setLocalErr("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      await login(email, password);
    } catch (e) {
      setLocalErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const anyError = googleError || error;

  return (
    <div style={s.page}>
      <div style={s.bg} />
      <div style={s.card}>
        <div style={s.logo}>⚔️</div>
        <div style={s.gameTitle}>DUNGEON ASCENT</div>
        <div style={s.gameSub}>FORGE YOUR LEGEND</div>
        <div style={s.divider} />

        {/* Google Sign Up — recommended */}
        <div style={s.googleNote}>⚡ Fastest way — one click, no password needed</div>
        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError("Google sign-in was cancelled.")}
            theme="filled_black"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        <div style={s.orDivider}><span style={s.orText}>or create with email</span></div>

        <Field label="Warrior Name" type="text" value={username} onChange={setUsername}
          placeholder="LegendaryKoder" maxLength={20} />
        <Field label="Email" type="email" value={email} onChange={setEmail}
          placeholder="your@email.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword}
          placeholder="Min 6 characters" onEnter={handleRegister} />

        {anyError && <ErrorBox msg={anyError} />}

        <button style={s.btn} onClick={handleRegister} disabled={loading || googleLoading}>
          {loading ? "Creating account..." : "🔥 Begin My Ascent"}
        </button>

        <div style={s.switchText}>
          Already a warrior?{" "}
          <span style={s.switchLink} onClick={onSwitch}>Return to the arena →</span>
        </div>
      </div>
    </div>
  );
}

// ─── Pick Username Screen (shown to new Google users) ────────────────────────
function PickUsernameScreen({ credential, suggestedUsername, email, onBack }) {
  const { loginWithToken } = useAuth();
  const [username, setUsername] = useState(suggestedUsername || "");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleConfirm = async () => {
    if (!username.trim()) { setError("Pick a username."); return; }
    if (username.trim().length < 3) { setError("At least 3 characters."); return; }
    if (username.trim().length > 20) { setError("Max 20 characters."); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError("Only letters, numbers and underscores."); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      loginWithToken(data.token, data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.bg} />
      <div style={s.card}>
        <div style={s.logo}>⚔️</div>
        <div style={s.gameTitle}>ONE LAST THING</div>
        <div style={s.gameSub}>CHOOSE YOUR WARRIOR NAME</div>
        <div style={s.divider} />
        <div style={{ color:"#666", fontSize:"0.82rem", textAlign:"center", lineHeight:"1.6" }}>
          Signing in as <span style={{color:"#ffd700"}}>{email}</span><br/>
          Pick a name that will appear on the leaderboard.
        </div>

        <Field
          label="Warrior Name"
          type="text"
          value={username}
          onChange={setUsername}
          placeholder="LegendaryKoder"
          maxLength={20}
          onEnter={handleConfirm}
        />
        <div style={{ color:"#333", fontSize:"0.72rem" }}>
          Letters, numbers, underscores only. Max 20 chars.
        </div>

        {error && <ErrorBox msg={error} />}

        <button style={s.btn} onClick={handleConfirm} disabled={loading}>
          {loading ? "Creating account..." : "🔥 Enter the Dungeon"}
        </button>
        <div style={{ textAlign:"center" }}>
          <span style={{ color:"#333", fontSize:"0.78rem", cursor:"pointer" }} onClick={onBack}>
            ← Go back
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, onEnter, maxLength }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
      <label style={{ color:"#888", fontSize:"0.8rem", letterSpacing:"0.1em" }}>{label}</label>
      <input
        style={s.input} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
        placeholder={placeholder} maxLength={maxLength}
      />
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div style={{ background:"rgba(255,68,68,0.08)", border:"1px solid #ff444433", borderRadius:4, padding:"0.5rem 0.75rem", color:"#ff6666", fontSize:"0.82rem" }}>
      ⚠️ {msg}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:      { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", position:"relative", overflow:"hidden", background:"#050508" },
  bg:        { position:"fixed", inset:0, background:`radial-gradient(ellipse at 20% 20%,rgba(255,68,0,0.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(100,0,200,0.08) 0%,transparent 60%)`, pointerEvents:"none" },
  card:      { background:"rgba(10,10,20,0.97)", border:"1px solid #2a1a0a", borderRadius:12, padding:"2.5rem 2rem", width:"100%", maxWidth:420, display:"flex", flexDirection:"column", gap:"1rem", position:"relative", boxShadow:"0 0 60px rgba(255,68,0,0.1)" },
  logo:      { fontSize:"2.5rem", textAlign:"center" },
  gameTitle: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.8rem", color:"#ffd700", textAlign:"center", letterSpacing:"0.15em", textShadow:"0 0 20px rgba(255,215,0,0.4)" },
  gameSub:   { fontSize:"0.72rem", color:"#ff4444", textAlign:"center", letterSpacing:"0.5em", fontFamily:"'JetBrains Mono',monospace" },
  divider:   { height:"1px", background:"linear-gradient(90deg,transparent,#333,transparent)" },
  googleWrap:{ display:"flex", justifyContent:"center" },
  googleNote:{ color:"#ffd70077", fontSize:"0.75rem", textAlign:"center", letterSpacing:"0.05em" },
  orDivider: { display:"flex", alignItems:"center", gap:"0.75rem" },
  orText:    { color:"#333", fontSize:"0.75rem", whiteSpace:"nowrap", padding:"0 0.5rem", background:"rgba(10,10,20,0.97)", position:"relative", flex:1, textAlign:"center", borderTop:"1px solid #1a1a2a" },
  input:     { background:"#0d0d18", border:"1px solid #2a2a3a", borderRadius:6, color:"#e8d5a3", padding:"0.7rem 0.9rem", fontSize:"0.9rem", fontFamily:"'JetBrains Mono',monospace", outline:"none" },
  btn:       { background:"linear-gradient(135deg,#7c2d12,#991b1b)", border:"1px solid #dc2626", color:"#fff", padding:"0.85rem", borderRadius:6, fontSize:"0.95rem", fontFamily:"'Syne',sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em" },
  switchText:{ color:"#555", fontSize:"0.82rem", textAlign:"center" },
  switchLink:{ color:"#ffd700", cursor:"pointer", textDecoration:"underline" },
  center:    { minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem", background:"#050508" },
};