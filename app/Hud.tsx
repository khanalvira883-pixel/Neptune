'use client';
import { useEffect, useState } from 'react';
const OK = ['Nailed it!', 'Big brain!', 'Brilliant!', 'You are on fire!'];
const NO = ['Good try!', 'Learning counts!', 'Almost there!'];
function boom() {
  const E = ['🎉', '✨', '⭐', '💜', '🌸'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.textContent = E[i % 5]; s.className = 'confetti';
    s.style.left = 30 + Math.random() * 40 + 'vw';
    s.style.setProperty('--dx', Math.random() * 60 - 30 + 'vw');
    s.style.animationDelay = Math.random() * 0.2 + 's';
    document.body.appendChild(s); setTimeout(() => s.remove(), 1800);
  }
}
export default function Hud() {
  const [xp, setXp] = useState(0), [streak, setStreak] = useState(0), [msg, setMsg] = useState(''), [pop, setPop] = useState(0);
  useEffect(() => {
    try { setStreak(+(localStorage.getItem('streak') || 0)); } catch {}
    const u = localStorage.getItem('uid');
  if (u) fetch('/api/progress?uid=' + u).then((r) => r.json()).then((x: any) => { if (x && !x.error) setXp((Object.values(x) as any[]).reduce((a: number, b: any) => a + Number(b), 0) as number); }).catch(() => {});  const on = (e: any) => {
      const p = e.detail || 0;
      setXp((x) => x + p); setPop(p); setTimeout(() => setPop(0), 900);
      const t = new Date().toDateString(), l = localStorage.getItem('lastDay');
      if (l !== t) {
        const y = new Date(Date.now() - 864e5).toDateString();
        const s = (l === y ? +(localStorage.getItem('streak') || 0) : 0) + 1;
        localStorage.setItem('streak', String(s)); localStorage.setItem('lastDay', t); setStreak(s);
      }
      const a = p >= 3 ? OK : NO; setMsg(a[Math.floor(Math.random() * a.length)]); setTimeout(() => setMsg(''), 2200);
      if (p >= 3) boom();
    };
    addEventListener('xp', on);
    return () => removeEventListener('xp', on);
  }, []);
  const lvl = Math.floor(xp / 20) + 1, pct = ((xp % 20) / 20) * 100;
  return <>
    <div className="hud">
      <span className="chip">⭐ Level {lvl}</span>
      <div className="bar"><i style={{ width: pct + '%' }} /></div>
      <span className="chip">{xp} XP{pop ? <b className="pop"> +{pop}</b> : null}</span>
      <span className="chip">🔥 {streak} day streak</span>
    </div>
    {msg && <div className="mascot"><span>🪐</span><p>{msg}</p></div>}
  </>;
}