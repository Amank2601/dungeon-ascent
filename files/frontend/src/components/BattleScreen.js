// src/components/BattleScreen.js
import { useState, useEffect, useRef } from "react";
import { LANGUAGES, runWithPiston, validatePseudoCode } from "../data/languages";

// Player always starts with 100 HP
// Each wrong answer → monster deals 10-20 damage
// HP hits 0 → defeat screen → retry same floor (HP resets to 100)
// Monster HP goes down only on correct answers

const PLAYER_MAX_HP = 100;

// ─── Empty starter templates per language (just the skeleton, NO solution) ────
const EMPTY_STARTERS = {
  javascript: (floor) => {
    if (!floor.functionName) return `// Write your code here\n`;
    return `function ${floor.functionName}(${getParamHint(floor)}) {\n  // write your solution here\n\n}`;
  },
  python: (floor) => {
    if (!floor.functionName) return `# Write your code here\n`;
    return `def ${toSnake(floor.functionName)}(${getParamHint(floor)}):\n    # write your solution here\n    pass\n`;
  },
  java: (floor) => {
    if (!floor.functionName) return `// Write your code here\n`;
    return `public Object ${floor.functionName}(${getParamHint(floor)}) {\n    // write your solution here\n\n}`;
  },
  cpp: (floor) => {
    if (!floor.functionName) return `// Write your code here\n`;
    return `auto ${floor.functionName}(${getParamHint(floor)}) {\n    // write your solution here\n\n}`;
  },
};

function getParamHint(floor) {
  if (!floor.testCases?.length) return "";
  const first = floor.testCases[0];
  if (Array.isArray(first.input)) return first.input.map((_,i)=>`param${i+1}`).join(", ");
  return "n";
}

function toSnake(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
function HPBar({ current, max, color = "#22c55e", label }) {
  const pct = Math.max(0, (current / max) * 100);
  const barColor = pct > 50 ? color : pct > 25 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.65rem", color: "#444" }}>{label}</span>
        <span style={{ fontSize: "0.65rem", color: barColor, fontWeight: "bold" }}>{current}/{max} HP</span>
      </div>
      <div style={{ height: "8px", background: "#0d0d14", borderRadius: "4px", overflow: "hidden", border: "1px solid #111" }}>
        <div style={{
          height: "100%", borderRadius: "4px",
          width: `${pct}%`,
          background: barColor,
          transition: "width 0.4s ease-out, background 0.3s",
          boxShadow: pct > 0 ? `0 0 8px ${barColor}66` : "none",
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
        <div style={{ position: "absolute", inset: "-16px", borderRadius: "50%", background: "rgba(255,68,0,0.15)", filter: "blur(14px)", animation: "pulse 2s infinite" }} />
      )}
      <div style={{ fontSize: "4rem", lineHeight: 1, zIndex: 1 }}>{monster.emoji}</div>
      <div style={{ position: "absolute", bottom: "-4px", width: "50px", height: "6px", background: "rgba(0,0,0,0.5)", borderRadius: "50%", filter: "blur(4px)" }} />
    </div>
  );
}

function PlayerSprite({ isAttacking, hp }) {
  const ratio = hp / PLAYER_MAX_HP;
  const face = ratio > 0.6 ? "🧙‍♂️" : ratio > 0.3 ? "🧟‍♂️" : "💀";
  return (
    <div style={{
      fontSize: "3.8rem", lineHeight: 1,
      animation: isAttacking ? "attackAnim 0.4s ease-in-out" : "floatAnim 3s ease-in-out infinite 1.5s",
      filter: ratio < 0.3 ? "drop-shadow(0 0 8px #ff4444)" : "none",
    }}>
      {face}
    </div>
  );
}

// ─── Test Results ─────────────────────────────────────────────────────────────
function TestResultsPanel({ testResults }) {
  if (!testResults?.length) return null;
  return (
    <div style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "5px", padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <div style={{ fontSize: "0.68rem", color: "#333", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>TEST RESULTS</div>
      {testResults.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: t.pass ? "#86efac" : "#fca5a5" }}>
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

// ─── MAIN BATTLE SCREEN ───────────────────────────────────────────────────────
export function BattleScreen({ world, floor, monster: monsterData, onVictory, onDefeat, onBack }) {
  const [phase, setPhase] = useState("dialogue");
  const [dialogueLine, setDialogueLine] = useState(0);
  const [monsterHp, setMonsterHp] = useState(monsterData.hp);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [attempts, setAttempts] = useState(0);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState(""); // always starts EMPTY
  const [result, setResult] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [pistonError, setPistonError] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const logRef = useRef(null);

  // Auto-scroll battle log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [battleLog]);

  // When language changes → reset to EMPTY skeleton (not solution)
  useEffect(() => {
    setCode(EMPTY_STARTERS[selectedLang]?.(floor) || "");
    setResult(null);
    setTestResults([]);
    setPistonError(null);
  }, [selectedLang, floor]);

  const addLog = (msg, color = "#888") =>
    setBattleLog(prev => [...prev.slice(-8), { msg, color, id: Date.now() + Math.random() }]);

  // ── Run Code ──────────────────────────────────────────────────────────────
  const runCode = async () => {
    if (!code.trim()) {
      addLog("✏️ Write your code first!", "#f59e0b");
      return;
    }

    setResult("running");
    setTestResults([]);
    setPistonError(null);
    setAttempts(a => a + 1);

    let passed = false;
    let newTestResults = [];

    try {
      if (selectedLang === "javascript") {
        // Run in browser directly
        passed = floor.validate(code);
        newTestResults = (floor.testCases || []).map((tc, i) => {
          try {
            const fn = new Function(`${code}; return ${floor.functionName || "solution"};`)();
            const input = Array.isArray(tc.input) ? tc.input : [tc.input];
            const got = fn(...input);
            const ok = JSON.stringify(got) === JSON.stringify(tc.expected);
            return { label: tc.label || `Test ${i + 1}`, pass: ok, result: got };
          } catch (e) {
            return { label: tc.label || `Test ${i + 1}`, pass: false, result: e.message };
          }
        });
      } else {
        // Send to Piston (free, no key)
        setResult("judging");
        addLog(`⏳ Running ${LANGUAGES[selectedLang].name} on Piston...`, "#888");
        const jr = await runWithPiston(code, selectedLang, floor.testCases || [], floor.functionName || "solution");

        if (jr.usedFallback) {
          addLog("⚠️ Piston unreachable — using logic check", "#f59e0b");
          setPistonError("Piston server unreachable. Using logic-based validation.");
          passed = validatePseudoCode(code, floor.id, selectedLang);
        } else if (jr.error && !jr.stdout) {
          addLog(`❌ Error: ${jr.error.slice(0, 80)}`, "#f87171");
          setPistonError(jr.error);
          passed = false;
        } else {
          passed = jr.passed;
          newTestResults = jr.testResults || [];
        }
      }
    } catch (err) {
      passed = false;
      setPistonError(err.message);
    }

    setTestResults(newTestResults);

    if (passed) {
      // ✅ Player attacks monster
      setResult("pass");
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 500);

      const dmg = monsterData.isBoss
        ? Math.floor(Math.random() * 3) + 3  // boss: 3-5 dmg
        : Math.floor(Math.random() * 2) + 2; // normal: 2-3 dmg

      const newMonHp = Math.max(0, monsterHp - dmg);
      setMonsterHp(newMonHp);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      addLog(`⚔️ Correct! You deal ${dmg} damage to ${monsterData.name}!`, "#86efac");

      if (newMonHp <= 0) {
        addLog(`💀 ${monsterData.name} has been defeated!`, "#ffd700");
        setTimeout(() => setPhase("victory"), 1000);
      }
    } else {
      // ❌ Monster attacks player
      setResult("fail");

      const dmg = monsterData.isBoss
        ? Math.floor(Math.random() * 15) + 15  // boss: 15-30 dmg
        : Math.floor(Math.random() * 10) + 10; // normal: 10-20 dmg

      const newHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newHp);
      addLog(`💥 Wrong! ${monsterData.name} deals ${dmg} damage! HP: ${newHp}/${PLAYER_MAX_HP}`, "#ff6666");

      if (newHp <= 0) {
        addLog("💀 Your HP reached 0! You must retry this floor.", "#ff4444");
        setTimeout(() => setPhase("defeat"), 1200);
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
        <ArenaDisplay playerHp={playerHp} isAttacking={false} monsterHp={monsterHp} monsterData={monsterData} isShaking={false} accent={accent} />
        <div style={s.dlgBox}>
          <div style={{ color: "#ff4444", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
            {monsterData.emoji} {monsterData.name}
          </div>
          <div style={{ color: "#e8d5a3", lineHeight: "1.65", fontSize: "0.9rem", minHeight: "50px" }}>
            {monsterData.dialogue[dialogueLine]}
          </div>
          <button style={s.dlgBtn} onClick={() => isDone ? setPhase("battle") : setDialogueLine(d => d + 1)}>
            {isDone ? "⚔️ FIGHT!" : "Continue ▶"}
          </button>
        </div>
      </div>
    );
  }

  // ── VICTORY ─────────────────────────────────────────────────────────────────
  if (phase === "victory") return (
    <div style={s.scene}>
      <div style={s.resultScreen}>
        <div style={{ fontSize: "4rem" }}>🎉</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: accent }}>
          {monsterData.isBoss ? "🏆 MASTERY FORGE CONQUERED!" : "⚔️ VICTORY!"}
        </div>
        <div style={{ color: "#666", fontSize: "0.88rem" }}>
          {monsterData.name} defeated in {attempts} attempt{attempts !== 1 ? "s" : ""}!
        </div>
        <div style={{ color: "#22c55e", fontSize: "0.85rem" }}>
          HP remaining: {playerHp}/{PLAYER_MAX_HP} 💚
        </div>
        <div style={s.rewardBox}>
          <div style={{ color: "#555", fontSize: "0.68rem", letterSpacing: "0.15em" }}>REWARD OBTAINED</div>
          <div style={{ color: "#ffd700", fontSize: "1rem", fontWeight: "bold", marginTop: "0.3rem" }}>🏆 {monsterData.reward}</div>
        </div>
        <button style={{ ...s.actionBtn, background: "#166534" }} onClick={onVictory}>Continue →</button>
      </div>
    </div>
  );

  // ── DEFEAT (HP = 0) ──────────────────────────────────────────────────────────
  if (phase === "defeat") return (
    <div style={s.scene}>
      <div style={s.resultScreen}>
        <div style={{ fontSize: "4rem" }}>💀</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#ff4444" }}>
          HP DEPLETED
        </div>
        <div style={{ color: "#666", fontSize: "0.88rem", textAlign: "center" }}>
          {monsterData.name} drained all your HP after {attempts} attempt{attempts !== 1 ? "s" : ""}.
        </div>
        <div style={s.defeatLore}>
          "Your HP hit zero. Study the challenge carefully, restore your strength, and try again."
        </div>
        <div style={{ color: "#333", fontSize: "0.8rem" }}>HP will reset to {PLAYER_MAX_HP} on retry</div>
        <button style={{ ...s.actionBtn, background: "#7f1d1d" }} onClick={onDefeat}>
          ↺ Retry Floor (HP restored)
        </button>
      </div>
    </div>
  );

  // ── BATTLE PHASE ─────────────────────────────────────────────────────────────
  return (
    <div style={s.scene}>
      <Header onBack={onBack} world={world} />

      {/* Arena */}
      <ArenaDisplay
        playerHp={playerHp} isAttacking={isAttacking}
        monsterHp={monsterHp} monsterData={monsterData}
        isShaking={isShaking} accent={accent}
      />

      {/* Battle Log */}
      <div style={s.log} ref={logRef}>
        {battleLog.length === 0
          ? <span style={{ color: "#1a1a2e", fontSize: "0.75rem" }}>Battle log appears here...</span>
          : battleLog.map(e => (
            <div key={e.id} style={{ color: e.color, fontSize: "0.8rem", animation: "fadeUp 0.3s ease-out" }}>
              {e.msg}
            </div>
          ))
        }
      </div>

      {/* Challenge Panel */}
      <div style={{ ...s.challengePanel, borderColor: monsterData.isBoss ? "#ffd700" : accent }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: monsterData.isBoss ? "#ffd700" : accent }}>
            {monsterData.isBoss ? "🔥 " : "⚡ "}{floor.title}
          </div>
          {/* Language selector */}
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            {Object.values(LANGUAGES).map(lang => (
              <button key={lang.id}
                style={{
                  border: "1px solid",
                  borderColor: selectedLang === lang.id ? lang.color : "#1a1a2a",
                  color: selectedLang === lang.id ? lang.color : "#444",
                  background: selectedLang === lang.id ? `${lang.color}18` : "transparent",
                  padding: "0.18rem 0.5rem", borderRadius: "20px",
                  fontSize: "0.7rem", cursor: "pointer",
                  fontFamily: "'JetBrains Mono',monospace",
                  transition: "all 0.15s",
                }}
                onClick={() => setSelectedLang(lang.id)}>
                {lang.emoji} {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "3px", padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
          <span style={{ color: LANGUAGES[selectedLang].color }}>{LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}:</span>
          <span style={{ color: "#444", marginLeft: "0.4rem" }}>{LANGUAGES[selectedLang].note}</span>
        </div>

        {monsterData.isBoss && (
          <div style={{ background: "rgba(255,68,0,0.06)", border: "1px solid #2a0a00", borderRadius: "4px", padding: "0.4rem 0.6rem", color: "#ff6633", fontSize: "0.8rem" }}>
            🔥 MASTERY FORGE — Use everything you've learned!
          </div>
        )}

        <div style={{ color: "#ccc", fontSize: "0.87rem", lineHeight: "1.7", whiteSpace: "pre-line" }}>
          {floor.challenge || floor.description}
        </div>

        {floor.hint && (
          <details style={{ background: "#030308", border: "1px solid #0d0d14", borderRadius: "4px", padding: "0.5rem 0.65rem" }}>
            <summary style={{ cursor: "pointer", color: "#444", fontSize: "0.8rem", userSelect: "none" }}>
              💡 Show Hint (no HP penalty)
            </summary>
            <div style={{ marginTop: "0.4rem", color: "#666", fontSize: "0.82rem", lineHeight: "1.5" }}>
              {floor.hint}
            </div>
          </details>
        )}

        {(floor.testDisplay || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <div style={{ fontSize: "0.65rem", color: "#333", letterSpacing: "0.1em" }}>EXPECTED OUTPUT</div>
            {floor.testDisplay.slice(0, 4).map((t, i) => (
              <div key={i} style={{ fontSize: "0.77rem", color: "#2a2a3a", fontFamily: "'JetBrains Mono',monospace" }}>→ {t}</div>
            ))}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div style={{ border: "1px solid #0d0d18", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#050510", borderBottom: "1px solid #0d0d18" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: LANGUAGES[selectedLang].color, fontSize: "0.8rem" }}>
              {LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}
            </span>
            <span style={{ color: "#1a1a2e", fontSize: "0.7rem" }}>— write your solution below</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              style={{ background: "transparent", border: "1px solid #111", color: "#444", padding: "0.2rem 0.6rem", cursor: "pointer", borderRadius: "3px", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}
              title="Clear editor"
              onClick={() => { setCode(EMPTY_STARTERS[selectedLang]?.(floor) || ""); setResult(null); setTestResults([]); }}>
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
              {result === "running" ? "⏳ Running..." : result === "judging" ? "⏳ Piston..." : "▶ Strike!"}
            </button>
          </div>
        </div>
        <textarea
          style={{
            width: "100%", minHeight: "180px",
            background: "#020205", border: "none",
            padding: "0.85rem", fontSize: "0.87rem",
            lineHeight: "1.75",
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

      {/* Piston error */}
      {pistonError && (
        <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid #78350f", borderRadius: "4px", padding: "0.4rem 0.7rem", color: "#f59e0b", fontSize: "0.78rem" }}>
          ⚠️ {pistonError}
        </div>
      )}

      {/* Test results */}
      <TestResultsPanel testResults={testResults} />

      {/* Result banners */}
      {result === "pass" && monsterHp > 0 && (
        <div style={s.bannerGood}>
          ⚔️ Direct hit! Monster HP: {monsterHp}/{monsterData.maxHp} — Keep going!
        </div>
      )}
      {result === "fail" && playerHp > 0 && (
        <div style={s.bannerBad}>
          💥 Wrong answer! Monster strikes back! Your HP: {playerHp}/{PLAYER_MAX_HP}
        </div>
      )}
    </div>
  );
}

// ─── Arena display ────────────────────────────────────────────────────────────
function ArenaDisplay({ playerHp, isAttacking, monsterHp, monsterData, isShaking, accent }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", gap: "1rem",
      background: "linear-gradient(180deg,#080512 0%,#040208 100%)",
      border: "1px solid #0d0d14", borderRadius: "8px",
      padding: "1.2rem 1.5rem",
    }}>
      {/* Player side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#333" }}>YOU</div>
        <PlayerSprite isAttacking={isAttacking} hp={playerHp} />
        <HPBar current={playerHp} max={PLAYER_MAX_HP} color="#22c55e" label="Player HP" />
        {playerHp <= 30 && (
          <div style={{ color: "#ef4444", fontSize: "0.68rem", animation: "pulse 1s infinite" }}>⚠️ LOW HP!</div>
        )}
      </div>

      <div style={{ color: "#111", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>VS</div>

      {/* Monster side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: accent }}>{monsterData.name}</div>
        <MonsterSprite monster={monsterData} isShaking={isShaking} isDefeated={monsterHp <= 0} />
        <HPBar current={monsterHp} max={monsterData.maxHp} color={accent} label="Monster HP" />
      </div>
    </div>
  );
}

function Header({ onBack, world }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button style={{ background: "transparent", border: "1px solid #111", color: "#444", padding: "0.3rem 0.65rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "'JetBrains Mono',monospace" }}
        onClick={onBack}>← Retreat</button>
      <span style={{ color: "#222", fontSize: "0.78rem" }}>{world.emoji} {world.name}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  scene: { width: "100%", maxWidth: "780px", display: "flex", flexDirection: "column", gap: "0.75rem", paddingBottom: "2rem", animation: "fadeUp 0.4s ease-out" },
  log: { background: "#030306", border: "1px solid #0a0a12", borderRadius: "5px", padding: "0.5rem 0.75rem", height: "75px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.15rem" },
  challengePanel: { border: "1px solid", borderRadius: "6px", padding: "1rem", background: "#060610", display: "flex", flexDirection: "column", gap: "0.65rem" },
  dlgBox: { background: "#060610", border: "1px solid #1a0a00", borderRadius: "8px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  dlgBtn: { alignSelf: "flex-end", background: "#7f1d1d", border: "none", color: "#fff", padding: "0.45rem 1.1rem", cursor: "pointer", borderRadius: "4px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem" },
  resultScreen: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", padding: "3rem 2rem", textAlign: "center", animation: "fadeUp 0.5s ease-out", minHeight: "65vh", justifyContent: "center" },
  rewardBox: { background: "rgba(255,215,0,0.05)", border: "1px solid #ffd70022", borderRadius: "6px", padding: "0.8rem 2rem", textAlign: "center" },
  defeatLore: { color: "#555", fontStyle: "italic", fontSize: "0.85rem", maxWidth: "380px", lineHeight: "1.6", textAlign: "center" },
  actionBtn: { border: "none", color: "#fff", padding: "0.8rem 2rem", borderRadius: "6px", fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" },
  bannerGood: { background: "rgba(34,197,94,0.07)", border: "1px solid #14532d", borderRadius: "4px", padding: "0.55rem 0.75rem", color: "#86efac", fontWeight: "bold", fontSize: "0.85rem" },
  bannerBad: { background: "rgba(239,68,68,0.07)", border: "1px solid #7f1d1d", borderRadius: "4px", padding: "0.55rem 0.75rem", color: "#fca5a5", fontWeight: "bold", fontSize: "0.85rem" },
};