import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

// Per-project KV keys (one hash each)
const dataKeys = (p) => [
  `pv:${p}`, `pv:${p}:daily`, `pv:${p}:hourly`,
  `pages:${p}`, `ref:${p}`, `geo:${p}`, `device:${p}`, `lang:${p}`,
];

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);

    // ── Mode: merge dot→underscore-mangled "<name>_psyverse_fun" orphans into
    // their canonical twin "<name>", summing every metric, then drop the orphan.
    // No data is lost — the views just move to the correct project key.
    if (url.searchParams.get('mergeMangled')) {
      const SUFFIX = '_psyverse_fun';
      const projects = await kv.smembers('projects');
      const merged = [];

      for (const p of projects) {
        if (!p.endsWith(SUFFIX)) continue;
        const canon = p.slice(0, -SUFFIX.length);
        const srcKeys = dataKeys(p);
        const dstKeys = dataKeys(canon);

        for (let i = 0; i < srcKeys.length; i++) {
          const h = await kv.hgetall(srcKeys[i]);
          if (h) {
            for (const [field, val] of Object.entries(h)) {
              const n = Number(val);
              if (n) await kv.hincrby(dstKeys[i], field, n);
            }
          }
          await kv.del(srcKeys[i]);
        }
        await kv.srem('projects', p);
        await kv.sadd('projects', canon);
        merged.push({ orphan: p, into: canon });
      }

      const remaining = await kv.smembers('projects');
      return new Response(JSON.stringify({
        mode: 'mergeMangled',
        merged,
        mergedCount: merged.length,
        remainingCount: remaining.length,
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // ── Mode: merge arbitrary "orphan:canonical" pairs (e.g. a bare vercel.app
    // alias key like "taoism-weld" that was logged before its PSYVERSE_MAP/VERCEL_MAP
    // entry shipped). Sums every metric into the canonical key, then drops the orphan.
    // No data is lost. Usage: ?merge=taoism-weld:taoism,five-elements-three:five-elements
    if (url.searchParams.get('merge')) {
      const pairs = url.searchParams.get('merge').split(',')
        .map((s) => s.split(':'))
        .filter(([from, to]) => from && to);
      const merged = [];

      for (const [from, to] of pairs) {
        const srcKeys = dataKeys(from);
        const dstKeys = dataKeys(to);
        for (let i = 0; i < srcKeys.length; i++) {
          const h = await kv.hgetall(srcKeys[i]);
          if (h) {
            for (const [field, val] of Object.entries(h)) {
              const n = Number(val);
              if (n) await kv.hincrby(dstKeys[i], field, n);
            }
          }
          await kv.del(srcKeys[i]);
        }
        await kv.srem('projects', from);
        await kv.sadd('projects', to);
        merged.push({ orphan: from, into: to });
      }

      const remaining = await kv.smembers('projects');
      return new Response(JSON.stringify({
        mode: 'merge',
        merged,
        mergedCount: merged.length,
        remainingCount: remaining.length,
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // ── Default mode: remove Vercel preview-deploy keys, or an explicit ?remove= list.
    const removeList = url.searchParams.get('remove');
    const explicitRemove = removeList ? removeList.split(',') : [];

    const projects = await kv.smembers('projects');
    const removed = [];

    for (const p of projects) {
      if (p.match(/-[a-z0-9]{7,}-.*projects$/) || p.match(/-deploy-/) || explicitRemove.includes(p)) {
        await kv.srem('projects', p);
        for (const key of dataKeys(p)) await kv.del(key);
        removed.push(p);
      }
    }

    const remaining = await kv.smembers('projects');
    return new Response(JSON.stringify({
      removed,
      remaining,
      removedCount: removed.length,
      remainingCount: remaining.length,
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
