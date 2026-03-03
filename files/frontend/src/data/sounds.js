// src/data/sounds.js — Web Audio API, zero file downloads

let _ctx = null;
const getCtx = () => {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
};

const tone = (freq, type, dur, gain, t, slide) => {
  const c = getCtx();
  const o = c.createOscillator(), v = c.createGain();
  o.connect(v); v.connect(c.destination);
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  v.gain.setValueAtTime(gain, t);
  v.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
};

export const SOUNDS = {
  click:    () => { try { const t=getCtx().currentTime; tone(900,"square",0.05,0.07,t); } catch{} },
  whoosh:   () => { try { const t=getCtx().currentTime; tone(400,"sawtooth",0.18,0.1,t,60); } catch{} },
  correct:  () => { try { const t=getCtx().currentTime; [523,659,784].forEach((f,i)=>tone(f,"triangle",0.15,0.16,t+i*0.08)); } catch{} },
  wrong:    () => { try { const t=getCtx().currentTime; tone(220,"sawtooth",0.18,0.12,t); setTimeout(()=>{ try{tone(160,"sawtooth",0.2,0.1,getCtx().currentTime);}catch{}},100); } catch{} },
  victory:  () => { try { const t=getCtx().currentTime; [523,659,784,1047].forEach((f,i)=>tone(f,"triangle",0.18,0.18,t+i*0.1)); tone(1047,"sine",0.5,0.2,t+0.45); } catch{} },
  defeat:   () => { try { const t=getCtx().currentTime; [400,300,200].forEach((f,i)=>tone(f,"sawtooth",0.3,0.13,t+i*0.15)); } catch{} },
  levelUp:  () => { try { const t=getCtx().currentTime; [261,329,392,523,659,784,1047].forEach((f,i)=>tone(f,"sine",0.15,0.2,t+i*0.07)); } catch{} },
  xpGain:   () => { try { const t=getCtx().currentTime; tone(880,"sine",0.07,0.09,t); tone(1100,"sine",0.1,0.09,t+0.06); } catch{} },
  storyBeat:() => { try { const t=getCtx().currentTime; tone(80,"sine",1.2,0.12,t); tone(120,"sine",0.4,0.06,t+0.1); } catch{} },
  betrayal: () => { try { const t=getCtx().currentTime; [440,370,277,185].forEach((f,i)=>tone(f,"sawtooth",0.12,0.13,t+i*0.12)); } catch{} },
  daily:    () => { try { const t=getCtx().currentTime; [659,784,1047].forEach((f,i)=>tone(f,"triangle",0.2,0.18,t+i*0.09)); } catch{} },
};

export const playSound = (name) => { try { SOUNDS[name]?.(); } catch {} };