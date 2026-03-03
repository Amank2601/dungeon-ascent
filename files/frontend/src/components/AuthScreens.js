// src/components/AuthScreens.js
import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// screens: main | register | otp | pickUsername | forgot | resetOtp | newPassword
export function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState("main");
  const [pending, setPending] = useState(null);

  if (loading) return <LoadingScreen />;
  if (!user) return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {screen === "main"         && <MainScreen         onRegister={() => setScreen("register")} onForgot={() => setScreen("forgot")} onNeedsUsername={(d) => { setPending(d); setScreen("pickUsername"); }} />}
      {screen === "register"     && <RegisterScreen     onBack={() => setScreen("main")}         onOTPSent={(d) => { setPending(d); setScreen("otp"); }} />}
      {screen === "otp"          && <OTPScreen          data={pending}                            onBack={() => setScreen("register")} />}
      {screen === "pickUsername" && <PickUsernameScreen data={pending}                            onBack={() => setScreen("main")} />}
      {screen === "forgot"       && <ForgotScreen       onBack={() => setScreen("main")}          onOTPSent={(d) => { setPending(d); setScreen("resetOtp"); }} />}
      {screen === "resetOtp"     && <ResetOTPScreen     data={pending}                            onBack={() => setScreen("forgot")} onVerified={(d) => { setPending(d); setScreen("newPassword"); }} />}
      {screen === "newPassword"  && <NewPasswordScreen  data={pending}                            onBack={() => setScreen("forgot")} onDone={() => setScreen("main")} />}
    </GoogleOAuthProvider>
  );
  return children;
}

function LoadingScreen() {
  return (
    <div style={s.center}>
      <div style={{ fontSize:"3rem" }}>⚔️</div>
      <div style={{ color:"#555", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.9rem" }}>Loading the dungeon...</div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
function MainScreen({ onRegister, onForgot, onNeedsUsername }) {
  const { login, loginWithToken } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Fill in all fields."); return; }
    setLoading(true); setError("");
    try { await login(email, password); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = useCallback(async (cr) => {
    setGLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/google", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: cr.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");
      if (data.needsUsername) { onNeedsUsername({ credential: cr.credential, suggestedUsername: data.suggestedUsername, email: data.email }); return; }
      loginWithToken(data.token, data.user);
    } catch (e) { setError(e.message); }
    finally { setGLoading(false); }
  }, [loginWithToken, onNeedsUsername]);

  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.8rem" }}>⚔️</div>
          <div style={s.gameTitle}>DUNGEON ASCENT</div>
          <div style={s.gameSub}>CODE ARENA · YEAR 2157</div>
        </div>
        <div style={s.divider}/>
        <div style={s.lore}>"You were betrayed. Pushed into the abyss.<br/>Six worlds stand between you and redemption."</div>
        <div style={s.divider}/>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}>
          <div style={s.sectionLabel}>⚡ Fastest — sign in with Google</div>
          {gLoading
            ? <div style={s.subText}>Verifying with Google...</div>
            : <GoogleLogin onSuccess={handleGoogle} onError={() => setError("Google sign-in cancelled.")} theme="filled_black" size="large" text="continue_with" shape="rectangular" width="300"/>
          }
        </div>
        <div style={s.orRow}><div style={s.orLine}/><span style={s.orText}>or sign in with email</span><div style={s.orLine}/></div>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" onEnter={handleLogin}/>
        <PasswordField label="Password" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw(p => !p)} onEnter={handleLogin}/>
        {error && <ErrBox msg={error}/>}
        <button style={s.btn} onClick={handleLogin} disabled={loading || gLoading}>
          {loading ? "Signing in..." : "Enter the Arena →"}
        </button>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem" }}>
          <span style={s.link} onClick={onRegister}>New warrior? Create account →</span>
          <span style={s.linkDim} onClick={onForgot}>Forgot password?</span>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
function RegisterScreen({ onBack, onOTPSent }) {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSend = async () => {
    if (!username || !email || !password) { setError("Fill in all fields."); return; }
    if (username.trim().length < 3) { setError("Username min 3 characters."); return; }
    if (password.length < 6) { setError("Password min 6 characters."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      onOTPSent({ username: username.trim(), email, password });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem" }}>⚔️</div>
          <div style={s.gameTitle}>CREATE ACCOUNT</div>
          <div style={s.gameSub}>FORGE YOUR LEGEND</div>
        </div>
        <div style={s.divider}/>
        <div style={s.lore}>"A new warrior enters. Your journey from the abyss begins now."</div>
        <Field label="Warrior Name" type="text" value={username} onChange={setUsername} placeholder="LegendaryKoder" maxLength={20}/>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com"/>
        <PasswordField label="Password" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw(p => !p)} onEnter={handleSend}/>
        {error && <ErrBox msg={error}/>}
        <button style={s.btn} onClick={handleSend} disabled={loading}>
          {loading ? "Sending code..." : "📧 Send Verification Code"}
        </button>
        <div style={s.subText}>A 6-digit code will be sent to your email to confirm it is real.</div>
        <div style={{ textAlign:"center" }}><span style={s.link} onClick={onBack}>← Back to sign in</span></div>
      </div>
    </div>
  );
}

// ─── OTP (signup) ─────────────────────────────────────────────────────────────
function OTPScreen({ data, onBack }) {
  const { login } = useAuth();
  const [otp,      setOtp]      = useState(["","","","","",""]);
  const [error,    setError]    = useState("");
  const [info,     setInfo]     = useState("Code sent! Check your inbox (and spam folder).");
  const [loading,  setLoading]  = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async (overrideCode) => {
    const code = overrideCode || otp.join("");
    if (code.length < 6) { setError("Enter the full 6-digit code."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: code }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Verification failed");
      await login(data.email, data.password);
    } catch (e) {
      setError(e.message);
      setOtp(["","","","","",""]);
      refs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g,"").slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) refs.current[i+1]?.focus();
    if (v && i === 5 && next.every(d => d !== "")) setTimeout(() => handleVerify(next.join("")), 80);
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i-1]?.focus();
    if (e.key === "Enter") handleVerify();
  };
  const handlePaste = (e) => {
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (p.length === 6) { setOtp(p.split("")); refs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(""); setInfo("");
    try {
      const res = await fetch(API + "/auth/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setInfo("New code sent!"); setCooldown(60);
      setOtp(["","","","","",""]); refs.current[0]?.focus();
    } catch (e) { setError(e.message); }
  };

  return <OTPBoxScreen title="CHECK YOUR EMAIL" sub="VERIFY YOUR IDENTITY" email={data?.email} info={info} error={error} otp={otp} refs={refs} loading={loading} cooldown={cooldown} onVerify={handleVerify} onChange={handleChange} onKey={handleKey} onPaste={handlePaste} onResend={handleResend} onBack={onBack} btnLabel="✅ Verify & Create Account"/>;
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
function ForgotScreen({ onBack, onOTPSent }) {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) { setError("Enter your email."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      onOTPSent({ email: email.toLowerCase().trim() });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem" }}>🔑</div>
          <div style={s.gameTitle}>FORGOT PASSWORD</div>
          <div style={s.gameSub}>RECLAIM YOUR ACCOUNT</div>
        </div>
        <div style={s.divider}/>
        <div style={s.lore}>"Even the greatest warriors forget. Enter your email and we will send a reset code."</div>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" onEnter={handleSend}/>
        {error && <ErrBox msg={error}/>}
        <button style={s.btn} onClick={handleSend} disabled={loading}>
          {loading ? "Sending code..." : "🔑 Send Reset Code"}
        </button>
        <div style={s.subText}>A 6-digit reset code will be sent if the email exists.</div>
        <div style={{ textAlign:"center" }}><span style={s.link} onClick={onBack}>← Back to sign in</span></div>
      </div>
    </div>
  );
}

// ─── RESET OTP SCREEN ─────────────────────────────────────────────────────────
function ResetOTPScreen({ data, onBack, onVerified }) {
  const [otp,      setOtp]      = useState(["","","","","",""]);
  const [error,    setError]    = useState("");
  const [info,     setInfo]     = useState("Reset code sent! Check your inbox.");
  const [loading,  setLoading]  = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Just verify the OTP is correct, don't reset yet — pass email+otp to next screen
  const handleVerify = async (overrideCode) => {
    const code = overrideCode || otp.join("");
    if (code.length < 6) { setError("Enter the full 6-digit code."); return; }
    // We'll do actual verification on reset-password endpoint with new password
    // For UX: just move to next screen carrying the code
    onVerified({ email: data.email, otp: code });
  };

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g,"").slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) refs.current[i+1]?.focus();
    if (v && i === 5 && next.every(d => d !== "")) setTimeout(() => handleVerify(next.join("")), 80);
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i-1]?.focus();
    if (e.key === "Enter") handleVerify();
  };
  const handlePaste = (e) => {
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (p.length === 6) { setOtp(p.split("")); refs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(""); setInfo("");
    try {
      const res = await fetch(API + "/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setInfo("New code sent!"); setCooldown(60);
      setOtp(["","","","","",""]); refs.current[0]?.focus();
    } catch (e) { setError(e.message); }
  };

  return <OTPBoxScreen title="CHECK YOUR EMAIL" sub="ENTER RESET CODE" email={data?.email} info={info} error={error} otp={otp} refs={refs} loading={loading} cooldown={cooldown} onVerify={handleVerify} onChange={handleChange} onKey={handleKey} onPaste={handlePaste} onResend={handleResend} onBack={onBack} btnLabel="→ Continue to New Password"/>;
}

// ─── NEW PASSWORD SCREEN ──────────────────────────────────────────────────────
function NewPasswordScreen({ data, onBack, onDone }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) { setError("Fill in both fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: data.otp, newPassword: password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Reset failed");
      setSuccess("Password updated! Redirecting to sign in...");
      setTimeout(onDone, 2000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem" }}>🛡️</div>
          <div style={s.gameTitle}>NEW PASSWORD</div>
          <div style={s.gameSub}>FORGE A STRONGER KEY</div>
        </div>
        <div style={s.divider}/>
        <div style={{ color:"#555", fontSize:"0.82rem", textAlign:"center" }}>
          Resetting password for <span style={{ color:"#ffd700" }}>{data?.email}</span>
        </div>
        <PasswordField label="New Password" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw(p => !p)}/>
        <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} show={showCf} onToggle={() => setShowCf(p => !p)} onEnter={handleReset}/>
        {error   && <ErrBox msg={error}/>}
        {success && <div style={s.infoBox}>✅ {success}</div>}
        <button style={s.btn} onClick={handleReset} disabled={loading}>
          {loading ? "Updating..." : "🛡️ Set New Password"}
        </button>
        <div style={{ textAlign:"center" }}><span style={s.link} onClick={onBack}>← Try a different code</span></div>
      </div>
    </div>
  );
}

// ─── PICK USERNAME ────────────────────────────────────────────────────────────
function PickUsernameScreen({ data, onBack }) {
  const { loginWithToken } = useAuth();
  const [username, setUsername] = useState(data?.suggestedUsername || "");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleConfirm = async () => {
    const trimmed = username.trim();
    if (!trimmed)            { setError("Pick a warrior name."); return; }
    if (trimmed.length < 3)  { setError("At least 3 characters."); return; }
    if (trimmed.length > 20) { setError("Max 20 characters."); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError("Letters, numbers, underscores only."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(API + "/auth/google", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: data.credential, username: trimmed }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to create account");
      loginWithToken(d.token, d.user);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem" }}>⚔️</div>
          <div style={s.gameTitle}>ONE LAST THING</div>
          <div style={s.gameSub}>CHOOSE YOUR WARRIOR NAME</div>
        </div>
        <div style={s.divider}/>
        <div style={{ color:"#555", fontSize:"0.82rem", textAlign:"center", lineHeight:"1.7" }}>
          Signed in as <span style={{ color:"#ffd700" }}>{data?.email}</span><br/>
          This name will appear on the leaderboard.
        </div>
        <Field label="WARRIOR NAME" type="text" value={username} onChange={setUsername} placeholder="LegendaryKoder" maxLength={20} onEnter={handleConfirm}/>
        <div style={s.subText}>Letters, numbers, underscores · 3-20 characters</div>
        {error && <ErrBox msg={error}/>}
        <button style={s.btn} onClick={handleConfirm} disabled={loading}>
          {loading ? "Creating account..." : "🔥 Enter the Dungeon"}
        </button>
        <div style={{ textAlign:"center" }}><span style={s.link} onClick={onBack}>← Use a different Google account</span></div>
      </div>
    </div>
  );
}

// ─── SHARED OTP BOX UI ────────────────────────────────────────────────────────
function OTPBoxScreen({ title, sub, email, info, error, otp, refs, loading, cooldown, onVerify, onChange, onKey, onPaste, onResend, onBack, btnLabel }) {
  return (
    <div style={s.page}><div style={s.bg}/><div style={s.grid}/>
      <div style={s.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem" }}>📧</div>
          <div style={s.gameTitle}>{title}</div>
          <div style={s.gameSub}>{sub}</div>
        </div>
        <div style={s.divider}/>
        <div style={{ background:"rgba(255,215,0,0.04)", border:"1px solid #ffd70022", borderRadius:8, padding:"0.9rem 1rem", textAlign:"center" }}>
          <div style={{ color:"#888", fontSize:"0.75rem", marginBottom:"0.25rem" }}>Code sent to</div>
          <div style={{ color:"#ffd700", fontWeight:"bold", fontSize:"0.88rem", wordBreak:"break-all" }}>{email}</div>
          <div style={{ color:"#333", fontSize:"0.7rem", marginTop:"0.3rem" }}>Expires in 10 minutes · Check spam if not received</div>
        </div>
        {info  && <div style={s.infoBox}>{info}</div>}
        {error && <ErrBox msg={error}/>}
        <div style={{ display:"flex", gap:"0.45rem", justifyContent:"center" }} onPaste={onPaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={el => refs.current[i] = el}
              value={digit} onChange={e => onChange(i, e.target.value)}
              onKeyDown={e => onKey(i, e)}
              type="text" inputMode="numeric" maxLength={1} autoFocus={i === 0}
              style={{ width:44, height:54, textAlign:"center", fontSize:"1.7rem", fontWeight:"bold",
                fontFamily:"'JetBrains Mono',monospace", background:"#0d0d18",
                border:"2px solid " + (digit ? "#ffd700" : "#2a2a3a"), borderRadius:8,
                outline:"none", color:"#ffd700", transition:"all 0.15s",
                boxShadow: digit ? "0 0 12px rgba(255,215,0,0.25)" : "none" }}
            />
          ))}
        </div>
        <button style={s.btn} onClick={() => onVerify()} disabled={loading}>
          {loading ? "Verifying..." : btnLabel}
        </button>
        <div style={{ textAlign:"center", fontSize:"0.8rem" }}>
          <span style={{ color:"#444" }}>Didn't receive it? </span>
          <span onClick={onResend} style={{ color: cooldown > 0 ? "#2a2a2a" : "#ffd700", cursor: cooldown > 0 ? "default" : "pointer", textDecoration: cooldown > 0 ? "none" : "underline" }}>
            {cooldown > 0 ? "Resend in " + cooldown + "s" : "Resend code"}
          </span>
        </div>
        <div style={{ textAlign:"center" }}><span style={s.link} onClick={onBack}>← Go back</span></div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, onEnter, maxLength }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
      <label style={{ color:"#888", fontSize:"0.78rem", letterSpacing:"0.1em" }}>{label}</label>
      <input style={s.input} type={type} value={value} onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()} placeholder={placeholder} maxLength={maxLength}/>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, onEnter }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
      <label style={{ color:"#888", fontSize:"0.78rem", letterSpacing:"0.1em" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input style={{ ...s.input, paddingRight:"2.8rem", width:"100%", boxSizing:"border-box" }}
          type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onEnter?.()}
          placeholder="••••••••"/>
        <button onClick={onToggle} type="button"
          style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", cursor:"pointer", color:"#555", fontSize:"1rem", padding:0, lineHeight:1 }}>
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  return <div style={{ background:"rgba(255,68,68,0.08)", border:"1px solid #ff444433", borderRadius:4, padding:"0.5rem 0.75rem", color:"#ff6666", fontSize:"0.8rem" }}>⚠️ {msg}</div>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:        { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", position:"relative", overflow:"hidden", background:"#000" },
  bg:          { position:"fixed", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at 20% 30%,rgba(255,100,0,0.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(100,0,255,0.08) 0%,transparent 50%)" },
  grid:        { position:"fixed", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(255,215,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.02) 1px,transparent 1px)", backgroundSize:"60px 60px" },
  card:        { background:"rgba(8,8,14,0.97)", border:"1px solid #1a1200", borderRadius:14, padding:"2.5rem 2rem", width:"100%", maxWidth:400, display:"flex", flexDirection:"column", gap:"1rem", boxShadow:"0 0 80px rgba(255,68,0,0.07)" },
  gameTitle:   { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.6rem", color:"#ffd700", textAlign:"center", letterSpacing:"0.12em", textShadow:"0 0 30px rgba(255,215,0,0.3)", marginTop:"0.3rem" },
  gameSub:     { fontSize:"0.68rem", color:"#ff4444", textAlign:"center", letterSpacing:"0.4em", fontFamily:"'JetBrains Mono',monospace" },
  divider:     { height:"1px", background:"linear-gradient(90deg,transparent,#1a1a1a,transparent)" },
  lore:        { color:"#444", fontSize:"0.78rem", textAlign:"center", fontStyle:"italic", lineHeight:"1.8", fontFamily:"'JetBrains Mono',monospace" },
  sectionLabel:{ color:"#ffd70066", fontSize:"0.72rem", letterSpacing:"0.08em" },
  orRow:       { display:"flex", alignItems:"center", gap:"0.75rem" },
  orLine:      { flex:1, height:"1px", background:"#1a1a1a" },
  orText:      { color:"#333", fontSize:"0.72rem", whiteSpace:"nowrap" },
  input:       { background:"#0d0d18", border:"1px solid #2a2a3a", borderRadius:6, color:"#e8d5a3", padding:"0.7rem 0.9rem", fontSize:"0.88rem", fontFamily:"'JetBrains Mono',monospace", outline:"none" },
  btn:         { background:"linear-gradient(135deg,#7c2d12,#991b1b)", border:"1px solid #dc2626", color:"#fff", padding:"0.85rem", borderRadius:6, fontSize:"0.92rem", fontFamily:"'Syne',sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em" },
  link:        { color:"#ffd700", cursor:"pointer", textDecoration:"underline", fontSize:"0.8rem" },
  linkDim:     { color:"#555", cursor:"pointer", fontSize:"0.8rem" },
  subText:     { color:"#333", fontSize:"0.72rem", textAlign:"center" },
  infoBox:     { background:"rgba(34,197,94,0.07)", border:"1px solid #22c55e33", borderRadius:4, padding:"0.5rem 0.75rem", color:"#22c55e", fontSize:"0.8rem", textAlign:"center" },
  center:      { minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem", background:"#000" },
};