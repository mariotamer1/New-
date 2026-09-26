// Shared storefront UI: header, footer, cards, carousels, search, cart drawer, offer dialog, toasts, meta.
import { $, $$, esc, money, pctOff, href, img, imgTag, icon, logo, telHref, debounce, ENV } from './lib.js';
import { store, cart, likes } from './store.js';

// ---------------------------------------------------------------- meta / SEO
export function setMeta({ title, description, path = '/', image, jsonld, noindex } = {}) {
  const s = store.settings();
  const full = title ? `${title} | ${s.storeName || 'ML Group'}` : `${s.storeName || 'ML Group'} — Big Savings. Great Products.`;
  document.title = full;
  const set = (sel, attr, val) => { let el = document.head.querySelector(sel); if (!el) { el = document.createElement('meta'); const [k, v] = sel.match(/\[(.+?)="(.+?)"\]/).slice(1); el.setAttribute(k, v); document.head.appendChild(el); } el.setAttribute(attr, val); };
  const desc = description || 'Discounted electronics, home goods, tools, appliances and more for retail and wholesale buyers. Fast shipping and free local pickup.';
  set('meta[name="description"]', 'content', desc);
  set('meta[property="og:title"]', 'content', full);
  set('meta[property="og:description"]', 'content', desc);
  if (ENV.routing === 'path') {
    const url = ENV.root + path.replace(/^\//, '');
    set('meta[property="og:url"]', 'content', url);
    let c = document.head.querySelector('link[rel="canonical"]');
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
    c.href = url.split('?')[0];
  }
  if (image) set('meta[property="og:image"]', 'content', img(image));
  set('meta[name="robots"]', 'content', noindex ? 'noindex' : 'index,follow');
  let ld = document.getElementById('ld-page');
  if (jsonld) {
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-page'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify(jsonld);
  } else if (ld) ld.remove();
}

// ---------------------------------------------------------------- toasts
export function toast(msg, type = '') {
  let box = $('.toasts');
  if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `${icon(type === 'err' ? 'close' : 'check', 'icon-sm')}<span>${esc(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2600);
}

// ---------------------------------------------------------------- header / footer
const NAV = [['/', 'Home'], ['/products', 'Products'], ['#cat', 'Categories'], ['/wholesale', 'Wholesale'], ['/about', 'About'], ['/contact', 'Contact']];

function catCounts() {
  const m = {};
  store.products().forEach((p) => { m[p.categoryId] = (m[p.categoryId] || 0) + 1; });
  return m;
}

export function headerHTML() {
  const s = store.settings();
  const counts = catCounts();
  const cats = store.categories();
  const catLinks = cats.map((c) => `<a href="${href('/categories/' + c.slug)}">${esc(c.name)} <span class="count">${counts[c.id] || 0}</span></a>`).join('');
  const navItems = NAV.map(([p, label]) => p === '#cat'
    ? `<li class="nav-dd"><button class="nav-btn" type="button" aria-expanded="false" aria-controls="dd-cats" data-dd>Categories ${icon('down')}</button>
        <div class="dd-panel" id="dd-cats">${catLinks}<hr><a href="${href('/categories')}">All categories ${icon('arrow', 'icon-sm')}</a></div></li>`
    : `<li><a href="${href(p)}" data-nav="${p}">${label}</a></li>`).join('');
  const parts = String(s.announcement || '').split('·').map((x) => x.trim()).filter(Boolean);
  const ann = parts.map((x, i) => `${i ? '<span class="sep hide-sm" aria-hidden="true">·</span>' : ''}<span class="${i ? 'hide-sm' : ''}">${i === 0 ? `<b>${esc(x)}</b>` : esc(x)}</span>`).join('');
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  ${ann ? `<div class="announce"><div class="wrap">${ann}</div></div>` : ''}
  <header class="site-header on-ink">
    <div class="wrap header-row">
      <a class="logo" href="${href('/')}" aria-label="ML Group home">${logo()}</a>
      <nav class="main-nav" aria-label="Main"><ul>${navItems}</ul></nav>
      <div class="header-search">${searchHTML('hs')}</div>
      <div class="header-actions">
        <button class="icon-btn only-mobile" type="button" aria-label="Search" aria-expanded="false" aria-controls="mobile-search" data-msearch>${icon('search')}</button>
        <a class="icon-btn" href="${href('/account')}" aria-label="Account">${icon('user')}</a>
        <button class="icon-btn" type="button" aria-label="Cart" data-open-cart>${icon('bag')}<span class="cart-count" data-cart-count hidden>0</span></button>
        <button class="icon-btn only-mobile" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-sheet" data-menu>${icon('menu')}</button>
      </div>
    </div>
    <div class="mobile-search" id="mobile-search" hidden>${searchHTML('ms')}</div>
  </header>`;
}

export function menuHTML() {
  const s = store.settings();
  const cats = store.categories();
  return `
  <div class="overlay" data-overlay="menu"></div>
  <aside class="sheet left menu-sheet" id="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="sheet-head"><a class="logo" href="${href('/')}" aria-label="ML Group home">${logo()}</a><button class="icon-btn" type="button" aria-label="Close menu" data-close-menu>${icon('close')}</button></div>
    <div class="sheet-body">
      <ul class="menu-list">
        <li><a href="${href('/')}">Home</a></li>
        <li><a href="${href('/products')}">Products ${icon('right', 'icon-sm')}</a></li>
        <li><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-cats">Categories ${icon('down')}</button>
          <ul class="menu-sub" id="menu-cats" hidden>${cats.map((c) => `<li><a href="${href('/categories/' + c.slug)}">${esc(c.name)}</a></li>`).join('')}<li><a href="${href('/categories')}">All categories</a></li></ul></li>
        <li><a href="${href('/wholesale')}">Wholesale ${icon('right', 'icon-sm')}</a></li>
        <li><a href="${href('/about')}">About ${icon('right', 'icon-sm')}</a></li>
        <li><a href="${href('/contact')}">Contact ${icon('right', 'icon-sm')}</a></li>
        <li><a href="${href('/account')}">My account ${icon('right', 'icon-sm')}</a></li>
        <li><a href="${href('/liked')}">Liked items ${icon('right', 'icon-sm')}</a></li>
      </ul>
      <div class="menu-contact">
        <span class="eyebrow">Call or text</span>
        <a href="${telHref(s.phone)}">${esc(s.phone)}</a>
        <span class="muted">${icon('store', 'icon-sm')} Local pickup: ${esc(s.city)}, ${esc(s.state)}</span>
      </div>
    </div>
  </aside>`;
}

export function footerHTML() {
  const s = store.settings();
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer on-ink">
    <div class="wrap footer-grid">
      <div class="f-brand">
        <a class="logo" href="${href('/')}" aria-label="ML Group home">${logo()}</a>
        <p>Discounted products for retail customers and wholesale buyers. New deals every week, shipped fast or ready for local pickup.</p>
        <div class="f-ship"><b>${icon('truck', 'icon-sm')} Shipping</b><span>Flat shipping price shown on every product. Orders ship in 1–2 business days.</span><b>${icon('store', 'icon-sm')} Local pickup always available</b><span>${esc(s.pickupHours)}</span></div>
      </div>
      <div class="f-col"><h2>Shop</h2><ul>
        <li><a href="${href('/products')}">All products</a></li>
        <li><a href="${href('/categories')}">Categories</a></li>
        <li><a href="${href('/wholesale')}">Wholesale</a></li>
      </ul></div>
      <div class="f-col"><h2>Help</h2><ul>
        <li><a href="${href('/shipping-policy')}">Shipping &amp; pickup</a></li>
        <li><a href="${href('/refund-policy')}">Refund policy</a></li>
        <li><a href="${href('/account')}">Order history</a></li>
        <li><a href="${href('/about')}">About ML Group</a></li>
        <li><a href="${href('/contact')}">Contact us</a></li>
      </ul></div>
      <div class="f-col"><h2>Contact</h2><ul class="f-contact">
        <li>${icon('phone', 'icon-sm')}<a href="${telHref(s.phone)}">${esc(s.phone)}</a></li>
        <li>${icon('mail', 'icon-sm')}<a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>
        <li>${icon('pin', 'icon-sm')}<span>${s.address1 ? esc(s.address1) + '<br>' : ''}${esc(s.city)}, ${esc(s.state)} ${esc(s.zip)}</span></li>
        <li>${icon('clock', 'icon-sm')}<span>${esc(s.pickupHours)}</span></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><div class="wrap">
      <span>© ${year} ML Group. All rights reserved.</span>
      <nav aria-label="Footer"><a href="${href('/refund-policy')}">Refund Policy</a><a href="${href('/shipping-policy')}">Shipping</a><a href="${href('/contact')}">Contact</a><a class="admin-link" href="${href('/admin')}">${icon('lock', 'icon-sm')} Admin</a></nav>
    </div></div>
  </footer>`;
}

// ---------------------------------------------------------------- product card
export function priceHTML(p, { save = false } = {}) {
  const off = pctOff(p);
  return `<div class="price"><span class="now tabnum">${money(p.price)}</span>${off ? `<s class="was tabnum">${money(p.originalPrice)}</s>` : ''}${save && off ? `<span class="save">Save ${money(p.originalPrice - p.price)}</span>` : ''}</div>`;
}

export function cardHTML(p, { eager = false, sizes } = {}) {
  const off = pctOff(p);
  const url = href('/products/' + p.slug);
  const ims = p.images.length ? p.images : [null];
  const slides = ims.map((im, i) => `<a href="${url}" ${i ? 'tabindex="-1" aria-hidden="true"' : `aria-label="${esc(p.title)}"`}>${imgTag(im, { alt: i ? '' : p.title, eager: eager && i === 0, sizes })}</a>`).join('');
  return `<article class="card" data-pid="${p.id}">
    <div class="card-media" data-carousel>
      <div class="track">${slides}</div>
      ${off ? `<span class="badge">-${off}%</span>` : ''}
      ${ims.length > 1 ? `<button class="car-btn prev" type="button" aria-label="Previous photo" data-car="-1">${icon('left', 'icon-sm')}</button><button class="car-btn next" type="button" aria-label="Next photo" data-car="1">${icon('right', 'icon-sm')}</button><div class="dots">${ims.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}
    </div>
    <div class="card-body">
      <p class="card-cond">${esc(p.condition)}</p>
      <h3 class="card-title"><a href="${url}">${esc(p.title)}</a></h3>
      <div class="price">${off ? `<s class="was was-slash tabnum">${money(p.originalPrice)}</s>` : ''}<span class="now tabnum">${money(p.price)}</span></div>
      <ul class="card-ship"><li>${icon('store', 'icon-sm')} Available for pick up</li>${p.noShipping ? '' : `<li>${icon('truck', 'icon-sm')} Available for shipping${p.shipping > 0 ? ` · ${money(p.shipping)}` : ' · Free'}</li>`}</ul>
      ${p.inventory <= 3 ? `<p class="stock-low">Only ${p.inventory} left</p>` : ''}
      <div class="card-actions">
        <button class="btn" type="button" data-offer="${p.id}">Make Offer</button>
        <button class="btn btn-primary" type="button" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

export function mountCarousels(root = document) {
  $$('[data-carousel]', root).forEach((el) => {
    if (el._car) return; el._car = true;
    const track = $('.track', el);
    const dots = $$('.dots i', el);
    const counter = $('.g-count', el);
    const thumbs = el.closest('.gallery') ? $$('.g-thumbs button', el.closest('.gallery')) : [];
    let raf = 0;
    const update = () => {
      raf = 0;
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      thumbs.forEach((t, k) => t.setAttribute('aria-current', k === i ? 'true' : 'false'));
      if (counter) counter.textContent = `${i + 1} / ${track.children.length}`;
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-car]'); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      const n = track.children.length, w = track.clientWidth;
      const i = Math.round(track.scrollLeft / w);
      const next = (i + Number(b.dataset.car) + n) % n;
      track.scrollTo({ left: next * w, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    thumbs.forEach((t, k) => t.addEventListener('click', () => track.scrollTo({ left: k * track.clientWidth, behavior: 'smooth' })));
  });
}

// ---------------------------------------------------------------- search
function searchHTML(id) {
  return `<form class="search" role="search" data-search action="${href('/products')}">
    <div class="search-field">${icon('search')}
      <label class="sr-only" for="${id}-q">Search products</label>
      <input id="${id}-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search products, brands, UPC…" role="combobox" aria-expanded="false" aria-controls="${id}-pop" aria-autocomplete="list">
      <button class="search-clear" type="button" aria-label="Clear search" data-clear hidden>${icon('close', 'icon-sm')}</button>
    </div>
    <div class="search-pop" id="${id}-pop" role="listbox" aria-label="Search suggestions"></div>
  </form>`;
}

const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
function hl(text, terms) {
  let out = esc(text);
  terms.filter((t) => t.length > 1).forEach((t) => { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
  return out;
}
export function searchProducts(q, limit = 99) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const cats = Object.fromEntries(store.categories().map((c) => [c.id, c.name]));
  const res = [];
  for (const p of store.products()) {
    const title = norm(p.title), brand = norm(p.brand), cat = norm(cats[p.categoryId]), upc = String(p.upc || '');
    const hay = `${title} ${brand} ${cat} ${upc} ${norm(p.condition)}`;
    if (!terms.every((t) => hay.includes(t))) continue;
    let score = 0;
    terms.forEach((t) => {
      if (title.startsWith(t)) score += 6;
      if (new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(title)) score += 3;
      if (brand.startsWith(t)) score += 4;
      if (upc && upc.startsWith(t)) score += 8;
      if (cat.startsWith(t)) score += 2;
    });
    res.push({ p, score: score });
  }
  return res.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.p);
}

function mountSearch(form, navigate) {
  const input = $('input', form), pop = $('.search-pop', form), clear = $('[data-clear]', form);
  let active = -1;
  const options = () => $$('[role="option"]', pop);
  const close = () => { pop.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); active = -1; input.removeAttribute('aria-activedescendant'); };
  const setActive = (i) => {
    const opts = options(); if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    opts.forEach((o, k) => o.classList.toggle('active', k === active));
    input.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  };
  const render = () => {
    const q = input.value.trim();
    clear.hidden = !q;
    if (!q) { close(); return; }
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const cats = store.categories().filter((c) => terms.every((t) => norm(c.name).includes(t)));
    const brands = [...new Set(store.products().map((p) => p.brand).filter(Boolean))].filter((b) => terms.every((t) => norm(b).includes(t))).slice(0, 4);
    const prods = searchProducts(q, 6);
    const id = input.id;
    let n = 0;
    let html = '';
    if (cats.length) html += `<div class="sp-group"><p class="sp-label">Categories</p><div class="sp-chips">${cats.map((c) => `<a class="chip" role="option" id="${id}-o${n++}" href="${href('/categories/' + c.slug)}">${hl(c.name, terms)}</a>`).join('')}</div></div>`;
    if (brands.length) html += `<div class="sp-group"><p class="sp-label">Brands</p><div class="sp-chips">${brands.map((b) => `<a class="chip" role="option" id="${id}-o${n++}" href="${href('/products?q=' + encodeURIComponent(b))}">${hl(b, terms)}</a>`).join('')}</div></div>`;
    if (prods.length) {
      html += `<div class="sp-group"><p class="sp-label">Products</p>${prods.map((p) => `<a class="sp-item" role="option" id="${id}-o${n++}" href="${href('/products/' + p.slug)}">${imgTag(p.images[0], { alt: '', sizes: '48px', w: 48 })}<span><span class="sp-name">${hl(p.title, terms)}</span><span class="sp-meta">${esc(p.brand || '')} · ${esc(p.condition)}${/^\d{4,}$/.test(q) ? ` · UPC ${hl(p.upc, terms)}` : ''}</span></span><span class="sp-price tabnum">${money(p.price)}${pctOff(p) ? `<s>${money(p.originalPrice)}</s>` : ''}</span></a>`).join('')}</div>`;
    }
    if (!html) html = `<p class="sp-empty">No matches for “${esc(q)}”. Try a brand, category or UPC.</p>`;
    else html += `<a class="sp-all" role="option" id="${id}-o${n++}" href="${href('/products?q=' + encodeURIComponent(q))}">See all results for “${esc(q)}” →</a>`;
    pop.innerHTML = html;
    pop.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
    active = -1;
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', () => { if (input.value.trim()) render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!pop.classList.contains('open')) render(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') { close(); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); options()[active].click(); }
  });
  clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim(); close();
    navigate('/products' + (q ? '?q=' + encodeURIComponent(q) : ''));
    input.blur();
  });
  pop.addEventListener('click', (e) => { if (e.target.closest('a')) { close(); input.blur(); const ms = document.getElementById('mobile-search'); if (ms && form.closest('#mobile-search')) { ms.hidden = true; $('[data-msearch]').setAttribute('aria-expanded', 'false'); } } });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
}

// ---------------------------------------------------------------- sheets (menu + cart) with focus trap
let lastFocus = null;
function trap(e) {
  const sheet = $('.sheet.open'); if (!sheet || e.key !== 'Tab') return;
  const f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', sheet).filter((x) => x.offsetParent !== null);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
}
export function openSheet(id) {
  const sheet = document.getElementById(id); if (!sheet) return;
  lastFocus = document.activeElement;
  closeSheets(true);
  sheet.classList.add('open');
  const ov = $(`[data-overlay="${id === 'cart-sheet' ? 'cart' : 'menu'}"]`); if (ov) ov.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => { const f = $('button, a[href]', sheet); if (f) f.focus(); }, 60);
  $$('[data-menu]').forEach((b) => b.setAttribute('aria-expanded', id === 'menu-sheet' ? 'true' : 'false'));
}
export function closeSheets(silent) {
  const was = $('.sheet.open');
  $$('.sheet.open, .overlay.open').forEach((el) => el.classList.remove('open'));
  document.documentElement.style.overflow = '';
  $$('[data-menu]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  if (was && !silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

// ---------------------------------------------------------------- cart drawer
export function cartSheetHTML() {
  return `<div class="overlay" data-overlay="cart"></div>
  <aside class="sheet right" id="cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div class="sheet-head"><h2 id="cart-title">Your cart</h2><button class="icon-btn" type="button" aria-label="Close cart" data-close-cart>${icon('close')}</button></div>
    <div class="sheet-body" data-cart-body></div>
    <div class="sheet-foot" data-cart-foot></div>
  </aside>`;
}

export function renderCart() {
  const body = $('[data-cart-body]'), foot = $('[data-cart-foot]');
  const items = cart.items();
  const count = items.reduce((s, i) => s + i.qty, 0);
  $$('[data-cart-count]').forEach((b) => { b.textContent = count; b.hidden = !count; });
  if (!body) return;
  $('#cart-title').textContent = count ? `Your cart (${count})` : 'Your cart';
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">${icon('bag')}<p><b>Your cart is empty.</b></p><p class="muted">Find something good in today’s deals.</p><a class="btn btn-primary" href="${href('/products')}" data-close-cart>Browse Deals</a></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = `<ul class="cart-items">${items.map(({ product: p, qty }) => `
    <li class="cart-item" data-line="${p.id}">
      <a href="${href('/products/' + p.slug)}" data-close-cart tabindex="-1" aria-hidden="true">${imgTag(p.images[0], { alt: '', sizes: '84px' })}</a>
      <div>
        <div class="ci-top"><a class="ci-title" href="${href('/products/' + p.slug)}" data-close-cart>${esc(p.title)}</a><span class="ci-price tabnum">${money(p.price * qty)}</span></div>
        <p class="ci-meta">${esc(p.condition)} · ${money(p.price)} each${p.inventory <= 5 ? ` · ${p.inventory} available` : ''}</p>
        <div class="ci-row">
          <div class="qty" role="group" aria-label="Quantity for ${esc(p.title)}">
            <button type="button" aria-label="Decrease quantity" data-qty="-1" ${qty <= 1 ? 'disabled' : ''}>${icon('minus', 'icon-sm')}</button>
            <input type="number" inputmode="numeric" min="1" max="${p.inventory}" value="${qty}" aria-label="Quantity" data-qty-input>
            <button type="button" aria-label="Increase quantity" data-qty="1" ${qty >= p.inventory ? 'disabled' : ''}>${icon('plus', 'icon-sm')}</button>
          </div>
          <button class="ci-remove" type="button" data-remove>${icon('trash', 'icon-sm')} Remove</button>
        </div>
      </div>
    </li>`).join('')}</ul>`;
  foot.innerHTML = `<div class="cart-sum"><div class="row total"><span>Subtotal</span><span class="tabnum">${money(cart.subtotal())}</span></div></div>
    <p class="cart-note">${icon('truck', 'icon-sm')} Shipping or free local pickup — choose at checkout.</p>
    <a class="btn btn-primary btn-lg btn-block" href="${href('/checkout')}" data-close-cart>Checkout</a>
    <button class="btn btn-block" type="button" data-close-cart>Continue shopping</button>`;
}

function mountCart() {
  const sheet = $('#cart-sheet');
  sheet.addEventListener('click', (e) => {
    const line = e.target.closest('[data-line]');
    const q = e.target.closest('[data-qty]');
    if (q && line) { const it = cart.items().find((i) => i.product.id === line.dataset.line); if (it) cart.set(it.product.id, it.qty + Number(q.dataset.qty)); }
    if (e.target.closest('[data-remove]') && line) cart.remove(line.dataset.line);
  });
  sheet.addEventListener('change', (e) => {
    if (e.target.matches('[data-qty-input]')) { const line = e.target.closest('[data-line]'); cart.set(line.dataset.line, Math.max(1, parseInt(e.target.value, 10) || 1)); }
  });
  window.addEventListener('cart:change', () => {
    renderCart();
    $$('[data-cart-count]').forEach((b) => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  });
  renderCart();
}

export function addToCart(id, qty = 1) {
  const p = store.productById(id);
  if (!p || p.inventory <= 0) { toast('Sorry, that item just sold out.', 'err'); return; }
  cart.add(id, qty);
  openSheet('cart-sheet');
}

// ---------------------------------------------------------------- make offer dialog
export function openOffer(id) {
  const p = store.productById(id); if (!p) return;
  let dlg = $('#offer-dialog');
  if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'offer-dialog'; dlg.className = 'modal'; dlg.setAttribute('aria-labelledby', 'offer-title'); document.body.appendChild(dlg); }
  dlg.innerHTML = `
    <div class="modal-head"><h2 id="offer-title">Make an offer</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dialog>${icon('close')}</button></div>
    <form class="modal-body form" novalidate data-offer-form>
      <div class="offer-item">${imgTag(p.images[0], { alt: '', sizes: '64px' })}<div><b>${esc(p.title)}</b><span>Listed at <b class="tabnum" style="display:inline">${money(p.price)}</b> · ${esc(p.condition)}</span></div></div>
      <div class="field"><label for="of-name">Name</label><input id="of-name" name="name" autocomplete="name" required maxlength="80"></div>
      <div class="field"><label for="of-phone">Phone number</label><input id="of-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(555) 555-5555" maxlength="24"></div>
      <div class="field"><label for="of-amount">Your offer</label><div class="money-input"><span>$</span><input id="of-amount" name="amount" type="number" inputmode="decimal" min="1" step="0.01" required placeholder="${Math.round(p.price * 0.85)}"></div><span class="hint">We usually reply by text within one business day.</span></div>
      <div class="hp" aria-hidden="true"><label for="of-web">Website</label><input id="of-web" name="website" tabindex="-1" autocomplete="off"></div>
      <p class="form-error" data-err hidden></p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Submit offer</button>
    </form>`;
  const form = $('[data-offer-form]', dlg);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const err = $('[data-err]', form);
    const name = String(f.get('name') || '').trim(), phone = String(f.get('phone') || '').trim(), amount = Number(f.get('amount'));
    const bad = [];
    [['of-name', !name], ['of-phone', phone.replace(/\D/g, '').length < 10], ['of-amount', !(amount > 0)]].forEach(([id, isBad]) => { $('#' + id).setAttribute('aria-invalid', isBad ? 'true' : 'false'); if (isBad) bad.push(id); });
    if (bad.length) { err.textContent = 'Please enter your name, a 10-digit phone number and an offer amount.'; err.hidden = false; $('#' + bad[0]).focus(); return; }
    const btn = $('button[type="submit"]', form); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      if (!f.get('website')) await store.submitOffer({ productId: p.id, name, phone, amount });
      form.innerHTML = `<div class="success"><span class="check">${icon('check')}</span><p class="offer-thanks">We have received your offer, and we will text you later today. The text will come from our number <b>${esc(store.settings().phone || '(425) 757-2554')}</b>.</p><p class="offer-thanks"><b>Thank you.</b></p><button class="btn btn-primary" type="button" data-close-dialog>Done</button></div>`;
    } catch (ex) { err.textContent = ex.message || 'Something went wrong. Please try again.'; err.hidden = false; btn.disabled = false; btn.textContent = 'Submit offer'; }
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close-dialog]')) dlg.close(); });
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  setTimeout(() => { const i = $('#of-name', dlg); if (i) i.focus(); }, 50);
}

// ---------------------------------------------------------------- global wiring
function paintLikes() {
  const n = likes.count();
  $$('[data-like-count]').forEach((el) => { el.textContent = n ? String(n) : ''; });
  $$('[data-like]').forEach((b) => { const on = likes.has(b.dataset.like); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Remove from liked items' : 'Add to liked items'); });
}
export function mountChrome(navigate) {
  paintLikes();
  window.addEventListener('likes:changed', paintLikes);
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-like]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const on = await likes.toggle(b.dataset.like);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    toast(on ? 'Saved to Liked items' : 'Removed from Liked items');
  }, true);
  $$('[data-search]').forEach((f) => mountSearch(f, navigate));
  mountCart();
  // categories dropdown
  const dd = $('[data-dd]');
  if (dd) {
    const panel = document.getElementById(dd.getAttribute('aria-controls'));
    const li = dd.closest('.nav-dd');
    let t;
    const set = (open) => { dd.setAttribute('aria-expanded', open ? 'true' : 'false'); panel.classList.toggle('open', open); };
    dd.addEventListener('click', () => set(dd.getAttribute('aria-expanded') !== 'true'));
    li.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) { clearTimeout(t); set(true); } });
    li.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover)').matches) t = setTimeout(() => set(false), 160); });
    li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); dd.focus(); } });
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', (e) => { if (!li.contains(e.target)) set(false); });
  }
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-open-cart]')) { openSheet('cart-sheet'); return; }
    if (t.closest('[data-menu]')) { openSheet('menu-sheet'); return; }
    if (t.closest('[data-close-cart]') || t.closest('[data-close-menu]') || t.closest('.overlay')) { closeSheets(!!t.closest('a')); }
    const mt = t.closest('.menu-toggle');
    if (mt) { const open = mt.getAttribute('aria-expanded') !== 'true'; mt.setAttribute('aria-expanded', open); document.getElementById(mt.getAttribute('aria-controls')).hidden = !open; }
    if (t.closest('.menu-sheet a')) closeSheets(true);
    const ms = t.closest('[data-msearch]');
    if (ms) {
      const box = $('#mobile-search'); const open = box.hidden;
      box.hidden = !open; ms.setAttribute('aria-expanded', open);
      if (open) setTimeout(() => $('input', box).focus(), 30);
    }
    const add = t.closest('[data-add]');
    if (add) { e.preventDefault(); addToCart(add.dataset.add, Number(add.dataset.qty || 1)); }
    const off = t.closest('[data-offer]');
    if (off) { e.preventDefault(); openOffer(off.dataset.offer); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('.sheet.open')) closeSheets(); trap(e); });
}

export function markNav(path) {
  $$('[data-nav]').forEach((a) => {
    const p = a.dataset.nav;
    const on = p === '/' ? path === '/' : path.startsWith(p);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
export { debounce };
