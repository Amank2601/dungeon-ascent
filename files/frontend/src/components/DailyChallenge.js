// src/components/DailyChallenge.js
import { useState, useEffect } from "react";
import { apiFetch } from "../context/AuthContext";
import { playSound } from "../data/sounds";

function countdown(ms) {
  const h = Math.floor(ms/3600000);
  const m = Math.floor((ms%3600000)/60000);
  return `${h}h ${m}m`;
}

export function DailyChallenge({ onBack, onXPGained }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [code,    setCode]    = useState("");
  const [result,  setResult]  = useState(null); // "correct" | "wrong" | null
  const [submitting, setSub]  = useState(false);
  const [timeLeft, setTime]   = useState(0);

  useEffect(() => {
    apiFetch("/daily")
      .then(d => {
        setData(d);
        setCode(d.problem.starterCode || "");
        setTime(d.nextResetMs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // countdown timer
  useEffect(() => {
    if (!timeLeft) return;
    const t = setInterval(() => setTime(ms => Math.max(0, ms - 1000)), 1000);
    return () => clearInterval(t);
  }, [!!timeLeft]);

  const handleSubmit = async () => {
    if (!code.trim() || submitting) return;
    setSub(true);
    setResult(null);
    try {
      // run via Piston
      const pistonRes = await fetch("http://localhost:5000/api/piston/execute", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          language:"javascript", version:"18.15.0",
          files:[{ name:"daily.js", content: buildTestCode(data.problem, code) }],
        }),
      });
      const piston = await pistonRes.json();
      const output = (piston.run?.stdout || "").trim();
      const passed = output === "PASS";

      if (passed) {
        playSound("correct");
        // mark complete on server
        const reward = await apiFetch("/daily/complete", { method:"POST" });
        setResult({ passed: true, xp: reward.xpAwarded, streak: reward.newStreak, bonus: reward.streakBonus });
        onXPGained?.(reward.xpAwarded);
        playSound(reward.streakBonus > 0 ? "levelUp" : "daily");
      } else {
        playSound("wrong");
        setResult({ passed: false, output });
      }
    } catch (e) {
      setResult({ passed: false, output: e.message });
    } finally {
      setSub(false);
    }
  };

  if (loading) return (
    <div style={s.page}>
      <div style={{textAlign:"center",marginTop:"5rem",fontSize:"2.5rem",animation:"pulse 1.5s infinite"}}>📅</div>
    </div>
  );

  if (!data) return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>
      <div style={{color:"#ff4444",textAlign:"center",marginTop:"3rem"}}>Could not load daily challenge.</div>
    </div>
  );

  const { problem, completedToday, streak } = data;
  const DIFF_COLOR = { easy:"#22c55e", medium:"#f59e0b", hard:"#ff4444" };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>

      <div style={s.header}>
        <div style={s.title}>📅 DAILY CHALLENGE</div>
        <div style={s.meta}>
          <span style={{...s.diff, color: DIFF_COLOR[problem.difficulty]||"#888"}}>
            {problem.difficulty?.toUpperCase()}
          </span>
          <span style={s.xpTag}>+{problem.xpReward} XP</span>
          {streak > 0 && <span style={s.streak}>🔥 {streak} day streak</span>}
          <span style={s.timer}>Resets in {countdown(timeLeft)}</span>
        </div>
      </div>

      {completedToday && !result ? (
        <div style={s.alreadyDone}>
          ✅ You already completed today's challenge!<br/>
          <span style={{color:"#444",fontSize:"0.8rem"}}>Come back in {countdown(timeLeft)} for a new one.</span>
        </div>
      ) : (
        <>
          <div style={s.problemCard}>
            <div style={s.problemTitle}>{problem.title}</div>
            <pre style={s.desc}>{problem.description}</pre>
            {problem.hint && (
              <details style={{marginTop:"0.75rem"}}>
                <summary style={{color:"#444",fontSize:"0.75rem",cursor:"pointer",userSelect:"none"}}>💡 Show hint</summary>
                <div style={{color:"#666",fontSize:"0.78rem",marginTop:"0.4rem",lineHeight:"1.6"}}>{problem.hint}</div>
              </details>
            )}
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={s.editor}
            spellCheck={false}
          />

          {result && (
            <div style={{...s.resultBox, borderColor: result.passed?"#22c55e":"#ff4444", background: result.passed?"rgba(34,197,94,0.05)":"rgba(255,68,68,0.05)"}}>
              {result.passed ? (
                <div>
                  <div style={{color:"#22c55e",fontWeight:"bold",fontSize:"1rem",marginBottom:"0.4rem"}}>✅ Correct!</div>
                  <div style={{color:"#ffd700"}}>+{result.xp} XP earned</div>
                  {result.bonus > 0 && <div style={{color:"#f97316",fontSize:"0.8rem"}}>🔥 Streak bonus: +{result.bonus} XP</div>}
                  <div style={{color:"#666",fontSize:"0.78rem",marginTop:"0.3rem"}}>Day streak: {result.streak} 🔥</div>
                </div>
              ) : (
                <div>
                  <div style={{color:"#ff4444",fontWeight:"bold",marginBottom:"0.4rem"}}>✗ Not quite right</div>
                  {result.output && <pre style={{color:"#555",fontSize:"0.75rem",whiteSpace:"pre-wrap"}}>{result.output}</pre>}
                  <div style={{color:"#444",fontSize:"0.78rem",marginTop:"0.4rem"}}>Check your logic and try again.</div>
                </div>
              )}
            </div>
          )}

          {!result?.passed && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{...s.submitBtn, opacity: submitting?0.6:1}}
            >
              {submitting ? "Testing..." : "Submit Solution ⚔️"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// build test runner code
function buildTestCode(problem, userCode) {
  const cases = problem.testCases || [];
  if (!cases.length) return `${userCode}\nconsole.log("PASS");`;
  return `
${userCode}
const fn = (typeof ${problem.functionName} !== 'undefined') ? ${problem.functionName} : undefined;
if (!fn) { console.log("FAIL: function not found"); process.exit(0); }
let pass = true;
const cases = ${JSON.stringify(cases)};
for (const c of cases) {
  const input = Array.isArray(c.input) ? c.input : [c.input];
  const got = fn(...input);
  const exp = c.expected;
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) { pass = false; break; }
}
console.log(pass ? "PASS" : "FAIL");
`;
}

const s = {
  page:      { width:"100%",maxWidth:680,padding:"1rem 0 3rem",animation:"fadeUp 0.4s ease-out" },
  back:      { background:"transparent",border:"1px solid #1a1a2e",color:"#555",padding:"0.35rem 0.75rem",borderRadius:4,cursor:"pointer",fontSize:"0.8rem",fontFamily:"'JetBrains Mono',monospace",marginBottom:"1rem" },
  header:    { marginBottom:"1.25rem" },
  title:     { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.6rem",color:"#ffd700",marginBottom:"0.5rem" },
  meta:      { display:"flex",gap:"0.6rem",flexWrap:"wrap",alignItems:"center" },
  diff:      { fontSize:"0.72rem",fontWeight:"bold",letterSpacing:"0.1em",fontFamily:"'JetBrains Mono',monospace" },
  xpTag:     { background:"rgba(255,215,0,0.08)",border:"1px solid #ffd70022",color:"#ffd700",padding:"0.15rem 0.5rem",borderRadius:20,fontSize:"0.72rem" },
  streak:    { color:"#f97316",fontSize:"0.78rem",fontWeight:"bold" },
  timer:     { color:"#333",fontSize:"0.72rem",fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto" },
  problemCard:{ background:"#080810",border:"1px solid #141420",borderRadius:8,padding:"1.25rem",marginBottom:"1rem" },
  problemTitle:{ fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#e8d5a3",fontSize:"1rem",marginBottom:"0.6rem" },
  desc:      { color:"#666",fontSize:"0.82rem",lineHeight:"1.75",whiteSpace:"pre-wrap",fontFamily:"'JetBrains Mono',monospace",margin:0 },
  editor:    { width:"100%",minHeight:180,background:"#050508",border:"1px solid #1a1a2a",borderRadius:6,padding:"0.9rem",color:"#e8d5a3",fontSize:"0.85rem",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:"0.75rem" },
  resultBox: { border:"1px solid",borderRadius:6,padding:"1rem",marginBottom:"0.75rem",fontFamily:"'JetBrains Mono',monospace",fontSize:"0.82rem" },
  submitBtn: { fontFamily:"'Syne',sans-serif",fontWeight:700,background:"linear-gradient(135deg,#7c2d12,#991b1b)",border:"1px solid #dc2626",color:"#fff",padding:"0.8rem 2rem",borderRadius:6,fontSize:"0.95rem",cursor:"pointer",width:"100%" },
  alreadyDone:{ textAlign:"center",padding:"2.5rem",color:"#22c55e",lineHeight:"2",border:"1px solid #22c55e22",borderRadius:8,background:"rgba(34,197,94,0.03)" },
};