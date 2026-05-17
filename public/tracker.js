// Analytics + Psyverse Bar — add to any site:
// <script defer src="https://dashboard.psyverse.fun/tracker.js"></script>
(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  //  ANALYTICS
  // ═══════════════════════════════════════════════
  var API = (document.currentScript && document.currentScript.src)
    ? new URL(document.currentScript.src).origin + '/api/collect'
    : '/api/collect';

  function send() {
    var data = {
      hostname: location.hostname,
      path: location.pathname,
      referrer: document.referrer || '',
      screen: String(window.innerWidth),
      language: navigator.language || ''
    };
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API, JSON.stringify(data));
    } else {
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).catch(function() {});
    }
  }

  if (document.readyState === 'complete') send();
  else window.addEventListener('load', send);

  var origPush = history.pushState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    setTimeout(send, 50);
  };
  window.addEventListener('popstate', function() { setTimeout(send, 50); });

  // ═══════════════════════════════════════════════
  //  PSYVERSE BAR
  // ═══════════════════════════════════════════════
  var SKIP_HOSTS = {
    'psyverse.fun': 1,              // manifesto has its own nav
    'dashboard.psyverse.fun': 1,    // admin
    'localhost': 1,
    '127.0.0.1': 1
  };
  if (SKIP_HOSTS[location.hostname] || /\.local$/.test(location.hostname)) return;
  // Honor user opt-out (set localStorage.psyverseBar='off' on any site to hide)
  try { if (localStorage.getItem('psyverseBar') === 'off') return; } catch (e) {}

  var HOSTS = ["16-frontiers.psyverse.fun","agency-genesis.psyverse.fun","agents.psyverse.fun","agi.psyverse.fun","aha.psyverse.fun","ai-replacement-map.psyverse.fun","ai-scientist-lab.psyverse.fun","ai-society-sandbox.psyverse.fun","ai-universe.psyverse.fun","aiapps.psyverse.fun","aitools.psyverse.fun","apes.psyverse.fun","apis.psyverse.fun","architect.psyverse.fun","arena.psyverse.fun","atlas.psyverse.fun","attention.psyverse.fun","attraction-lab.psyverse.fun","autonomous-software-civilization.psyverse.fun","autoresearch.psyverse.fun","av.psyverse.fun","awaken-os.psyverse.fun","beyond-matter.psyverse.fun","beyond-tech.psyverse.fun","blockchain-atlas.psyverse.fun","blog.psyverse.fun","brain-computer-interface-world.psyverse.fun","brain.psyverse.fun","centuries.psyverse.fun","chain.psyverse.fun","chainmind.psyverse.fun","chains.psyverse.fun","chaos-os.psyverse.fun","chaos-simulator.psyverse.fun","china-regional-systems.psyverse.fun","chip-war-atlas.psyverse.fun","chrono-void.psyverse.fun","civilization-kernel.psyverse.fun","civilization-os-infinity.psyverse.fun","civilization-os.psyverse.fun","civilization-stack.psyverse.fun","civilization-tech-tree.psyverse.fun","civilization-tree.psyverse.fun","civilization-waves.psyverse.fun","civilizations.psyverse.fun","civlab-ai-replacement-map.psyverse.fun","civlab.psyverse.fun","civos-civilization-os.psyverse.fun","civos-clan-civilization.psyverse.fun","civos-idea-evolution.psyverse.fun","civos-material-civilization.psyverse.fun","civos.psyverse.fun","civtech.psyverse.fun","clan-civilization.psyverse.fun","clarity-os.psyverse.fun","climate-civilization.psyverse.fun","cnkol.psyverse.fun","coders.psyverse.fun","cognition-gym.psyverse.fun","cognitive-civilization.psyverse.fun","collapse-watch.psyverse.fun","convergence.psyverse.fun","cosmos-to-code.psyverse.fun","creators.psyverse.fun","cryptocivilization.psyverse.fun","cycle-engine.psyverse.fun","dance.psyverse.fun","daofaziran.psyverse.fun","decision-os.psyverse.fun","deep-stack.psyverse.fun","desire-atlas.psyverse.fun","digital-species.psyverse.fun","dongbei-renaissance.psyverse.fun","dream-foundry.psyverse.fun","dream-machine.psyverse.fun","electric-civilization.psyverse.fun","elements-of-civilization.psyverse.fun","emotion-os.psyverse.fun","ethics-engine.psyverse.fun","evolution-of-eyes.psyverse.fun","evolution.psyverse.fun","failure-museum.psyverse.fun","figures.psyverse.fun","five-challenges.psyverse.fun","five-frontiers.psyverse.fun","five-horizons.psyverse.fun","five-worlds.psyverse.fun","four-primitives.psyverse.fun","frontier-garrisons.psyverse.fun","fusion-os.psyverse.fun","future-economy.psyverse.fun","future-energy-dashboard.psyverse.fun","future-materials-database.psyverse.fun","future-simulator.psyverse.fun","ge.psyverse.fun","gear.psyverse.fun","global-materials-graph.psyverse.fun","gosu.psyverse.fun","grassland.psyverse.fun","greatest-ideas.psyverse.fun","haplo.psyverse.fun","happy-crush.psyverse.fun","heat.psyverse.fun","highway.psyverse.fun","how-the-world-works.psyverse.fun","huangqihai-civilization.psyverse.fun","hub.psyverse.fun","human-future-atlas.psyverse.fun","human-memory-project.psyverse.fun","human-os.psyverse.fun","humanity-os.psyverse.fun","humanity-problem-database.psyverse.fun","humanoids.psyverse.fun","idc.psyverse.fun","idea-evolution.psyverse.fun","ideaspace.psyverse.fun","ides.psyverse.fun","imitation-atlas.psyverse.fun","influence-os.psyverse.fun","inner-monologue.psyverse.fun","innovation-engines.psyverse.fun","innovators.psyverse.fun","insights.psyverse.fun","intelligence-network.psyverse.fun","internet-tribes.psyverse.fun","invisible-flows.psyverse.fun","invisible-systems.psyverse.fun","island.psyverse.fun","jin-atlas.psyverse.fun","knowledge-compression-engine.psyverse.fun","knowledge-os.psyverse.fun","kol.psyverse.fun","langbrain.psyverse.fun","last-seen.psyverse.fun","learn.psyverse.fun","ledger.psyverse.fun","levels.psyverse.fun","libertarian.psyverse.fun","life-cinematic.psyverse.fun","life-os.psyverse.fun","links.psyverse.fun","llms.psyverse.fun","manifesto.psyverse.fun","market.psyverse.fun","mask-engine.psyverse.fun","material-civilization.psyverse.fun","meaning.psyverse.fun","memory-atlas.psyverse.fun","meta-civilization.psyverse.fun","mind-arena.psyverse.fun","mind-vs-machine.psyverse.fun","mindatlas.psyverse.fun","mindforge.psyverse.fun","minds.psyverse.fun","mindseye.psyverse.fun","minimum-units.psyverse.fun","mirror-civilizations.psyverse.fun","mirror.psyverse.fun","mountain-merchants.psyverse.fun","names.psyverse.fun","neolithic-world.psyverse.fun","north-rules-south.psyverse.fun","oceanic-civilization.psyverse.fun","omega.psyverse.fun","omnifi.psyverse.fun","org.psyverse.fun","oss.psyverse.fun","pacific-rim-ports.psyverse.fun","parallel-life.psyverse.fun","parenting-os.psyverse.fun","persona-engine.psyverse.fun","planetary-brain.psyverse.fun","privacy.psyverse.fun","prompts.psyverse.fun","psy-civilization.psyverse.fun","psy-killer-apps.psyverse.fun","psy-protocol-spec.psyverse.fun","psy-research.psyverse.fun","psy-spec.psyverse.fun","psy.psyverse.fun","psyverse-os.psyverse.fun","quantum-computing-visualizer.psyverse.fun","quantum.psyverse.fun","read-every-book.psyverse.fun","reality-engine.psyverse.fun","reality-kernel.psyverse.fun","reality-simulation-engine.psyverse.fun","reality-stack.psyverse.fun","reality.psyverse.fun","regions.psyverse.fun","researchers.psyverse.fun","roads.psyverse.fun","robot-civilization-observatory.psyverse.fun","saas.psyverse.fun","sanyuan.psyverse.fun","sauce-civilization.psyverse.fun","seeker.psyverse.fun","self-construction-os.psyverse.fun","selfcraft.psyverse.fun","sensory-os.psyverse.fun","sentience.psyverse.fun","seven-tongues.psyverse.fun","shenzhen-bay.psyverse.fun","shenzhen-velocity.psyverse.fun","signal.psyverse.fun","silicon-ideology.psyverse.fun","sim.psyverse.fun","sinosphere.psyverse.fun","skills.psyverse.fun","social-temperature.psyverse.fun","southward-migration.psyverse.fun","staples.psyverse.fun","states-of-reality.psyverse.fun","steppe-empire.psyverse.fun","store.psyverse.fun","strategy-os.psyverse.fun","string.psyverse.fun","surnames.psyverse.fun","survival-intelligence.psyverse.fun","suyu.psyverse.fun","synthetic-history.psyverse.fun","tao.psyverse.fun","tech-cosmos.psyverse.fun","tech-migration.psyverse.fun","tech.psyverse.fun","techne.psyverse.fun","ten-heavens.psyverse.fun","the-human-library.psyverse.fun","time.psyverse.fun","token-civilization.psyverse.fun","tools.psyverse.fun","triangle.psyverse.fun","truth.psyverse.fun","uncertainty-os.psyverse.fun","urcde.psyverse.fun","value-planes.psyverse.fun","vision-stack.psyverse.fun","warp.psyverse.fun","wiki.psyverse.fun","x-playbook.psyverse.fun","yellow-river-frontier.psyverse.fun","zk-civilization.psyverse.fun"];

  // All children use ψ- prefixed classes + a defensive layout reset to neutralize host CSS
  // (many host stylesheets target plain nav/a/button selectors and would otherwise displace our internals).
  var CSS = '#\\3c8 -bar,#\\3c8 -bar *{box-sizing:border-box!important;float:none!important;clear:none!important}'
    + '#\\3c8 -bar > *,#\\3c8 -bar > * > *{'
        + 'position:static!important;top:auto!important;left:auto!important;right:auto!important;bottom:auto!important;'
        + 'margin:0!important;transform:none!important;z-index:auto!important;max-width:none!important;'
        + 'min-width:0!important;width:auto!important;height:auto!important;'
    + '}'
    + '#\\3c8 -bar{position:fixed!important;top:0!important;left:0!important;right:0!important;'
    + 'height:32px!important;z-index:2147483647!important;'
    + 'display:flex!important;align-items:center!important;justify-content:space-between!important;'
    + 'padding:0 14px!important;gap:14px!important;margin:0!important;'
    + 'background:#0a0908!important;'
    + 'background-image:linear-gradient(180deg,#0e0c0a 0%,#0a0908 100%)!important;'
    + 'border:0!important;border-bottom:1px solid rgba(201,162,75,0.32)!important;'
    + 'box-shadow:0 1px 0 rgba(255,255,255,0.03) inset,0 4px 18px rgba(0,0,0,0.22)!important;'
    + 'font-family:ui-monospace,SFMono-Regular,"JetBrains Mono",Menlo,Consolas,monospace!important;'
    + 'font-size:11px!important;line-height:1!important;letter-spacing:.06em!important;'
    + 'color:rgba(236,228,211,0.88)!important;'
    + 'transition:transform .25s ease,opacity .25s ease!important;'
    + 'isolation:isolate!important;'
    + '}'
    + '#\\3c8 -bar.\\3c8 -hidden{transform:translateY(-100%)!important}'
    + '#\\3c8 -bar a,#\\3c8 -bar button{color:rgba(236,228,211,0.88)!important;text-decoration:none!important;'
    + 'background:transparent!important;background-image:none!important;border:0!important;cursor:pointer!important;'
    + 'font:inherit!important;letter-spacing:inherit!important;padding:0!important;'
    + 'text-transform:uppercase!important;letter-spacing:.18em!important;font-size:9.5px!important;'
    + 'transition:color .15s ease!important;box-shadow:none!important;outline:0!important;'
    + 'display:inline-flex!important;align-items:center!important;gap:5px!important;'
    + '}'
    + '#\\3c8 -bar a:hover,#\\3c8 -bar button:hover{color:#e6c071!important}'
    + '#\\3c8 -bar .\\3c8 -brand{display:inline-flex!important;align-items:center!important;gap:8px!important;'
    + 'color:#c9a24b!important;flex-shrink:0!important;font-style:italic!important;text-transform:none!important;'
    + 'font-family:"Fraunces",Georgia,serif!important;font-size:13px!important;letter-spacing:.01em!important}'
    + '#\\3c8 -bar .\\3c8 -mk{display:inline-flex!important;align-items:center!important;justify-content:center!important;'
    + 'width:18px!important;height:18px!important;border-radius:50%!important;border:1px solid #c9a24b!important;'
    + 'font-family:ui-monospace,monospace!important;font-size:9px!important;font-style:normal!important;'
    + 'color:#c9a24b!important;flex-shrink:0!important}'
    + '#\\3c8 -bar .\\3c8 -here{flex:1 1 auto!important;min-width:0!important;text-align:center!important;'
    + 'overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;'
    + 'text-transform:uppercase!important;font-size:9.5px!important;color:rgba(236,228,211,0.55)!important;'
    + 'letter-spacing:.18em!important;display:block!important}'
    + '#\\3c8 -bar .\\3c8 -here b{font-weight:500!important;color:rgba(236,228,211,0.95)!important}'
    + '#\\3c8 -bar .\\3c8 -nav{display:inline-flex!important;align-items:center!important;gap:14px!important;flex-shrink:0!important;'
    + 'text-transform:uppercase!important;font-size:9.5px!important;letter-spacing:.18em!important}'
    + '#\\3c8 -bar .\\3c8 -atlas{color:#c9a24b!important}'
    + '#\\3c8 -bar .\\3c8 -close{opacity:.5!important;font-size:14px!important;width:18px!important;height:18px!important;'
    + 'display:inline-flex!important;align-items:center!important;justify-content:center!important;'
    + 'border-radius:50%!important;letter-spacing:0!important;padding:0!important}'
    + '#\\3c8 -bar .\\3c8 -close:hover{opacity:1!important;background:rgba(201,162,75,0.12)!important}'
    + '@media (max-width:640px){'
    + '#\\3c8 -bar{height:30px!important;padding:0 10px!important;gap:8px!important}'
    + '#\\3c8 -bar .\\3c8 -brand span:last-child,#\\3c8 -bar .\\3c8 -here,#\\3c8 -bar .\\3c8 -lbl{display:none!important}'
    + '#\\3c8 -bar .\\3c8 -nav{gap:10px!important}'
    + '}';

  function inject() {
    if (document.getElementById('\u03c8-bar')) return;

    var style = document.createElement('style');
    style.id = '\u03c8-bar-style';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);

    var host = location.hostname;
    var hereLabel = host.replace(/\.psyverse\.fun$/i, '').replace(/\.vercel\.app$/i, '');

    var bar = document.createElement('div');
    bar.id = '\u03c8-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Psyverse');
    bar.innerHTML =
      '<a class="\u03c8-brand" href="https://psyverse.fun/" title="The Psyverse Manifesto">'
        + '<span class="\u03c8-mk">\u221e</span>'
        + '<span>One Mission</span>'
      + '</a>'
      + '<div class="\u03c8-here">In the Psyverse \u00b7 <b>' + hereLabel + '</b></div>'
      + '<div class="\u03c8-nav" role="navigation">'
        + '<button id="\u03c8-rand" title="Random sibling site">\u21bb <span class="\u03c8-lbl">Random</span></button>'
        + '<button id="\u03c8-next" title="Next sibling site">\u2192 <span class="\u03c8-lbl">Next</span></button>'
        + '<a class="\u03c8-atlas" href="https://psyverse.fun/atlas" title="Browse all 200">\u2234 <span class="\u03c8-lbl">Atlas</span></a>'
        + '<button class="\u03c8-close" id="\u03c8-close" title="Hide on this site" aria-label="Hide">\u00d7</button>'
      + '</div>';
    document.documentElement.appendChild(bar);

    function go(h) {
      // Persist the picker order across hops so Next walks the list
      try { sessionStorage.setItem('psyverseFrom', host); } catch (e) {}
      location.href = 'https://' + h + '/';
    }
    function pickRandom() {
      var pick = HOSTS[Math.floor(Math.random() * HOSTS.length)];
      var tries = 0;
      while (pick === host && tries++ < 5) pick = HOSTS[Math.floor(Math.random() * HOSTS.length)];
      return pick;
    }
    function pickNext() {
      var i = HOSTS.indexOf(host);
      if (i === -1) return HOSTS[0];
      return HOSTS[(i + 1) % HOSTS.length];
    }
    document.getElementById('\u03c8-rand').onclick = function() { go(pickRandom()); };
    document.getElementById('\u03c8-next').onclick = function() { go(pickNext()); };
    document.getElementById('\u03c8-close').onclick = function() {
      try { localStorage.setItem('psyverseBar', 'off'); } catch (e) {}
      bar.classList.add('\u03c8-hidden');
      setTimeout(function() { bar.remove(); }, 300);
    };
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
