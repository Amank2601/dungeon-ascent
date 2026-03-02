// src/components/StoryIntro.js
import { useState, useEffect } from "react";
import { STORY_INTRO } from "../data/story";
import { useAuth } from "../context/AuthContext";

export function StoryIntro({ onComplete, alreadySeen }) {
  const { user } = useAuth();
  const [visibleLines, setVisibleLines] = useState([]);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    STORY_INTRO.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        if (i === STORY_INTRO.length - 1) {
          setTimeout(() => setDone(true), 1500);
        }
      }, line.delay);
    });
  }, [started]);

  if (!started) {
    return (
      <div style={s.landing}>
        <div style={s.landingBg} />
        <div style={s.landingContent}>
          <div style={s.landingTop}>
            <div style={s.bigIcon}>⚔️</div>
            <div style={s.bigTitle}>DUNGEON ASCENT</div>
            <div style={s.bigSub}>CODE ARENA</div>
          </div>

          <div style={s.welcomeCard}>
            <div style={s.welcomeGreet}>
              Welcome back, <span style={{ color: "#ffd700" }}>{user?.username}</span>
            </div>
            <div style={s.welcomeLore}>
              "You were betrayed. Stripped of your knowledge. Pushed into the abyss.<br />
              Six worlds stand between you and redemption.<br />
              The dungeon will teach you everything — if you survive."
            </div>
            <div style={s.worldIcons}>
              <span title="The Awakening">🌍</span>
              <span style={s.arrow}>→</span>
              <span title="Loop Realm">🌀</span>
              <span style={s.arrow}>→</span>
              <span title="Function Forge">⚙️</span>
              <span style={s.arrow}>→</span>
              <span title="Memory Vault">📦</span>
              <span style={s.arrow}>→</span>
              <span title="Logic Arena">⚔️</span>
              <span style={s.arrow}>→</span>
              <span title="Architect Layer">🏛️</span>
            </div>
            <div style={s.btnRow}>
              {alreadySeen ? (
                <button style={s.primaryBtn} onClick={onComplete}>
                  Continue My Journey →
                </button>
              ) : (
                <>
                  <button style={s.primaryBtn} onClick={() => setStarted(true)}>
                    ▶ Watch the Story
                  </button>
                  <button style={s.secondaryBtn} onClick={onComplete}>
                    Skip Intro →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.storyScene}>
      <div style={s.storyBg} />
      <div style={s.storyContent}>
        <div style={s.storyLines}>
          {visibleLines.map((line, i) => (
            <p key={i} style={{
              ...s.storyLine,
              color: line.highlight ? "#ff4444" : "#e8d5a3",
              fontSize: line.highlight ? "1.5rem" : "1rem",
              fontWeight: line.highlight ? "bold" : "normal",
              fontFamily: line.highlight ? "'Syne', sans-serif" : "'JetBrains Mono', monospace",
              animation: "fadeUp 0.6s ease-out",
              textShadow: line.highlight ? "0 0 30px rgba(255,68,68,0.5)" : "none",
            }}>
              {line.text}
            </p>
          ))}
        </div>
        {done && (
          <button style={{ ...s.primaryBtn, animation: "fadeUp 0.5s ease-out" }} onClick={onComplete}>
            ⚔️ BEGIN YOUR ASCENT →
          </button>
        )}
      </div>
    </div>
  );
}

const s = {
  landing: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "1rem",
  },
  landingBg: {
    position: "fixed",
    inset: 0,
    background: `
      radial-gradient(ellipse at 30% 30%, rgba(255,100,0,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 70%, rgba(100,0,255,0.06) 0%, transparent 60%)
    `,
    pointerEvents: "none",
  },
  landingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    maxWidth: "600px",
    width: "100%",
  },
  landingTop: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  bigIcon: { fontSize: "3.5rem" },
  bigTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "clamp(2rem, 7vw, 4rem)",
    color: "#ffd700",
    letterSpacing: "0.15em",
    textShadow: "0 0 30px rgba(255,215,0,0.3)",
  },
  bigSub: {
    color: "#ff4444",
    letterSpacing: "0.5em",
    fontSize: "0.85rem",
    fontFamily: "'JetBrains Mono', monospace",
  },
  welcomeCard: {
    background: "rgba(10,10,20,0.9)",
    border: "1px solid #2a1a0a",
    borderRadius: "12px",
    padding: "2rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    boxShadow: "0 0 40px rgba(255,68,0,0.08)",
  },
  welcomeGreet: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "1.3rem",
    color: "#e8d5a3",
    textAlign: "center",
  },
  welcomeLore: {
    color: "#666",
    fontSize: "0.85rem",
    lineHeight: "1.8",
    textAlign: "center",
    fontStyle: "italic",
  },
  worldIcons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    fontSize: "1.5rem",
  },
  arrow: { color: "#333", fontSize: "0.9rem" },
  btnRow: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c2d12, #991b1b)",
    border: "1px solid #dc2626",
    color: "#fff",
    padding: "0.8rem 2rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
    letterSpacing: "0.05em",
  },
  secondaryBtn: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    background: "transparent",
    border: "1px solid #333",
    color: "#666",
    padding: "0.8rem 1.5rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },

  // Story cinematic
  storyScene: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  storyBg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at center, rgba(20,0,0,1) 0%, #000 100%)",
    pointerEvents: "none",
  },
  storyContent: {
    maxWidth: "680px",
    width: "100%",
    padding: "2rem",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    alignItems: "center",
  },
  storyLines: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  storyLine: {
    lineHeight: "1.7",
    margin: 0,
  },
};
