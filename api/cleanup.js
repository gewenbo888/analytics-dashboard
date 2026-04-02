import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405 });
  }

  try {
    const projects = await kv.smembers('projects');
    const removed = [];

    for (const p of projects) {
      // Remove entries that look like Vercel preview deployments
      if (p.match(/-[a-z0-9]{7,}-.*projects$/) || p.match(/-deploy-/)) {
        // Remove from projects set
        await kv.srem('projects', p);

        // Clean up associated keys
        const keys = [
          `pv:${p}`, `pv:${p}:daily`, `pv:${p}:hourly`,
          `pages:${p}`, `ref:${p}`, `geo:${p}`,
          `device:${p}`, `lang:${p}`
        ];
        for (const key of keys) {
          await kv.del(key);
        }
        removed.push(p);
      }
    }

    const remaining = await kv.smembers('projects');

    return new Response(JSON.stringify({
      removed,
      remaining,
      removedCount: removed.length,
      remainingCount: remaining.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
