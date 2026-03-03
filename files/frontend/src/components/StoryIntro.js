// src/components/StoryIntro.js
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { playSound } from "../data/sounds";

// ─── 6 cinematic scenes ───────────────────────────────────────────────────────
// Each scene auto-advances after `ms` ms (0 = manual only)
const SCENES = [
  { id:"year",      ms:3500, accent:"#ffd700", bg:"#000000" },
  { id:"team",      ms:4000, accent:"#22d3ee", bg:"#000508" },
  { id:"algorithm", ms:3500, accent:"#ffd700", bg:"#050200" },
  { id:"betrayal",  ms:5000, accent:"#ff4444", bg:"#050000" },
  { id:"abyss",     ms:3500, accent:"#444",    bg:"#000003" },
  { id:"begin",     ms:0,    accent:"#ffd700", bg:"#080400" },
];

// ─── individual scene renderers ───────────────────────────────────────────────
function SceneYear({ vis }) {
  return (
    <div style={C.stack}>
      <div style={{ ...C.bigYear, opacity: vis[0]?1:0, transform: vis[0]?"scale(1)":"scale(0.6)", filter: vis[0]?"blur(0)":"blur(12px)", transition:"all 1.1s cubic-bezier(.16,1,.3,1)" }}>
        YEAR 2157
      </div>
      <div style={{ ...C.rule, width: vis[1]?"280px":"0", opacity: vis[1]?1:0, transition:"all 0.8s 0.2s ease-out" }} />
      <div style={{ ...C.sub, opacity: vis[2]?1:0, transform: vis[2]?"translateY(0)":"translateY(20px)", transition:"all 0.7s 0.1s ease-out" }}>
        THE CODE ARENA
      </div>
      <div style={{ ...C.body, opacity: vis[3]?1:0, transform: vis[3]?"translateY(0)":"translateY(16px)", transition:"all 0.7s ease-out", maxWidth:480 }}>
        A digital dungeon spanning 100 floors of pure algorithmic warfare.<br/>
        Built by the world's greatest engineers. Governed by one law:<br/>
        <span style={{color:"#ffd700"}}>solve it, or be consumed.</span>
      </div>
    </div>
  );
}

function SceneTeam({ vis }) {
  const members = [
    { name:"YOU",    role:"The Ascendant",   emoji:"🧙‍♂️", you:true  },
    { name:"KIRA",   role:"Syntax Witch",     emoji:"🧙‍♀️", you:false },
    { name:"REX",    role:"Loop Runner",      emoji:"🏃",  you:false },
    { name:"NOVA",   role:"Function Thief",   emoji:"💫",  you:false },
    { name:"BYTE",   role:"Memory Devourer",  emoji:"🧠",  you:false },
    { name:"CIPHER", role:"Algorithm Lord",   emoji:"🔐",  you:false },
  ];
  return (
    <div style={C.stack}>
      <div style={{ ...C.label, color:"#22d3ee", opacity:vis[0]?1:0, transform:vis[0]?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease-out" }}>
        THE ELITE SIX
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.5rem", opacity:vis[1]?1:0, transform:vis[1]?"translateY(0)":"translateY(20px)", transition:"all 0.7s 0.2s ease-out" }}>
        {members.map((m,i) => (
          <div key={i} style={{ border:`1px solid ${m.you?"#ffd70055":"#1a1a2a"}`, borderRadius:8, padding:"0.7rem 0.4rem", textAlign:"center", background:m.you?"rgba(255,215,0,0.06)":"rgba(10,10,20,0.8)" }}>
            <div style={{fontSize:"1.8rem"}}>{m.emoji}</div>
            <div style={{color:m.you?"#ffd700":"#e8d5a3",fontWeight:"bold",fontSize:"0.78rem",marginTop:"0.2rem"}}>{m.name}{m.you?" ★":""}</div>
            <div style={{color:"#444",fontSize:"0.65rem"}}>{m.role}</div>
          </div>
        ))}
      </div>
      <div style={{ ...C.body, opacity:vis[2]?1:0, transform:vis[2]?"translateY(0)":"translateY(16px)", transition:"all 0.7s 0.3s ease-out" }}>
        Together you descended to <span style={{color:"#22d3ee"}}>Floor −100</span> and found the Forbidden Algorithm.<br/>
        You trusted them with your life.
      </div>
    </div>
  );
}

function SceneAlgorithm({ vis }) {
  return (
    <div style={C.stack}>
      <div style={{ ...C.label, color:"#ffd70077", letterSpacing:"0.25em", opacity:vis[0]?1:0, transition:"all 0.7s ease-out" }}>
        THE FORBIDDEN ALGORITHM
      </div>
      <div style={{ opacity:vis[1]?1:0, transition:"all 0.8s 0.3s ease-out", textAlign:"center" }}>
        <div style={{ fontSize:"5.5rem", animation:"floatGlow 3s ease-in-out infinite", display:"inline-block" }}>📜</div>
      </div>
      <div style={{ ...C.code, opacity:vis[2]?1:0, transform:vis[2]?"translateY(0)":"translateY(16px)", transition:"all 0.7s 0.4s ease-out" }}>
        <span style={{color:"#666"}}>// power beyond imagination</span><br/>
        <span style={{color:"#7dd3fc"}}>const </span>
        <span style={{color:"#ffd700"}}>algorithm</span>
        <span style={{color:"#e8d5a3"}}> = </span>
        <span style={{color:"#86efac"}}>unlock</span>
        <span style={{color:"#e8d5a3"}}>(floor[</span>
        <span style={{color:"#f97316"}}>-100</span>
        <span style={{color:"#e8d5a3"}}>]);</span><br/>
        <span style={{color:"#666"}}>// you held it. you trusted your team.</span>
      </div>
    </div>
  );
}

function SceneBetrayal({ vis }) {
  return (
    <div style={C.stack}>
      <div style={{ ...C.warning, opacity:vis[0]?1:0, transform:vis[0]?"scale(1)":"scale(1.6)", filter:vis[0]?"blur(0)":"blur(16px)", transition:"all 0.5s ease-out" }}>
        WHILE YOU SLEPT...
      </div>
      {/* The betrayal animation */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"1.5rem", flexWrap:"wrap", padding:"1rem 2rem", border:"1px solid #ff000018", borderRadius:12, background:"rgba(255,0,0,0.02)", opacity:vis[1]?1:0, transition:"opacity 0.5s 0.4s" }}>
        {/* sleeping hero */}
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3rem", animation: vis[1]?"sleepFloat 2s ease-in-out infinite":"none"}}>🧙‍♂️</div>
          <div style={{color:"#555",fontSize:"0.65rem",marginTop:"0.2rem"}}>💤 YOU (asleep)</div>
        </div>
        <div style={{color:"#ff4444",fontSize:"2rem",animation:vis[1]?"pulseX 1s ease-in-out infinite":"none"}}>⟶</div>
        {/* traitors fleeing */}
        <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
          {[["🧙‍♀️","KIRA"],["🏃","REX"],["💫","NOVA"],["🧠","BYTE"],["🔐","CIPHER"]].map(([e,n],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.4rem", opacity:vis[2]?1:0, transform:vis[2]?"translateX(0)":"translateX(-30px)", transition:`all 0.35s ${0.6+i*0.1}s ease-out` }}>
              <span style={{fontSize:"1.2rem"}}>{e}</span>
              <span style={{color:"#ff4444",fontSize:"0.65rem"}}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:"0.8rem",animation:vis[2]?"fadeGone 1.2s 1.8s ease-in forwards":"none",opacity:vis[2]?1:0,transition:"opacity 0.5s 0.8s"}}>
          <div style={{fontSize:"2rem"}}>📜</div>
          <div style={{color:"#ff444477",fontSize:"0.65rem",letterSpacing:"0.2em"}}>STOLEN</div>
        </div>
      </div>
      <div style={{ ...C.body, color:"#ff666677", opacity:vis[3]?1:0, transform:vis[3]?"translateY(0)":"translateY(16px)", transition:"all 0.7s 1.2s ease-out" }}>
        They took the Algorithm. Erased your memories.<br/>
        Then pushed you into <span style={{color:"#ff4444"}}>The Abyss.</span>
      </div>
    </div>
  );
}

function SceneAbyss({ vis }) {
  return (
    <div style={C.stack}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(2rem,7vw,5rem)", color:"#333", letterSpacing:"0.2em", opacity:vis[0]?1:0, animation:vis[0]?"glitchText 0.8s ease-out":"none", transition:"opacity 0.5s" }}>
        FLOOR ZERO
      </div>
      <div style={{ color:"#ff000033", fontSize:"0.85rem", letterSpacing:"0.5em", fontFamily:"'JetBrains Mono',monospace", opacity:vis[1]?1:0, transition:"opacity 0.7s 0.3s" }}>
        THE ABYSS
      </div>
      <div style={{ fontSize:"4rem", filter:"grayscale(1)", opacity: vis[2]?0.6:0, transform:vis[2]?"translateY(0)":"translateY(-40px)", transition:"all 0.9s 0.4s ease-out" }}>
        🧙‍♂️
      </div>
      <div style={{ ...C.code, opacity:vis[3]?1:0, transition:"opacity 0.7s 0.7s", opacity2:0.5 }}>
        <span style={{color:"#ff4444"}}>ERROR</span><span style={{color:"#555"}}>: memory.skills = </span><span style={{color:"#ff6666"}}>undefined</span><br/>
        <span style={{color:"#ff4444"}}>ERROR</span><span style={{color:"#555"}}>: team.members  = </span><span style={{color:"#ff6666"}}>[ ]</span><br/>
        <span style={{color:"#22c55e"}}> OK   </span><span style={{color:"#555"}}>: mind.status   = </span><span style={{color:"#86efac"}}>"intact"</span>
      </div>
      <div style={{ color:"#444", fontSize:"0.75rem", letterSpacing:"0.15em", opacity:vis[4]?1:0, transition:"opacity 0.7s 0.8s", fontFamily:"'JetBrains Mono',monospace" }}>
        NO WEAPONS · NO TEAM · NO MEMORY
      </div>
    </div>
  );
}

function SceneBegin({ onDone, vis }) {
  return (
    <div style={C.stack}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(1.6rem,5vw,3rem)", color:"#ffd700", letterSpacing:"0.08em", animation:"glowPulse 2s ease-in-out infinite", opacity:vis[0]?1:0, transition:"opacity 0.8s" }}>
        ⚔️  BEGIN YOUR ASCENT
      </div>
      <div style={{ ...C.sub, color:"#e8d5a398", opacity:vis[1]?1:0, transition:"opacity 0.7s 0.3s", textAlign:"center" }}>
        Defeat the monsters. Reclaim your skills. Find your betrayers.
      </div>
      <div style={{ display:"flex", gap:"0.6rem", opacity:vis[2]?1:0, transition:"opacity 0.6s 0.5s" }}>
        {["🌍","🌀","⚙️","📦","⚔️","🏛️"].map((e,i) => (
          <span key={i} style={{fontSize:"1.8rem", opacity:vis[2]?1:0, transform:vis[2]?"translateY(0)":"translateY(10px)", transition:`all 0.4s ${0.6+i*0.07}s ease-out`}}>{e}</span>
        ))}
      </div>
      <button
        onClick={onDone}
        style={{ ...C.startBtn, opacity:vis[3]?1:0, transform:vis[3]?"translateY(0)":"translateY(16px)", transition:"all 0.6s 0.8s ease-out" }}
      >
        ENTER THE DUNGEON →
      </button>
    </div>
  );
}

// ─── scene → component + how many vis-slots it needs ─────────────────────────
const SCENE_MAP = {
  year:      { C: SceneYear,      slots: 4 },
  team:      { C: SceneTeam,      slots: 3 },
  algorithm: { C: SceneAlgorithm, slots: 3 },
  betrayal:  { C: SceneBetrayal,  slots: 4 },
  abyss:     { C: SceneAbyss,     slots: 5 },
  begin:     { C: SceneBegin,     slots: 4 },
};

// staggered reveal of vis slots
function useReveal(n, active) {
  const [vis, setVis] = useState(Array(n).fill(false));
  useEffect(() => {
    if (!active) { setVis(Array(n).fill(false)); return; }
    setVis(Array(n).fill(false));
    for (let i = 0; i < n; i++) {
      setTimeout(() => setVis(prev => { const a=[...prev]; a[i]=true; return a; }), 200 + i * 380);
    }
  }, [active, n]);
  return vis;
}

// starfield bg
function Stars({ count = 55 }) {
  const stars = useRef(Array.from({length:count},()=>({ x:Math.random()*100, y:Math.random()*100, s:0.6+Math.random()*1.6, d:2+Math.random()*3, dl:Math.random()*4 }))).current;
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {stars.map((s,i)=>(
        <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:`${s.s}px`, height:`${s.s}px`, borderRadius:"50%", background:"#fff", opacity:0.5, animation:`twinkle ${s.d}s ${s.dl}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

// glitch scanlines for betrayal
function Glitch() {
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {[12,27,43,58,71,85].map((top,i)=>(
        <div key={i} style={{ position:"absolute",left:0,right:0,top:`${top}%`,height:"1px",background:`rgba(255,${40+i*18},0,0.22)`,animation:`scanLine 0.${4+i}s ${i*0.07}s linear infinite` }} />
      ))}
      {Array.from({length:18}).map((_,i)=>(
        <div key={`p${i}`} style={{ position:"absolute",left:`${Math.random()*100}%`,top:0,width:"1px",height:`${8+Math.random()*18}px`,background:"rgba(255,60,0,0.4)",animation:`pixelFall ${1.2+Math.random()*2}s ${Math.random()*3}s linear infinite` }} />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function StoryIntro({ onComplete, alreadySeen }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState("landing"); // "landing" | "cinematic"
  const [idx, setIdx]     = useState(0);
  const timerRef = useRef(null);

  const scene = SCENES[idx];
  const { C: SceneComp, slots } = SCENE_MAP[scene.id];
  const vis = useReveal(slots, phase === "cinematic");

  // play a sound + set auto-advance timer on each scene
  useEffect(() => {
    if (phase !== "cinematic") return;
    if (scene.id === "betrayal") setTimeout(()=>playSound("betrayal"),400);
    else if (scene.id === "begin") playSound("victory");
    else playSound("storyBeat");

    if (scene.ms > 0) {
      timerRef.current = setTimeout(advance, scene.ms);
      return () => clearTimeout(timerRef.current);
    }
  }, [idx, phase]);

  const advance = () => {
    clearTimeout(timerRef.current);
    playSound("whoosh");
    setIdx(i => Math.min(i+1, SCENES.length-1));
  };

  const skip = () => { clearTimeout(timerRef.current); playSound("click"); onComplete(); };

  // ── Landing ─────────────────────────────────────────────────────────────────
  if (phase === "landing") return (
    <div style={L.root}>
      <style>{CSS}</style>
      <Stars count={50} />
      <div style={L.grid}/>
      <div style={L.glow1}/><div style={L.glow2}/>
      <div style={L.inner}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3.5rem",animation:"floatGlow 3s ease-in-out infinite"}}>⚔️</div>
          <div style={L.title}>DUNGEON<br/>ASCENT</div>
          <div style={L.codeSub}>CODE ARENA · YEAR 2157</div>
        </div>
        <div style={L.card}>
          <div style={L.greet}>Welcome, <span style={{color:"#ffd700",textShadow:"0 0 12px rgba(255,215,0,0.5)"}}>{user?.username}</span></div>
          <div style={L.lore}>
            "You were betrayed. Your memories erased. Pushed into the abyss.<br/>
            Six worlds stand between you and the ones who did this.<br/>
            <span style={{color:"#e8d5a366"}}>The dungeon will teach you everything — if you survive.</span>"
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.3rem",flexWrap:"wrap"}}>
            {[["🌍","Awakening"],["→"],["🌀","Loops"],["→"],["⚙️","Functions"],["→"],["📦","Memory"],["→"],["⚔️","Logic"],["→"],["🏛️","Architect"]].map(([e,l],i)=>(
              e==="→"
                ? <span key={i} style={{color:"#1a1a1a",fontSize:"0.8rem"}}>→</span>
                : <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem"}}>{e}</div>
                    <div style={{color:"#2a2a2a",fontSize:"0.58rem"}}>{l}</div>
                  </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
            {alreadySeen
              ? <button style={L.btnP} onClick={()=>{playSound("click");onComplete();}}>Continue My Journey →</button>
              : <>
                  <button style={L.btnP} onClick={()=>{playSound("click");setPhase("cinematic");}}>▶ Watch the Story</button>
                  <button style={L.btnS} onClick={()=>{playSound("click");onComplete();}}>Skip Intro →</button>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );

  // ── Cinematic ────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:scene.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",transition:"background 0.9s ease",padding:"2rem"}}>
      <style>{CSS}</style>
      {scene.id==="betrayal" ? <Glitch/> : <Stars count={scene.id==="begin"?60:30}/>}

      {/* scene content */}
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:680}}>
        {scene.id === "begin"
          ? <SceneComp vis={vis} onDone={onComplete}/>
          : <SceneComp vis={vis}/>
        }
      </div>

      {/* skip */}
      <button onClick={skip} style={nav.skip}>Skip ✕</button>

      {/* click-to-advance hint */}
      {scene.ms > 0 && (
        <button onClick={advance} style={nav.hint}>click to continue ▶</button>
      )}

      {/* progress dots */}
      <div style={nav.dots}>
        {SCENES.map((s,i)=>(
          <div key={i} style={{width:i===idx?18:6,height:6,borderRadius:3,background:i===idx?scene.accent:"#1a1a1a",transition:"all 0.4s"}}/>
        ))}
      </div>
    </div>
  );
}

// ─── shared scene styles ──────────────────────────────────────────────────────
const C = {
  stack:   { display:"flex",flexDirection:"column",alignItems:"center",gap:"1.8rem",textAlign:"center" },
  bigYear: { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(3rem,10vw,7rem)",color:"#ffd700",letterSpacing:"0.14em",lineHeight:1,textShadow:"0 0 80px rgba(255,215,0,0.3)" },
  label:   { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1rem,4vw,2rem)",letterSpacing:"0.3em" },
  sub:     { color:"#777",fontSize:"clamp(0.78rem,2vw,0.95rem)",letterSpacing:"0.3em",fontFamily:"'JetBrains Mono',monospace" },
  body:    { color:"#555",fontSize:"clamp(0.78rem,2vw,0.88rem)",lineHeight:"1.95",fontStyle:"italic",fontFamily:"'JetBrains Mono',monospace" },
  rule:    { height:"1px",background:"linear-gradient(90deg,transparent,#ffd70044,transparent)",transition:"width 0.8s ease-out, opacity 0.8s" },
  code:    { background:"#080808",border:"1px solid #181818",borderRadius:6,padding:"0.9rem 1.4rem",fontFamily:"'JetBrains Mono',monospace",fontSize:"0.82rem",lineHeight:1.85,textAlign:"left",width:"100%",maxWidth:480 },
  warning: { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1.5rem,5vw,3.5rem)",color:"#ff4444",letterSpacing:"0.12em",textShadow:"0 0 60px rgba(255,68,68,0.5)" },
  startBtn:{ fontFamily:"'Syne',sans-serif",fontWeight:800,background:"linear-gradient(135deg,#7c2d12,#991b1b)",border:"1px solid #dc2626",color:"#fff",padding:"1rem 3rem",borderRadius:6,fontSize:"1rem",cursor:"pointer",letterSpacing:"0.08em" },
};

// ─── landing styles ───────────────────────────────────────────────────────────
const L = {
  root:    { minHeight:"100vh",background:"#000",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"1.5rem" },
  grid:    { position:"fixed",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,215,0,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.022) 1px,transparent 1px)",backgroundSize:"60px 60px" },
  glow1:   { position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 20% 30%,rgba(255,100,0,0.07) 0%,transparent 50%)" },
  glow2:   { position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 80% 70%,rgba(100,0,255,0.07) 0%,transparent 50%)" },
  inner:   { position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2rem",maxWidth:560,width:"100%" },
  title:   { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2.5rem,4.5vw,4rem)",color:"#ffd700",letterSpacing:"0.12em",lineHeight:1.0,textAlign:"center",textShadow:"0 0 60px rgba(255,215,0,0.18)",animation:"glowPulse 3s ease-in-out infinite" },
  codeSub: { color:"#ff4444",letterSpacing:"0.4em",fontSize:"0.72rem",fontFamily:"'JetBrains Mono',monospace",marginTop:"0.5rem" },
  card:    { background:"rgba(8,8,14,0.97)",border:"1px solid #1a1200",borderRadius:12,padding:"2rem",width:"100%",display:"flex",flexDirection:"column",gap:"1.4rem",boxShadow:"0 0 80px rgba(255,68,0,0.04)" },
  greet:   { fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.3rem",color:"#e8d5a3",textAlign:"center" },
  lore:    { color:"#444",fontSize:"0.83rem",lineHeight:"1.9",textAlign:"center",fontStyle:"italic",fontFamily:"'JetBrains Mono',monospace" },
  btnP:    { fontFamily:"'Syne',sans-serif",fontWeight:700,background:"linear-gradient(135deg,#7c2d12,#991b1b)",border:"1px solid #dc2626",color:"#fff",padding:"0.85rem 2rem",borderRadius:6,fontSize:"0.95rem",cursor:"pointer",letterSpacing:"0.05em" },
  btnS:    { fontFamily:"'Syne',sans-serif",fontWeight:700,background:"transparent",border:"1px solid #1a1a1a",color:"#444",padding:"0.85rem 1.5rem",borderRadius:6,fontSize:"0.9rem",cursor:"pointer" },
};

const nav = {
  skip: { position:"fixed",top:"1rem",right:"1rem",background:"transparent",border:"1px solid #1a1a1a",color:"#333",padding:"0.35rem 0.8rem",borderRadius:4,fontSize:"0.73rem",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",zIndex:100 },
  hint: { position:"fixed",bottom:"2.8rem",right:"1.5rem",background:"transparent",border:"none",color:"#2a2a2a",fontSize:"0.72rem",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",zIndex:100,animation:"blink 1.6s ease-in-out infinite" },
  dots: { position:"fixed",bottom:"1.2rem",left:"50%",transform:"translateX(-50%)",display:"flex",gap:"5px",zIndex:100,alignItems:"center" },
};

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const CSS = `
@keyframes floatGlow  { 0%,100%{transform:translateY(0);filter:drop-shadow(0 0 18px #ffd700)} 50%{transform:translateY(-12px);filter:drop-shadow(0 0 38px #ffd700)} }
@keyframes glowPulse  { 0%,100%{text-shadow:0 0 20px rgba(255,215,0,0.25)} 50%{text-shadow:0 0 60px rgba(255,215,0,0.65),0 0 100px rgba(255,100,0,0.25)} }
@keyframes twinkle    { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.3)} }
@keyframes sleepFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-7px) rotate(2deg)} }
@keyframes pulseX     { 0%,100%{opacity:0.35;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.2)} }
@keyframes fadeGone   { 0%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(50px)} }
@keyframes glitchText { 0%{transform:translateX(-6px);opacity:0} 30%{transform:translateX(4px)} 60%{transform:translateX(-2px)} 100%{transform:translateX(0);opacity:1} }
@keyframes scanLine   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
@keyframes pixelFall  { 0%{transform:translateY(-10px);opacity:0.7} 100%{transform:translateY(100vh);opacity:0} }
@keyframes blink      { 0%,100%{opacity:0.25} 50%{opacity:0.7} }
`;