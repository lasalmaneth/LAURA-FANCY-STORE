/**
 * core/registry.js — Service Registry & Orchestrator
 *
 * This is the single entry point for the entire application.
 * It defines the service manifest, loads core styles, mounts each
 * service's HTML template into the DOM, and initialises its JS module.
 *
 * Architecture rules:
 *  - Services are loaded in manifest order (DOM order matters)
 *  - Services never import from each other
 *  - Only core/ and shared/ are cross-service concerns
 *  - Each service JS must export an async init() function
 */

/* ─────────────────────────────────────────
   SERVICE MANIFEST
   Add / remove / reorder services here.
───────────────────────────────────────── */
const MANIFEST = [
  { name: 'navigation', cssFile: 'nav.css',         mount: '#app-header', method: 'replace' },
  { name: 'ticker',     cssFile: 'ticker.css',       mount: '#app-main',   method: 'append'  },
  { name: 'hero',       cssFile: 'hero.css',         mount: '#app-main',   method: 'append'  },
  { name: 'products',   cssFile: 'products.css',     mount: '#app-main',   method: 'append'  },
  { name: 'story',      cssFile: 'story.css',        mount: '#app-main',   method: 'append'  },
  { name: 'process',    cssFile: 'process.css',      mount: '#app-main',   method: 'append'  },
  { name: 'features',   cssFile: 'features.css',     mount: '#app-main',   method: 'append'  },
  { name: 'contact',    cssFile: 'contact.css',      mount: '#app-main',   method: 'append'  },
  { name: 'newsletter', cssFile: 'newsletter.css',   mount: '#app-main',   method: 'append'  },
  { name: 'footer',     cssFile: 'footer.css',       mount: '#app-footer', method: 'replace' },
];

/* ─────────────────────────────────────────
   CORE STYLES — loaded before any service
───────────────────────────────────────── */
const CORE_STYLES = [
  'core/design-tokens.css',
  'core/reset.css',
  'core/typography.css',
  'core/animations.css',
  'shared/layout/noise.css',
  'shared/components/button.css',
  'shared/components/section-header.css',
];

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */

/** Inject a <link> stylesheet into <head> */
function injectCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/** Fetch an HTML template string */
async function fetchTemplate(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`[Registry] Failed to load template: ${url} (${res.status})`);
  return res.text();
}

/* ─────────────────────────────────────────
   SERVICE LOADER
───────────────────────────────────────── */

async function loadService({ name, cssFile, mount, method }) {
  const base = `services/${name}`;

  // 1. Inject service CSS (non-blocking, parallel with fetch)
  injectCSS(`${base}/${cssFile}`);

  // 2. Fetch HTML template (relative to index.html)
  const html = await fetchTemplate(`${base}/template.html`);

  // 3. Mount into designated DOM slot
  const target = document.querySelector(mount);
  if (!target) throw new Error(`[Registry] Mount point not found: ${mount}`);

  if (method === 'replace') {
    target.innerHTML = html;
  } else {
    target.insertAdjacentHTML('beforeend', html);
  }

  // 4. Dynamically import service JS and call init()
  //    Path is relative to THIS file (core/registry.js)
  const module = await import(`../services/${name}/${name}.js`);
  if (typeof module.init === 'function') {
    await module.init();
  }

  console.log(`[Registry] ✓ ${name}`);
}

/* ─────────────────────────────────────────
   BOOT SEQUENCE
───────────────────────────────────────── */

async function boot() {
  console.log('[Registry] Booting Laura Fancy Store...');

  // Load all core styles in parallel (no order dependency)
  CORE_STYLES.forEach(injectCSS);

  // Load services sequentially — DOM insertion order matters
  for (const service of MANIFEST) {
    await loadService(service);
  }

  // Load responsive overrides last — needs all service selectors in DOM
  injectCSS('shared/layout/responsive.css');

  // Init global core utilities (cursor + scroll animations)
  const { initAnimations } = await import('./animations.js');
  const { initCursor }     = await import('./cursor.js');
  initAnimations();
  initCursor();

  console.log('[Registry] ✓ All services mounted and initialised');
}

boot().catch(err => console.error('[Registry] Boot failed:', err));
