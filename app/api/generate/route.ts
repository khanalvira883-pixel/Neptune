import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { allow } from '../../../lib/rate';
export const dynamic = 'force-dynamic';
const KINDS: any = {
  quick: 'a short multiple-choice question',
  scenario: 'a realistic 3-4 sentence scenario about people, followed by a question about the best response',
  research: 'a deep question based on a real finding or concept from psychology or cognitive science, naming the researcher or concept',
};
const POOL = [
  { text: 'Your teammate snaps at you during a stressful meeting. What is the most emotionally intelligent response?', options: ['Snap back to defend yourself', 'Stay calm and ask what is behind the frustration later in private', 'Ignore them forever', 'Complain to others'], answer: 1, explanation: 'Pausing and addressing it privately separates the emotion from the issue.' },
  { text: 'The anchoring effect (Tversky and Kahneman) means that…', options: ['First numbers we see bias later estimates', 'We forget old numbers', 'We prefer round numbers', 'We ignore prices'], answer: 0, explanation: 'An initial value pulls later judgements towards it.' },
  { text: 'Which question best tests a belief using Socratic questioning?', options: ['Who agrees with you?', 'What evidence would change your mind?', 'Why are you wrong?', 'Is it popular?'], answer: 1, explanation: 'It exposes the foundation of the belief.' },
];
export async function POST(r: NextRequest) {
  const { domain = 'EQ', kind = 'quick', seed = 0, uid = 'anon' } = await r.json();
  const fb = () => NextResponse.json({ ...POOL[Math.floor(Math.random() * POOL.length)], source: 'built-in' });
  try {
    if (!process.env.GEMINI_API_KEY || !(await allow(String(uid)))) return fb();
    const ai = new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' });
    const c: any = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: 'You write learning challenges. Reply with JSON only: {"text":string,"options":[4 strings],"answer":index 0-3,"explanation":string}. No markdown.' },
        { role: 'user', content: `Domain: ${domain}. Write ${KINDS[kind] || KINDS.quick}. Avoid common textbook examples. Variation seed: ${seed}.` },
      ],
    } as any);
    const j = JSON.parse((c.choices[0].message.content || '{}').replace(/```json|```/g, '').trim());
    if (!j.text || !Array.isArray(j.options) || j.options.length < 2 || typeof j.answer !== 'number') return fb();
    return NextResponse.json({ ...j, source: 'gpt' });
  } catch (e) { console.error('AI error:', e); return fb(); }
}