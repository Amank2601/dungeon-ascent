// src/components/BattleScreen.js
import { useState, useEffect, useRef } from "react";
import { LANGUAGES, runWithPiston, validatePseudoCode } from "../data/languages";
import { FOLLOW_UPS } from "../data/problems";

// ─── Constants ────────────────────────────────────────────────────────────────
const PLAYER_MAX_HP = 100;
// Damage per wrong answer
const DMG_NORMAL = [15, 25];
const DMG_BOSS   = [20, 35];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toSnake(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

function getParams(floor) {
  if (!floor.testCases?.length) return "";
  const first = floor.testCases[0];
  if (Array.isArray(first.input)) return first.input.map((_, i) => `param${i + 1}`).join(", ");
  return "n";
}

// ─── Empty skeletons — NO solution pre-filled ─────────────────────────────────
function getEmptyCode(floor, lang) {
  if (!floor.functionName) {
    return lang === "python" ? `# Write your code here\n` : `// Write your code here\n`;
  }
  const fn = floor.functionName;
  const params = getParams(floor);
  switch (lang) {
    case "python":  return `def ${toSnake(fn)}(${params}):\n    # write your solution here\n    pass\n`;
    case "java":    return `public Object ${fn}(${params}) {\n    // write your solution here\n\n}`;
    case "cpp":     return `auto ${fn}(${params}) {\n    // write your solution here\n\n}`;
    default:        return `function ${fn}(${params}) {\n  // write your solution here\n\n}`;
  }
}

function getEmptyCodeForVariant(variant, lang) {
  if (!variant.functionName) {
    return lang === "python" ? `# Write your solution here\n` : `// Write your solution here\n`;
  }
  const fn = variant.functionName;
  switch (lang) {
    case "python":  return `def ${toSnake(fn)}(n):\n    # write your solution here\n    pass\n`;
    case "java":    return `public Object ${fn}(Object n) {\n    // write your solution here\n\n}`;
    case "cpp":     return `auto ${fn}(auto n) {\n    // write your solution here\n\n}`;
    default:        return `function ${fn}(n) {\n  // write your solution here\n\n}`;
  }
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
function HPBar({ current, max, color = "#22c55e", label }) {
  const pct = Math.max(0, (current / max) * 100);
  const col = pct > 50 ? color : pct > 25 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.65rem", color: "#444" }}>{label}</span>
        <span style={{ fontSize: "0.65rem", color: col, fontWeight: "bold" }}>{current}/{max}</span>
      </div>
      <div style={{ height: "8px", background: "#0d0d14", borderRadius: "4px", overflow: "hidden", border: "1px solid #111" }}>
        <div style={{
          height: "100%", borderRadius: "4px",
          width: `${pct}%`, background: col,
          transition: "width 0.4s ease-out",
          boxShadow: pct > 0 ? `0 0 8px ${col}55` : "none",
        }} />
      </div>
    </div>
  );
}

// ─── Sprites ──────────────────────────────────────────────────────────────────
function MonsterSprite({ monster, isShaking, isDefeated }) {
  return (
    <div style={{
      position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
      animation: isShaking ? "shake 0.35s" : isDefeated ? "fadeOutScale 0.8s forwards" : "floatAnim 3s ease-in-out infinite",
    }}>
      {monster.isBoss && !isDefeated && (
        <div style={{ position: "absolute", inset: "-14px", borderRadius: "50%", background: "rgba(255,68,0,0.15)", filter: "blur(14px)", animation: "pulse 2s infinite" }} />
      )}
      <div style={{ fontSize: "4rem", lineHeight: 1, zIndex: 1 }}>{monster.emoji}</div>
    </div>
  );
}

function PlayerSprite({ isAttacking, hp }) {
  const r = hp / PLAYER_MAX_HP;
  return (
    <div style={{
      fontSize: "3.8rem", lineHeight: 1,
      animation: isAttacking ? "attackAnim 0.4s" : "floatAnim 3s ease-in-out infinite 1.5s",
      filter: r < 0.3 ? "drop-shadow(0 0 10px #ff4444)" : "none",
    }}>
      {r > 0.6 ? "🧙‍♂️" : r > 0.3 ? "🧟‍♂️" : "💀"}
    </div>
  );
}

// ─── Arena ────────────────────────────────────────────────────────────────────
function Arena({ playerHp, isAttacking, monsterHp, monsterData, isShaking, accent }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem",
      background: "linear-gradient(180deg,#080512 0%,#040208 100%)",
      border: "1px solid #0d0d14", borderRadius: "8px", padding: "1.2rem 1.5rem",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#333" }}>YOU</div>
        <PlayerSprite isAttacking={isAttacking} hp={playerHp} />
        <HPBar current={playerHp} max={PLAYER_MAX_HP} color="#22c55e" label="Player HP" />
        {playerHp <= 30 && (
          <div style={{ color: "#ef4444", fontSize: "0.68rem", animation: "pulse 1s infinite" }}>⚠️ LOW HP!</div>
        )}
      </div>
      <div style={{ color: "#111", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>VS</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: accent }}>{monsterData.name}</div>
        <MonsterSprite monster={monsterData} isShaking={isShaking} isDefeated={monsterHp <= 0} />
        <HPBar current={monsterHp} max={monsterData.maxHp} color={accent} label="Monster HP" />
      </div>
    </div>
  );
}

// ─── Test Results ─────────────────────────────────────────────────────────────
function TestResults({ results }) {
  if (!results?.length) return null;
  return (
    <div style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "5px", padding: "0.5rem 0.75rem" }}>
      <div style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>TEST RESULTS</div>
      {results.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: t.pass ? "#86efac" : "#fca5a5", marginBottom: "0.15rem" }}>
          <span>{t.pass ? "✅" : "❌"}</span>
          <span style={{ flex: 1 }}>{t.label || `Test ${i + 1}`}</span>
          {!t.pass && t.result !== undefined && (
            <span style={{ color: "#555", fontSize: "0.7rem" }}>got: {String(t.result)}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Problem Panel ────────────────────────────────────────────────────────────
function ProblemPanel({ floor, variant, attemptNumber, accent, isBoss, selectedLang }) {
  const current = variant || floor;
  const isFollowUp = attemptNumber > 0;

  return (
    <div style={{ border: `1px solid ${isBoss ? "#ffd700" : accent}`, borderRadius: "6px", padding: "1rem", background: "#060610", display: "flex", flexDirection: "column", gap: "0.65rem" }}>

      {/* Title + attempt dots */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: isBoss ? "#ffd700" : accent }}>
            {isBoss ? "🔥 " : "⚡ "}{floor.title}
          </div>
          {isFollowUp && (
            <div style={{ background: "#3a1a00", border: "1px solid #7c3a00", color: "#f59e0b", fontSize: "0.68rem", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
              🔄 Follow-up #{attemptNumber} — similar problem
            </div>
          )}
        </div>
        {/* Dots: red=failed, color=current, dark=future */}
        <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: i < attemptNumber ? "#ef4444" : i === attemptNumber ? accent : "#1a1a2a",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Language note */}
      <div style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "3px", padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
        <span style={{ color: LANGUAGES[selectedLang].color }}>{LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}:</span>
        <span style={{ color: "#444", marginLeft: "0.4rem" }}>{LANGUAGES[selectedLang].note}</span>
      </div>

      {isBoss && (
        <div style={{ background: "rgba(255,68,0,0.06)", border: "1px solid #2a0a00", borderRadius: "4px", padding: "0.4rem 0.6rem", color: "#ff6633", fontSize: "0.8rem" }}>
          🔥 MASTERY FORGE — Use everything you've learned!
        </div>
      )}

      {/* Challenge */}
      <div style={{ color: "#ccc", fontSize: "0.87rem", lineHeight: "1.7", whiteSpace: "pre-line" }}>
        {current.challenge || current.description}
      </div>

      {/* Lesson — only first attempt */}
      {!isFollowUp && floor.lesson && (
        <details style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "4px", padding: "0.5rem 0.65rem" }}>
          <summary style={{ cursor: "pointer", color: "#555", fontSize: "0.8rem", userSelect: "none" }}>📖 Show Lesson</summary>
          <div style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.82rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>{floor.lesson}</div>
        </details>
      )}

      {/* Hint */}
      {current.hint && (
        <details style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "4px", padding: "0.5rem 0.65rem" }}>
          <summary style={{ cursor: "pointer", color: "#444", fontSize: "0.8rem", userSelect: "none" }}>💡 Show Hint (free)</summary>
          <div style={{ marginTop: "0.4rem", color: "#666", fontSize: "0.82rem", lineHeight: "1.5" }}>{current.hint}</div>
        </details>
      )}

      {/* Expected output */}
      {(current.testDisplay || []).length > 0 && (
        <div>
          <div style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>EXPECTED</div>
          {current.testDisplay.slice(0, 4).map((t, i) => (
            <div key={i} style={{ fontSize: "0.77rem", color: "#2a2a3a", fontFamily: "'JetBrains Mono',monospace" }}>→ {t}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN BATTLE SCREEN ───────────────────────────────────────────────────────
export function BattleScreen({ world, floor, monster: monsterData, onVictory, onDefeat, onBack, initialLang = "javascript" }) {
  const [phase, setPhase] = useState("dialogue");
  const [dialogueLine, setDialogueLine] = useState(0);
  const [monsterHp, setMonsterHp] = useState(monsterData.hp);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);

  // 0 = original problem, 1 = follow-up 1, 2 = follow-up 2
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [currentVariant, setCurrentVariant] = useState(null);

  const [selectedLang, setSelectedLang] = useState(() => {
    // Use initialLang if this floor supports it, otherwise use first supported lang
    const supported = floor.languages || ["javascript","python","java","cpp"];
    return supported.includes(initialLang) ? initialLang : supported[0];
  });
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [pistonError, setPistonError] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [battleLog]);

  // Reset code when lang or variant changes — always to empty skeleton
  useEffect(() => {
    setCode(currentVariant ? getEmptyCodeForVariant(currentVariant, selectedLang) : getEmptyCode(floor, selectedLang));
    setResult(null);
    setTestResults([]);
    setPistonError(null);
  }, [selectedLang, currentVariant, floor]);

  const addLog = (msg, color = "#888") =>
    setBattleLog(prev => [...prev.slice(-8), { msg, color, id: Date.now() + Math.random() }]);

  const getNextVariant = (attempt) => {
    const variants = FOLLOW_UPS[floor.id];
    if (!variants || attempt >= variants.length) return null;
    return variants[attempt];
  };

  // ── Validate current problem ────────────────────────────────────────────────
  const validateCurrent = async () => {
    const problem = currentVariant || floor;

    if (selectedLang === "javascript") {
      // Run in browser
      let passed = false;
      try { passed = problem.validate(code); } catch { passed = false; }

      const newTestResults = (problem.testCases || []).map((tc, i) => {
        try {
          const fnName = problem.functionName;
          if (!fnName) return { label: tc.label || `Test ${i + 1}`, pass: passed, result: null };
          const fn = new Function(`${code}; return ${fnName};`)();
          const input = Array.isArray(tc.input) ? tc.input : [tc.input];
          const got = fn(...input);
          const ok = JSON.stringify(got) === JSON.stringify(tc.expected);
          return { label: tc.label || `Test ${i + 1}`, pass: ok, result: got };
        } catch (e) {
          return { label: tc.label || `Test ${i + 1}`, pass: false, result: e.message };
        }
      });
      return { passed, testResults: newTestResults };
    }

    // Non-JS → Piston (via your local Docker proxy)
    addLog(`⏳ Running ${LANGUAGES[selectedLang].name} on Piston...`, "#555");
    const jr = await runWithPiston(code, selectedLang, problem.testCases || [], problem.functionName || "solution");

    if (jr.usedFallback) {
      addLog("⚠️ Piston unreachable — using logic check", "#f59e0b");
      setPistonError("Piston Docker not reachable. Make sure it's running on port 2000.");
      const passed = validatePseudoCode(code, floor.id, selectedLang);
      return { passed, testResults: [] };
    }

    if (jr.error && !jr.stdout) {
      return { passed: false, testResults: [], error: jr.error };
    }

    return { passed: jr.passed, testResults: jr.testResults || [], error: jr.error };
  };

  // ── Main Strike handler ─────────────────────────────────────────────────────
  const runCode = async () => {
    const emptyCheck = currentVariant
      ? getEmptyCodeForVariant(currentVariant, selectedLang).trim()
      : getEmptyCode(floor, selectedLang).trim();

    if (!code.trim() || code.trim() === emptyCheck) {
      addLog("✏️ Write your solution first!", "#f59e0b");
      return;
    }

    setResult("running");
    setTestResults([]);
    setPistonError(null);

    let validation;
    try {
      validation = await validateCurrent();
    } catch (err) {
      validation = { passed: false, testResults: [], error: err.message };
    }

    const { passed, testResults: newTests, error } = validation;
    setTestResults(newTests || []);
    if (error) setPistonError(error);

    if (passed) {
      // ✅ CORRECT
      setResult("pass");
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 500);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      if (attemptNumber === 0) {
        // 🎯 First try = INSTANT KILL
        setMonsterHp(0);
        addLog(`⚡ PERFECT! First try! Monster obliterated instantly!`, "#ffd700");
      } else {
        // Correct on follow-up = monster dies
        setMonsterHp(0);
        addLog(`✅ Correct on follow-up! Monster finally defeated!`, "#86efac");
      }
      setTimeout(() => setPhase("victory"), 1200);

    } else {
      // ❌ WRONG
      setResult("fail");

      const [dMin, dMax] = monsterData.isBoss ? DMG_BOSS : DMG_NORMAL;
      const dmg = randInt(dMin, dMax);
      const newHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newHp);
      addLog(`💥 Wrong! ${monsterData.name} deals ${dmg} damage! HP: ${newHp}/${PLAYER_MAX_HP}`, "#ff6666");

      if (newHp <= 0) {
        addLog("💀 HP depleted! Retry this floor.", "#ff4444");
        setTimeout(() => setPhase("defeat"), 1200);
        return;
      }

      // Load follow-up problem (max 2 follow-ups after original = 3 total)
      const nextAttempt = attemptNumber + 1;
      if (nextAttempt <= 2) {
        const nextVariant = getNextVariant(nextAttempt - 1);
        if (nextVariant) {
          setTimeout(() => {
            setAttemptNumber(nextAttempt);
            setCurrentVariant(nextVariant);
            setResult(null);
            setTestResults([]);
            addLog(`🔄 A similar problem appears — solve it to defeat the monster!`, "#f59e0b");
          }, 600);
        } else {
          // No follow-up defined for this floor, just let them retry same
          setTimeout(() => { setResult(null); setAttemptNumber(nextAttempt); }, 400);
          addLog(`🔄 Try again — same problem.`, "#f59e0b");
        }
      } else {
        // Past max follow-ups — keep going, just eat HP
        setTimeout(() => setResult(null), 400);
        addLog(`⚔️ Keep going! Solve it before your HP hits 0!`, "#f59e0b");
      }
    }
  };

  const accent = world.theme.primary;
  const isRunning = result === "running" || result === "judging";

  // ── DIALOGUE PHASE ──────────────────────────────────────────────────────────
  if (phase === "dialogue") {
    const isDone = dialogueLine >= monsterData.dialogue.length - 1;
    return (
      <div style={s.scene}>
        <Header onBack={onBack} world={world} />
        <Arena playerHp={playerHp} isAttacking={false} monsterHp={monsterHp} monsterData={monsterData} isShaking={false} accent={accent} />
        <div style={s.dlgBox}>
          <div style={{ color: "#ff4444", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
            {monsterData.emoji} {monsterData.name}
          </div>
          <div style={{ color: "#e8d5a3", lineHeight: "1.65", minHeight: "50px" }}>
            {monsterData.dialogue[dialogueLine]}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#333", fontSize: "0.75rem" }}>⚡ Tip: Correct on 1st try = instant kill!</span>
            <button style={s.dlgBtn} onClick={() => isDone ? setPhase("battle") : setDialogueLine(d => d + 1)}>
              {isDone ? "⚔️ FIGHT!" : "Continue ▶"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VICTORY ─────────────────────────────────────────────────────────────────
  if (phase === "victory") return (
    <div style={s.scene}>
      <div style={s.resultScreen}>
        <div style={{ fontSize: "4rem" }}>{attemptNumber === 0 ? "⚡" : "🎉"}</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: accent }}>
          {attemptNumber === 0
            ? "⚡ PERFECT KILL!"
            : monsterData.isBoss ? "🏆 BOSS CONQUERED!" : "⚔️ VICTORY!"}
        </div>
        {attemptNumber === 0 && (
          <div style={{ color: "#ffd700", fontSize: "0.9rem" }}>First attempt! No HP lost on this floor!</div>
        )}
        <div style={{ color: "#22c55e", fontSize: "0.85rem" }}>HP remaining: {playerHp}/{PLAYER_MAX_HP} 💚</div>
        <div style={s.rewardBox}>
          <div style={{ color: "#555", fontSize: "0.68rem", letterSpacing: "0.15em" }}>REWARD</div>
          <div style={{ color: "#ffd700", fontSize: "1rem", fontWeight: "bold", marginTop: "0.3rem" }}>🏆 {monsterData.reward}</div>
        </div>
        <button style={{ ...s.actionBtn, background: "#166534" }} onClick={onVictory}>Continue →</button>
      </div>
    </div>
  );

  // ── DEFEAT ─────────────────────────────────────────────────────────────────
  if (phase === "defeat") return (
    <div style={s.scene}>
      <div style={s.resultScreen}>
        <div style={{ fontSize: "4rem" }}>💀</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#ff4444" }}>HP DEPLETED</div>
        <div style={{ color: "#666", fontSize: "0.88rem", textAlign: "center" }}>
          {monsterData.name} drained all your HP.
        </div>
        <div style={s.defeatLore}>"Study the problems carefully and try again, warrior."</div>
        <div style={{ color: "#333", fontSize: "0.8rem" }}>HP resets to {PLAYER_MAX_HP} on retry</div>
        <button style={{ ...s.actionBtn, background: "#7f1d1d" }} onClick={onDefeat}>↺ Retry Floor</button>
      </div>
    </div>
  );

  // ── BATTLE PHASE ─────────────────────────────────────────────────────────────
  return (
    <div style={s.scene}>
      <Header onBack={onBack} world={world} />

      <Arena playerHp={playerHp} isAttacking={isAttacking} monsterHp={monsterHp} monsterData={monsterData} isShaking={isShaking} accent={accent} />

      {/* Battle Log */}
      <div style={s.log} ref={logRef}>
        {battleLog.length === 0
          ? <span style={{ color: "#1a1a2e", fontSize: "0.75rem" }}>⚡ Solve on 1st try = instant kill! Wrong = similar follow-up problem appears.</span>
          : battleLog.map(e => <div key={e.id} style={{ color: e.color, fontSize: "0.8rem", animation: "fadeUp 0.3s ease-out" }}>{e.msg}</div>)
        }
      </div>

      {/* Problem */}
      <ProblemPanel
        floor={floor}
        variant={currentVariant}
        attemptNumber={attemptNumber}
        accent={accent}
        isBoss={monsterData.isBoss}
        selectedLang={selectedLang}
      />

      {/* Language selector */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {Object.values(LANGUAGES).filter(lang => 
          !floor.languages || floor.languages.includes(lang.id)
        ).map(lang => (
          <button key={lang.id}
            style={{
              border: "1px solid",
              borderColor: selectedLang === lang.id ? lang.color : "#1a1a2a",
              color: selectedLang === lang.id ? lang.color : "#444",
              background: selectedLang === lang.id ? `${lang.color}18` : "transparent",
              padding: "0.2rem 0.55rem", borderRadius: "20px",
              fontSize: "0.72rem", cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace", transition: "all 0.15s",
            }}
            onClick={() => setSelectedLang(lang.id)}>
            {lang.emoji} {lang.name}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div style={{ border: "1px solid #0d0d18", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#050510", borderBottom: "1px solid #0d0d18" }}>
          <span style={{ color: LANGUAGES[selectedLang].color, fontSize: "0.8rem" }}>
            {LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}
            <span style={{ color: "#2a2a3a", marginLeft: "0.5rem", fontSize: "0.7rem" }}>— write your solution</span>
          </span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              style={{ background: "transparent", border: "1px solid #111", color: "#444", padding: "0.2rem 0.6rem", cursor: "pointer", borderRadius: "3px", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}
              onClick={() => {
                setCode(currentVariant ? getEmptyCodeForVariant(currentVariant, selectedLang) : getEmptyCode(floor, selectedLang));
                setResult(null); setTestResults([]);
              }}>
              ↺ Clear
            </button>
            <button
              style={{
                border: "none", color: "#fff", padding: "0.25rem 1.1rem",
                borderRadius: "3px", fontSize: "0.82rem",
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                cursor: isRunning ? "not-allowed" : "pointer",
                background: isRunning ? "#1a1a2a" : result === "pass" ? "#14532d" : result === "fail" ? "#7f1d1d" : "#1e3a5f",
                transition: "background 0.2s",
              }}
              onClick={runCode}
              disabled={isRunning}>
              {isRunning ? "⏳ Running..." : "▶ Strike!"}
            </button>
          </div>
        </div>
        <textarea
          style={{
            width: "100%", minHeight: "185px",
            background: "#020205", border: "none",
            padding: "0.85rem", fontSize: "0.87rem", lineHeight: "1.75",
            fontFamily: "'JetBrains Mono',monospace",
            resize: "vertical", outline: "none",
            color: LANGUAGES[selectedLang].monoColor,
          }}
          value={code}
          onChange={e => { setCode(e.target.value); setResult(null); setTestResults([]); }}
          placeholder={`Write your ${LANGUAGES[selectedLang].name} solution here...`}
          spellCheck={false}
          disabled={isRunning}
        />
      </div>

      {/* Piston error notice */}
      {pistonError && (
        <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid #78350f", borderRadius: "4px", padding: "0.4rem 0.7rem", color: "#f59e0b", fontSize: "0.78rem" }}>
          ⚠️ {pistonError}
        </div>
      )}

      <TestResults results={testResults} />

      {result === "pass" && (
        <div style={s.bannerGood}>
          ⚡ {attemptNumber === 0 ? "PERFECT! Monster instantly defeated!" : "Correct! Monster defeated!"}
        </div>
      )}
      {result === "fail" && playerHp > 0 && (
        <div style={s.bannerBad}>
          💥 Wrong! HP: {playerHp}/{PLAYER_MAX_HP}
          {attemptNumber < 2 && getNextVariant(attemptNumber) ? " — similar follow-up coming..." : " — keep trying!"}
        </div>
      )}
    </div>
  );
}

function Header({ onBack, world }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button style={{ background: "transparent", border: "1px solid #111", color: "#444", padding: "0.3rem 0.65rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "'JetBrains Mono',monospace" }} onClick={onBack}>
        ← Retreat
      </button>
      <span style={{ color: "#222", fontSize: "0.78rem" }}>{world.emoji} {world.name}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  scene:       { width: "100%", maxWidth: "780px", display: "flex", flexDirection: "column", gap: "0.75rem", paddingBottom: "2rem", animation: "fadeUp 0.4s ease-out" },
  log:         { background: "#030306", border: "1px solid #0a0a12", borderRadius: "5px", padding: "0.5rem 0.75rem", height: "75px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.15rem" },
  dlgBox:      { background: "#060610", border: "1px solid #1a0a00", borderRadius: "8px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  dlgBtn:      { background: "#7f1d1d", border: "none", color: "#fff", padding: "0.45rem 1.1rem", cursor: "pointer", borderRadius: "4px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem" },
  resultScreen:{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", padding: "3rem 2rem", textAlign: "center", animation: "fadeUp 0.5s ease-out", minHeight: "65vh", justifyContent: "center" },
  rewardBox:   { background: "rgba(255,215,0,0.05)", border: "1px solid #ffd70022", borderRadius: "6px", padding: "0.8rem 2rem", textAlign: "center" },
  defeatLore:  { color: "#555", fontStyle: "italic", fontSize: "0.85rem", maxWidth: "380px", lineHeight: "1.6", textAlign: "center" },
  actionBtn:   { border: "none", color: "#fff", padding: "0.8rem 2rem", borderRadius: "6px", fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" },
  bannerGood:  { background: "rgba(34,197,94,0.07)", border: "1px solid #14532d", borderRadius: "4px", padding: "0.55rem 0.75rem", color: "#86efac", fontWeight: "bold", fontSize: "0.85rem" },
  bannerBad:   { background: "rgba(239,68,68,0.07)", border: "1px solid #7f1d1d", borderRadius: "4px", padding: "0.55rem 0.75rem", color: "#fca5a5", fontWeight: "bold", fontSize: "0.85rem" },
};