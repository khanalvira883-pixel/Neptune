import { NextRequest, NextResponse } from 'next/server';
import { pool, init } from '../../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET(r: NextRequest) {
  await init();
  const uid = r.nextUrl.searchParams.get('uid') || '';
  const { rows } = await pool.query('SELECT dim,pts FROM scores WHERE uid=$1', [uid]);
  return NextResponse.json(Object.fromEntries(rows.map((x) => [x.dim, x.pts])));
}
export async function POST(r: NextRequest) {
  await init();
  const { uid, dim, pts } = await r.json();
  await pool.query('INSERT INTO scores VALUES($1,$2,$3) ON CONFLICT(uid,dim) DO UPDATE SET pts=scores.pts+$3', [uid, dim, pts]);
  return NextResponse.json({ ok: true });
}