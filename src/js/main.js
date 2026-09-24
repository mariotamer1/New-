import { $, ENV, href } from './lib.js';
import { store } from './store.js';
import { headerHTML, footerHTML, menuHTML, cartSheetHTML, mountChrome, setMeta, markNav, closeSheets } from './ui.js';
import * as P from './pages.js';

const ROUTES = [
  [/^\/$/, () => P.home()],
  [/^\/products\/?$/, (m, ctx) => P.catalog(ctx)],
  [/^\/products\/([^/?#]+)\/?$/, (m, ctx) => P.product({ ...ctx, params: { slug: decodeURIComponent(m[1]) } })],
  [/^\/categories\/?$/, () => P.categories()],
  [/^\/categories\/([^/?#]+)\/?$/, (m, ctx) => { const c = store.category(decodeURIComponent(m[1])); return c ? P.catalog({ ...ctx, params: { cat: c.slug } }) : P.notFound('Category not found'); }],
  [/^\/wholesale\/?$/, () => P.wholesale()],
  [/^\/about\/?$/, () => P.about()],
  [/^\/contact\/?$/, () => P.contact()],
  [/^\/checkout\/?$/, () => P.checkout()],
  [/^\/order\/([^/?#]+)\/?$/, (m) => P.order({ params: { id: decodeURIComponent(m[1]) } })],
  [/^\/account\/?$/, () => P.account()],
  [/^\/shipping-policy\/?$/, () => P.policy({ kind: 'shipping' })],
  [/^\/refund-policy\/?$/, () => P.policy({ kind: 'refund' })],
  [/^\/admin(?:\/.*)?$/, 'admin'],
];

let memoryPath = ENV.cfg.startPath || '/';
let cleanup = null;
const scrollMemo = {};

function currentPath() {
  if (ENV.routing === 'path') {
    let p = location.pathname;
    if (p.startsWith(ENV.rootPath)) p = '/' + p.slice(ENV.rootPath.length);
    p = p.replace(/index\.html$/, '').replace(/404\.html$/, '');
    return (p || '/') + location.search;
  }
  if (ENV.routing === 'hash') return (location.hash.startsWith('#/') ? location.hash.slice(1) : '/') || '/';
  return memoryPath;
}

function toAppPath(raw) {
  if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;
  if (ENV.routing !== 'path') return raw.startsWith('#/') ? raw.slice(1) : null;
  let u; try { u = new URL(raw, location.href); } catch { return null; }
  if (u.origin !== location.origin || !u.pathname.startsWith(ENV.rootPath)) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(u.pathname) && !/index\.html$/.test(u.pathname)) return null;
  if (u.hash && u.pathname === location.pathname && u.search === location.search) return null;
  return '/' + u.pathname.slice(ENV.rootPath.length).replace(/index\.html$/, '') + u.search;
}

export function navigate(path, { replace = false } = {}) {
  const key = currentPath();
  scrollMemo[key] = window.scrollY;
  if (ENV.routing === 'path') history[replace ? 'replaceState' : 'pushState']({}, '', href(path));
  else if (ENV.routing === 'hash') {
    if (replace) history.replaceState(null, '', '#' + path);
    else { location.hash = path; return; } // hashchange renders
  } else memoryPath = path;
  render({ scroll: replace ? null : 0 });
}
const navigateReplace = (path) => {
  if (ENV.routing === 'path') history.replaceState({}, '', href(path));
  else if (ENV.routing === 'hash') history.replaceState(null, '', '#' + path);
  else memoryPath = path;
};

let adminMod = null;
async function loadAdmin() {
  if (adminMod) return adminMod;
  if (window.MLAdmin) return (adminMod = window.MLAdmin);
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = ENV.root + 'assets/admin.js' + (ENV.cfg.v ? '?v=' + ENV.cfg.v : ''); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  return (adminMod = window.MLAdmin);
}

async function render({ scroll = 0 } = {}) {
  const full = currentPath();
  const [path, qs] = full.split('?');
  const query = new URLSearchParams(qs || '');
  if (cleanup) { try { cleanup(); } catch {} cleanup = null; }
  closeSheets(true);
  const main = $('#main');
  const shell = document.body;
  let route = null, m = null;
  for (const [re, fn] of ROUTES) { m = path.match(re); if (m) { route = fn; break; } }
  if (route === 'admin') {
    shell.classList.add('is-admin');
    const mod = await loadAdmin();
    setMeta({ title: 'Admin', path: '/admin', noindex: true });
    main.innerHTML = '';
    cleanup = await mod.mount(main, { store, navigate, query });
    window.scrollTo(0, 0);
    return;
  }
  shell.classList.remove('is-admin');
  const page = route ? route(m, { query, navigate, path }) : P.notFound();
  setMeta({ title: page.title, description: page.description, path: page.path || path, image: page.image, jsonld: page.jsonld, noindex: page.noindex });
  main.innerHTML = page.html;
  main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
  markNav(path);
  if (page.mount) { const r = page.mount(main, { navigate, navigateReplace, query }); if (typeof r === 'function') cleanup = r; }
  if (scroll === null) return;
  const back = scrollMemo[full];
  window.scrollTo({ top: scroll === 'restore' && back != null ? back : 0, behavior: 'instant' });
}

async function boot() {
  const app = document.getElementById('app');
  await store.init();
  app.innerHTML = `${headerHTML()}<main id="main" tabindex="-1"></main>${footerHTML()}${menuHTML()}${cartSheetHTML()}`;
  mountChrome(navigate);
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const path = toAppPath(a.getAttribute('href'));
    if (path == null) return;
    e.preventDefault();
    navigate(path);
  });
  if (ENV.routing === 'path') window.addEventListener('popstate', () => render({ scroll: 'restore' }));
  if (ENV.routing === 'hash') window.addEventListener('hashchange', () => render({ scroll: 0 }));
  window.addEventListener('store:changed', () => { store.refresh(); });
  await render({ scroll: null });
  document.documentElement.classList.add('ready');
}

boot().catch((e) => {
  console.error(e);
  const app = document.getElementById('app');
  if (app) app.innerHTML = `<div style="padding:40px;font:16px system-ui">The store could not load. Please refresh the page.</div>`;
});
