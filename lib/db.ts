import { Pool } from 'pg';
const g = globalThis as any;
const url = process.env.DATABASE_URL || '';
export const pool: Pool = g.pool ?? (g.pool = new Pool({
  connectionString: url,
  ssl: url.includes('localhost') ? false : { rejectUnauthorized: false },
}));
export async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS scores(uid text, dim text, pts int DEFAULT 0, PRIMARY KEY(uid,dim));
  CREATE TABLE IF NOT EXISTS journal(id serial PRIMARY KEY, uid text, mood text, body text, followup text, at timestamptz DEFAULT now());`);
}