import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pool, init } from '../../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET(r: NextRequest) {
  await init();
  const uid = r.nextUrl.searchParams.get('uid') || '';
  const { rows } = await pool.query('SELECT mood,body,followup FROM journal WHERE uid=$1 ORDER BY id DESC LIMIT 10', [uid]);
  return NextResponse.json(rows);
}
export async function POST(r: NextRequest) {
  await init();
  const { uid, mood, body } = await r.json();
  let followup = 'What is one small thing within your control right now?';
  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' });
      const c: any = await ai.chat.completions.create({
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
        max_tokens: 800,
        messages: [
          { role: 'system', content: 'You are a warm emotional-intelligence coach. Reply with ONE short reflective follow-up question. Never give medical advice.' },
          { role: 'user', content: `Mood: ${mood}. Journal: ${body}` },
        ],
      } as any);
      followup = c.choices[0].message.content || followup;
    }
  } catch (e) { console.error('AI error:', e); }
  await pool.query('INSERT INTO journal(uid,mood,body,followup) VALUES($1,$2,$3,$4)', [uid, mood, body, followup]);
  return NextResponse.json({ followup });
}