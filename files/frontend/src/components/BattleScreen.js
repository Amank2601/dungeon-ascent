// src/components/BattleScreen.js
import { useState, useEffect, useRef } from "react";
import { LANGUAGES, runWithJudge0, validatePseudoCode } from "../data/languages";

const MAX_LIVES = 3;

function HPBar({ current, max, color = "#22c55e", label }) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"0.2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:"0.65rem",color:"#333"}}>{label}</span>
        <span style={{fontSize:"0.65rem",color}}>{current}/{max} HP</span>
      </div>
      <div style={{height:"5px",background:"#0d0d14",borderRadius:"3px",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:"3px",transition:"width 0.5s ease-out",width:`${pct}%`,background:pct>50?color:pct>25?"#f59e0b":"#ef4444"}} />
      </div>
    </div>
  );
}

function LivesDisplay({ lives }) {
  return (
    <div style={{display:"flex",gap:"0.25rem",justifyContent:"center"}}>
      {Array.from({length:MAX_LIVES}).map((_,i)=>(
        <span key={i} style={{fontSize:"1.2rem",opacity:i<lives?1:0.15,transition:"opacity 0.3s"}}>❤️</span>
      ))}
    </div>
  );
}

function MonsterSprite({ monster, isShaking, isDefeated }) {
  return (
    <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",
      animation:isShaking?"shake 0.35s":isDefeated?"fadeOutScale 0.8s forwards":"floatAnim 3s ease-in-out infinite"}}>
      {monster.isBoss&&!isDefeated&&(
        <div style={{position:"absolute",inset:"-12px",borderRadius:"50%",background:"rgba(255,68,0,0.12)",filter:"blur(12px)",animation:"pulse 2s infinite"}}/>
      )}
      <div style={{fontSize:"3.5rem",lineHeight:1,zIndex:1}}>{monster.emoji}</div>
    </div>
  );
}

function PlayerSprite({ isAttacking, hp, maxHp }) {
  const ratio = hp/maxHp;
  return (
    <div style={{fontSize:"3.5rem",lineHeight:1,
      animation:isAttacking?"attackAnim 0.4s ease-in-out":"floatAnim 3s ease-in-out infinite 1.5s"}}>
      {ratio>0.6?"🧙‍♂️":ratio>0.3?"🧟‍♂️":"💀"}
    </div>
  );
}

function TestResultsPanel({ testResults }) {
  if (!testResults?.length) return null;
  return (
    <div style={{background:"#030308",border:"1px solid #0d0d14",borderRadius:"5px",padding:"0.5rem 0.75rem",display:"flex",flexDirection:"column",gap:"0.25rem"}}>
      {testResults.map((t,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.8rem",color:t.pass?"#86efac":"#fca5a5"}}>
          <span>{t.pass?"✅":"❌"}</span>
          <span style={{flex:1}}>{t.label||`Test ${i+1}`}</span>
          {!t.pass&&t.result&&<span style={{color:"#555",fontSize:"0.7rem"}}>got: {String(t.result)}</span>}
        </div>
      ))}
    </div>
  );
}

export function BattleScreen({ world, floor, monster: monsterData, onVictory, onDefeat, onBack }) {
  const [phase, setPhase] = useState("dialogue");
  const [dialogueLine, setDialogueLine] = useState(0);
  const [monsterHp, setMonsterHp] = useState(monsterData.hp);
  const [playerHp, setPlayerHp] = useState(10);
  const [lives, setLives] = useState(MAX_LIVES);
  const [attempts, setAttempts] = useState(0);
  const [code, setCode] = useState(floor.starterCode||"");
  const [result, setResult] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [isShaking, setIsShaking] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [judgeError, setJudgeError] = useState(null);
  const logRef = useRef(null);

  useEffect(()=>{
    if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight;
  },[battleLog]);

  useEffect(()=>{
    setCode(floor.starterCodes?.[selectedLang]||floor.starterCode||"");
    setResult(null); setTestResults([]); setJudgeError(null);
  },[selectedLang]);

  const addLog=(msg,color="#888")=>
    setBattleLog(prev=>[...prev.slice(-8),{msg,color,id:Date.now()+Math.random()}]);

  const runCode = async () => {
    setResult("running"); setTestResults([]); setJudgeError(null);
    setAttempts(a=>a+1);
    let passed=false, newTestResults=[];

    try {
      if (selectedLang === "javascript") {
        passed = floor.validate(code);
        newTestResults = (floor.testCases||[]).map((tc,i)=>{
          try {
            const fn = new Function(`${code}; return ${floor.functionName||"solution"};`)();
            const input = Array.isArray(tc.input)?tc.input:[tc.input];
            const got = fn(...input);
            const ok = JSON.stringify(got)===JSON.stringify(tc.expected);
            return {label:tc.label||`Test ${i+1}`,pass:ok,result:got};
          } catch { return {label:tc.label||`Test ${i+1}`,pass:false,result:"Error"}; }
        });
      } else {
        setResult("judging");
        addLog(`⏳ Sending to Judge0...`,"#888");
        const jr = await runWithJudge0(code, selectedLang, floor.testCases||[], floor.functionName||"solution");
        if (jr.usedFallback || jr.error==="JUDGE0_NOT_CONFIGURED") {
          addLog("⚠️ Judge0 unavailable — using logic validation","#f59e0b");
          setJudgeError("Judge0 not configured. Add JUDGE0_API_KEY to backend .env");
          passed = validatePseudoCode(code, floor.id, selectedLang);
        } else if (jr.error) {
          addLog(`❌ ${jr.error}`,"#f87171");
          setJudgeError(jr.error);
          passed = validatePseudoCode(code, floor.id, selectedLang);
        } else {
          passed = jr.passed;
          newTestResults = jr.testResults||[];
        }
      }
    } catch(err) { passed=false; setJudgeError(err.message); }

    setTestResults(newTestResults);

    if (passed) {
      setResult("pass");
      setIsAttacking(true); setTimeout(()=>setIsAttacking(false),500);
      const dmg=Math.floor(Math.random()*2)+2;
      const newMonHp=Math.max(0,monsterHp-dmg);
      setMonsterHp(newMonHp); setIsShaking(true); setTimeout(()=>setIsShaking(false),400);
      addLog(`✅ Correct! You deal ${dmg} damage!`,"#86efac");
      if(newMonHp<=0){ addLog(`💀 ${monsterData.name} defeated!`,"#ffd700"); setTimeout(()=>setPhase("victory"),1000); }
    } else {
      setResult("fail");
      const dmg=Math.floor(Math.random()*2)+1;
      const newPlayerHp=Math.max(0,playerHp-dmg); setPlayerHp(newPlayerHp);
      const newLives=lives-1; setLives(newLives);
      addLog(`❌ Wrong! ${monsterData.name} deals ${dmg} damage! (${newLives} lives left)`,"#ff6666");
      if(newLives<=0){ addLog("💀 You have been defeated!","#ff4444"); setTimeout(()=>setPhase("defeat"),1000); }
    }
  };

  const accent=world.theme.primary;

  if (phase==="dialogue") {
    const isDone=dialogueLine>=monsterData.dialogue.length-1;
    return (
      <div style={sc.scene}>
        <div style={sc.hdr}><button style={sc.back} onClick={onBack}>← Retreat</button><span style={{color:"#333",fontSize:"0.78rem"}}>{world.emoji} {world.name}</span></div>
        <Arena playerHp={playerHp} playerMaxHp={10} isAttacking={false} monsterHp={monsterHp} monsterMaxHp={monsterData.maxHp} monster={monsterData} isShaking={false} isDefeated={false} lives={lives} accent={accent}/>
        <div style={sc.dlgBox}>
          <div style={{color:"#ff4444",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.88rem"}}>{monsterData.emoji} {monsterData.name}</div>
          <div style={{minHeight:"48px",color:"#e8d5a3",lineHeight:"1.6",fontSize:"0.9rem"}}>{monsterData.dialogue[dialogueLine]}</div>
          <button style={sc.dlgBtn} onClick={()=>isDone?setPhase("battle"):setDialogueLine(d=>d+1)}>{isDone?"⚔️ FIGHT!":"Continue ▶"}</button>
        </div>
      </div>
    );
  }

  if (phase==="victory") return (
    <div style={sc.scene}>
      <div style={sc.result}>
        <div style={{fontSize:"4rem"}}>🎉</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.8rem",color:accent}}>{monsterData.isBoss?"🏆 MASTERY CONQUERED!":"⚔️ VICTORY!"}</div>
        <div style={{color:"#666",fontSize:"0.88rem"}}>{monsterData.name} defeated in {attempts} attempt{attempts!==1?"s":""}!</div>
        <div style={{background:"rgba(255,215,0,0.05)",border:"1px solid #ffd70022",borderRadius:"6px",padding:"0.8rem 1.8rem",textAlign:"center"}}>
          <div style={{color:"#555",fontSize:"0.7rem",letterSpacing:"0.15em",marginBottom:"0.4rem"}}>REWARD</div>
          <div style={{color:"#ffd700",fontSize:"1rem",fontWeight:"bold"}}>🏆 {monsterData.reward}</div>
        </div>
        <button style={{...sc.actionBtn,background:"#166534"}} onClick={onVictory}>Continue →</button>
      </div>
    </div>
  );

  if (phase==="defeat") return (
    <div style={sc.scene}>
      <div style={sc.result}>
        <div style={{fontSize:"4rem"}}>💀</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.8rem",color:"#ff4444"}}>DEFEATED</div>
        <div style={{color:"#666",fontSize:"0.88rem"}}>{monsterData.name} overwhelmed you after {attempts} attempts.</div>
        <div style={{color:"#555",fontSize:"0.82rem",maxWidth:"380px",lineHeight:"1.6",textAlign:"center",fontStyle:"italic"}}>"Study the test cases and try again, warrior."</div>
        <button style={{...sc.actionBtn,background:"#7f1d1d"}} onClick={onDefeat}>↺ Retry Floor</button>
      </div>
    </div>
  );

  const isRunning=result==="running"||result==="judging";
  return (
    <div style={sc.scene}>
      <div style={sc.hdr}><button style={sc.back} onClick={onBack}>← Retreat</button><span style={{color:"#333",fontSize:"0.78rem"}}>{world.emoji} {world.name}</span></div>
      <Arena playerHp={playerHp} playerMaxHp={10} isAttacking={isAttacking} monsterHp={monsterHp} monsterMaxHp={monsterData.maxHp} monster={monsterData} isShaking={isShaking} isDefeated={monsterHp<=0} lives={lives} accent={accent}/>

      <div style={sc.log} ref={logRef}>
        {battleLog.length===0?<span style={{color:"#1a1a2e",fontSize:"0.78rem"}}>Battle log...</span>
          :battleLog.map(e=><div key={e.id} style={{color:e.color,fontSize:"0.8rem",animation:"fadeUp 0.3s ease-out"}}>{e.msg}</div>)}
      </div>

      <div style={{...sc.challenge,borderColor:monsterData.isBoss?"#ffd700":accent}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.5rem"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.95rem",color:monsterData.isBoss?"#ffd700":accent}}>
            {monsterData.isBoss?"🔥 ":"⚡ "}{floor.title}
          </div>
          <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap"}}>
            {Object.values(LANGUAGES).map(lang=>(
              <button key={lang.id} style={{border:"1px solid",borderColor:selectedLang===lang.id?lang.color:"#111",color:selectedLang===lang.id?lang.color:"#333",background:selectedLang===lang.id?`${lang.color}18`:"transparent",padding:"0.18rem 0.45rem",borderRadius:"20px",fontSize:"0.7rem",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}
                onClick={()=>setSelectedLang(lang.id)}>
                {lang.emoji} {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:"#030308",border:"1px solid #0d0d14",borderRadius:"3px",padding:"0.3rem 0.5rem",fontSize:"0.75rem"}}>
          <span style={{color:LANGUAGES[selectedLang].color}}>{LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}:</span>
          <span style={{color:"#444",marginLeft:"0.4rem"}}>{LANGUAGES[selectedLang].note}</span>
        </div>

        {monsterData.isBoss&&<div style={{background:"rgba(255,68,0,0.06)",border:"1px solid #2a0a00",borderRadius:"4px",padding:"0.4rem 0.6rem",color:"#ff6633",fontSize:"0.8rem"}}>🔥 MASTERY FORGE — Use everything you've learned!</div>}
        <div style={{color:"#bbb",fontSize:"0.87rem",lineHeight:"1.65",whiteSpace:"pre-line"}}>{floor.challenge||floor.description}</div>
        {floor.hint&&<details style={{background:"#030308",border:"1px solid #0d0d14",borderRadius:"4px",padding:"0.45rem 0.6rem"}}>
          <summary style={{cursor:"pointer",color:"#444",fontSize:"0.8rem",userSelect:"none"}}>💡 Show Hint</summary>
          <div style={{marginTop:"0.4rem",color:"#666",fontSize:"0.82rem",lineHeight:"1.5"}}>{floor.hint}</div>
        </details>}
        {(floor.testDisplay||[]).length>0&&<div style={{display:"flex",flexDirection:"column",gap:"0.2rem"}}>
          {(floor.testDisplay||[]).slice(0,4).map((t,i)=><div key={i} style={{fontSize:"0.75rem",color:"#2a2a3a"}}>→ {t}</div>)}
        </div>}
      </div>

      <div style={{border:"1px solid #0d0d18",borderRadius:"6px",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.45rem 0.75rem",background:"#050510",borderBottom:"1px solid #0d0d18"}}>
          <span style={{color:LANGUAGES[selectedLang].color,fontSize:"0.8rem"}}>{LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].name}</span>
          <div style={{display:"flex",gap:"0.4rem"}}>
            <button style={{background:"transparent",border:"1px solid #111",color:"#444",padding:"0.2rem 0.5rem",cursor:"pointer",borderRadius:"3px",fontSize:"0.75rem",fontFamily:"'JetBrains Mono',monospace"}}
              onClick={()=>{setCode(floor.starterCodes?.[selectedLang]||floor.starterCode||"");setResult(null);setTestResults([]);}}>↺</button>
            <button style={{border:"none",color:"#fff",padding:"0.25rem 1rem",borderRadius:"3px",fontSize:"0.82rem",fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:isRunning?"not-allowed":"pointer",
              background:isRunning?"#1a1a2a":result==="pass"?"#14532d":result==="fail"?"#7f1d1d":"#1e3a5f"}}
              onClick={runCode} disabled={isRunning||lives<=0}>
              {result==="running"?"⏳ Running...":result==="judging"?"⏳ Judge0...":"▶ Strike!"}
            </button>
          </div>
        </div>
        <textarea style={{width:"100%",minHeight:"155px",background:"#020205",border:"none",padding:"0.75rem",fontSize:"0.85rem",lineHeight:"1.7",fontFamily:"'JetBrains Mono',monospace",resize:"vertical",outline:"none",color:LANGUAGES[selectedLang].monoColor}}
          value={code} onChange={e=>{setCode(e.target.value);setResult(null);setTestResults([]);}} spellCheck={false} disabled={isRunning}/>
      </div>

      {judgeError&&judgeError!=="JUDGE0_NOT_CONFIGURED"&&(
        <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid #78350f",borderRadius:"4px",padding:"0.4rem 0.6rem",color:"#f59e0b",fontSize:"0.78rem"}}>⚠️ {judgeError}</div>
      )}
      <TestResultsPanel testResults={testResults}/>
      {result==="pass"&&monsterHp>0&&<div style={{background:"rgba(34,197,94,0.07)",border:"1px solid #14532d",borderRadius:"4px",padding:"0.55rem 0.75rem",color:"#86efac",fontWeight:"bold",fontSize:"0.85rem"}}>✅ Hit! Monster HP: {monsterHp}/{monsterData.maxHp} — Keep attacking!</div>}
      {result==="fail"&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid #7f1d1d",borderRadius:"4px",padding:"0.55rem 0.75rem",color:"#fca5a5",fontWeight:"bold",fontSize:"0.85rem"}}>❌ Miss! Monster strikes back. Lives: {"❤️".repeat(lives)}</div>}
    </div>
  );
}

function Arena({playerHp,playerMaxHp,isAttacking,monsterHp,monsterMaxHp,monster,isShaking,isDefeated,lives,accent}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"1rem",background:"linear-gradient(180deg,#080512 0%,#040208 100%)",border:"1px solid #0d0d14",borderRadius:"8px",padding:"1.2rem 1.5rem"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"}}>
        <div style={{fontSize:"0.68rem",letterSpacing:"0.12em",color:"#222",marginBottom:"0.4rem"}}>YOU</div>
        <PlayerSprite isAttacking={isAttacking} hp={playerHp} maxHp={playerMaxHp}/>
        <HPBar current={playerHp} max={playerMaxHp} color="#22c55e" label="Your HP"/>
        <LivesDisplay lives={lives}/>
      </div>
      <div style={{color:"#111",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.2rem"}}>VS</div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"}}>
        <div style={{fontSize:"0.68rem",letterSpacing:"0.12em",color:accent,marginBottom:"0.4rem"}}>{monster.name}</div>
        <MonsterSprite monster={monster} isShaking={isShaking} isDefeated={isDefeated}/>
        <HPBar current={monsterHp} max={monsterMaxHp} color={accent} label="Monster HP"/>
      </div>
    </div>
  );
}

const sc={
  scene:{width:"100%",maxWidth:"780px",display:"flex",flexDirection:"column",gap:"0.7rem",paddingBottom:"2rem",animation:"fadeUp 0.4s ease-out"},
  hdr:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  back:{background:"transparent",border:"1px solid #111",color:"#444",padding:"0.3rem 0.65rem",borderRadius:"4px",cursor:"pointer",fontSize:"0.78rem",fontFamily:"'JetBrains Mono',monospace"},
  log:{background:"#030306",border:"1px solid #0a0a12",borderRadius:"5px",padding:"0.5rem 0.75rem",height:"72px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"0.15rem"},
  challenge:{border:"1px solid",borderRadius:"6px",padding:"1rem",background:"#060610",display:"flex",flexDirection:"column",gap:"0.6rem"},
  dlgBox:{background:"#060610",border:"1px solid #1a0a00",borderRadius:"8px",padding:"1.2rem",display:"flex",flexDirection:"column",gap:"0.75rem"},
  dlgBtn:{alignSelf:"flex-end",background:"#7f1d1d",border:"none",color:"#fff",padding:"0.4rem 1rem",cursor:"pointer",borderRadius:"4px",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.82rem"},
  result:{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.2rem",padding:"3rem 2rem",textAlign:"center",animation:"fadeUp 0.5s ease-out",minHeight:"60vh",justifyContent:"center"},
  actionBtn:{border:"none",color:"#fff",padding:"0.75rem 2rem",borderRadius:"6px",fontSize:"0.95rem",fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",marginTop:"0.5rem"},
};
