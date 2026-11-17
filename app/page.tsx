'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lab from './Lab';
import Hud from './Hud';

const D = ['EQ','Critical','Creativity','Memory','Observation','Social','Logic','Language','Focus','Curiosity','Speaking'];
const TH: any = { obsidian: 'Obsidian Moonlight', siena: 'Siena Afternoon', neon: 'Neon Meridian', forest: 'Emerald Forest', dawn: 'Crimson Dawn' };
const CH: any = { obsidian: [110,164.8,220], siena: [130.8,164.8,196], neon: [98,146.8,196], forest: [87.3,130.8,196], dawn: [110,138.6,164.8] };
const CARDS: any[] = [
  ['EQ','A friend cancels at the last minute. Best first move?',['Pretend nothing happened','Ask what is going on and listen','Cancel on them next time'],1,'Curiosity before judgement keeps trust.'],
  ['Critical','“Everyone buys it, so it must be good.” This is a…',['Bandwagon fallacy','Strong proof','Statistic'],0,'Popularity is not evidence.'],
  ['Creativity','Which habit boosts creative ideas most?',['Copy the first idea','Combine unrelated ideas','Avoid all limits'],1,'Novelty comes from unexpected combinations.'],
  ['Memory','A memory palace links facts to…',['Random numbers','Familiar places','Only colours'],1,'We remember places better than lists.'],
  ['Observation','A sharp observer first…',['Jumps to conclusions','Notices details','Ignores small things'],1,'Details first, theories second.'],
  ['Social','Active listening includes…',['Planning your reply','Paraphrasing what you heard','Checking your phone'],1,'Paraphrasing shows you understood.'],
  ['Logic','All birds have wings. A penguin is a bird. So…',['It has wings','It can fly','Wings mean flying'],0,'Deduction follows from the premises.'],
  ['Language','“Brevity is the soul of wit” means…',['Long speeches are clever','Concise speech shows intelligence','Jokes must be loud'],1,'Fewer words, more meaning.'],
  ['Focus','Best for deep focus?',['Single-tasking in timed blocks','Switching apps often','Notifications on'],0,'Task-switching costs attention.'],
  ['Speaking','Best fix for “um” and “uh”?',['Speak faster','Pause silently','Speak louder'],1,'A pause sounds confident.'],
];

function Stream({ add }: any) {
  const [done, setDone] = useState<any>({});
  return <>{CARDS.map((c, i) => (
    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-4 rounded-2xl bg-bg2 p-5">
      <span className="text-sm text-ac">{c[0]}</span>
      <h3 className="my-1 text-lg">{c[1]}</h3>
      {c[2].map((o: string, j: number) => (
        <button key={j} disabled={done[i] !== undefined} onClick={() => { setDone({ ...done, [i]: j }); add(c[0], j === c[3] ? 3 : 1); }}
          className={'my-1 block w-full rounded-xl border px-3 py-2 text-left ' + (done[i] === undefined ? 'border-mu hover:border-ac' : j === c[3] ? 'border-green-400 bg-green-900' : j === done[i] ? 'border-red-400 bg-red-900' : 'border-mu opacity-60')}>{o}</button>
      ))}
      {done[i] !== undefined && <p className="mt-2 text-sm text-mu">{c[4]}</p>}
    </motion.div>))}</>;
}

function Mem({ add }: any) {
  const [a] = useState(() => Array.from('🌙🔥🌊🌿⭐🎧').flatMap((x) => [x, x]).sort(() => Math.random() - 0.5));
  const [op, setOp] = useState<number[]>([]), [ok, setOk] = useState<number[]>([]), [mv, setMv] = useState(0);
  const flip = (i: number) => {
    if (op.length > 1 || op.includes(i) || ok.includes(i)) return;
    const n = [...op, i]; setOp(n);
    if (n.length == 2) {
      setMv(mv + 1);
      if (a[n[0]] == a[n[1]]) { const k = [...ok, ...n]; setOk(k); setOp([]); if (k.length == 12) add('Memory', mv < 10 ? 6 : 4); }
      else setTimeout(() => setOp([]), 700);
    }
  };
  return <div><p>Moves: {mv}</p><div className="grid grid-cols-4 gap-2">{a.map((x, i) => <button key={i} onClick={() => flip(i)} className="aspect-square rounded-xl bg-bg2 text-3xl">{op.includes(i) || ok.includes(i) ? x : '?'}</button>)}</div></div>;
}

function Odd({ add }: any) {
  const [r, setR] = useState(0), [s, setS] = useState(0), [o, setO] = useState(() => Math.floor(Math.random() * 36));
  if (r == 4) return <p>Score {s}/4</p>;
  const pick = (i: number) => { const ns = s + (i == o ? 1 : 0); setS(ns); setR(r + 1); setO(Math.floor(Math.random() * 36)); if (r == 3) add('Observation', ns + 1); };
  return <div><p>Round {r + 1}/4: tap the different one</p><div className="grid grid-cols-6 gap-1">{Array.from({ length: 36 }, (_, i) => <button key={i} onClick={() => pick(i)} className="aspect-square rounded bg-bg2 text-xl">{i == o ? '🙃' : '🙂'}</button>)}</div></div>;
}

function Seq({ add }: any) {
  const mk = () => { const a = 1 + Math.floor(Math.random() * 8), d = 2 + Math.floor(Math.random() * 5); return Array.from({ length: 5 }, (_, i) => a + d * i); };
  const [q, setQ] = useState(mk), [v, setV] = useState(''), [r, setR] = useState(0), [s, setS] = useState(0);
  if (r == 4) return <p>Score {s}/4</p>;
  return <div><p className="mb-2">{q.slice(0, 4).join(', ')}, ?</p><input value={v} onChange={(e) => setV(e.target.value)} className="rounded bg-bg2 p-2" />{' '}
    <button className="rounded bg-ac px-3 py-2 text-bg" onClick={() => { const ns = s + (+v == q[4] ? 1 : 0); setS(ns); setR(r + 1); setV(''); setQ(mk()); if (r == 3) add('Logic', ns + 1); }}>Check</button></div>;
}

function Mood({ uid, add }: any) {
  const [m, setM] = useState(''), [b, setB] = useState(''), [f, setF] = useState(''), [h, setH] = useState<any[]>([]), [ld, setLd] = useState(false);
  const load = () => uid && fetch('/api/journal?uid=' + uid).then((r) => r.json()).then((x) => Array.isArray(x) && setH(x)).catch(() => {});
  useEffect(() => { load(); }, [uid]);
  const save = async () => {
    if (!m) return; setLd(true);
    const r = await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, mood: m, body: b }) }).then((r) => r.json());
    setF(r.followup); setB(''); setLd(false); add('EQ', 2); load();
  };
  return <div><h3 className="mb-2 text-xl">How is your emotional weather?</h3>
    <div className="grid grid-cols-3 gap-2">{['😊 Joyful','😌 Calm','😰 Anxious','😢 Sad','😠 Angry','😴 Drained'].map((x) => <button key={x} onClick={() => setM(x)} className={'rounded-xl border p-3 ' + (m == x ? 'border-ac bg-bg2' : 'border-mu')}>{x}</button>)}</div>
    <textarea value={b} onChange={(e) => setB(e.target.value)} rows={4} placeholder="Write freely…" className="my-3 w-full rounded-xl bg-bg2 p-3" />
    <button onClick={save} className="rounded-full bg-ac px-5 py-2 font-semibold text-bg">{ld ? 'Thinking…' : 'Save and reflect'}</button>
    {f && <p className="my-3 rounded-xl bg-bg2 p-3 text-ac">{f}</p>}
    {h.map((x, i) => <p key={i} className="mt-2 text-sm text-mu">{x.mood}: {x.body}</p>)}</div>;
}

function Radar({ sc }: any) {
  const mx = Math.max(15, ...D.map((d) => sc[d] || 0));
  const pt = (i: number, v: number) => { const a = (i / 11) * 2 * Math.PI - Math.PI / 2; return [150 + 110 * v * Math.cos(a), 150 + 110 * v * Math.sin(a)]; };
  return <svg viewBox="-20 0 340 300" className="mx-auto w-full max-w-md">
    {[0.25, 0.5, 0.75, 1].map((v) => <polygon key={v} points={D.map((_, i) => pt(i, v).join(',')).join(' ')} fill="none" stroke="var(--mu)" opacity=".4" />)}
    {D.map((d, i) => { const [x, y] = pt(i, 1.17); return <text key={d} x={x} y={y} textAnchor="middle" fontSize="9" fill="var(--tx)">{d}</text>; })}
    <polygon points={D.map((d, i) => pt(i, (sc[d] || 0) / mx).join(',')).join(' ')} fill="var(--ac)" fillOpacity=".3" stroke="var(--ac)" strokeWidth="2" /></svg>;
}

export default function Home() {
  const [t, setT] = useState('obsidian'), [tab, setTab] = useState('Stream'), [sc, setSc] = useState<any>({}), [uid, setUid] = useState(''), [music, setMusic] = useState(false), [g, setG] = useState(0);
  useEffect(() => {
    let u = localStorage.getItem('uid'); if (!u) { u = crypto.randomUUID(); localStorage.setItem('uid', u); }
    setUid(u); setT(localStorage.getItem('t') || 'obsidian');
    fetch('/api/progress?uid=' + u).then((r) => r.json()).then((x) => x && !x.error && setSc(x)).catch(() => {});
  }, []);
  useEffect(() => { document.documentElement.dataset.t = t; localStorage.setItem('t', t); }, [t]);
  useEffect(() => {
    if (!music) return;
    const ac = new AudioContext(), m = ac.createGain(); m.gain.value = 0.1; m.connect(ac.destination);
    const os = CH[t].map((f: number) => { const o = ac.createOscillator(); o.frequency.value = f; o.connect(m); o.start(); return o; });
    let bpm = 60, ly = scrollY, tm: any;
    const onS = () => { bpm = Math.min(120, bpm + Math.abs(scrollY - ly) / 8); ly = scrollY; };
    addEventListener('scroll', onS);
    const beat = () => { const o = ac.createOscillator(), gn = ac.createGain(), n = ac.currentTime; o.frequency.value = CH[t][0] * 4; gn.gain.setValueAtTime(0.001, n); gn.gain.exponentialRampToValueAtTime(0.2, n + 0.02); gn.gain.exponentialRampToValueAtTime(0.001, n + 0.6); o.connect(gn); gn.connect(m); o.start(); o.stop(n + 0.7); bpm = Math.max(50, bpm - 1); tm = setTimeout(beat, 60000 / bpm); };
    beat();
    return () => { clearTimeout(tm); removeEventListener('scroll', onS); os.forEach((o: any) => o.stop()); ac.close(); };
  }, [music, t]);
  const add = (dim: string, pts: number) => {
    window.dispatchEvent(new CustomEvent('xp', { detail: pts }));
    setSc((s: any) => ({ ...s, [dim]: (s[dim] || 0) + pts }));
    fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, dim, pts }) }).catch(() => {});
  };
  const games = [['Memory Match', <Mem key="m" add={add} />], ['Odd One Out', <Odd key="o" add={add} />], ['Number Sequence', <Seq key="s" add={add} />]];
  return <main className="mx-auto max-w-2xl px-4 pb-20">
    <header className="flex flex-wrap items-center justify-between gap-3 py-5">
      <h1 className="text-4xl tracking-[.3em] text-ac">NEPTUNE</h1>
      <div className="flex gap-2">
        <select value={t} onChange={(e) => setT(e.target.value)} className="rounded-lg bg-bg2 p-2">{Object.keys(TH).map((k) => <option key={k} value={k}>{TH[k]}</option>)}</select>
        <button onClick={() => setMusic(!music)} className="rounded-lg bg-ac px-3 text-bg">{music ? 'Music on' : 'Music off'}</button>
      </div>
    </header>
    <Hud />
    <nav className="sticky top-0 z-10 flex gap-2 bg-bg py-2">{['Stream','Games','AI Lab','Mood','Constellation'].map((x) => <button key={x} onClick={() => setTab(x)} className={'flex-1 rounded-full border px-2 py-2 ' + (tab == x ? 'border-ac bg-ac text-bg' : 'border-mu')}>{x}</button>)}</nav>
    <section className="mt-4">
      {tab == 'Stream' && <Stream add={add} />}
      {tab == 'Games' && <div><div className="mb-4 flex flex-wrap gap-2">{games.map((x: any, i) => <button key={i} onClick={() => setG(i)} className={'rounded-xl border px-3 py-2 ' + (g == i ? 'border-ac bg-bg2' : 'border-mu')}>{x[0]}</button>)}</div><div key={g}>{games[g][1]}</div></div>}
      {tab == 'Mood' && <Mood uid={uid} add={add} />}
      {tab == 'AI Lab' && <Lab add={add} />}
      {tab == 'Constellation' && <div><h3 className="mb-2 text-xl">Your Cognitive Constellation</h3><Radar sc={sc} /><p className="mt-2 text-center text-mu">Total points: {D.reduce((a, d) => a + (sc[d] || 0), 0)}</p></div>}
    </section>
  </main>;
}