import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { hostname, path, referrer, screen, language } = body;

    if (!hostname) {
      return new Response(JSON.stringify({ error: 'hostname required' }), { status: 400 });
    }

    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const hourKey = now.toISOString().slice(0, 13);  // YYYY-MM-DDTHH
    // Normalize Vercel preview hostnames:
    // "myapp-abc123-gewenbo888s-projects.vercel.app" → "myapp"
    // "myapp.vercel.app" → "myapp"
    let project = hostname.replace(/\.vercel\.app$/, '');
    // Catch-all: strip anything ending with "-gewenbo888s-projects" (covers all preview patterns)
    project = project.replace(/-[a-z0-9]+-gewenbo888s-projects$/, '');
    // Also strip just the team suffix if present
    project = project.replace(/-gewenbo888s-projects$/, '');
    // Catch deploy prefix patterns
    project = project.replace(/-deploy-.*$/, '');
    project = project.replace(/[^a-zA-Z0-9-]/g, '_');

    // Use pipeline for atomic multi-command
    const pipe = kv.pipeline();

    // Track this project in the global set
    pipe.sadd('projects', project);

    // Increment total pageviews
    pipe.hincrby(`pv:${project}`, 'total', 1);

    // Daily pageviews
    pipe.hincrby(`pv:${project}:daily`, dateKey, 1);

    // Hourly (for last 48h sparkline)
    pipe.hincrby(`pv:${project}:hourly`, hourKey, 1);

    // Page path counts
    if (path) {
      pipe.hincrby(`pages:${project}`, path, 1);
    }

    // Referrer tracking
    if (referrer) {
      try {
        const refHost = new URL(referrer).hostname || 'direct';
        pipe.hincrby(`ref:${project}`, refHost, 1);
      } catch {
        pipe.hincrby(`ref:${project}`, 'direct', 1);
      }
    } else {
      pipe.hincrby(`ref:${project}`, 'direct', 1);
    }

    // Country from Vercel edge header
    const country = req.headers.get('x-vercel-ip-country') || 'unknown';
    pipe.hincrby(`geo:${project}`, country, 1);

    // Device (simple screen-width heuristic)
    if (screen) {
      const w = parseInt(screen);
      const device = w <= 480 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
      pipe.hincrby(`device:${project}`, device, 1);
    }

    // Browser language
    if (language) {
      const lang = language.slice(0, 2);
      pipe.hincrby(`lang:${project}`, lang, 1);
    }

    // Global daily total (across all projects)
    pipe.hincrby('pv:global:daily', dateKey, 1);

    await pipe.exec();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Collect error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}
