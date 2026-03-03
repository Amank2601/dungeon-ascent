// src/data/levels.js
export const LEVELS = [
  { level:1,  min:0,    title:"Fallen Coder",       badge:"🪨", color:"#555"    },
  { level:2,  min:300,  title:"Syntax Apprentice",  badge:"📜", color:"#888"    },
  { level:3,  min:700,  title:"Loop Runner",        badge:"🌀", color:"#a78bfa" },
  { level:4,  min:1200, title:"Function Knight",    badge:"⚙️", color:"#60a5fa" },
  { level:5,  min:1800, title:"Array Warrior",      badge:"📦", color:"#34d399" },
  { level:6,  min:2600, title:"Algorithm Mage",     badge:"🔮", color:"#f59e0b" },
  { level:7,  min:3600, title:"Logic Warlord",      badge:"⚔️", color:"#f97316" },
  { level:8,  min:5000, title:"Code Architect",     badge:"🏛️", color:"#e879f9" },
  { level:9,  min:7000, title:"Dungeon Master",     badge:"👑", color:"#ffd700" },
  { level:10, min:10000,title:"THE ASCENDED",       badge:"🔥", color:"#ff4444" },
];

export function getLevel(xp = 0) {
  let cur = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) cur = l; else break; }
  const next = LEVELS.find(l => l.level === cur.level + 1) || null;
  const pct  = next ? Math.min(100, Math.round(((xp - cur.min) / (next.min - cur.min)) * 100)) : 100;
  return { ...cur, next, pct, xpToNext: next ? next.min - xp : 0 };
}