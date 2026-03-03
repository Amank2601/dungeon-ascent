// src/components/Leaderboard.js
import { useState, useEffect } from "react";
import { apiFetch } from "../context/AuthContext";
import { getLevel } from "../data/levels";

export function Leaderboard({ onBack }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    apiFetch("/leaderboard")
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const LANG_EMOJI = { javascript:"🟨", python:"🐍", java:"☕", cpp:"⚡" };

  if (loading) return (
    <div style={s.page}>
      <div style={s.loading}>⚔️<br/><span style={{fontSize:"0.8rem",color:"#333",marginTop:"0.5rem",display:"block"}}>Loading rankings...</span></div>
    </div>
  );

  if (error) return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>
      <div style={{color:"#ff4444",textAlign:"center",marginTop:"3rem",fontSize:"0.85rem"}}>Failed to load: {error}</div>
    </div>
  );

  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Back</button>

      <div style={s.header}>
        <div style={s.title}>🏆 LEADERBOARD</div>
        <div style={s.sub}>Top coders in the Dungeon</div>
        {data?.yourRank > 20 && (
          <div style={s.yourRankBadge}>
            Your global rank: <span style={{color:"#ffd700"}}>#{data.yourRank}</span>
            {" · "}<span style={{color:"#e8d5a3"}}>{data.yourXP} XP</span>
          </div>
        )}
      </div>

      <div style={s.table}>
        {/* header row */}
        <div style={s.headerRow}>
          <span style={s.col.rank}>RANK</span>
          <span style={s.col.player}>PLAYER</span>
          <span style={s.col.xp}>XP</span>
          <span style={s.col.worlds}>WORLDS</span>
          <span style={s.col.lang}>LANG</span>
        </div>

        {data?.board.map((entry, i) => {
          const lvl = getLevel(entry.totalXP);
          const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
          return (
            <div key={i} style={{
              ...s.row,
              background: entry.isYou ? "rgba(255,215,0,0.05)" : "transparent",
              borderColor: entry.isYou ? "#ffd70033" : "#0e0e0e",
              borderLeft: entry.isYou ? "2px solid #ffd700" : "2px solid transparent",
            }}>
              <span style={s.col.rank}>
                {medal || <span style={{color:"#333"}}>#{entry.rank}</span>}
              </span>
              <span style={s.col.player}>
                <span style={{color: lvl.color, marginRight:"0.3rem"}}>{lvl.badge}</span>
                <span style={{color: entry.isYou?"#ffd700":"#e8d5a3", fontWeight: entry.isYou?"bold":"normal"}}>
                  {entry.username}{entry.isYou?" (you)":""}
                </span>
                <span style={{color:"#333",fontSize:"0.68rem",marginLeft:"0.4rem"}}>{lvl.title}</span>
              </span>
              <span style={{...s.col.xp, color:"#ffd700"}}>
                {entry.totalXP.toLocaleString()}
              </span>
              <span style={{...s.col.worlds, color:"#22c55e"}}>
                {"⭐".repeat(entry.worldsCompleted)}{entry.worldsCompleted===0&&<span style={{color:"#222"}}>—</span>}
              </span>
              <span style={s.col.lang}>
                {LANG_EMOJI[entry.selectedLanguage]||"❓"}
              </span>
            </div>
          );
        })}

        {data?.board.length === 0 && (
          <div style={{textAlign:"center",color:"#333",padding:"3rem",fontSize:"0.85rem"}}>
            No players yet. Be the first to climb!
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:    { width:"100%",maxWidth:760,padding:"1rem 0 3rem",animation:"fadeUp 0.4s ease-out" },
  loading: { textAlign:"center",marginTop:"5rem",fontSize:"3rem",animation:"pulse 1.5s infinite" },
  back:    { background:"transparent",border:"1px solid #1a1a2e",color:"#555",padding:"0.35rem 0.75rem",borderRadius:4,cursor:"pointer",fontSize:"0.8rem",fontFamily:"'JetBrains Mono',monospace",marginBottom:"1rem" },
  header:  { textAlign:"center",marginBottom:"2rem" },
  title:   { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.8rem",color:"#ffd700",marginBottom:"0.3rem" },
  sub:     { color:"#444",fontSize:"0.8rem",letterSpacing:"0.15em" },
  yourRankBadge: { marginTop:"0.75rem",background:"rgba(255,215,0,0.05)",border:"1px solid #ffd70022",borderRadius:6,padding:"0.35rem 1rem",display:"inline-block",fontSize:"0.8rem",color:"#888" },
  table:   { display:"flex",flexDirection:"column",gap:"2px" },
  headerRow: { display:"flex",padding:"0.4rem 0.8rem",fontSize:"0.65rem",color:"#333",letterSpacing:"0.15em",borderBottom:"1px solid #0e0e0e",marginBottom:"0.25rem" },
  row:     { display:"flex",alignItems:"center",padding:"0.6rem 0.8rem",borderRadius:4,border:"1px solid",transition:"background 0.2s",fontSize:"0.82rem",gap:"0.5rem" },
  col: {
    rank:   { width:48,flexShrink:0,textAlign:"center",fontSize:"1rem" },
    player: { flex:1,display:"flex",alignItems:"center",gap:"0.25rem",flexWrap:"wrap",minWidth:0 },
    xp:     { width:72,flexShrink:0,textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontSize:"0.78rem" },
    worlds: { width:70,flexShrink:0,textAlign:"center",fontSize:"0.75rem",letterSpacing:"-0.1em" },
    lang:   { width:32,flexShrink:0,textAlign:"center",fontSize:"1rem" },
  },
};