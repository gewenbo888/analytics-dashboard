import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

// psyverse.fun subdomains → canonical project keys (matches existing vercel.app-derived keys)
const PSYVERSE_MAP = {
  'idea-engine.psyverse.fun': 'idea-engine',
  'idea-engine-2.vercel.app': 'idea-engine',
  'absolute-idea-engine.psyverse.fun': 'absolute-idea-engine',
  'absolute-idea-engine.vercel.app': 'absolute-idea-engine',
  'power-civilization-engine.psyverse.fun': 'power-civilization-engine',
  'power-civilization-engine.vercel.app': 'power-civilization-engine',
  'money-engine.psyverse.fun': 'money-engine',
  'money-engine-eosin.vercel.app': 'money-engine',
  'optics-engine.psyverse.fun': 'optics-engine',
  'optics-engine.vercel.app': 'optics-engine',
  'spatial-computing.psyverse.fun': 'spatial-computing',
  'spatial-computing-tan.vercel.app': 'spatial-computing',
  'civilization-engine.psyverse.fun': 'civilization-engine',
  'civilization-engine.vercel.app': 'civilization-engine',
  'statistical-intelligence.psyverse.fun': 'statistical-intelligence',
  'genius.psyverse.fun': 'genius',
  'genius-smoky.vercel.app': 'genius',
  'genius.vercel.app': 'genius',
  'sapiens.psyverse.fun': 'sapiens',
  'sapiens.vercel.app': 'sapiens',
  'idea-of-the-brain.psyverse.fun': 'idea-of-the-brain',
  'idea-of-the-brain.vercel.app': 'idea-of-the-brain',
  'planetary-engine.psyverse.fun': 'planetary-engine',
  'planetary-engine.vercel.app': 'planetary-engine',
  'carbon-capture-engine.psyverse.fun': 'carbon-capture-engine',
  'carbon-capture-engine.vercel.app': 'carbon-capture-engine',
  'trend-engine.psyverse.fun': 'trend-engine',
  'trend-engine-mocha.vercel.app': 'trend-engine',
  'health-engine.psyverse.fun': 'health-engine',
  'health-engine-delta.vercel.app': 'health-engine',
  'essence-of-life.psyverse.fun': 'essence-of-life',
  'essence-of-life.vercel.app': 'essence-of-life',
  'narrative.psyverse.fun': 'narrative',
  'narrative-wine.vercel.app': 'narrative',
  'first-principles.psyverse.fun': 'first-principles',
  'first-principles-rho.vercel.app': 'first-principles',
  'equality-engine.psyverse.fun': 'equality-engine',
  'equality-engine.vercel.app': 'equality-engine',
  'truth-goodness-beauty.psyverse.fun': 'truth-goodness-beauty',
  'truth-goodness-beauty.vercel.app': 'truth-goodness-beauty',
  'spacetime-engine.psyverse.fun': 'spacetime-engine',
  'spacetime-engine.vercel.app': 'spacetime-engine',
  'flow-state.psyverse.fun': 'flow-state',
  'flow-state-nine-theta.vercel.app': 'flow-state',
  'great-convergence.psyverse.fun': 'great-convergence',
  'great-convergence.vercel.app': 'great-convergence',
  'mission-engine.psyverse.fun': 'mission-engine',
  'consciousness.psyverse.fun': 'consciousness',
  'consciousness-theta.vercel.app': 'consciousness',
  'energy-engine.psyverse.fun': 'energy-engine',
  'wealth-engine.psyverse.fun': 'wealth-engine',
  'product-engine.psyverse.fun': 'product-engine',
  'product-engine-sand.vercel.app': 'product-engine',
  'vertical-farming-engine.psyverse.fun': 'vertical-farming-engine',
  'vertical-farming-engine.vercel.app': 'vertical-farming-engine',
  'need-engine.psyverse.fun': 'need-engine',
  'need-engine.vercel.app': 'need-engine',
  'universal-love-engine.psyverse.fun': 'universal-love-engine',
  'liberation-engine.psyverse.fun': 'liberation-engine',
  'universal-love-engine.vercel.app': 'universal-love-engine',
  'wealth-engine-xi.vercel.app': 'wealth-engine',
  'rule-of-law-engine.psyverse.fun': 'rule-of-law-engine',
  'rule-of-law-engine.vercel.app': 'rule-of-law-engine',
  'democracy-engine.psyverse.fun': 'democracy-engine',
  'democracy-engine.vercel.app': 'democracy-engine',
  'service-engine.psyverse.fun': 'service-engine',
  'service-engine-umber.vercel.app': 'service-engine',
  'human-rights-engine.psyverse.fun': 'human-rights-engine',
  'human-rights-engine.vercel.app': 'human-rights-engine',
  'gravity-engine.psyverse.fun': 'gravity-engine',
  'matter-engine.psyverse.fun': 'matter-engine',
  'matter-engine.vercel.app': 'matter-engine',
  'self-suggestion.psyverse.fun': 'self-suggestion',
  'self-suggestion.vercel.app': 'self-suggestion',
  'dimension.psyverse.fun': 'dimension',
  'dimension-ten.vercel.app': 'dimension',
  'quantum-reality.psyverse.fun': 'quantum-reality',
  'quantum-reality-alpha.vercel.app': 'quantum-reality',
  'elon-observatory.psyverse.fun': 'elon-observatory',
  'miletus-engine.psyverse.fun': 'miletus-engine',
  'sanyuan.psyverse.fun':     'sanyuan',
  'selfcraft.psyverse.fun':   'selfcraft',
  'mind-vs-machine.psyverse.fun': 'mind-vs-machine',
  'ten-heavens.psyverse.fun': 'ten-heavens',
  'omnifi.psyverse.fun':      'omnifi',
  'psyverse.fun':             'gewenbo-manifesto',
  'manifesto.psyverse.fun':   'gewenbo-manifesto',
  'idea-evolution.psyverse.fun': 'idea-evolution',
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
  'gosu-yu-codex.psyverse.fun': 'gosu-yu-codex',
  'libertarian.psyverse.fun': 'libertarian',
  'kol.psyverse.fun':         'crypto-kol',
  'mindseye.psyverse.fun':    'mindseye',
  'cnkol.psyverse.fun':       'chinese-crypto-kols',
  'skills.psyverse.fun':      'skills-showcase',
  'llms.psyverse.fun':        'llm-models',
  'aiapps.psyverse.fun':      'ai-apps-rank',
  'ides.psyverse.fun':        'ides-rank',
  'saas.psyverse.fun':        'saas-rank',
  'gear.psyverse.fun':        'gear-rank',
  'creators.psyverse.fun':    'creators-rank',
  'coders.psyverse.fun':      'coders-rank',
  'learn.psyverse.fun':       'learn-rank',
  'oss.psyverse.fun':         'oss-rank',
  'apis.psyverse.fun':        'apis-rank',
  'langbrain.psyverse.fun':   'langbrain',
  'agents.psyverse.fun':      'agents-rank',
  'figures.psyverse.fun':     'figures-rank',
  'arena.psyverse.fun':       'ai-arena',
  'psy.psyverse.fun':         'psy-protocol-site',
  'psy-architecture.psyverse.fun':'psy-architecture',
  'psy-research.psyverse.fun':'psy-research',
  'silicon-ideology.psyverse.fun':'silicon-ideology',
  'tech-migration.psyverse.fun':  'tech-migration',
  'beyond-tech.psyverse.fun':     'beyond-tech',
  'origins-of-technology.psyverse.fun': 'origins-of-technology',
  'origins-of-technology.vercel.app':   'origins-of-technology',
  'build-on-psy.psyverse.fun': 'build-on-psy',
  'build-on-psy.vercel.app':   'build-on-psy',
  'hanzi-genesis.psyverse.fun': 'hanzi-genesis',
  'hanzi-genesis.vercel.app':   'hanzi-genesis',
  'x-playbook.psyverse.fun':      'x-playbook',
  'meta-civilization.psyverse.fun':'meta-civilization',
  'deep-stack.psyverse.fun':      'deep-stack',
  'electric-civilization.psyverse.fun': 'electric-civilization',
  'invisible-flows.psyverse.fun':     'invisible-flows',
  'imagination-engine.psyverse.fun':  'imagination-engine',
  'token-civilization.psyverse.fun':  'token-civilization',
  'civilization-kernel.psyverse.fun': 'civilization-kernel',
  'shenzhen-velocity.psyverse.fun':   'shenzhen-velocity',
  'vision-stack.psyverse.fun':        'vision-stack',
  'planetary-brain.psyverse.fun': 'planetary-brain',
  'idc.psyverse.fun':         'china-idc-ranking',
  'heat.psyverse.fun':        'heating-comparison',
  'privacy.psyverse.fun':     'privacy-zk-landscape',
  'humanoids.psyverse.fun':   'humanoid-robots-ranking',
  'av.psyverse.fun':          'autonomous-driving-ranking',
  'warp.psyverse.fun':        'curvature-engine',
  'apes.psyverse.fun':        'apes-comparison',
  'innovators.psyverse.fun':  'innovators-atlas',
  'seeker.psyverse.fun':      'the-seeker',
  'staples.psyverse.fun':     'staple-foods-atlas',
  'chains.psyverse.fun':      'blockchain-performance-atlas',
  'minds.psyverse.fun':       'thinking-styles-atlas',
  'omega.psyverse.fun':       'omega-engine',
  'urcde.psyverse.fun':       'urcde-engine',
  'mindatlas.psyverse.fun':   'atlas-of-mind',
  'tools.psyverse.fun':       'tool-hub',
  'aha.psyverse.fun':         'aha-psyverse',
  'ledger.psyverse.fun':      'ledger-psyverse',
  'ideaspace.psyverse.fun':   'ideaspace-psyverse',
  'convergence.psyverse.fun': 'convergence-psyverse',
  'chainmind.psyverse.fun':   'chainmind-psyverse',
  'architect.psyverse.fun':   'architect-psyverse',
  'cognition-gym.psyverse.fun': 'cognition-gym',
  'mind-arena.psyverse.fun':  'mind-arena',
  'ethics-engine.psyverse.fun': 'ethics-engine',
  'humanity-os.psyverse.fun': 'humanity-os',
  'truth.psyverse.fun':       'truth-engine',
  'market.psyverse.fun':      'intelligence-market',
  'sim.psyverse.fun':         'simulation-universe',
  'attention.psyverse.fun':   'attention-os',
  'meaning.psyverse.fun':     'meaning-engine',
  'time.psyverse.fun':        'time-machine',
  'knowledge-os.psyverse.fun':'knowledge-os',
  'influence-os.psyverse.fun':'influence-os',
  'uncertainty-os.psyverse.fun':'uncertainty-os',
  'chaos-os.psyverse.fun':'chaos-os',
  'strategy-os.psyverse.fun':  'strategy-os',
  'emotion-os.psyverse.fun':'emotion-os',
  'blockchain-atlas.psyverse.fun':'blockchain-atlas',
  'ge.psyverse.fun':          'ge-clan-atlas',
  'jin-atlas.psyverse.fun':   'jin-atlas',
  'surnames.psyverse.fun':    'surname-atlas',
  'grassland.psyverse.fun':   'grassland-atlas',
  'org.psyverse.fun':         'organization-atlas',
  'chain.psyverse.fun':       'chain-essence',
  'signal.psyverse.fun':      'signal-os',
  'parenting-os.psyverse.fun':'parenting-os',
  'mindforge.psyverse.fun':   'mindforge',
  'awaken-os.psyverse.fun':   'awaken-os',
  'clarity-os.psyverse.fun':  'clarity-os',
  'self-construction-os.psyverse.fun': 'self-construction-os',
  'self-engine.psyverse.fun': 'self-engine',
  'agency-genesis.psyverse.fun':       'agency-genesis',
  'civilization-waves.psyverse.fun':   'civilization-waves',
  'southward-migration.psyverse.fun':  'southward-migration',
  'steppe-empire.psyverse.fun':        'steppe-empire',
  'human-future-atlas.psyverse.fun':   'human-future-atlas',
  'climate-civilization.psyverse.fun': 'climate-civilization',
  'states-of-reality.psyverse.fun':    'states-of-reality',
  'frontier-garrisons.psyverse.fun':   'frontier-garrisons',
  'oceanic-civilization.psyverse.fun': 'oceanic-civilization',
  'the-human-library.psyverse.fun':    'the-human-library',
  'yellow-river-frontier.psyverse.fun':'yellow-river-frontier',
  'techne.psyverse.fun':               'techne',
  'zk-civilization.psyverse.fun':      'zk-civilization',
  'survival-intelligence.psyverse.fun':'survival-intelligence',
  'cryptocivilization.psyverse.fun':   'cryptocivilization',
  'neolithic-world.psyverse.fun':      'neolithic-world',
  'elements-of-civilization.psyverse.fun': 'elements-of-civilization',
  'pacific-rim-ports.psyverse.fun':    'pacific-rim-ports',
  'huangqihai-civilization.psyverse.fun': 'huangqihai-civilization',
  'china-regional-systems.psyverse.fun': 'china-regional-systems',
  'dongbei-renaissance.psyverse.fun':  'dongbei-renaissance',
  'mountain-merchants.psyverse.fun':   'mountain-merchants',
  'psy-killer-apps.psyverse.fun':      'psy-killer-apps',
  'psy-civilization.psyverse.fun':     'psy-civilization',
  'sentience.psyverse.fun':            'sentience',
  'evolution-of-eyes.psyverse.fun':    'evolution-of-eyes',
  'psy-spec.psyverse.fun':             'psy-spec',
  'cognitive-civilization.psyverse.fun': 'cognitive-civilization',
  'sinosphere.psyverse.fun':           'sinosphere',
  'clan-civilization.psyverse.fun':    'clan-civilization',
  'civilization-os.psyverse.fun':      'civilization-os',
  'psyverse-os.psyverse.fun':          'psyverse-os',
  'civilization-os-infinity.psyverse.fun': 'civilization-os-infinity',
  'material-civilization.psyverse.fun': 'material-civilization',
  'civos.psyverse.fun':                       'civos',
  'civos-civilization-os.psyverse.fun':       'civos-civilization-os',
  'civos-idea-evolution.psyverse.fun':        'civos-idea-evolution',
  'civos-material-civilization.psyverse.fun': 'civos-material-civilization',
  'civos-clan-civilization.psyverse.fun':     'civos-clan-civilization',
  'psy-protocol-spec.psyverse.fun':           'psy-protocol-spec',
  'sensory-os.psyverse.fun':                  'sensory-os',
  'reality-kernel.psyverse.fun':              'reality-kernel',
  'decision-os.psyverse.fun':                 'decision-os',
  'cycle-engine.psyverse.fun':                'cycle-engine',
  'life-os.psyverse.fun':                     'life-os',
  'mask-engine.psyverse.fun':                 'mask-engine',
  'attraction-lab.psyverse.fun':              'attraction-lab',
  'dream-foundry.psyverse.fun':               'dream-foundry',
  'parallel-life.psyverse.fun':               'parallel-life',
  'internet-tribes.psyverse.fun':             'internet-tribes',
  'persona-engine.psyverse.fun':              'persona-engine',
  'desire-atlas.psyverse.fun':                'desire-atlas',
  'life-cinematic.psyverse.fun':              'life-cinematic',
  'social-temperature.psyverse.fun':          'social-temperature',
  'chaos-simulator.psyverse.fun':             'chaos-simulator',
  'chaos-simulator-puce.vercel.app':          'chaos-simulator',
  'chaos-simulator.vercel.app':               'chaos-simulator',
  'last-seen.psyverse.fun':                   'last-seen',
  'inner-monologue.psyverse.fun':             'inner-monologue',
  'fusion-os.psyverse.fun':                   'fusion-os',
  'ai-replacement-map.psyverse.fun':          'ai-replacement-map',
  // — civlab ecosystem (10 platforms + hub) —
  'civlab.psyverse.fun':                      'civlab',
  'civilization-tree.psyverse.fun':           'civilization-tree',
  'how-the-world-works.psyverse.fun':         'how-the-world-works',
  'humanity-problem-database.psyverse.fun':   'humanity-problem-database',
  'future-simulator.psyverse.fun':            'future-simulator',
  'ai-society-sandbox.psyverse.fun':          'ai-society-sandbox',
  'global-materials-graph.psyverse.fun':      'global-materials-graph',
  'civlab-ai-replacement-map.psyverse.fun':   'civlab-ai-replacement-map',
  'failure-museum.psyverse.fun':              'failure-museum',
  'knowledge-compression-engine.psyverse.fun':'knowledge-compression-engine',
  'human-memory-project.psyverse.fun':        'human-memory-project',
  // — civilization startup lab (10 AI-native platforms) —
  'reality-engine.psyverse.fun':              'reality-engine',
  'invisible-systems.psyverse.fun':           'invisible-systems',
  'digital-species.psyverse.fun':             'digital-species',
  'memory-atlas.psyverse.fun':                'memory-atlas',
  'collapse-watch.psyverse.fun':              'collapse-watch',
  'ai-universe.psyverse.fun':                 'ai-universe',
  'ai-genesis.psyverse.fun':                  'ai-genesis',
  'positioning-theory.psyverse.fun':          'positioning-theory',
  'positioning-theory.vercel.app':            'positioning-theory',
  'information-engine.psyverse.fun':          'information-engine',
  'human-os.psyverse.fun':                    'human-os',
  'future-economy.psyverse.fun':              'future-economy',
  'intelligence-network.psyverse.fun':        'intelligence-network',
  'synthetic-history.psyverse.fun':           'synthetic-history',
  'beyond-matter.psyverse.fun':               'beyond-matter',
  'greatest-ideas.psyverse.fun':              'greatest-ideas',
  'four-primitives.psyverse.fun':             'four-primitives',
  // — civtech ecosystem (10 platforms + hub) —
  'civtech.psyverse.fun':                          'civtech',
  'ai-scientist-lab.psyverse.fun':                 'ai-scientist-lab',
  'chip-war-atlas.psyverse.fun':                   'chip-war-atlas',
  'imitation-atlas.psyverse.fun':                  'imitation-atlas',
  'civilization-tech-tree.psyverse.fun':           'civilization-tech-tree',
  'quantum-computing-visualizer.psyverse.fun':     'quantum-computing-visualizer',
  'autonomous-software-civilization.psyverse.fun': 'autonomous-software-civilization',
  'future-energy-dashboard.psyverse.fun':          'future-energy-dashboard',
  'robot-civilization-observatory.psyverse.fun':   'robot-civilization-observatory',
  'brain-computer-interface-world.psyverse.fun':   'brain-computer-interface-world',
  'reality-simulation-engine.psyverse.fun':        'reality-simulation-engine',
  'chrono-void.psyverse.fun':                      'chrono-void',
  'five-worlds.psyverse.fun':                      'five-worlds',
  'suyu.psyverse.fun':                             'suyu',
  'five-challenges.psyverse.fun':                  'five-challenges',
  'value-planes.psyverse.fun':                     'value-planes',
  'daofaziran.psyverse.fun':                       'daofaziran',
  'daofaziran.vercel.app':                         'daofaziran',
  'civilization-stack.psyverse.fun':               'civilization-stack',
  'civilization-stack.vercel.app':                 'civilization-stack',
  'cosmos-to-code.psyverse.fun':                   'cosmos-to-code',
  'cosmos-to-code.vercel.app':                     'cosmos-to-code',
  'five-frontiers.psyverse.fun':                   'five-frontiers',
  'five-frontiers.vercel.app':                     'five-frontiers',
  'north-rules-south.psyverse.fun':                'north-rules-south',
  'north-rules-south.vercel.app':                  'north-rules-south',
  'minimum-units.psyverse.fun':                    'minimum-units',
  'minimum-units.vercel.app':                      'minimum-units',
  'seven-tongues.psyverse.fun':                    'seven-tongues',
  'seven-tongues.vercel.app':                      'seven-tongues',
  '16-frontiers.psyverse.fun':                     '16-frontiers',
  '16-frontiers.vercel.app':                       '16-frontiers',
  'innovation-engines.psyverse.fun':               'innovation-engines',
  'innovation-engines.vercel.app':                 'innovation-engines',
  'centuries.psyverse.fun':                        'centuries',
  'centuries.vercel.app':                          'centuries',
  'five-horizons.psyverse.fun':                    'five-horizons',
  'five-horizons.vercel.app':                      'five-horizons',
  'mirror-civilizations.psyverse.fun':             'mirror-civilizations',
  'mirror-civilizations.vercel.app':               'mirror-civilizations',
  'read-every-book.psyverse.fun':                  'read-every-book',
  'read-every-book.vercel.app':                    'read-every-book',
  'reality-stack.psyverse.fun':                    'reality-stack',
  'reality-stack.vercel.app':                      'reality-stack',
  'shenzhen-bay.psyverse.fun':                     'shenzhen-bay',
  'shenzhen-bay.vercel.app':                       'shenzhen-bay',
  'tech-cosmos.psyverse.fun':                      'tech-cosmos',
  'tech-cosmos.vercel.app':                        'tech-cosmos',
  'dream-machine.psyverse.fun':                    'dream-machine',
  'dream-machine-snowy.vercel.app':                'dream-machine',
  'happy-crush.psyverse.fun':                      'happy-crush',
  'happy-crush.vercel.app':                        'happy-crush',
  'sauce-civilization.psyverse.fun':               'sauce-civilization',
  'sauce-civilization.vercel.app':                 'sauce-civilization',
  'shenzhen-vs-seoul.psyverse.fun':                'shenzhen-vs-seoul',
  'shenzhen-vs-seoul.vercel.app':                  'shenzhen-vs-seoul',
  'boredom-architecture.psyverse.fun':             'boredom-architecture',
  'boredom-architecture.vercel.app':               'boredom-architecture',
  'steam-civilization.psyverse.fun':               'steam-civilization',
  'steam-civilization.vercel.app':                 'steam-civilization',
  'founders-dilemma.psyverse.fun':                 'founders-dilemma',
  'founders-dilemma.vercel.app':                   'founders-dilemma',
  'founders-dilemma-three.vercel.app':             'founders-dilemma',
  'alkaloid-atlas.psyverse.fun':                   'alkaloid-atlas',
  'alkaloid-atlas.vercel.app':                     'alkaloid-atlas',
  'happiness-engine.psyverse.fun':                 'happiness-engine',
  'happiness-engine.vercel.app':                   'happiness-engine',
  'liquid-civilization.psyverse.fun':              'liquid-civilization',
  'liquid-civilization.vercel.app':                'liquid-civilization',
  'creativity-engine.psyverse.fun':                'creativity-engine',
  'creativity-engine.vercel.app':                  'creativity-engine',
  'tech-civilization.psyverse.fun':                'tech-civilization',
  'tech-civilization.vercel.app':                  'tech-civilization',
  'entropy.psyverse.fun':                          'entropy',
  'entropy-self.vercel.app':                       'entropy',
  'eleven-dimensions.psyverse.fun':                'eleven-dimensions',
  'eleven-dimensions.vercel.app':                  'eleven-dimensions',
  'time-travel.psyverse.fun':                      'time-travel',
  'time-travel-pearl.vercel.app':                  'time-travel',
  'time-travel.vercel.app':                        'time-travel',
  'immortality-engine.psyverse.fun':               'immortality-engine',
  'immortality-engine.vercel.app':                 'immortality-engine',
  'gene-editing-engine.psyverse.fun':              'gene-editing-engine',
  'gene-editing-engine.vercel.app':                'gene-editing-engine',
  'nexus-book.psyverse.fun':                       'nexus-book',
  'nexus-book.vercel.app':                         'nexus-book',
  'nexus-book-sigma.vercel.app':                   'nexus-book',
  'kangxi-red-letter.psyverse.fun':                'kangxi-red-letter',
  'kangxi-red-letter.vercel.app':                  'kangxi-red-letter',
  'rockefeller-letters.psyverse.fun':              'rockefeller-letters',
  'rockefeller-letters.vercel.app':                'rockefeller-letters',
  'first-cause-books.psyverse.fun':                'first-cause-books',
  'first-cause-books.vercel.app':                  'first-cause-books',
  'bci-engine.psyverse.fun':                       'bci-engine',
  'bci-engine.vercel.app':                         'bci-engine',
  'vr-engine.psyverse.fun':                        'vr-engine',
  'vr-engine.vercel.app':                          'vr-engine',
  'book-of-elon.psyverse.fun':                     'book-of-elon',
  'book-of-elon.vercel.app':                       'book-of-elon',
  'steve-jobs.psyverse.fun':                       'steve-jobs',
  'steve-jobs-weld.vercel.app':                    'steve-jobs',
  'steve-jobs.vercel.app':                         'steve-jobs',
  'chaos-science.psyverse.fun':                    'chaos-science',
  'chaos-science.vercel.app':                      'chaos-science',
  'beginning-of-infinity.psyverse.fun':            'beginning-of-infinity',
  'beginning-of-infinity-eight.vercel.app':        'beginning-of-infinity',
  'beginning-of-infinity.vercel.app':              'beginning-of-infinity',
  'big-picture.psyverse.fun':                      'big-picture',
  'big-picture-khaki.vercel.app':                  'big-picture',
  'big-picture.vercel.app':                        'big-picture',
  'additive-manufacturing.psyverse.fun':           'additive-manufacturing',
  'additive-manufacturing-alpha.vercel.app':       'additive-manufacturing',
  'additive-manufacturing.vercel.app':             'additive-manufacturing',
  'musk-codex.psyverse.fun':                       'musk-codex',
  'musk-codex.vercel.app':                         'musk-codex',
  'nietzsche-plato.psyverse.fun':                  'nietzsche-plato',
  'nietzsche-plato.vercel.app':                    'nietzsche-plato',
  'hassabis-codex.psyverse.fun':                   'hassabis-codex',
  'hassabis-codex.vercel.app':                     'hassabis-codex',
  'psy-wallet.psyverse.fun':                       'psy-wallet',
  'psy-wallet.vercel.app':                         'psy-wallet',
};

// vercel.app aliases that Vercel auto-suffixes (-jade, -mu, etc.) → canonical key.
// Without this, visits to the bare vercel.app URL get logged under the suffixed name
// and the dashboard can't find PROJECT_META. Added retroactively April 2026.
const VERCEL_MAP = {
  'gravity-engine-gray.vercel.app':    'gravity-engine',
  'sanyuan-tau.vercel.app':            'sanyuan',
  'libertarian-jade.vercel.app':       'libertarian',
  'mindseye-kappa.vercel.app':         'mindseye',
  'skills-showcase-livid.vercel.app':  'skills-showcase',
  'llm-models-mu.vercel.app':          'llm-models',
  'ai-arena-olive.vercel.app':         'ai-arena',
  'the-seeker-psi.vercel.app':         'the-seeker',
  'tool-hub-red.vercel.app':           'tool-hub',
  'mind-arena-three.vercel.app':       'mind-arena',
  'truth-engine-alpha.vercel.app':     'truth-engine',
  'attention-os-eta.vercel.app':       'attention-os',
  'meaning-engine-rho.vercel.app':     'meaning-engine',
  'time-machine-vert-theta.vercel.app':'time-machine',
  'parenting-os-eta.vercel.app':       'parenting-os',
  'mindforge-steel.vercel.app':        'mindforge',
  'awaken-os-ten.vercel.app':          'awaken-os',
  'clarity-os-one.vercel.app':         'clarity-os',
  'techne-six.vercel.app':             'techne',
  'sentience-six.vercel.app':          'sentience',
  'civilization-os-blush.vercel.app':  'civilization-os',
  'last-seen-fawn.vercel.app':         'last-seen',
  'humanity-os-sandy.vercel.app':      'humanity-os',
  'fusion-os-beta.vercel.app':         'fusion-os',
  'deep-stack-eight.vercel.app':       'deep-stack',
  'x-playbook-nine.vercel.app':        'x-playbook',
  'omnifi-dusky.vercel.app':           'omnifi',
  'beyond-tech-eosin.vercel.app':      'beyond-tech',
  'ai-genesis-dun.vercel.app':         'ai-genesis',
  'energy-engine-alpha.vercel.app':    'energy-engine',
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

    // Skip local development hostnames so they don't pollute the dashboard
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return new Response(JSON.stringify({ ok: true, skipped: 'local' }), { status: 200 });
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
      // Unmapped *.psyverse.fun subdomains → use the bare subdomain as the key,
      // so a pageview arriving before the PSYVERSE_MAP entry is deployed no longer
      // creates a dot→underscore "name_psyverse_fun" orphan.
      project = project.replace(/\.psyverse\.fun$/, '');
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
