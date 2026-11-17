import Redis from 'ioredis';
const g = globalThis as any;
const rd = process.env.REDIS_URL ? (g.rd ?? (g.rd = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 }))) : null;
export async function allow(k: string, max = 20, ttl = 3600) {
  if (!rd) return true;
  try {
    const n = await rd.incr('gen:' + k);
    if (n == 1) await rd.expire('gen:' + k, ttl);
    return n <= max;
  } catch { return true; }
}