import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const project = url.searchParams.get('project');
  const authHeader = url.searchParams.get('key');

  // Simple auth check — set ANALYTICS_KEY env var to protect dashboard
  const expectedKey = process.env.ANALYTICS_KEY;
  if (expectedKey && authHeader !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // If no project specified, return overview of all projects
    if (!project) {
      const projects = await kv.smembers('projects');

      // Batch all reads into one pipeline — N projects used to do 2N
      // sequential round-trips, which timed out the Edge function once
      // we tracked ~200+ sites.
      const pipe = kv.pipeline();
      for (const p of projects) {
        pipe.hgetall(`pv:${p}`);
        pipe.hgetall(`pv:${p}:daily`);
      }
      pipe.hgetall('pv:global:daily');
      const results = await pipe.exec();

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const last7Keys = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Keys.push(d.toISOString().slice(0, 10));
      }

      const overview = projects.map((p, i) => {
        const pvData = results[i * 2] || {};
        const dailyData = results[i * 2 + 1] || {};
        return {
          project: p,
          total: Number(pvData.total || 0),
          today: Number(dailyData[today] || 0),
          yesterday: Number(dailyData[yesterday] || 0),
          last7: last7Keys.map((key) => ({ date: key, views: Number(dailyData[key] || 0) })),
        };
      });

      overview.sort((a, b) => b.total - a.total);

      const globalDaily = results[projects.length * 2] || {};
      const globalLast7 = last7Keys.map((key) => ({
        date: key,
        views: Number(globalDaily[key] || 0),
      }));

      return new Response(JSON.stringify({
        projects: overview,
        globalDaily: globalLast7,
        totalProjects: projects.length,
      }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Detailed stats for a single project
    const [pvData, dailyData, hourlyData, pages, refs, geo, device, lang] = await Promise.all([
      kv.hgetall(`pv:${project}`) || {},
      kv.hgetall(`pv:${project}:daily`) || {},
      kv.hgetall(`pv:${project}:hourly`) || {},
      kv.hgetall(`pages:${project}`) || {},
      kv.hgetall(`ref:${project}`) || {},
      kv.hgetall(`geo:${project}`) || {},
      kv.hgetall(`device:${project}`) || {},
      kv.hgetall(`lang:${project}`) || {},
    ]);

    // Format daily (last 30 days)
    const daily = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, views: Number((dailyData || {})[key] || 0) });
    }

    // Format hourly (last 48 hours)
    const hourly = [];
    for (let i = 47; i >= 0; i--) {
      const d = new Date();
      d.setHours(d.getHours() - i);
      const key = d.toISOString().slice(0, 13);
      hourly.push({ hour: key, views: Number((hourlyData || {})[key] || 0) });
    }

    // Sort pages/refs/geo by count descending
    const sortObj = (obj) => Object.entries(obj || {})
      .map(([k, v]) => ({ name: k, count: Number(v) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const today = new Date().toISOString().slice(0, 10);

    return new Response(JSON.stringify({
      project,
      total: Number((pvData || {}).total || 0),
      today: Number((dailyData || {})[today] || 0),
      daily,
      hourly,
      pages: sortObj(pages),
      referrers: sortObj(refs),
      countries: sortObj(geo),
      devices: sortObj(device),
      languages: sortObj(lang),
    }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (err) {
    console.error('Stats error:', err);
    return new Response(JSON.stringify({ error: 'Internal error', details: err.message }), { status: 500, headers: CORS });
  }
}
