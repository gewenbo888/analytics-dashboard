import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

// psyverse.fun subdomains → canonical project keys (matches existing vercel.app-derived keys)
const PSYVERSE_MAP = {
  'psyverse.fun':             'gewenbo-manifesto',
  'manifesto.psyverse.fun':   'gewenbo-manifesto',
  'hub.psyverse.fun':         'gewenbo-hub',
  'links.psyverse.fun':       'gewenbo-links',
  'blog.psyverse.fun':        'gewenbo-blog',
  'store.psyverse.fun':       'gewenbo-store',
  'atlas.psyverse.fun':       'global-atlas-lake',
  'civilizations.psyverse.fun':'civilizations-compared',
  'regions.psyverse.fun':     'three-regions',
  'roads.psyverse.fun':       'three-roads-agi',
  'tao.psyverse.fun':         'tao-science',
  'tech.psyverse.fun':        'emerging-tech-nine',
  'aitools.psyverse.fun':     'ai-tools-guide-henna',
  'insights.psyverse.fun':    'ai-insights-beta',
  'researchers.psyverse.fun': 'chinese-ai-researchers',
  'agi.psyverse.fun':         'agi-research-seven',
  'string.psyverse.fun':      'web-topaz-two-62',
  'evolution.psyverse.fun':   'evolution-ai-six',
  'levels.psyverse.fun':      'tech-levels',
  'brain.psyverse.fun':       'brain-atlas-ten',
  'autoresearch.psyverse.fun':'autoresearch-showcase',
  'prompts.psyverse.fun':     'prompt-vault-two-sooty',
  'wiki.psyverse.fun':        'llm-wiki-snowy',
  'triangle.psyverse.fun':    'impossible-triangle-lemon',
  'names.psyverse.fun':       'chinese-name-gen',
  'island.psyverse.fun':      'island-gun-king',
  'highway.psyverse.fun':     'prototype-indol-five',
  'haplo.psyverse.fun':       'y-haplogroups',
  'quantum.psyverse.fun':     'quantum-crypto-three',
  'dance.psyverse.fun':       'tokendance',
  'gosu.psyverse.fun':        'gosu-yu',
  'libertarian.psyverse.fun': 'libertarian',
  'kol.psyverse.fun':         'crypto-kol',
  'mindseye.psyverse.fun':    'mindseye',
  'cnkol.psyverse.fun':       'chinese-crypto-kols',
  'skills.psyverse.fun':      'skills-showcase',
  'llms.psyverse.fun':        'llm-models',
  'aiapps.psyverse.fun':      'ai-apps-rank',
  'ides.psyverse.fun':        'ides-rank',
  'saas.psyverse.fun':        'saas-rank',
};

// vercel.app aliases that Vercel auto-suffixes (-jade, -mu, etc.) → canonical key.
// Without this, visits to the bare vercel.app URL get logged under the suffixed name
// and the dashboard can't find PROJECT_META. Added retroactively April 2026.
const VERCEL_MAP = {
  'libertarian-jade.vercel.app':       'libertarian',
  'mindseye-kappa.vercel.app':         'mindseye',
  'skills-showcase-livid.vercel.app':  'skills-showcase',
  'llm-models-mu.vercel.app':          'llm-models',
};

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
    // Normalize hostnames to canonical project key.
    // 1) psyverse.fun subdomains → canonical key from PSYVERSE_MAP
    // 2) *.vercel.app → strip .vercel.app + preview/deploy suffixes
    let project;
    if (PSYVERSE_MAP[hostname]) {
      project = PSYVERSE_MAP[hostname];
    } else if (VERCEL_MAP[hostname]) {
      project = VERCEL_MAP[hostname];
    } else {
      project = hostname.replace(/\.vercel\.app$/, '');
      project = project.replace(/-[a-z0-9]+-gewenbo888s-projects$/, '');
      project = project.replace(/-gewenbo888s-projects$/, '');
      project = project.replace(/-deploy-.*$/, '');
      project = project.replace(/[^a-zA-Z0-9-]/g, '_');
    }

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
