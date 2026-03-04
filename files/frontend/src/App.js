// src/App.js
import { useState, useEffect } from "react";
import { AuthProvider, useAuth, apiFetch } from "./context/AuthContext";
import { AuthGate } from "./components/AuthScreens";
import { StoryIntro } from './components/StoryIntro';
import { BattleScreen } from "./components/BattleScreen";
import { Leaderboard } from "./components/Leaderboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { WORLDS } from "./data/worlds";
import { MONSTERS, BETRAYER_REVEALS } from "./data/story";
import { getLevel } from "./data/levels";
import { playSound } from "./data/sounds";

// Inject global styles + fonts
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { background: #050508; height: 100%; font-family: 'JetBrains Mono', monospace; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #222; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
      @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
      @keyframes pulse { 0%,100%{opacity:0.6}50%{opacity:1} }
      @keyframes shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
      @keyframes monsterFloat {
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(-8px)}
      }
      @keyframes playerAttack {
        0%{transform:translateX(0)}
        30%{transform:translateX(20px)}
        60%{transform:translateX(-5px)}
        100%{transform:translateX(0)}
      }
      @keyframes fadeOut {
        from{opacity:1;transform:scale(1)}
        to{opacity:0;transform:scale(0.5)}
      }
      @keyframes glowPulse {
        0%,100%{text-shadow:0 0 20px rgba(255,215,0,0.4)}
        50%{text-shadow:0 0 50px rgba(255,215,0,0.8),0 0 80px rgba(255,100,0,0.4)}
      }
      input:focus { border-color: #ffd700 !important; }
      button:hover { opacity: 0.85; }
      textarea { tab-size: 2; }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── PROGRESS HELPERS ─────────────────────────────────────────────────────────
const initProgress = () => ({ worlds: {}, totalXP: 0, introDone: false });

const markFloor = (p, wid, fid) => {
  const worlds = p.worlds || {};
  const w = { ...(worlds[wid] || { completedFloors: [], bossDefeated: false }) };
  if (!w.completedFloors.includes(fid)) w.completedFloors = [...w.completedFloors, fid];
  return { ...p, worlds: { ...worlds, [wid]: w }, totalXP: (p.totalXP || 0) + 100 };
};

const markBoss = (p, wid) => {
  const worlds = p.worlds || {};
  const w = { ...(worlds[wid] || { completedFloors: [], bossDefeated: false }), bossDefeated: true };
  return { ...p, worlds: { ...worlds, [wid]: w }, totalXP: (p.totalXP || 0) + 500 };
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ progress, onMap, onLeaderboard, onDaily, user, onLogout }) {
  const { logout } = useAuth();
  const lvl = getLevel(progress.totalXP || 0);
  return (
    <div style={ui.topBar}>
      <div style={ui.topLogo} onClick={onMap}>⚔️ DUNGEON ASCENT</div>
      <div style={ui.topCenter}>
        {/* XP + Level badge */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <span style={ui.xp}>✨ {(progress.totalXP||0).toLocaleString()} XP</span>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"1px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <span style={{ fontSize:"0.85rem" }}>{lvl.badge}</span>
              <span style={{ color: lvl.color, fontSize:"0.72rem", fontWeight:"bold", letterSpacing:"0.05em" }}>
                Lv.{lvl.level} {lvl.title}
              </span>
            </div>
            {lvl.next && (
              <div style={{ width:90, height:2, background:"#111", borderRadius:1, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${lvl.pct}%`, background: lvl.color, transition:"width 0.5s" }} />
              </div>
            )}
          </div>
        </div>
        {/* Nav buttons */}
        <button onClick={()=>{playSound("click");onDaily();}} style={ui.navBtn}>📅 Daily</button>
        <button onClick={()=>{playSound("click");onLeaderboard();}} style={ui.navBtn}>🏆 Board</button>
      </div>
      <div style={ui.topRight}>
        <span style={ui.username}>🧙 {user?.username}</span>
        <button style={ui.logoutBtn} onClick={() => { onLogout(); logout(); }}>Logout</button>
      </div>
    </div>
  );
}

// ─── WORLD MAP ────────────────────────────────────────────────────────────────
function WorldMap({ progress, onSelectWorld, selectedLanguage, onLanguageChange }) {
  const LANG_OPTIONS = [
    { id: "javascript", name: "JavaScript", emoji: "🟨", color: "#f7df1e" },
    { id: "python",     name: "Python",     emoji: "🐍", color: "#3776ab" },
    { id: "java",       name: "Java",       emoji: "☕", color: "#ed8b00" },
    { id: "cpp",        name: "C++",        emoji: "⚡", color: "#00599c" },
  ];
  return (
    <div style={ui.page}>
      <div style={ui.mapTitle}>⚔️ WORLD MAP</div>
      <div style={ui.mapSub}>
        Betrayed at the top. Stranded at the bottom. Climb back — one world at a time.
      </div>
      {/* Language selector */}
      <div style={{ display:"flex", gap:"0.5rem", justifyContent:"center", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <span style={{ color:"#444", fontSize:"0.78rem", alignSelf:"center", marginRight:"0.25rem" }}>Your language:</span>
        {LANG_OPTIONS.map(lang => (
          <button key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            style={{
              border: "1px solid",
              borderColor: selectedLanguage === lang.id ? lang.color : "#1a1a2a",
              color: selectedLanguage === lang.id ? lang.color : "#444",
              background: selectedLanguage === lang.id ? `${lang.color}18` : "transparent",
              padding: "0.35rem 0.85rem", borderRadius: "20px",
              fontSize: "0.82rem", cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace", transition: "all 0.2s",
              fontWeight: selectedLanguage === lang.id ? "bold" : "normal",
            }}>
            {lang.emoji} {lang.name}
          </button>
        ))}
      </div>
      <div style={ui.worldGrid}>
        {WORLDS.map((world, wi) => {
          const wp = progress.worlds?.[world.id] || {};
          const completed = wp.completedFloors?.length || 0;
          const visibleFloors = world.floors.filter(f => !f.languages || f.languages.includes(selectedLanguage));
          const total = visibleFloors.length;
          const pct = Math.round((completed / total) * 100);
          const bossDefeated = wp.bossDefeated || false;
          const locked = wi > 0 && !progress.worlds?.[WORLDS[wi - 1].id]?.bossDefeated;

          return (
            <div
              key={world.id}
              onClick={() => !locked && onSelectWorld(world)}
              style={{
                ...ui.worldCard,
                borderColor: bossDefeated ? world.theme.primary : locked ? "#1a1a1a" : "#2a2a3a",
                opacity: locked ? 0.4 : 1,
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              {locked && <div style={ui.lockTag}>🔒 Defeat previous boss</div>}
              {bossDefeated && <div style={{ ...ui.lockTag, background: "#052e16", color: "#86efac", borderColor: "#166534" }}>✅ MASTERED</div>}
              <div style={{ fontSize: "2.2rem" }}>{world.emoji}</div>
              <div style={ui.worldNum}>WORLD {world.number}</div>
              <div style={{ ...ui.worldName, color: world.theme.primary }}>{world.name}</div>
              <div style={ui.worldSub}>{world.subtitle}</div>
              <div style={ui.worldDesc}>{world.description}</div>
              <div style={ui.pBar}><div style={{ ...ui.pFill, width: `${pct}%`, background: world.theme.primary }} /></div>
              <div style={ui.pLabel}>{completed}/{total} floors {bossDefeated ? "• 🔥 Boss Defeated" : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FLOOR MAP ────────────────────────────────────────────────────────────────
function FloorMap({ world, progress, onSelectFloor, onBack, selectedLanguage = "javascript" }) {
  const wp = progress.worlds?.[world.id] || {};
  const done = wp.completedFloors || [];
  const bossDefeated = wp.bossDefeated || false;
  const visibleFloors = world.floors.filter(f => !f.languages || f.languages.includes(selectedLanguage));
  const allDone = visibleFloors.every(f => done.includes(f.id));
  const monsterList = MONSTERS[world.id] || [];
  const bossMonster = MONSTERS[`${world.id}boss`];

  return (
    <div style={ui.page}>
      <button style={ui.backBtn} onClick={onBack}>← World Map</button>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "2.5rem" }}>{world.emoji}</div>
        <div style={{ ...ui.worldName, color: world.theme.primary, fontSize: "1.6rem" }}>
          World {world.number}: {world.name}
        </div>
        <div style={ui.worldSub}>{world.subtitle}</div>
      </div>

      {/* Betrayer reveal */}
      {BETRAYER_REVEALS[world.id] && (
        <div style={ui.betrayerCard}>
          <span style={{ fontSize: "1.5rem" }}>{BETRAYER_REVEALS[world.id].emoji}</span>
          <div>
            <div style={{ color: "#ff4444", fontSize: "0.8rem", fontWeight: "bold" }}>
              BETRAYER INTEL: {BETRAYER_REVEALS[world.id].name}
            </div>
            <div style={{ color: "#666", fontSize: "0.78rem", lineHeight: "1.5" }}>
              {BETRAYER_REVEALS[world.id].message}
            </div>
          </div>
        </div>
      )}

      <div style={ui.floorList}>
        {visibleFloors.map((floor, fi) => {
          const floorDone = done.includes(floor.id);
          const prevDone = fi === 0 || done.includes(visibleFloors[fi - 1].id);
          const locked = !prevDone;
          const monster = monsterList[fi] || monsterList[monsterList.length - 1];

          return (
            <div
              key={floor.id}
              onClick={() => !locked && onSelectFloor(floor, monster)}
              style={{
                ...ui.floorRow,
                borderColor: floorDone ? world.theme.primary : locked ? "#111" : "#2a2a3a",
                opacity: locked ? 0.35 : 1,
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              <div style={{ ...ui.floorIcon, color: floorDone ? world.theme.primary : locked ? "#333" : "#555" }}>
                {floorDone ? "✅" : locked ? "🔒" : monster?.emoji || "👾"}
              </div>
              <div style={ui.floorInfo}>
                <div style={{ ...ui.floorTitle, color: floorDone ? world.theme.primary : "#e8d5a3" }}>
                  {fi + 1}. {floor.title}
                </div>
                {!locked && !floorDone && monster && (
                  <div style={ui.floorMonster}>
                    Boss: {monster.name} • {monster.hp} HP
                  </div>
                )}
                {floorDone && <div style={{ color: "#22c55e", fontSize: "0.72rem" }}>Floor Cleared!</div>}
              </div>
              {!locked && !floorDone && <div style={{ color: "#ff4444", fontSize: "0.9rem" }}>⚔️</div>}
            </div>
          );
        })}

        {/* Boss floor */}
        {bossMonster && (
          <div
            onClick={() => (allDone || bossDefeated) && onSelectFloor(world.boss, bossMonster, true)}
            style={{
              ...ui.floorRow,
              borderColor: bossDefeated ? "#ffd700" : allDone ? "#ff4444" : "#111",
              background: bossDefeated ? "#1a1200" : allDone ? "#1a0000" : "#0a0a0a",
              opacity: allDone || bossDefeated ? 1 : 0.3,
              cursor: allDone || bossDefeated ? "pointer" : "not-allowed",
            }}
          >
            <div style={{ fontSize: "1.8rem" }}>{bossMonster.emoji}</div>
            <div style={ui.floorInfo}>
              <div style={{ ...ui.floorTitle, color: bossDefeated ? "#ffd700" : allDone ? "#ff4444" : "#333" }}>
                🔥 {world.boss.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: bossDefeated ? "#22c55e" : allDone ? "#ff6666" : "#333" }}>
                {bossDefeated
                  ? "✅ Mastery Achieved!"
                  : allDone
                  ? `${bossMonster.name} — ${bossMonster.hp} HP — ENTER THE FORGE`
                  : "Complete all floors to unlock"}
              </div>
            </div>
            {allDone && !bossDefeated && <div style={{ color: "#ff4444", fontSize: "0.9rem" }}>⚔️</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BETRAYER CONFRONTATION ───────────────────────────────────────────────────
function BetrayerRevealScene({ worldId, onContinue }) {
  const betrayer = BETRAYER_REVEALS[worldId];
  return (
    <div style={ui.betrayerScene}>
      <div style={{ fontSize: "5rem", animation: "glowPulse 2s ease-in-out infinite" }}>{betrayer?.emoji}</div>
      <div style={{ color: "#ff4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem" }}>
        BETRAYER DEFEATED
      </div>
      <div style={{ color: "#ffd700", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{betrayer?.name}</div>
      <div style={{ color: "#888", fontSize: "0.9rem", maxWidth: "450px", lineHeight: "1.7", textAlign: "center" }}>
        {betrayer?.message}
      </div>
      <div style={{ color: "#555", fontSize: "0.8rem" }}>The next world awakens...</div>
      <button style={{ ...ui.actionBtn, marginTop: "1rem" }} onClick={onContinue}>
        Continue →
      </button>
    </div>
  );
}

// ─── FINAL VICTORY ────────────────────────────────────────────────────────────
function FinalVictory({ user, progress, onRestart }) {
  return (
    <div style={ui.victoryScene}>
      <div style={{ fontSize: "5rem" }}>🏆</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "#ffd700", animation: "glowPulse 2s infinite", textAlign: "center" }}>
        THE DUNGEON IS CONQUERED
      </div>
      <div style={{ color: "#888", lineHeight: "1.8", fontSize: "0.95rem", textAlign: "center", maxWidth: "500px" }}>
        {user?.username}, you've defeated 6 worlds, mastered every algorithm,<br />
        and destroyed VOID — the Architect of your Betrayal.<br />
        The Forbidden Algorithm is yours once more.
      </div>
      <div style={{ color: "#ffd700", fontSize: "1.1rem" }}>Total XP: {progress.totalXP}</div>
      <div style={{ display: "flex", gap: "4rem", margin: "1rem 0" }}>
        {WORLDS.map(w => (
          <div key={w.id} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem" }}>{w.emoji}</div>
            <div style={{ color: w.theme.primary, fontSize: "0.7rem" }}>✅</div>
          </div>
        ))}
      </div>
      <button style={{ ...ui.actionBtn }} onClick={onRestart}>Play Again</button>
    </div>
  );
}

// ─── MAIN GAME LOGIC ──────────────────────────────────────────────────────────
function Game() {
  const { user } = useAuth();
  const [scene, setScene] = useState("intro");
  const [progress, setProgress] = useState(initProgress);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [isBossFight, setIsBossFight] = useState(false);
  const [showBetrayerReveal, setShowBetrayerReveal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("dungeon_language") || "javascript";
  });
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const updated = { ...progress, selectedLanguage: lang };
    saveProgress(updated);
  };

  const [progressLoading, setProgressLoading] = useState(true);

  // Load progress from MongoDB on mount
  useEffect(() => {
    if (!user) return;
    setProgressLoading(true);
    apiFetch("/progress")
      .then((data) => {
        const p = data.progress || initProgress();
        if (!p.worlds) p.worlds = {};
        setProgress(p);
        if (p.introDone) setScene("worldmap");
        if (p.selectedLanguage) setSelectedLanguage(p.selectedLanguage);
      })
      .catch((err) => {
        console.warn("Could not load progress from server:", err.message);
        try {
          const saved = localStorage.getItem(`dungeon_progress_${user.id}`);
          if (saved) {
            const p = JSON.parse(saved);
            setProgress(p);
            if (p.introDone) setScene("worldmap");
          }
        } catch {}
      })
      .finally(() => setProgressLoading(false));
  }, [user]);

  // Save progress to MongoDB
  const saveProgress = (p) => {
    setProgress(p);
    try {
      localStorage.setItem(`dungeon_progress_${user.id}`, JSON.stringify(p));
    } catch {}
    apiFetch("/progress", {
      method: "POST",
      body: JSON.stringify({ progress: p }),
    }).catch((err) => console.warn("Progress save failed:", err.message));
  };

  const handleIntroDone = () => {
    const p = { ...progress, introDone: true };
    saveProgress(p);
    setScene("worldmap");
  };

  const handleSelectFloor = (floor, monster, isBoss = false) => {
    setSelectedFloor(floor);
    setSelectedMonster(monster);
    setIsBossFight(isBoss);
    setScene("battle");
  };

  const handleBattleVictory = () => {
    const isBoss = isBossFight;
    let p;
    if (isBoss) {
      p = markBoss(progress, selectedWorld.id);
    } else {
      p = markFloor(progress, selectedWorld.id, selectedFloor.id);
    }
    saveProgress(p);

    if (isBoss) {
      setProgress(p);
      setShowBetrayerReveal(true);
      setScene("betrayer");
    } else {
      setScene("floormap");
    }
  };

  const handleBattleDefeat = () => {
    setScene("battle");
  };

  const handleBetrayerContinue = () => {
    setShowBetrayerReveal(false);
    const allDone = WORLDS.every(w => progress.worlds?.[w.id]?.bossDefeated);
    if (allDone) {
      setScene("victory");
    } else {
      setScene("worldmap");
    }
  };

  // ── Logout handler: reset scene before logging out ──
  const handleLogout = () => {
    setScene("intro");
    setProgress(initProgress());
    setSelectedWorld(null);
    setSelectedFloor(null);
    setSelectedMonster(null);
  };

  return (
    <div style={ui.root}>
      <GlobalStyles />

      {scene !== "intro" && (
        <TopBar
          progress={progress}
          onMap={() => setScene("worldmap")}
          onLeaderboard={() => setScene("leaderboard")}
          onDaily={() => setScene("daily")}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <div style={ui.content}>
        {progressLoading && (
          <div style={{ color:"#444", fontSize:"0.9rem", marginTop:"5rem", textAlign:"center", animation:"fadeUp 0.4s" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem", animation:"pulse 1.5s infinite" }}>⚔️</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#ffd700", fontSize:"1.1rem" }}>DUNGEON ASCENT</div>
            <div style={{ color:"#333", marginTop:"0.5rem" }}>Loading your adventure...</div>
          </div>
        )}

        {!progressLoading && scene === "intro" && (
          <StoryIntro onComplete={handleIntroDone} alreadySeen={progress.introDone} />
        )}

        {!progressLoading && scene === "worldmap" && (
          <WorldMap
            progress={progress}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onSelectWorld={w => { setSelectedWorld(w); setScene("floormap"); }}
          />
        )}

        {!progressLoading && scene === "floormap" && selectedWorld && (
          <FloorMap
            world={selectedWorld}
            progress={progress}
            selectedLanguage={selectedLanguage}
            onSelectFloor={handleSelectFloor}
            onBack={() => setScene("worldmap")}
          />
        )}

        {!progressLoading && scene === "battle" && selectedFloor && selectedMonster && (
          <BattleScreen
            key={`${selectedFloor.id}-${Date.now()}`}
            world={selectedWorld}
            floor={selectedFloor}
            monster={selectedMonster}
            initialLang={selectedLanguage}
            onVictory={handleBattleVictory}
            onDefeat={handleBattleDefeat}
            onBack={() => setScene("floormap")}
          />
        )}

        {!progressLoading && scene === "betrayer" && selectedWorld && (
          <BetrayerRevealScene
            worldId={selectedWorld.id}
            onContinue={handleBetrayerContinue}
          />
        )}

        {!progressLoading && scene === "victory" && (
          <FinalVictory
            user={user}
            progress={progress}
            onRestart={() => {
              apiFetch("/progress", { method: "DELETE" }).catch(() => {});
              const fresh = initProgress();
              saveProgress(fresh);
              setScene("intro");
            }}
          />
        )}

        {!progressLoading && scene === "leaderboard" && (
          <Leaderboard onBack={() => setScene("worldmap")} />
        )}

        {!progressLoading && scene === "daily" && (
          <DailyChallenge
            onBack={() => setScene("worldmap")}
            onXPGained={(xp) => {
              const updated = { ...progress, totalXP: (progress.totalXP || 0) + xp };
              saveProgress(updated);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <Game />
      </AuthGate>
    </AuthProvider>
  );
}

// ─── UI STYLES ────────────────────────────────────────────────────────────────
const ui = {
  root: {
    minHeight: "100vh",
    background: "#050508",
    color: "#e8d5a3",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1.25rem",
    background: "rgba(5,5,8,0.95)",
    borderBottom: "1px solid #111",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  topLogo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    color: "#ffd700",
    fontSize: "0.95rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    textShadow: "0 0 15px rgba(255,215,0,0.3)",
  },
  topCenter: { display: "flex", gap: "1rem" },
  xp: {
    background: "rgba(255,215,0,0.08)",
    border: "1px solid #ffd70022",
    color: "#ffd700",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.78rem",
  },
  topRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  username: { color: "#666", fontSize: "0.8rem" },
  navBtn: {
    background: "transparent",
    border: "1px solid #1a1a2a",
    color: "#666",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontFamily: "'JetBrains Mono', monospace",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #2a2a3a",
    color: "#555",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontFamily: "'JetBrains Mono', monospace",
  },
  page: {
    width: "100%",
    maxWidth: "860px",
    padding: "1rem 0 2rem",
    animation: "fadeUp 0.4s ease-out",
  },
  mapTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.6rem",
    color: "#ffd700",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  mapSub: {
    color: "#444",
    textAlign: "center",
    fontSize: "0.82rem",
    lineHeight: "1.5",
    marginBottom: "2rem",
    fontStyle: "italic",
  },
  worldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
  },
  worldCard: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    position: "relative",
    background: "#080810",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  lockTag: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    background: "#111",
    border: "1px solid #222",
    padding: "0.15rem 0.4rem",
    borderRadius: "3px",
    fontSize: "0.68rem",
    color: "#555",
  },
  worldNum: { fontSize: "0.68rem", color: "#444", letterSpacing: "0.2em" },
  worldName: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem" },
  worldSub: { fontSize: "0.78rem", color: "#666" },
  worldDesc: { fontSize: "0.78rem", color: "#444", lineHeight: "1.4" },
  pBar: { height: "2px", background: "#111", borderRadius: "1px", marginTop: "0.5rem" },
  pFill: { height: "100%", borderRadius: "1px", transition: "width 0.5s" },
  pLabel: { fontSize: "0.7rem", color: "#444" },
  backBtn: {
    background: "transparent",
    border: "1px solid #1a1a2e",
    color: "#555",
    padding: "0.35rem 0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: "1rem",
    display: "inline-block",
  },
  betrayerCard: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
    background: "rgba(255,68,0,0.04)",
    border: "1px solid #330a00",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    marginBottom: "1.25rem",
  },
  floorList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  floorRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid",
    borderRadius: "6px",
    padding: "0.7rem 0.9rem",
    cursor: "pointer",
    background: "#080810",
    transition: "border-color 0.2s, background 0.2s",
  },
  floorIcon: { fontSize: "1.3rem", flexShrink: 0, width: "2rem", textAlign: "center" },
  floorInfo: { flex: 1 },
  floorTitle: { fontSize: "0.88rem", fontWeight: "bold" },
  floorMonster: { fontSize: "0.72rem", color: "#ff6666", marginTop: "0.15rem" },
  actionBtn: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c2d12, #991b1b)",
    border: "none",
    color: "#fff",
    padding: "0.8rem 2rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  betrayerScene: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: "1.25rem",
    textAlign: "center",
    padding: "2rem",
    animation: "fadeUp 0.6s ease-out",
  },
  victoryScene: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: "1.5rem",
    padding: "2rem",
    animation: "fadeUp 0.6s ease-out",
  },
};