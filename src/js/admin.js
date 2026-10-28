// ML Group admin dashboard. Mounted by main.js at /admin with the shared store instance.
import { $, $$, esc, money, pctOff, href, img, imgTag, icon, logo, telHref, fmtDate, round2, slugify, ENV, CARRIERS, carrierName, trackUrl } from './lib.js';
import { toast } from './ui.js';

const TABS = [
  ['overview', 'Overview', 'chart'],
  ['products', 'Products', 'tag'],
  ['orders', 'Orders', 'box'],
  ['inventory', 'Inventory', 'layers'],
  ['offers', 'Offers', 'cash'],
  ['messages', 'Messages', 'msg'],
  ['settings', 'Settings', 'gear'],
  ['profit', 'Profit', 'percent'],
];
const CONDITIONS = ['New', 'Open Box', 'Like New', 'Refurbished', 'Used – Good', 'Used – Fair', 'Scratch & Dent'];
const ORDER_STATUS = [['new', 'New'], ['processing', 'Processing'], ['ready', 'Ready for pickup'], ['shipped', 'Shipped'], ['completed', 'Completed'], ['cancelled', 'Cancelled']];
const OFFER_STATUS = [['new', 'New'], ['contacted', 'Contacted'], ['accepted', 'Accepted'], ['declined', 'Declined']];
const MSG_STATUS = [['new', 'New'], ['read', 'Read'], ['archived', 'Archived']];

function mount(main, { store, navigate, query }) {
  const A = store.admin;
  let tab = query.get('tab') || 'overview';
  let editId = query.get('edit') || null;
  let data = { products: [], orders: [], offers: [], inquiries: [] };
  let prodFilter = { q: '', f: 'all' };
  let selected = new Set();
  let draft = null; // product being edited
  const setURL = () => {
    const q = new URLSearchParams(); if (tab !== 'overview') q.set('tab', tab); if (editId) q.set('edit', editId);
    const path = '/admin' + (q.toString() ? '?' + q : '');
    if (ENV.routing === 'path') history.replaceState({}, '', href(path)); else if (ENV.routing === 'hash') history.replaceState(null, '', '#' + path);
  };
  const catName = (id) => (store.category(id) || {}).name || '—';
  const refreshStore = () => { store.refresh(); window.dispatchEvent(new CustomEvent('cart:change')); };

  async function loadAll() {
    const [products, orders, offers, inquiries] = await Promise.all([A.products(), A.orders(), A.offers(), A.inquiries()]);
    const costs = await (A.costs ? A.costs().catch(() => ({})) : {});
    data = { products, orders, offers, inquiries, costs };
  }

  // ------------------------------------------------------------ login
  async function renderLogin(msg) {
    main.innerHTML = `<div class="adm-login"><form class="adm-login-card" novalidate data-login>
      <a class="logo adm-logo" href="${href('/')}" aria-label="Back to store">${logo()}</a>
      <div><h1>Admin sign in</h1><p class="muted">Enter the store password to manage listings, orders and offers.</p></div>
      <div class="field"><label for="adm-pw">Password</label><input id="adm-pw" name="pw" type="password" autocomplete="current-password" required autofocus></div>
      <p class="form-error" data-err ${msg ? '' : 'hidden'}>${esc(msg || '')}</p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${icon('lock', 'icon-sm')} Sign in</button>
      ${store.kind === 'local' ? `<p class="form-note">${store.offline ? 'Store database unreachable — using this browser’s copy.' : 'Preview mode: changes are saved in this browser.'}</p>` : ''}
      <a class="link" href="${href('/')}" style="justify-self:center;font-size:14px">← Back to store</a>
    </form></div>`;
    setTimeout(() => { const i = $('#adm-pw'); if (i) i.focus(); }, 30);
  }

  // ------------------------------------------------------------ nav badges (unseen items)
  // "Seen" = the tab was opened in this browser. Messages count people, so several messages from one person show as 1.
  const SEEN_KEY = 'mlgroup-admin-seen-v1';
  const seenIds = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch { return new Set(); } };
  const saveSeen = (set) => { try { localStorage.setItem(SEEN_KEY, JSON.stringify([...set].slice(-3000))); } catch {} };
  const isPickupReq = (m) => m.type === 'pickup' && m.status === 'new';
  const isMsgReq = (m) => m.type !== 'pickup' && m.status === 'new';
  function unseenBadge(k) {
    const seen = seenIds();
    if (k === 'orders') return data.orders.filter((o) => o.status === 'new' && !seen.has('o:' + o.id)).length + data.inquiries.filter((m) => isPickupReq(m) && !seen.has('m:' + m.id)).length;
    if (k === 'offers') return data.offers.filter((o) => o.status === 'new' && !seen.has('f:' + o.id)).length;
    if (k === 'messages') return new Set(data.inquiries.filter((m) => isMsgReq(m) && !seen.has('m:' + m.id)).map((m) => String(m.email || m.phone || m.name || m.id).toLowerCase())).size;
    return 0;
  }
  function markSeen(k) {
    const seen = seenIds();
    if (k === 'orders') { data.orders.filter((o) => o.status === 'new').forEach((o) => seen.add('o:' + o.id)); data.inquiries.filter(isPickupReq).forEach((m) => seen.add('m:' + m.id)); }
    if (k === 'offers') data.offers.filter((o) => o.status === 'new').forEach((o) => seen.add('f:' + o.id));
    if (k === 'messages') data.inquiries.filter(isMsgReq).forEach((m) => seen.add('m:' + m.id));
    saveSeen(seen);
  }
  // Update the badge circles on the nav in place (no page redraw).
  function paintBadges() {
    $$('nav[aria-label="Admin"] [data-tab]').forEach((b) => {
      const k = b.dataset.tab; const n = k === tab ? 0 : unseenBadge(k);
      let el = b.querySelector('.adm-badge');
      if (!n) { if (el) el.remove(); return; }
      if (!el) { el = document.createElement('b'); el.className = 'adm-badge'; b.appendChild(el); }
      el.textContent = n;
    });
  }
  if (!window.__admBadgePoll) {
    window.__admBadgePoll = setInterval(async () => {
      if (document.hidden || !data || !$('nav[aria-label="Admin"]')) return;
      try { await loadAll(); paintBadges(); } catch {}
    }, 30000);
  }

  // ------------------------------------------------------------ shell
  function shell(body, title, actions = '') {
    const nNew = (k, st = 'new') => data[k].filter((x) => x.status === st).length;
    const badge = {};
    ['orders', 'offers', 'messages'].forEach((k) => { badge[k] = k === tab ? 0 : unseenBadge(k); });
    return `<div class="admin">
      <aside class="adm-side on-ink">
        <a class="logo" href="${href('/')}" aria-label="View store">${logo()}</a>
        <span class="adm-tag">Admin</span>
        <nav aria-label="Admin"><ul>${TABS.map(([k, l, ic]) => `<li><button type="button" data-tab="${k}" ${tab === k ? 'aria-current="page"' : ''}>${icon(ic)}<span>${l}</span>${badge[k] ? `<b class="adm-badge">${badge[k]}</b>` : ''}</button></li>`).join('')}</ul></nav>
        <div class="adm-side-foot"><a href="${href('/')}">${icon('eye', 'icon-sm')} View store</a><button type="button" data-logout>${icon('logout', 'icon-sm')} Sign out</button></div>
      </aside>
      <section class="adm-main">
        <header class="adm-top"><h1>${title}</h1><div class="adm-actions">${actions}</div></header>
        ${store.kind === 'local' ? `<p class="adm-note">${icon('lock', 'icon-sm')} ${store.offline ? 'The store database could not be reached, so changes are saved only in this browser.' : 'Preview mode — changes are saved in this browser. Connect the store database to publish changes to every customer.'}</p>` : ''}
        <div class="adm-body">${body}</div>
      </section>
    </div>`;
  }

  async function render() {
    if (!(await A.session())) { renderLogin(); return; }
    await loadAll();
    markSeen(tab);
    setURL();
    if (tab === 'products' && editId) return renderEditor();
    const views = { overview, products, orders, offers, requests: orders, messages, categories: overview, settings, revenue, profit, sales: salesPage, inventory };
    (views[tab] || overview)();
  }

  // ------------------------------------------------------------ overview
  function overview() {
    const P = data.products;
    const live = P.filter((p) => p.published && p.inventory > 0);
    const out = P.filter((p) => p.inventory <= 0);
    const since = Date.now() - 30 * 864e5;
    const rev = data.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt) > since).reduce((s, o) => s + o.total, 0);
    const tiles = [
      ['Live listings', live.length, 'Published and in stock'],
      ['New orders', data.orders.filter((o) => o.status === 'new').length, `${data.orders.length} total`],
      ['Units in stock', P.reduce((s, p) => s + Math.max(0, p.inventory), 0), `${out.length} sold out (hidden)`],
      ['New offers', data.offers.filter((o) => o.status === 'new').length, `${data.offers.length} total`],
      ['Sales · 30 days', money(rev), 'Tap for sales breakdown'],
      ['Messages', data.inquiries.filter((o) => o.status === 'new').length, 'Contact + wholesale'],
    ];
    main.innerHTML = shell(`
      <div class="adm-tiles">${tiles.map(([l, v, s]) => l.startsWith('Sales') ? `<button type="button" class="adm-tile adm-tile-link" data-sales-breakdown aria-label="Open sales breakdown"><span class="eyebrow">${l} ${icon('right', 'icon-sm')}</span><b class="tabnum">${v}</b><span class="muted">${s}</span></button>` : `<div class="adm-tile"><span class="eyebrow">${l}</span><b class="tabnum">${v}</b><span class="muted">${s}</span></div>`).join('')}</div>
      <div class="adm-cols two">
        <section class="adm-card"><div class="adm-card-head"><h2>Recent orders</h2><button class="link" type="button" data-tab="orders">All orders</button></div>
          ${data.orders.length ? `<ul class="adm-list">${data.orders.slice(0, 6).map((o) => `<li><button type="button" data-open-order="${o.id}"><span><b class="mono">#${o.number}</b> ${esc(o.customer.name)}<small>${fmtDate(o.createdAt, true)} · ${(() => { const n = o.items.reduce((t, i) => t + (i.qty || 1), 0); return `${n} item${n === 1 ? '' : 's'}`; })()} · ${o.fulfillment === 'pickup' ? 'Pickup' : 'Ship'}</small></span><span class="tabnum">${money(o.total)}</span>${needsConfirm(o) ? '<span class="adm-needs">Confirm</span>' : ''}${(() => { const im = o.items[0] && o.items[0].image; return im ? `<img class="adm-ord-img" src="${esc(img(im.sm || im.lg))}" alt="${esc(o.items[0].title)}" width="52" height="52" loading="lazy">` : '<span class="adm-ord-img adm-noimg"></span>'; })()}</button></li>`).join('')}</ul>` : '<p class="muted adm-empty">No orders yet. They appear here as soon as a customer checks out.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>Latest offers</h2><button class="link" type="button" data-tab="offers">All offers</button></div>
          ${data.offers.length ? `<ul class="adm-list">${data.offers.slice(0, 6).map((o) => `<li><button type="button" data-tab="offers"><span><b>${money(o.amount)}</b> for ${esc(o.productTitle)}<small>${esc(o.name)} · ${esc(o.phone)} · ${fmtDate(o.createdAt, true)}</small></span><span class="status s-${o.status}">${statusLabel(OFFER_STATUS, o.status)}</span></button></li>`).join('')}</ul>` : '<p class="muted adm-empty">No offers yet. Offers from the “Make Offer” button land here.</p>'}
        </section>
      </div>`, 'Overview', `<button class="btn btn-primary" type="button" data-new>${icon('plus', 'icon-sm')} Add product</button>`);
  }
  const statusLabel = (list, v) => (list.find(([k]) => k === v) || [v, v])[1];

  // ------------------------------------------------------------ products list
  function products() {
    const q = prodFilter.q.toLowerCase();
    let list = data.products.filter((p) => !q || `${p.title} ${p.brand || ''} ${p.upc || ''} ${p.slug}`.toLowerCase().includes(q));
    const f = prodFilter.f;
    if (f === 'live') list = list.filter((p) => p.published && p.inventory > 0);
    if (f === 'hidden') list = list.filter((p) => !p.published);
    if (f === 'out') list = list.filter((p) => p.inventory <= 0);
    selected = new Set([...selected].filter((id) => data.products.some((p) => p.id === id)));
    main.innerHTML = shell(`
      <div class="adm-toolbar">
        <div class="search-field adm-search">${icon('search')}<label class="sr-only" for="pf-q">Search products</label><input id="pf-q" type="search" placeholder="Search title, brand, UPC" value="${esc(prodFilter.q)}" data-pf-q></div>
        <div class="select"><label class="sr-only" for="pf-f">Show</label><select id="pf-f" data-pf-f>${[['all', 'All products'], ['live', 'Live'], ['hidden', 'Unpublished'], ['out', 'Sold out']].map(([v, l]) => `<option value="${v}" ${f === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('down')}</div>
        <span class="muted" style="font-size:14px">${list.length} of ${data.products.length}</span>
      </div>
      <div class="adm-bulk" data-bulk ${selected.size ? '' : 'hidden'}>
        <b data-bulk-n>${selected.size} selected</b>
        <label class="adm-inline">Discount <input type="number" min="1" max="95" value="20" data-bulk-pct aria-label="Discount percent"> %</label>
        <button class="btn btn-sm" type="button" data-bulk="discount">Apply discount</button>
        <button class="btn btn-sm" type="button" data-bulk="publish">Publish</button>
        <button class="btn btn-sm" type="button" data-bulk="unpublish">Unpublish</button>
        <button class="btn btn-sm" type="button" data-bulk="delete">Delete</button>
      </div>
      <div class="table-wrap"><table class="tbl adm-table"><thead><tr>
        <th><input type="checkbox" aria-label="Select all" data-sel-all ${list.length && list.every((p) => selected.has(p.id)) ? 'checked' : ''}></th>
        <th>Product</th><th>Price</th><th>Inventory</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
        ${list.map((p) => `<tr data-row="${p.id}" class="${p.inventory <= 0 || !p.published ? 'dim' : ''}">
          <td><input type="checkbox" aria-label="Select ${esc(p.title)}" data-sel="${p.id}" ${selected.has(p.id) ? 'checked' : ''}></td>
          <td><div class="adm-prod">${p.images[0] ? `<img src="${esc(img(p.images[0].sm))}" alt="" width="48" height="48" loading="lazy">` : '<span class="adm-noimg"></span>'}<div><button class="adm-title" type="button" data-edit="${p.id}">${esc(p.title)}</button><small>${esc(catName(p.categoryId))} · ${esc(p.condition)}${p.noShipping ? ' · Pick up only' : ''}${p.upc ? ' · ' + esc(p.upc) : ''}</small></div></div></td>
          <td class="tabnum"><b>${money(p.price)}</b>${pctOff(p) ? `<small><s>${money(p.originalPrice)}</s> · -${pctOff(p)}%</small>` : ''}</td>
          <td><div class="adm-stock"><button type="button" aria-label="Decrease inventory" data-inv="-1" data-id="${p.id}">${icon('minus', 'icon-sm')}</button><b class="tabnum">${p.inventory}</b><button type="button" aria-label="Increase inventory" data-inv="1" data-id="${p.id}">${icon('plus', 'icon-sm')}</button></div>${p.inventory <= 0 ? '<small>Sold out · hidden</small>' : ''}</td>
          <td><label class="switch"><input type="checkbox" data-pub="${p.id}" ${p.published ? 'checked' : ''}><span>${p.published ? 'Published' : 'Hidden'}</span></label></td>
          <td class="adm-row-actions"><button class="btn btn-sm" type="button" data-edit="${p.id}">${icon('edit', 'icon-sm')} Edit</button>${p.published && p.inventory > 0 ? `<a class="btn btn-sm" href="${href('/products/' + p.slug)}" target="_blank" rel="noopener" aria-label="View ${esc(p.title)} on the store">${icon('eye', 'icon-sm')}</a>` : ''}</td>
        </tr>`).join('') || '<tr><td colspan="6" class="muted">No products match.</td></tr>'}
      </tbody></table></div>`, 'Products', `<button class="btn btn-primary" type="button" data-new>${icon('plus', 'icon-sm')} Add product</button>`);
  }

  // ------------------------------------------------------------ product editor
  // The product form, shared by the Products editor and the scanner's Add popup.
  function editorForm(d, isNew) {
    const pct = d.originalPrice && d.price && Number(d.originalPrice) > Number(d.price) ? Math.round((1 - d.price / d.originalPrice) * 100) : '';
    return `      <form class="adm-editor" novalidate data-editor>
        <div class="adm-ed-main">
          <section class="adm-card"><div class="adm-card-head"><h2>Details</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-title">Title</label><input id="ed-title" name="title" required maxlength="140" value="${esc(d.title)}" placeholder="e.g. 55&quot; 4K Smart TV – Open Box"></div>
            <div class="field"><label for="ed-desc">Description</label><textarea id="ed-desc" name="description" rows="8" placeholder="What it is, condition notes, what’s included. Start lines with • for bullet points.">${esc(d.description)}</textarea></div>
            <input type="hidden" id="ed-brand" name="brand" value="${esc(d.brand || '')}">
            <div class="field"><label for="ed-upc">UPC <span class="opt">(optional)</span></label><input id="ed-upc" name="upc" inputmode="numeric" maxlength="14" value="${esc(d.upc || '')}"><span class="hint">8–14 digits from the barcode.</span></div>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Photos</h2><span class="muted" style="font-size:13px">First photo is the cover. Drag to reorder.</span></div><div class="adm-card-body">
            <div class="adm-photos" data-photos>${photosHTML(d)}</div>
            <label class="adm-drop" data-drop><input type="file" accept="image/*" multiple data-files class="sr-only">${icon('upload')}<span><b>Add photos</b> — click or drop images here</span><small>JPG, PNG, WebP or HEIC-converted. Resized automatically.</small></label>
            <p class="muted" data-upload-status aria-live="polite" style="font-size:13px"></p>
          </div></section>
        </div>
        <div class="adm-ed-side">
          <input type="checkbox" name="published" hidden ${d.published ? 'checked' : ''}>
          <section class="adm-card"><div class="adm-card-head"><h2>Pricing</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-orig">Original / retail price</label><div class="money-input"><span>$</span><input id="ed-orig" name="originalPrice" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(d.originalPrice ?? '')}"></div></div>
            <input type="hidden" id="ed-pct" name="pct" value="${pct}">
            <div class="field"><label for="ed-price">Sale price</label><div class="money-input"><span>$</span><input id="ed-price" name="price" type="number" inputmode="decimal" min="0" step="0.01" required value="${esc(d.price ?? '')}"></div></div>
            <div class="field"><label for="ed-ship">Shipping price</label><div class="money-input"><span>$</span><input id="ed-ship" name="shipping" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(d.shipping ?? 0)}"></div><span class="hint">Local pickup is always free.</span></div>
            <label class="check-row"><input type="checkbox" name="noShipping" ${d.noShipping ? 'checked' : ''}> <span><b>Not available for shipping</b><br><span class="hint">The store will only show “Available for pick up”.</span></span></label>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Inventory</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-inv">Quantity in stock</label><div class="qty" style="height:46px"><button type="button" aria-label="Decrease" data-ed-inv="-1">${icon('minus', 'icon-sm')}</button><input id="ed-inv" name="inventory" type="number" inputmode="numeric" min="0" step="1" value="${esc(d.inventory)}" style="width:80px"><button type="button" aria-label="Increase" data-ed-inv="1">${icon('plus', 'icon-sm')}</button></div></div>
          </div></section>
          <input type="hidden" name="categoryId" value="${esc(d.categoryId || '')}">
          <input type="hidden" name="condition" value="${esc(d.condition || 'New')}">
          <input type="hidden" name="slug" value="${esc(d.slug || '')}">
          <p class="form-error" data-err hidden></p>
          <div class="adm-ed-actions">
            <button class="btn btn-primary btn-lg" type="submit">${isNew ? 'List product' : 'Save changes'}</button>
            <button class="btn btn-lg" type="button" data-cancel-edit>Cancel</button>
            ${isNew ? '' : `<button class="btn btn-lg adm-danger" type="button" data-delete-product>${icon('trash', 'icon-sm')} Delete</button>`}
          </div>
          <div class="adm-confirm" data-confirm hidden><p><b>Delete this product?</b> This can’t be undone.</p><div><button class="btn btn-sm adm-danger" type="button" data-confirm-delete>Delete</button><button class="btn btn-sm" type="button" data-confirm-cancel>Keep it</button></div></div>
        </div>
      </form>`;
  }

  function renderEditor() {
    const isNew = editId === 'new';
    const p = isNew ? null : data.products.find((x) => x.id === editId);
    if (!isNew && !p) { editId = null; return products(); }
    if (!draft || draft._for !== editId) {
      draft = p ? JSON.parse(JSON.stringify(p)) : { title: '', slug: '', brand: '', upc: '', condition: 'New', categoryId: (store.categories()[0] || {}).id || null, description: '', price: '', originalPrice: '', shipping: 9.95, inventory: 1, published: true, bestDeal: false, images: [] };
      draft._for = editId;
    }
    const d = draft;
    main.innerHTML = shell(editorForm(d, isNew), `<button class="adm-back" type="button" data-cancel-edit>${icon('left')} Back</button>`, `<button class="adm-scan" type="button" data-scan aria-label="Scan barcode for UPC"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 8v8M9 8v8M11.5 8v8M13 8v8M15.5 8v8M17.5 8v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>SCAN</span></button>`);
    wireEditor();
  }

  function photosHTML(d) {
    if (!d.images.length) return '<p class="muted" style="font-size:14px">No photos yet.</p>';
    return d.images.map((im, i) => `<figure class="adm-photo" draggable="true" data-ph="${i}">
      <img src="${esc(img(im.sm || im.lg))}" alt="Photo ${i + 1}">
      ${i === 0 ? '<span class="adm-cover">Cover</span>' : ''}
      <figcaption>
        <button type="button" aria-label="Move photo ${i + 1} left" data-ph-move="-1" ${i === 0 ? 'disabled' : ''}>${icon('left', 'icon-sm')}</button>
        <span class="mono">${i + 1}</span>
        <button type="button" aria-label="Move photo ${i + 1} right" data-ph-move="1" ${i === d.images.length - 1 ? 'disabled' : ''}>${icon('right', 'icon-sm')}</button>
        <button type="button" aria-label="Delete photo ${i + 1}" data-ph-del>${icon('trash', 'icon-sm')}</button>
      </figcaption></figure>`).join('');
  }

  function wireEditor(opts = {}) {
    const form = $('[data-editor]');
    const isNew = opts.isNew != null ? opts.isNew : editId === 'new';
    const f = (n) => form.elements[n];
    const redrawPhotos = () => { $('[data-photos]').innerHTML = photosHTML(draft); };
    const syncDraft = () => {
      ['title', 'description', 'brand', 'upc', 'slug', 'condition', 'categoryId'].forEach((k) => { draft[k] = f(k).value; });
      draft.price = f('price').value; draft.originalPrice = f('originalPrice').value; draft.shipping = f('shipping').value; draft.inventory = f('inventory').value;
      draft.published = f('published').checked; draft.noShipping = f('noShipping').checked;
    };
    form.addEventListener('input', (e) => {
      const n = e.target.name;
      const orig = parseFloat(f('originalPrice').value), pctv = parseFloat(f('pct').value), price = parseFloat(f('price').value);
      if (n === 'pct' && orig > 0 && pctv >= 0) f('price').value = round2(orig * (1 - pctv / 100)).toFixed(2);
      if (n === 'price' && orig > 0 && price >= 0) f('pct').value = price < orig ? Math.round((1 - price / orig) * 100) : '';
      if (n === 'originalPrice' && orig > 0 && pctv > 0) f('price').value = round2(orig * (1 - pctv / 100)).toFixed(2);
      if (n === 'title' || n === 'slug') { const sp = $('[data-slug-preview]'); if (sp) sp.textContent = slugify(f('slug').value || f('title').value) || 'product-name'; }
      syncDraft();
    });
    form.addEventListener('change', syncDraft);
    form.addEventListener('click', async (e) => {
      const inv = e.target.closest('[data-ed-inv]');
      if (inv) { f('inventory').value = Math.max(0, (parseInt(f('inventory').value, 10) || 0) + Number(inv.dataset.edInv)); syncDraft(); }
      const mv = e.target.closest('[data-ph-move]');
      if (mv) { const i = Number(mv.closest('[data-ph]').dataset.ph), j = i + Number(mv.dataset.phMove); [draft.images[i], draft.images[j]] = [draft.images[j], draft.images[i]]; redrawPhotos(); }
      const del = e.target.closest('[data-ph-del]');
      if (del) { const i = Number(del.closest('[data-ph]').dataset.ph); const [rm] = draft.images.splice(i, 1); if (A.removeImage) A.removeImage(rm).catch(() => {}); redrawPhotos(); }
      if (e.target.closest('[data-delete-product]')) { $('[data-confirm]').hidden = false; }
      if (e.target.closest('[data-confirm-cancel]')) { $('[data-confirm]').hidden = true; }
      if (e.target.closest('[data-confirm-delete]')) { await A.deleteProduct(editId); refreshStore(); toast('Product deleted'); editId = null; draft = null; render(); }
    });
    // drag & drop reorder
    let dragFrom = null;
    const ph = $('[data-photos]');
    ph.addEventListener('dragstart', (e) => { const fig = e.target.closest('[data-ph]'); if (fig) { dragFrom = Number(fig.dataset.ph); e.dataTransfer.effectAllowed = 'move'; fig.classList.add('dragging'); } });
    ph.addEventListener('dragover', (e) => { if (dragFrom !== null) { e.preventDefault(); } });
    ph.addEventListener('drop', (e) => {
      const fig = e.target.closest('[data-ph]'); if (dragFrom === null || !fig) return;
      e.preventDefault(); const to = Number(fig.dataset.ph);
      const [m] = draft.images.splice(dragFrom, 1); draft.images.splice(to, 0, m); dragFrom = null; redrawPhotos();
    });
    ph.addEventListener('dragend', () => { dragFrom = null; $$('.dragging').forEach((x) => x.classList.remove('dragging')); });
    // uploads
    const status = $('[data-upload-status]');
    const upload = async (files) => {
      files = Array.from(files).filter((x) => x.type.startsWith('image/'));
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        status.textContent = `Uploading ${i + 1} of ${files.length}…`;
        try { const im = await A.uploadImage(files[i]); draft.images.push({ ...im, alt: '' }); redrawPhotos(); }
        catch (ex) { toast(`Couldn’t upload ${files[i].name}: ${ex.message}`, 'err'); }
      }
      status.textContent = `${files.length} photo${files.length > 1 ? 's' : ''} added — remember to save.`;
    };
    $('[data-files]').addEventListener('change', (e) => { upload(e.target.files); e.target.value = ''; });
    const drop = $('[data-drop]');
    drop.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); drop.classList.add('over'); } });
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) { e.preventDefault(); drop.classList.remove('over'); upload(e.dataTransfer.files); } });
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); syncDraft();
      const err = $('[data-err]');
      const price = parseFloat(draft.price), orig = parseFloat(draft.originalPrice), ship = parseFloat(draft.shipping || 0), inv = parseInt(draft.inventory, 10);
      const upc = String(draft.upc || '').replace(/\D/g, '');
      const problems = [];
      if (!draft.title.trim()) problems.push(['ed-title', 'Add a title.']);
      if (String(draft.price ?? '').trim() === '' || !(price >= 0)) problems.push(['ed-price', 'Enter a sale price ($0 or more).']);
      if (!(inv >= 0)) problems.push(['ed-inv', 'Inventory must be 0 or more.']);
      if (!(ship >= 0)) problems.push(['ed-ship', 'Shipping must be 0 or more.']);
      if (upc && (upc.length < 8 || upc.length > 14)) problems.push(['ed-upc', 'UPC should be 8–14 digits.']);
      $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid'));
      if (problems.length) { problems.forEach(([id]) => $('#' + id).setAttribute('aria-invalid', 'true')); err.textContent = problems.map((x) => x[1]).join(' '); err.hidden = false; $('#' + problems[0][0]).focus(); return; }
      const rec = {
        id: isNew ? undefined : editId, title: draft.title.trim(), slug: draft.slug.trim(), brand: draft.brand.trim(), upc,
        condition: draft.condition, categoryId: draft.categoryId || null, description: draft.description.trim(),
        price: round2(price), originalPrice: orig > price ? round2(orig) : null, shipping: round2(ship), inventory: inv,
        published: draft.published, bestDeal: false, noShipping: !!draft.noShipping, images: draft.images,
      };
      const btn = $('button[type="submit"]', form); btn.disabled = true; btn.textContent = 'Saving…';
      try {
        const saved = await A.saveProduct(rec);
        refreshStore();
        toast(isNew ? 'Product created' : 'Changes saved');
        if (opts.onSaved) return opts.onSaved(saved);
        editId = null; draft = null; tab = 'products';
        render();
        return saved;
      } catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; btn.textContent = isNew ? 'List product' : 'Save changes'; }
    });
  }

  // ------------------------------------------------------------ inventory & cost
  let invQ = '';
  let invSort = 'stock';
  const INV_SORTS = [['stock', 'In stock first'], ['cost-high', 'Cost: high to low'], ['cost-low', 'Cost: low to high'], ['recent', 'Recently added']];
  // Items without a cost always sort to the end of the cost sorts.
  const sortInv = (list) => {
    // Sort by total cost on hand (cost × units in stock), so 10 units outrank 1 unit of a pricier item.
    const byCost = (dir) => (a, b) => { const ca = costOf(a); const cb = costOf(b); if (ca == null || cb == null) return (ca == null) - (cb == null) || a.title.localeCompare(b.title); const ta = ca * Math.max(0, a.inventory); const tb = cb * Math.max(0, b.inventory); return dir * (tb - ta) || a.title.localeCompare(b.title); };
    if (invSort === 'cost-high') return list.sort(byCost(1));
    if (invSort === 'cost-low') return list.sort(byCost(-1));
    if (invSort === 'recent') return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list.sort((a, b) => (b.inventory > 0) - (a.inventory > 0) || a.title.localeCompare(b.title));
  };
  const upcKey = (u) => String(u || '').replace(/\D/g, '').replace(/^0+/, '');
  const costOf = (p) => (data.costs && data.costs[p.id] != null ? data.costs[p.id] : null);
  const fmtCost = (v) => (v == null ? '' : Number(v).toFixed(2));
  function invTotals() {
    const P = data.products;
    const units = P.reduce((t, p) => t + Math.max(0, p.inventory), 0);
    const costVal = round2(P.reduce((t, p) => t + (costOf(p) != null ? costOf(p) * Math.max(0, p.inventory) : 0), 0));
    const retail = round2(P.reduce((t, p) => t + p.price * Math.max(0, p.inventory), 0));
    const missing = P.filter((p) => p.inventory > 0 && costOf(p) == null).length;
    return { units, costVal, retail, missing };
  }
  function invRow(p) {
    const c = costOf(p); const tot = c != null ? money(c * Math.max(0, p.inventory)) : '—';
    return `<li class="inv-row${p.inventory <= 0 ? ' is-out' : ''}" data-inv="${p.id}">
      ${p.images[0] ? `<img src="${esc(img(p.images[0].sm))}" alt="" width="52" height="52" loading="lazy">` : '<span class="adm-noimg"></span>'}
      <div><div class="inv-title">${esc(p.title)}</div><div class="inv-meta">${p.upc ? 'UPC ' + esc(p.upc) : 'No UPC'}${p.published ? '' : ' · Hidden'}</div></div>
      <div class="inv-nums">
        <div><small>Stock</small><label class="sp-money inv-stock-in"><input type="number" inputmode="numeric" min="0" step="1" value="${p.inventory}" data-inv-setstock="${p.id}" aria-label="Stock of ${esc(p.title)}"></label></div>
        <div><small>Price</small><b class="tabnum">${money(p.price)}</b></div>
        <div><small>Cost</small><label class="sp-money"><span>$</span><input type="number" inputmode="decimal" min="0" step="0.01" placeholder="0.00" value="${fmtCost(c)}" data-cost="${p.id}" aria-label="Cost of ${esc(p.title)}"></label></div>
        <div><small>Total cost</small><b class="tabnum" data-inv-total>${tot}</b></div>
      </div></li>`;
  }
  // Rows for the current search. Typing only swaps these rows, so the search box keeps focus and the page doesn't jump.
  function invRowsHTML() {
    const q = invQ.trim().toLowerCase(); const qd = upcKey(invQ);
    const list = sortInv(data.products.filter((p) => !q || p.title.toLowerCase().includes(q) || (qd && upcKey(p.upc).includes(qd))));
    return list.map(invRow).join('') || '<li class="inv-row"><span></span><span class="muted">No matching items.</span></li>';
  }
  function inventory() {
    const t = invTotals();
    main.innerHTML = shell(`
      <div class="adm-tiles inv-tiles">
        <div class="adm-tile"><span class="eyebrow">Inventory value (cost)</span><b class="tabnum" data-inv-costval>${money(t.costVal)}</b><span class="muted" data-inv-missing>${t.missing ? `${t.missing} in-stock item${t.missing === 1 ? '' : 's'} still need a cost` : 'All in-stock items have a cost'}</span></div>
        <div class="adm-tile"><span class="eyebrow">Retail value</span><b class="tabnum">${money(t.retail)}</b><span class="muted">At your website prices</span></div>
        <div class="adm-tile"><span class="eyebrow">Units in stock</span><b class="tabnum">${t.units}</b><span class="muted">${data.products.filter((p) => p.inventory > 0).length} items in stock</span></div>
      </div>
      <div class="inv-tools"><input type="search" placeholder="Search by name or UPC" value="${esc(invQ)}" data-inv-q aria-label="Search inventory"><div class="select"><label class="sr-only" for="inv-sort">Sort inventory</label><select id="inv-sort" data-inv-sort>${INV_SORTS.map(([v, l]) => `<option value="${v}" ${invSort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('down')}</div></div>
      <ul class="inv-list">${invRowsHTML()}</ul>`, 'Inventory', `<button class="btn btn-primary" type="button" data-inv-scan>${icon('camera', 'icon-sm')} Scan</button>`);
  }
  // Update tiles and one row in place (no re-render, so typing and scrolling aren't interrupted).
  function invRefresh(id) {
    const t = invTotals();
    const cv = $('[data-inv-costval]'); if (cv) cv.textContent = money(t.costVal);
    const ms = $('[data-inv-missing]'); if (ms) ms.textContent = t.missing ? `${t.missing} in-stock item${t.missing === 1 ? '' : 's'} still need a cost` : 'All in-stock items have a cost';
    const p = data.products.find((x) => x.id === id); const row = id && $(`[data-inv="${id}"]`);
    if (p && row) { const c = costOf(p); const si = $('[data-inv-setstock]', row); if (si && document.activeElement !== si) si.value = p.inventory; $('[data-inv-total]', row).textContent = c != null ? money(c * Math.max(0, p.inventory)) : '—'; row.classList.toggle('is-out', p.inventory <= 0); }
  }
  async function saveCost(id, raw) {
    const v = raw === '' ? null : round2(Math.max(0, Number(raw)));
    if (raw !== '' && !Number.isFinite(v)) return;
    data.costs = data.costs || {};
    if (v == null) delete data.costs[id]; else data.costs[id] = v;
    try { await A.setCost(id, v); } catch (ex) { toast(ex.message || 'Could not save the cost'); }
  }
  // Mini add-product popup from the scanner: the full product form. "List product" posts it and returns to the scanner.
  function openAddProduct(code, onSaved) {
    draft = { title: '', slug: '', brand: '', upc: code, condition: 'New', categoryId: (store.categories()[0] || {}).id || null, description: '', price: '', originalPrice: '', shipping: 9.95, inventory: 1, published: true, bestDeal: false, images: [] };
    const dlg = document.createElement('dialog');
    dlg.className = 'modal adm-add-dlg';
    dlg.innerHTML = `<div class="adm-add-head"><h2>Add product</h2><button class="btn btn-sm" type="button" data-add-close aria-label="Close">${icon('close', 'icon-sm')}</button></div><div class="adm-add-body">${editorForm(draft, true)}</div>`;
    const close = () => { dlg.close(); dlg.remove(); };
    document.body.appendChild(dlg);
    dlg.querySelector('[data-add-close]').addEventListener('click', close);
    dlg.querySelector('[data-cancel-edit]').addEventListener('click', close);
    dlg.showModal();
    wireEditor({ isNew: true, onSaved: async (saved) => { close(); await loadAll(); onSaved(saved); } });
  }
  async function invScan() {
    if (!window.MLScanner) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = ENV.root + 'assets/scanner.js' + (ENV.cfg.v ? '?v=' + ENV.cfg.v : ''); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    let cur = null; // { code, id }
    const h = window.MLScanner.open({
      continuous: true,
      onResult: (code) => { cur = { code, id: (data.products.find((p) => p.upc && upcKey(p.upc) === upcKey(code)) || {}).id || null }; paint(true); },
      onError: (msg) => toast(msg),
      onClose: () => { if (tab === 'inventory') inventory(); },
    });
    // Typed UPC box is always there, above the results card.
    h.panel.innerHTML = `<form class="sp-type" data-sp-type><label class="sr-only" for="sp-upc">Type a UPC</label><input id="sp-upc" type="text" inputmode="numeric" autocomplete="off" placeholder="Type UPC" enterkeyhint="search"><button class="btn btn-primary" type="submit">Search</button></form><div data-sp-out></div>`;
    const panel = $('[data-sp-out]', h.panel);
    // Put the typed-UPC box right under the scan frame, inside the camera view.
    const typeForm = h.panel.querySelector('[data-sp-type]'); const cam = h.panel.parentElement.querySelector('.scan-cam'); if (cam) cam.appendChild(typeForm);
    typeForm.addEventListener('submit', (e) => {
      e.preventDefault(); const inp = e.target.querySelector('input'); const code = inp.value.replace(/\D/g, '');
      if (code.length < 6) { toast('Enter at least 6 digits'); return; }
      cur = { code, id: (data.products.find((p) => p.upc && upcKey(p.upc) === upcKey(code)) || {}).id || null }; paint(true); inp.value = ''; inp.blur();
    });
    const paint = (fresh) => {
      if (!cur) { panel.innerHTML = '<p class="sp-empty">Scan a barcode or type the UPC in the box under the camera. Each new scan shows up here — the camera stays on.</p>'; return; }
      const p = cur.id && data.products.find((x) => x.id === cur.id);
      const c = p ? costOf(p) : null;
      panel.innerHTML = `<div class="sp-card"${fresh ? '' : ' style="animation:none"'}>
        <div class="sp-upc"><b>${esc(cur.code)}</b><button class="btn btn-sm" type="button" data-sp-copy>Copy</button></div>
        ${p ? `<div class="sp-prod">${p.images[0] ? `<img src="${esc(img(p.images[0].sm))}" alt="">` : ''}<div><h3>${esc(p.title)}</h3><div class="sp-stock">In stock: <button type="button" class="sp-stock-btn tabnum" data-sp-edit aria-label="Change stock">${p.inventory} ${icon('edit', 'icon-sm')}</button> · ${money(p.price)}</div>${p.inventory <= 0 || !p.published ? `<div class="sp-status">${p.inventory <= 0 ? 'Sold out — saved, not showing on the website' : 'Hidden from the website'}${!p.published ? ` <button class="btn btn-sm" type="button" data-sp-relist>Show on website</button>` : ' · add stock to relist'}</div>` : '<div class="sp-status ok">Live on the website</div>'}</div></div>
          <div class="sp-cost"><label>Cost per item<span class="sp-money"><span>$</span><input type="number" inputmode="decimal" min="0" step="0.01" placeholder="0.00" value="${fmtCost(c)}" data-sp-cost></span></label><div class="sp-total"><small>Total cost (${p.inventory})</small><b class="tabnum" data-sp-total>${c != null ? money(c * Math.max(0, p.inventory)) : '—'}</b></div></div>
          <div class="sp-actions"><button class="btn" type="button" data-sp="-1">${icon('minus', 'icon-sm')} Reduce by 1</button><button class="btn adm-danger" type="button" data-sp="out">Mark out of stock</button><button class="btn btn-primary" type="button" data-sp="+1">${icon('plus', 'icon-sm')} Add 1 stock</button></div>`
        : '<div class="sp-new-row"><p class="sp-new">This item isn’t on the website.</p><button class="btn btn-primary" type="button" data-sp-add>Add</button></div>'}
      </div>`;
    };
    paint(false);
    // iOS ignores touch-action on some versions: block the double-tap zoom gesture on the action buttons.
    let lastTap = 0;
    panel.addEventListener('touchend', (e) => { if (!e.target.closest('.sp-actions, [data-sp-edit], [data-sp-copy], [data-sp-add]')) return; const now = Date.now(); if (now - lastTap < 350) { e.preventDefault(); e.target.closest('button').click(); } lastTap = now; }, { passive: false });
    panel.addEventListener('click', async (e) => {
      if (e.target.closest('[data-sp-copy]')) { try { await navigator.clipboard.writeText(cur.code); e.target.closest('button').textContent = 'Copied'; } catch { toast('Copy not available — press and hold the number to copy'); } return; }
      if (e.target.closest('[data-sp-edit]') && cur && cur.id) {
        const p = data.products.find((x) => x.id === cur.id); const btn = e.target.closest('[data-sp-edit]');
        btn.outerHTML = `<form class="sp-stock-form" data-sp-stockform><input type="number" inputmode="numeric" min="0" step="1" value="${p.inventory}" aria-label="New stock"><button class="btn btn-sm btn-primary" type="submit">Save</button></form>`;
        const inp = $('[data-sp-stockform] input', panel); inp.focus(); inp.select();
        return;
      }
      if (e.target.closest('[data-sp-relist]') && cur && cur.id) {
        const p = data.products.find((x) => x.id === cur.id);
        try { const np = await A.patchProduct(p.id, { published: true }); p.published = true; if (np) p.inventory = np.inventory; refreshStore(); } catch (ex) { toast(ex.message || 'Could not relist'); }
        paint(false); return;
      }
      if (e.target.closest('[data-sp-add]')) { openAddProduct(cur.code, (saved) => { cur = { code: cur.code, id: saved.id }; paint(true); }); return; }
      const b = e.target.closest('[data-sp]'); if (!b || !cur || !cur.id) return;
      const p = data.products.find((x) => x.id === cur.id); if (!p) return;
      $$('[data-sp]', panel).forEach((x) => { x.disabled = true; });
      try {
        let np;
        if (b.dataset.sp === 'out') np = await A.patchProduct(p.id, { inventory: 0 });
        else np = await A.adjustInventory(p.id, b.dataset.sp === '+1' ? 1 : -1);
        p.inventory = np && np.inventory != null ? np.inventory : p.inventory;
        refreshStore();
      } catch (ex) { toast(ex.message || 'Could not update stock'); }
      paint(false);
    });
    panel.addEventListener('submit', async (e) => {
      if (!e.target.matches('[data-sp-stockform]')) return; e.preventDefault();
      const p = data.products.find((x) => x.id === cur.id); const n = parseInt(e.target.querySelector('input').value, 10);
      if (!(n >= 0)) { toast('Enter a number 0 or higher'); return; }
      try { const np = await A.patchProduct(p.id, { inventory: n }); p.inventory = np && np.inventory != null ? np.inventory : n; refreshStore(); } catch (ex) { toast(ex.message || 'Could not update stock'); }
      paint(false);
    });
    panel.addEventListener('input', (e) => {
      if (!e.target.matches('[data-sp-cost]') || !cur || !cur.id) return;
      const p = data.products.find((x) => x.id === cur.id); const v = e.target.value;
      const tot = $('[data-sp-total]', panel); if (tot) tot.textContent = v === '' ? '—' : money(Number(v) * Math.max(0, p.inventory));
      clearTimeout(invScan.t); invScan.t = setTimeout(() => saveCost(p.id, v), 500);
    });
  }

  // ------------------------------------------------------------ profit
  let profitPeriod = '30';
  // One row per sale: revenue (items, excluding shipping, minus refunds) minus the cost of what sold.
  function profitRows(from, to) {
    const costs = data.costs || {};
    return data.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt) >= from && new Date(o.createdAt) <= to).map((o) => {
      const cost = round2(o.items.reduce((t, i) => t + (costs[i.productId] != null ? costs[i.productId] * (i.qty || 1) : 0), 0));
      const missing = o.items.filter((i) => costs[i.productId] == null).length;
      const refunds = refundsOf(o).reduce((t, r) => t + Number(r.amount), 0);
      const revenue = round2((o.subtotal != null ? o.subtotal : o.total) - refunds);
      return { o, cost, revenue, profit: round2(revenue - cost), missing };
    });
  }
  function profit() {
    const [from, to] = revRange(profitPeriod);
    const rows = profitRows(from, to);
    const total = round2(rows.reduce((t, r) => t + r.profit, 0));
    const rev = round2(rows.reduce((t, r) => t + r.revenue, 0));
    const missing = rows.reduce((t, r) => t + r.missing, 0);
    const margin = rev ? Math.round((total / rev) * 100) : 0;
    main.innerHTML = shell(`
      <div class="rv-periods" role="group" aria-label="Time period">${REV_PERIODS.map(([k, l]) => `<button type="button" class="chip${profitPeriod === k ? ' is-on' : ''}" data-prof="${k}" aria-pressed="${profitPeriod === k}">${l}</button>`).join('')}</div>
      <div class="adm-tiles rv-tiles">
        <div class="adm-tile"><span class="eyebrow">Profit</span><b class="tabnum">${money(total)}</b><span class="muted">${rows.length} sale${rows.length === 1 ? '' : 's'}</span></div>
        <div class="adm-tile"><span class="eyebrow">Margin</span><b class="tabnum">${margin}%</b><span class="muted">Profit ÷ revenue</span></div>
        ${missing ? `<div class="adm-tile"><span class="eyebrow">Missing cost</span><b class="tabnum">${missing}</b><span class="muted">items sold with no cost yet</span></div>` : ''}
      </div>
      <section class="adm-card"><div class="adm-card-head"><h2>Profit by sale</h2></div>
        ${rows.length ? `<table class="rv-table"><thead><tr><th>Date</th><th>Order</th><th class="num">Profit</th></tr></thead><tbody>${rows.slice().sort((a, b) => new Date(b.o.createdAt) - new Date(a.o.createdAt)).map((r) => `<tr><td>${fmtDate(r.o.createdAt, true)}</td><td><button class="link mono" type="button" data-open-order="${r.o.id}">#${r.o.number}</button>${r.missing ? ' <small class="muted">· cost missing</small>' : ''}</td><td class="num tabnum">${money(r.profit)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted adm-empty">No sales in this period.</p>'}
      </section>
      ${salesDataHTML()}
      <dialog class="modal adm-order-dlg" id="order-dlg" aria-labelledby="od-title"></dialog>`, 'Profit', `<button class="btn btn-sm" type="button" data-tab="overview">${icon('left', 'icon-sm')} Overview</button>`);
  }

  // ------------------------------------------------------------ sales data (owner's sheet, since 2024)
  const SALES_TOTALS = { gross: 253099.17, expenses: 169954.44, profit: 83144.74 };
  // Monthly profit from the owner's sheet (before the website). From January 2026 each month uses the average until changed here.
  const SALES_MONTHS = [['2024-04', 471.83], ['2024-05', 481.14], ['2024-06', 292.82], ['2024-07', 1101.99], ['2024-08', 1797.00], ['2024-09', 1592.18], ['2024-10', 446.34], ['2024-11', 396.66], ['2024-12', 1596.93],
    ['2025-01', 2000.00], ['2025-02', 2000.00], ['2025-03', 3000.00], ['2025-04', 3000.00], ['2025-05', 3000.00], ['2025-06', 2037.59], ['2025-07', 3002.21], ['2025-08', 2753.21], ['2025-09', 3184.79], ['2025-10', 3231.09], ['2025-11', 3123.05], ['2025-12', 4516.84]];
  const SALES_AVG_2026 = 2771.49;
  function salesDataHTML() {
    const T = SALES_TOTALS;
    return `<section class="adm-card sales-data"><div class="adm-card-head"><h2>Sales data</h2><span class="muted" style="font-size:13px">Since 2024, from your sheet</span></div>
      <div class="adm-card-body">
        <div class="adm-tiles rv-tiles">
          <div class="adm-tile"><span class="eyebrow">Revenue (since 2024)</span><b class="tabnum">${money(T.gross)}</b><span class="muted">Gross revenue</span></div>
          <div class="adm-tile"><span class="eyebrow">Profit (since 2024)</span><b class="tabnum">${money(T.profit)}</b><span class="muted">From your sheet</span></div>
        </div>
      </div></section>`;
  }

  // ------------------------------------------------------------ sales breakdown (pop-up from Overview)
  let sbUnit = 'month';
  const SB_UNITS = [['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['year', 'Year']];
  const ymd = (t) => `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  // Period key for a date in local time: the day, the Monday of its week, the month (YYYY-MM) or the year.
  function periodOf(d, unit) {
    const x = new Date(d);
    if (unit === 'year') return String(x.getFullYear());
    if (unit === 'month') return ymd(x).slice(0, 7);
    if (unit === 'week') { const w = new Date(x.getFullYear(), x.getMonth(), x.getDate()); w.setDate(w.getDate() - ((w.getDay() + 6) % 7)); return ymd(w); }
    return ymd(x);
  }
  function periodLabel(key, unit) {
    if (unit === 'year') return key;
    if (unit === 'month') return new Date(key + '-01T12:00:00').toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const day = new Date(key + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return unit === 'week' ? `Week of ${day}` : day;
  }
  // Rows per period. Site = orders on this website (revenue, expenses, profit). Sheet and Average = profit only.
  function salesBreakdownRows(unit) {
    const now = new Date();
    const bucket = (u) => {
      const m = new Map();
      profitRows(new Date(0), now).forEach((r) => {
        const k = periodOf(r.o.createdAt, u);
        const x = m.get(k) || { key: k, revenue: 0, expenses: 0, profit: 0 };
        x.revenue = round2(x.revenue + r.revenue); x.expenses = round2(x.expenses + r.cost); x.profit = round2(x.profit + r.profit);
        m.set(k, x);
      });
      return m;
    };
    if (unit === 'day' || unit === 'week') {
      return [...bucket(unit).values()].map((r) => ({ ...r, label: periodLabel(r.key, unit), source: 'Site' }));
    }
    const site = bucket('month'); const sheet = new Map(SALES_MONTHS); const out = [];
    for (let i = 2024 * 12 + 3; i <= now.getFullYear() * 12 + now.getMonth(); i++) {
      const y = Math.floor(i / 12); const key = `${y}-${String(i % 12 + 1).padStart(2, '0')}`;
      const s = site.get(key); site.delete(key);
      if (s) out.push({ ...s, label: periodLabel(key, 'month'), source: 'Site' });
      else if (sheet.has(key)) out.push({ key, label: periodLabel(key, 'month'), revenue: null, expenses: null, profit: sheet.get(key), source: 'Sheet' });
      else if (y === 2026) out.push({ key, label: periodLabel(key, 'month'), revenue: null, expenses: null, profit: SALES_AVG_2026, source: 'Average' });
    }
    site.forEach((s) => out.push({ ...s, label: periodLabel(s.key, 'month'), source: 'Site' }));
    if (unit === 'month') return out.sort((a, b) => (a.key < b.key ? -1 : 1));
    const years = new Map();
    out.forEach((r) => {
      const y = r.key.slice(0, 4);
      const x = years.get(y) || { key: y, label: y, revenue: null, expenses: null, profit: 0, source: 'Year' };
      if (r.revenue != null) x.revenue = round2((x.revenue || 0) + r.revenue);
      if (r.expenses != null) x.expenses = round2((x.expenses || 0) + r.expenses);
      x.profit = round2(x.profit + r.profit);
      years.set(y, x);
    });
    return [...years.values()].sort((a, b) => (a.key < b.key ? -1 : 1));
  }
  const sbMoney = (v) => (v == null ? '—' : money(v));
  // Sales page: revenue, expenses and profit for a range. Site orders are exact; the sheet adds profit for whole months in the range.
  let sbRange = 'all';
  const SB_RANGES = [['today', 'Today'], ['7', 'Last 7 days'], ['30', 'Last 30 days'], ['ytd', 'YTD'], ['lastyear', 'Last year'], ['all', 'All time']];
  function rangeBounds(key) {
    const now = new Date(); const y = now.getFullYear(); const startDay = new Date(y, now.getMonth(), now.getDate());
    if (key === 'today') return { from: startDay, to: now };
    if (key === '7' || key === '30') return { from: new Date(startDay - Number(key) * 864e5), to: now };
    if (key === 'ytd') return { from: new Date(y, 0, 1), to: now };
    if (key === 'lastyear') return { from: new Date(y - 1, 0, 1), to: new Date(y - 1, 11, 31, 23, 59, 59, 999) };
    return { from: new Date(0), to: now };
  }
  function rangeTotals(key) {
    if (key === 'all') return { revenue: SALES_TOTALS.gross, expenses: SALES_TOTALS.expenses, profit: SALES_TOTALS.profit };
    const b = rangeBounds(key); const now = new Date();
    const site = profitRows(b.from, b.to);
    const siteMonths = new Set(profitRows(new Date(0), now).map((r) => periodOf(r.o.createdAt, 'month')));
    let profit = site.reduce((t, r) => t + r.profit, 0); let sheetMonths = 0;
    const months = [...SALES_MONTHS];
    for (let mo = 1; mo <= now.getMonth() + 1; mo++) months.push([`${now.getFullYear()}-${String(mo).padStart(2, '0')}`, SALES_AVG_2026]);
    months.forEach(([m, v]) => {
      if (siteMonths.has(m)) return;
      const [yy, mm] = m.split('-').map(Number);
      if (new Date(yy, mm - 1, 1) >= b.from && new Date(yy, mm, 0, 23, 59, 59, 999) <= b.to) { profit += v; sheetMonths++; }
    });
    // The sheet has monthly profit only, so revenue and expenses can't be shown for ranges that include sheet months.
    const exact = sheetMonths === 0;
    return {
      revenue: exact ? round2(site.reduce((t, r) => t + r.revenue, 0)) : null,
      expenses: exact ? round2(site.reduce((t, r) => t + r.cost, 0)) : null,
      profit: round2(profit),
    };
  }
  function salesPage() {
    const T = rangeTotals(sbRange);
    const rows = salesBreakdownRows(sbUnit).slice().reverse();
    const note = sbUnit === 'day' || sbUnit === 'week'
      ? 'Day and week views only cover orders on this website. Your sheet has monthly profit only.'
      : 'Site = orders on this website. Sheet = your monthly profit from before the website. Average = the monthly average from January 2026 until you change it.';
    const line = (label, v, neg) => `<div class="sb-row"><span class="eyebrow">${label}</span><b class="tabnum">${v == null ? '—' : (neg ? '-' : '') + money(v)}</b></div>`;
    main.innerHTML = shell(`
      <div class="sb-rows">
        ${line('Revenue', T.revenue)}
        ${line('Expenses', T.expenses, true)}
        ${line('Profit', T.profit)}
      </div>
      <div class="rv-periods" role="group" aria-label="Time range">${SB_RANGES.map(([k, l]) => `<button type="button" class="chip${sbRange === k ? ' is-on' : ''}" data-sbr="${k}" aria-pressed="${sbRange === k}">${l}</button>`).join('')}</div>
      <div class="rv-periods" role="group" aria-label="Breakdown by">${SB_UNITS.map(([k, l]) => `<button type="button" class="chip${sbUnit === k ? ' is-on' : ''}" data-sb="${k}" aria-pressed="${sbUnit === k}">${l}</button>`).join('')}</div>
      <section class="adm-card"><div class="adm-card-head"><h2>By ${SB_UNITS.find((u) => u[0] === sbUnit)[1].toLowerCase()}</h2></div>
        ${rows.length ? `<table class="rv-table sb-table"><thead><tr><th>Period</th><th class="num">Revenue</th><th class="num">Expenses</th><th class="num">Profit</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${esc(r.label)} <small class="muted">· ${r.source}</small></td><td class="num tabnum">${sbMoney(r.revenue)}</td><td class="num tabnum">${sbMoney(r.expenses)}</td><td class="num tabnum">${sbMoney(r.profit)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted adm-empty">No sales yet for this view.</p>'}
      </section>
      <p class="muted" style="font-size:13px">${note}</p>`, 'Sales', `<button class="btn btn-sm" type="button" data-tab="overview">${icon('left', 'icon-sm')} Overview</button>`);
  }

  // ------------------------------------------------------------ revenue report
  let revPeriod = '30';
  const REV_PERIODS = [['today', 'Today'], ['7', '7 days'], ['30', '30 days'], ['90', '90 days'], ['ytd', 'Year to date'], ['all', 'All time']];
  const isInPerson = (o) => o.customer && o.customer.name === 'In-person sale';
  const qtyOf = (o) => o.items.reduce((t, i) => t + (i.qty || 1), 0);
  function revRange(key, now = new Date()) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (key === 'today') return [day, now];
    if (key === 'ytd') return [new Date(now.getFullYear(), 0, 1), now];
    if (key === 'all') { const first = data.orders.reduce((m, o) => Math.min(m, +new Date(o.createdAt)), +now); return [new Date(first), now]; }
    const n = Number(key); return [new Date(day.getTime() - (n - 1) * 864e5), now];
  }
  function revenue() {
    const valid = data.orders.filter((o) => o.status !== 'cancelled');
    const [from, to] = revRange(revPeriod);
    const inP = valid.filter((o) => { const d = new Date(o.createdAt); return d >= from && d <= to; });
    // previous period of equal length, for the change badge
    const len = to - from; const prevFrom = new Date(from - len); const prev = valid.filter((o) => { const d = new Date(o.createdAt); return d >= prevFrom && d < from; });
    const sum = (l) => round2(l.reduce((t, o) => t + o.total, 0));
    const total = sum(inP), prevTotal = sum(prev);
    const units = inP.reduce((t, o) => t + qtyOf(o), 0);
    const ship = round2(inP.reduce((t, o) => t + (o.shippingTotal || 0), 0));
    const chg = revPeriod !== 'all' && prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
    const tiles = [
      ['Revenue', money(total), chg == null ? `${inP.length} order${inP.length === 1 ? '' : 's'}` : `${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg)}% vs previous ${REV_PERIODS.find((x) => x[0] === revPeriod)[1].toLowerCase()}`],
      ['Orders', inP.length, `${units} item${units === 1 ? '' : 's'} sold`],
      ['Avg order', money(inP.length ? total / inP.length : 0), 'Revenue ÷ orders'],
      ['Avg item price', money(units ? (total - ship) / units : 0), 'Item revenue ÷ items'],
      ['Shipping collected', money(ship), `${inP.filter((o) => o.fulfillment !== 'pickup').length} shipped order(s)`],
      ['Best day', (() => { const m = {}; inP.forEach((o) => { const k = new Date(o.createdAt).toDateString(); m[k] = (m[k] || 0) + o.total; }); const b = Object.entries(m).sort((a, c) => c[1] - a[1])[0]; return b ? money(b[1]) : '—'; })(), (() => { const m = {}; inP.forEach((o) => { const k = new Date(o.createdAt).toDateString(); m[k] = (m[k] || 0) + o.total; }); const b = Object.entries(m).sort((a, c) => c[1] - a[1])[0]; return b ? fmtDate(b[0]) : 'No sales yet'; })()],
    ];
    // chart buckets: hours for Today, days up to 45 days, weeks beyond that
    const span = (to - from) / 864e5;
    const unit = revPeriod === 'today' ? 'hour' : span > 45 ? 'week' : 'day';
    const buckets = [];
    if (unit === 'hour') { for (let h = 0; h <= to.getHours(); h++) buckets.push({ start: new Date(from.getTime() + h * 36e5), label: new Date(from.getTime() + h * 36e5).toLocaleTimeString('en-US', { hour: 'numeric' }) }); }
    else { const step = unit === 'week' ? 7 : 1; for (let d = new Date(from); d <= to; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step)) buckets.push({ start: new Date(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }); }
    buckets.forEach((b, i) => { const end = buckets[i + 1] ? buckets[i + 1].start : new Date(to.getTime() + 1); const os = inP.filter((o) => { const d = new Date(o.createdAt); return d >= b.start && d < end; }); b.total = sum(os); b.n = os.length; });
    const max = Math.max(1, ...buckets.map((b) => b.total));
    const bars = buckets.map((b) => `<div class="rv-bar" tabindex="0" data-tip="${esc(`${unit === 'week' ? 'Week of ' : ''}${b.label} · ${money(b.total)} · ${b.n} order${b.n === 1 ? '' : 's'}`)}"><i style="height:${b.total ? Math.max(3, (b.total / max) * 100) : 0}%"></i></div>`).join('');
    const tickEvery = Math.ceil(buckets.length / 6);
    const ticks = buckets.map((b, i) => `<span>${i % tickEvery === 0 ? esc(b.label) : ''}</span>`).join('');
    // splits
    const split = (rows) => { const t = rows.reduce((a, r) => a + r[1], 0) || 1; return `<ul class="rv-split">${rows.map(([l, v, n]) => `<li><div class="rv-split-top"><span>${l}</span><b class="tabnum">${money(v)}</b></div><div class="rv-meter"><i style="width:${(v / t) * 100}%"></i></div><small class="muted">${n} order${n === 1 ? '' : 's'} · ${Math.round((v / t) * 100)}%</small></li>`).join('')}</ul>`; };
    const by = (f) => [inP.filter(f), inP.filter((o) => !f(o))];
    const [web, store_] = by((o) => !isInPerson(o));
    const [pick, shipd] = by((o) => o.fulfillment === 'pickup');
    const [paidOnline, paidLocal] = by((o) => o.payment === 'paypal');
    // top sellers & categories
    const prod = {};
    inP.forEach((o) => o.items.forEach((i) => { const k = i.productId || i.title; const r = prod[k] || (prod[k] = { title: i.title, image: i.image, units: 0, rev: 0, cat: (data.products.find((p) => p.id === i.productId) || {}).categoryId }); const share = o.items.length === 1 ? o.total - (o.shippingTotal || 0) : (i.price * (i.qty || 1)); r.units += i.qty || 1; r.rev += share; }));
    const top = Object.values(prod).sort((a, b) => b.rev - a.rev);
    const cats = {}; top.forEach((r) => { const k = catName(r.cat); cats[k] = (cats[k] || 0) + r.rev; });
    const catRows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    main.innerHTML = shell(`
      <div class="rv-periods" role="group" aria-label="Time period">${REV_PERIODS.map(([k, l]) => `<button type="button" class="chip${revPeriod === k ? ' is-on' : ''}" data-rev="${k}" aria-pressed="${revPeriod === k}">${l}</button>`).join('')}</div>
      <p class="muted rv-range">${fmtDate(from)} – ${fmtDate(to)} · cancelled orders not counted</p>
      <div class="adm-tiles rv-tiles">${tiles.map(([l, v, sub]) => `<div class="adm-tile"><span class="eyebrow">${l}</span><b class="tabnum">${v}</b><span class="muted">${sub}</span></div>`).join('')}</div>
      <section class="adm-card rv-chart-card"><div class="adm-card-head"><h2>Revenue by ${unit}</h2><span class="muted">${money(total)} total</span></div>
        <div class="rv-chart"><div class="rv-bars" style="--n:${buckets.length}">${bars}</div><div class="rv-ticks" style="--n:${buckets.length}">${ticks}</div><div class="rv-tip" hidden></div></div>
      </section>
      <div class="adm-cols three rv-splits">
        <section class="adm-card"><div class="adm-card-head"><h2>Where it sold</h2></div>${split([['Website orders', sum(web), web.length], ['In person', sum(store_), store_.length]])}</section>
        <section class="adm-card"><div class="adm-card-head"><h2>Delivery</h2></div>${split([['Pickup', sum(pick), pick.length], ['Shipped', sum(shipd), shipd.length]])}</section>
        <section class="adm-card"><div class="adm-card-head"><h2>Payment</h2></div>${split([['Paid online (PayPal)', sum(paidOnline), paidOnline.length], ['Cash / at pickup', sum(paidLocal), paidLocal.length]])}</section>
      </div>
      <div class="adm-cols two">
        <section class="adm-card"><div class="adm-card-head"><h2>Top sellers</h2></div>
          ${top.length ? `<table class="rv-table"><thead><tr><th>Item</th><th class="num">Sold</th><th class="num">Revenue</th></tr></thead><tbody>${top.slice(0, 10).map((r) => `<tr><td><div class="adm-prod">${r.image ? `<img src="${esc(img(r.image.sm || r.image.lg))}" alt="" width="40" height="40" loading="lazy">` : '<span class="adm-noimg"></span>'}<span class="rv-title">${esc(r.title)}</span></div></td><td class="num tabnum">${r.units}</td><td class="num tabnum">${money(r.rev)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted adm-empty">No sales in this period.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>By category</h2></div>
          ${catRows.length ? `<table class="rv-table"><thead><tr><th>Category</th><th class="num">Revenue</th><th class="num">Share</th></tr></thead><tbody>${catRows.map(([c, v]) => `<tr><td>${esc(c)}</td><td class="num tabnum">${money(v)}</td><td class="num tabnum">${Math.round((v / (total - ship || 1)) * 100)}%</td></tr>`).join('')}</tbody></table>` : '<p class="muted adm-empty">No sales in this period.</p>'}
        </section>
      </div>
      <section class="adm-card"><div class="adm-card-head"><h2>Sales in this period</h2><span class="muted">${inP.length} order${inP.length === 1 ? '' : 's'}</span></div>
        ${inP.length ? `<table class="rv-table"><thead><tr><th>Date</th><th>Order</th><th>Sold</th><th class="num">Items</th><th class="num">Total</th></tr></thead><tbody>${inP.map((o) => `<tr><td>${fmtDate(o.createdAt, true)}</td><td><button class="link mono" type="button" data-open-order="${o.id}">#${o.number}</button></td><td>${isInPerson(o) ? 'In person' : 'Website'} · ${o.fulfillment === 'pickup' ? 'Pickup' : 'Shipped'}</td><td class="num tabnum">${qtyOf(o)}</td><td class="num tabnum">${money(o.total)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted adm-empty">No sales in this period.</p>'}
      </section>
      <dialog class="modal adm-order-dlg" id="order-dlg" aria-labelledby="od-title"></dialog>`, 'Revenue', `<button class="btn btn-sm" type="button" data-tab="overview">${icon('left', 'icon-sm')} Overview</button>`);
    const chart = $('.rv-chart', main); const tip = $('.rv-tip', main);
    const show = (b) => { tip.textContent = b.dataset.tip; tip.hidden = false; const r = b.getBoundingClientRect(), c = chart.getBoundingClientRect(); tip.style.left = `${Math.min(Math.max(r.left - c.left + r.width / 2, 70), c.width - 70)}px`; };
    $$('.rv-bar', main).forEach((b) => { b.addEventListener('pointerenter', () => show(b)); b.addEventListener('focus', () => show(b)); b.addEventListener('click', () => show(b)); });
    chart.addEventListener('pointerleave', () => { tip.hidden = true; });
  }

  // ------------------------------------------------------------ orders
  let orderFilter = 'all';
  function orders() {
    const list = data.orders.filter((o) => orderFilter === 'all' || o.status === orderFilter);
    main.innerHTML = shell(`
      <div class="adm-toolbar"><div class="select"><label class="sr-only" for="of-f">Status</label><select id="of-f" data-of>${[['all', 'All orders'], ...ORDER_STATUS].map(([v, l]) => `<option value="${v}" ${orderFilter === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('down')}</div><span class="muted" style="font-size:14px">${list.length} order${list.length === 1 ? '' : 's'}</span></div>
      ${list.length ? `<div class="ord-list">${list.map((o) => {
        const first = o.items[0] || {}; const more = o.items.length - 1;
        return `<div class="ord-swipe" data-swipe="${o.id}"><button class="ord-del-btn" type="button" data-del-order="${o.id}">${icon('trash', 'icon-sm')} Delete</button><details class="ord-row" data-oid="${o.id}">
          <summary>
            <span class="ord-main"><b class="ord-name">${esc(o.customer.name)}</b><span class="ord-del ${o.fulfillment === 'pickup' ? 'is-pickup' : 'is-ship'}">${o.fulfillment === 'pickup' ? 'Pick up' : 'Shipping'}</span>${['completed', 'shipped'].includes(o.status) ? `<span class="ord-st done" title="Done — shipped or picked up" aria-label="Done">${icon('check', 'icon-sm')}</span>` : `<span class="ord-st todo" title="Not done yet" aria-label="Not done yet">${icon('close', 'icon-sm')}</span>`}${needsConfirm(o) ? `<span class="adm-needs ord-confirm-tap" role="button" tabindex="0" data-confirm-order="${o.id}" title="Tap to confirm this order">Confirm</span>` : ''}</span>
            <span class="ord-item">${esc(first.title || '')}${more > 0 ? ` <small>+${more} more</small>` : ''}</span>
            <span class="ord-chev" aria-hidden="true">${icon('down', 'icon-sm')}</span>
          </summary>
          <div class="ord-body">
            <dl class="ord-kv"><div><dt>Order</dt><dd class="mono">#${o.number}</dd></div><div><dt>Date</dt><dd>${fmtDate(o.createdAt, true)}</dd></div><div><dt>Phone</dt><dd>${esc(o.customer.phone || '—')}</dd></div><div><dt>Items</dt><dd>${o.items.reduce((s, i) => s + i.qty, 0)}</dd></div><div><dt>Total</dt><dd class="tabnum"><b>${money(o.total)}</b></dd></div></dl>
            <div class="ord-mark" role="group" aria-label="Mark order"><button type="button" class="btn btn-sm${['completed', 'shipped'].includes(o.status) ? ' is-on' : ''}" data-ord-mark="${o.id}" data-to="completed">${icon('check', 'icon-sm')} Done</button><button type="button" class="btn btn-sm${['completed', 'shipped'].includes(o.status) ? '' : ' is-on'}" data-ord-mark="${o.id}" data-to="new">${icon('close', 'icon-sm')} Not done</button></div>
            <div class="ord-status"><label class="sr-only" for="os-${o.id}">Status</label><select id="os-${o.id}" class="adm-status" data-order-status="${o.id}">${ORDER_STATUS.map(([v, l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${needsConfirm(o) ? `<small><button class="btn btn-sm btn-primary adm-confirm-btn" type="button" data-confirm-order="${o.id}">Confirm</button></small>` : ''}${o.tracking && o.tracking.number ? `<small class="adm-track">${esc(carrierName(o.tracking.carrier))} · <a class="mono" href="${esc(trackUrl(o.tracking.carrier, o.tracking.number))}" target="_blank" rel="noopener">${esc(o.tracking.number)}</a></small>` : o.status === 'shipped' ? `<small><button class="link" type="button" data-track="${o.id}">+ Add tracking</button></small>` : ''}</div>
            <button class="btn btn-sm" type="button" data-open-order="${o.id}">View full order</button>
            <button class="btn btn-sm adm-danger ord-del-inline" type="button" data-del-order="${o.id}">${icon('trash', 'icon-sm')} Delete order</button>
            ${(() => { const im = o.items[0] && o.items[0].image; return im ? `<img class="ord-body-img" src="${esc(img(im.sm || im.lg))}" alt="${esc(o.items[0].title)}" width="120" height="120" loading="lazy">` : ''; })()}
          </div>
        </details></div>`; }).join('')}</div>` : '<div class="empty"><h2>No orders</h2><p class="muted">New orders from checkout appear here instantly.</p></div>'}
      <h2 class="adm-sub" id="pickup-requests">Pickup requests</h2>
      ${requestsHTML()}
      <dialog class="modal adm-order-dlg" id="order-dlg" aria-labelledby="od-title"></dialog>`, 'Orders');
  }
  // PayPal refunds: full or partial; several partial refunds can add up to what the customer paid.
  const refundsOf = (o) => (o.paypalRefunds || []).filter((r) => !['FAILED', 'CANCELLED'].includes(r.status));
  const refundLeft = (o) => (o.payment === 'paypal' && o.paidAt && o.paypalCaptureId ? round2(o.total - refundsOf(o).reduce((t, r) => t + Number(r.amount), 0)) : 0);
  const canRefund = (o) => refundLeft(o) > 0;
  // Refund less the 4.5% card processing fee (fee is figured on the amount the customer paid).
  const feeRefund = (o) => Math.max(0, round2(refundLeft(o) - round2(o.total * 0.045)));
  // Tracking popup: carrier + tracking number (optional). Opens after marking an order Shipped.
  function openTracking(id) {
    const o = data.orders.find((x) => x.id === id); if (!o) return;
    let dlg = document.getElementById('track-dlg');
    if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'track-dlg'; dlg.className = 'modal track-dlg'; dlg.setAttribute('aria-labelledby', 'tk-title'); document.body.appendChild(dlg); }
    const t = o.tracking || {};
    dlg.innerHTML = `<div class="modal-head"><h2 id="tk-title">Tracking package</h2></div>
      <form class="modal-body form" data-track-form="${o.id}" novalidate>
        <p class="muted" style="font-size:14px">Order #${o.number} · ${esc(o.customer.name)}. Optional — the customer sees this on their order.</p>
        <div class="field"><label for="tk-carrier">Carrier</label><select id="tk-carrier" name="carrier">${CARRIERS.map(([v, l]) => `<option value="${v}" ${t.carrier === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label class="sr-only" for="tk-number">Tracking number</label><input id="tk-number" name="number" placeholder="Tracking number" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" value="${esc(t.number || '')}"></div>
        <div class="track-actions"><button class="btn btn-primary" type="submit">Save</button><button class="btn btn-exit" type="button" data-track-exit>Exit</button></div>
      </form>`;
    const form = dlg.querySelector('form');
    dlg.onclick = (e) => { if (e.target === dlg || e.target.closest('[data-track-exit]')) dlg.close(); };
    form.onsubmit = async (e) => {
      e.preventDefault();
      const carrier = form.carrier.value, number = form.number.value.trim().replace(/\s+/g, '').toUpperCase();
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Saving…';
      try {
        await A.setTracking(o.id, number ? { carrier, number, at: new Date().toISOString() } : null);
        dlg.close(); toast(number ? 'Tracking saved' : 'Saved'); await loadAll();
        if (tab === 'orders') { const open = $('#order-dlg') && $('#order-dlg').open; orders(); if (open) openOrder(o.id); }
      } catch (ex) { btn.disabled = false; btn.textContent = 'Save'; toast(ex.message || 'Could not save tracking'); }
    };
    dlg.showModal();
  }
  const needsConfirm = (o) => o.stockHeld === false && o.status !== 'cancelled';
  function openOrder(id) {
    const o = data.orders.find((x) => x.id === id); if (!o) return;
    if (!$('#order-dlg')) { tab = 'orders'; orders(); }
    const dlg = $('#order-dlg');
    const addr = o.address ? `${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}` : 'Local pickup';
    dlg.innerHTML = `<div class="modal-head"><h2 id="od-title">Order #${o.number}</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dlg>${icon('close')}</button></div>
      <div class="modal-body">
        <dl class="kv"><div><dt>Placed</dt><dd>${fmtDate(o.createdAt, true)}</dd></div><div><dt>Delivery</dt><dd>${o.fulfillment === 'pickup' ? 'Local pickup' : 'Shipping'}</dd></div><div><dt>Payment</dt><dd>${o.payment === 'paypal' ? (o.paidAt ? `<b>PAID</b> · PayPal${o.paypalCaptureId ? `<small class="mono">${esc(o.paypalCaptureId)}</small>` : ''}` : 'PayPal — not paid') : o.payment === 'free' ? 'Free — no payment' : o.payment === 'pickup' ? 'Pay at pickup' : 'Send payment link'}</dd></div><div><dt>Total</dt><dd class="tabnum">${money(o.total)}</dd></div></dl>
        <div class="info-card"><h2>Customer</h2><p><b>${esc(o.customer.name)}</b></p><p><a href="${telHref(o.customer.phone)}">${esc(o.customer.phone)}</a> · <a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a></p><p class="muted">${addr}</p>${o.notes ? `<p><b>Notes:</b> ${esc(o.notes)}</p>` : ''}</div>
        <ul class="sum-items" style="max-height:none;border:1px solid var(--line)">${o.items.map((i) => `<li class="sum-item"><span class="th">${imgTag(i.image, { alt: '', sizes: '56px' })}<span class="q">${i.qty}</span></span><span class="t">${esc(i.title)}<small>${i.qty} × ${money(i.price)}${i.shipping ? ' · ship ' + money(i.shipping) : ''}</small></span><span class="p tabnum">${money(i.price * i.qty)}</span></li>`).join('')}</ul>
        <div class="sum-totals" style="padding:0"><div class="row"><span>Subtotal</span><span class="tabnum">${money(o.subtotal)}</span></div><div class="row"><span>Shipping</span><span class="tabnum">${money(o.shippingTotal)}</span></div><div class="row total"><span>Total</span><span class="tabnum">${money(o.total)}</span></div></div>
        ${needsConfirm(o) ? `<div class="od-confirm-box"><p><b>Not confirmed yet.</b> This pay-at-pickup order hasn’t taken anything off the website — the ${o.items.length > 1 ? 'items are' : 'item is'} still for sale. Confirm to mark ${o.items.length > 1 ? 'them' : 'it'} sold and remove ${o.items.length > 1 ? 'them' : 'it'} from stock.</p><button class="btn btn-primary btn-block" type="button" data-confirm-order="${o.id}">${icon('check', 'icon-sm')} Confirm order</button></div>` : ''}
        <div class="field"><label for="od-status">Status</label><select id="od-status" data-order-status="${o.id}">${ORDER_STATUS.map(([v, l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${o.status === 'shipped' || (o.tracking && o.tracking.number) ? `<div class="info-card od-track"><h2>Tracking package</h2>${o.tracking && o.tracking.number ? `<p>${esc(carrierName(o.tracking.carrier))} · <a class="mono" href="${esc(trackUrl(o.tracking.carrier, o.tracking.number))}" target="_blank" rel="noopener">${esc(o.tracking.number)}</a></p>` : '<p class="muted">No tracking number yet.</p>'}<p><button class="btn btn-sm" type="button" data-track="${o.id}">${icon('truck', 'icon-sm')} ${o.tracking && o.tracking.number ? 'Edit tracking' : 'Add tracking'}</button></p></div>` : ''}
        ${refundsOf(o).length ? `<div class="adm-note">${refundsOf(o).map((r) => `<p><b>Refunded ${money(r.amount)}</b> through PayPal on ${fmtDate(r.at, true)}${r.status !== 'COMPLETED' ? ` (${esc(String(r.status).toLowerCase())})` : ''}.</p>`).join('')}${refundsOf(o).length > 1 || canRefund(o) ? `<p class="muted">Refunded so far: ${money(round2(o.total - refundLeft(o)))} of ${money(o.total)}</p>` : ''}</div>` : ''}
        ${o.status !== 'cancelled' || canRefund(o) ? `<div class="od-actions">${o.status !== 'cancelled' ? `<button class="btn adm-danger" type="button" data-od-ask="refund">Cancel order</button>` : ''}${canRefund(o) ? `<button class="btn adm-danger" type="button" data-od-ask="refund">Refund customer</button><button class="btn" type="button" data-od-ask="fee">Refund minus 4.5%</button><button class="btn" type="button" data-od-ask="partial">Partial refund</button>` : ''}</div>
        <div class="adm-confirm" data-od-confirm="refund" hidden>${canRefund(o)
          ? `<p><b>Would you like to refund the customer?</b> ${money(refundLeft(o))} goes back to their card or PayPal automatically.${o.status !== 'cancelled' ? ' The order is cancelled and items go back in stock.' : ''}</p><div><button class="btn btn-sm adm-danger" type="button" data-od-refund="${o.id}">Yes, refund ${money(refundLeft(o))}</button>${o.status !== 'cancelled' ? `<button class="btn btn-sm" type="button" data-cancel-order="${o.id}">No, just cancel</button>` : ''}<button class="btn btn-sm" type="button" data-od-back>Go back</button></div>`
          : `<p><b>Cancel order #${o.number}?</b> ${needsConfirm(o) ? 'Nothing to restock — this order was never confirmed, so the items stayed on the website.' : 'Items go back in stock.'}${o.payment === 'paypal' ? '' : ' This order wasn’t paid online, so if they already paid you (cash, card link), refund them the same way.'}</p><div><button class="btn btn-sm adm-danger" type="button" data-cancel-order="${o.id}">Yes, cancel order</button><button class="btn btn-sm" type="button" data-od-back>Go back</button></div>`}</div>
        ${canRefund(o) ? `<div class="adm-confirm" data-od-confirm="fee" hidden><p><b>Refund minus 4.5% fee?</b> ${money(feeRefund(o))} goes back to their card or PayPal (${money(refundLeft(o))} less the ${money(round2(o.total * 0.045))} processing fee).${o.status !== 'cancelled' ? ' The order is cancelled and items go back in stock.' : ''}</p><div><button class="btn btn-sm adm-danger" type="button" data-od-fee="${o.id}">Yes, refund ${money(feeRefund(o))}</button><button class="btn btn-sm" type="button" data-od-back>Go back</button></div></div>` : ''}
        ${canRefund(o) ? `<div class="adm-confirm" data-od-confirm="partial" hidden><p><b>Partial refund</b> Enter how much to send back to the customer. Up to ${money(refundLeft(o))}. The order stays open and nothing is restocked.</p>
          <div class="field"><label for="od-partial">Refund amount ($)</label><input id="od-partial" type="number" inputmode="decimal" min="0.01" max="${refundLeft(o)}" step="0.01" placeholder="0.00" data-od-amount></div>
          <div><button class="btn btn-sm adm-danger" type="button" data-od-partial="${o.id}">Refund this amount</button><button class="btn btn-sm" type="button" data-od-back>Go back</button></div></div>` : ''}` : ''}
      </div>`;
    dlg.showModal();
  }

  // ------------------------------------------------------------ offers
  function offers() {
    main.innerHTML = shell(data.offers.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Product</th><th>List price</th><th>Offer</th><th>Customer</th><th>Status</th><th></th></tr></thead><tbody>
      ${data.offers.map((o) => { const p = data.products.find((x) => x.id === o.productId); const ratio = o.listPrice ? Math.round((o.amount / o.listPrice) * 100) : 0; return `<tr>
        <td>${fmtDate(o.createdAt, true)}</td>
        <td><div class="adm-prod">${o.productImage ? `<img src="${esc(img(o.productImage.sm))}" alt="" width="48" height="48">` : ''}<div>${p ? `<button class="adm-title" type="button" data-edit="${p.id}">${esc(o.productTitle)}</button>` : esc(o.productTitle)}<small>${p ? `${p.inventory} in stock` : 'Deleted'}</small></div></div></td>
        <td class="tabnum">${money(o.listPrice)}</td>
        <td class="tabnum"><b>${money(o.amount)}</b><small>${ratio}% of list</small></td>
        <td>${esc(o.name)}<small><a href="${telHref(o.phone)}">${esc(o.phone)}</a> · <a href="sms:${esc(o.phone.replace(/[^\d+]/g, ''))}">Text</a></small></td>
        <td><label class="sr-only" for="ofs-${o.id}">Status</label><select id="ofs-${o.id}" class="adm-status" data-offer-status="${o.id}">${OFFER_STATUS.map(([v, l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
        <td>${p && o.status !== 'accepted' ? `<button class="btn btn-sm" type="button" data-accept-price="${o.id}" title="Set the product price to this offer">Use as price</button>` : ''} <button class="btn btn-sm adm-danger" type="button" data-offer-del="${o.id}">${icon('trash', 'icon-sm')} Delete</button></td></tr>`; }).join('')}
      </tbody></table></div>` : '<div class="empty"><h2>No offers yet</h2><p class="muted">When a customer taps “Make Offer”, their name, phone and amount appear here.</p></div>', 'Offers');
  }

  // ------------------------------------------------------------ messages
  // ------------------------------------------------------------ pickup requests
  function requestsHTML() {
    const list = data.inquiries.filter((m) => m.type === 'pickup');
    const parse = (m) => {
      const item = ((m.message || '').match(/Pickup request:\s*(.+)/) || [])[1] || 'Pickup request';
      const when = ((m.message || '').match(/When:\s*(.+)/) || [])[1] || '';
      return { item: item.trim(), when: when.trim() };
    };
    return list.length ? `<div class="adm-reqs">${list.map((m) => { const r = parse(m); const tel = String(m.phone || '').replace(/[^\d+]/g, ''); return `<details class="adm-req ${m.status === 'new' ? 'unread' : ''}">
      <summary><span class="adm-req-title"><b>${esc(r.item)}</b><small>${icon('calendar', 'icon-sm')} ${esc(r.when || fmtDate(m.createdAt, true))}</small></span>${m.status === 'new' ? '<span class="status s-new">New</span>' : `<span class="status s-${m.status}">${m.status === 'read' ? 'Confirmed' : 'Done'}</span>`}${icon('down')}</summary>
      <div class="adm-req-body">
        <dl class="kv"><div><dt>Name</dt><dd>${esc(m.name)}</dd></div><div><dt>Phone</dt><dd><a href="${telHref(m.phone)}">${esc(m.phone)}</a></dd></div><div><dt>Pickup time</dt><dd>${esc(r.when || '—')}</dd></div><div><dt>Requested</dt><dd>${fmtDate(m.createdAt, true)}</dd></div></dl>
        <div class="adm-req-actions">
          <a class="btn btn-primary" href="sms:${esc(tel)}">${icon('msg', 'icon-sm')} Text</a>
          <a class="btn" href="${telHref(m.phone)}">${icon('phone', 'icon-sm')} Call</a>
          <label class="sr-only" for="rq-${m.id}">Status</label><select id="rq-${m.id}" class="adm-status" data-msg-status="${m.id}"><option value="new" ${m.status === 'new' ? 'selected' : ''}>New</option><option value="read" ${m.status === 'read' ? 'selected' : ''}>Confirmed</option><option value="archived" ${m.status === 'archived' ? 'selected' : ''}>Done</option></select>
          <button class="btn btn-sm" type="button" data-msg-del="${m.id}" data-back="requests">${icon('trash', 'icon-sm')} Delete</button>
        </div>
      </div></details>`; }).join('')}</div>` : '<div class="empty"><h2>No pickup requests yet</h2><p class="muted">When a customer taps “Choose a date &amp; time” on a product, their request shows up here.</p></div>';
  }

  function messages() {
    const msgs = data.inquiries.filter((m) => m.type !== 'pickup');
    main.innerHTML = shell(msgs.length ? `<div class="adm-msgs">${msgs.map((m) => `<article class="adm-card adm-msg ${m.status === 'new' ? 'unread' : ''}">
      <div class="adm-card-head"><h2>${esc(m.name)} <span class="status">${m.type === 'wholesale' ? 'Wholesale' : m.type === 'pickup' ? 'Pickup request' : 'Contact'}</span></h2><span class="muted" style="font-size:13px">${fmtDate(m.createdAt, true)}</span></div>
      <div class="adm-card-body"><p class="adm-msg-meta"><a href="${telHref(m.phone)}">${esc(m.phone)}</a> · <a href="sms:${esc(String(m.phone).replace(/[^\d+]/g, ''))}">Text</a>${m.email ? ` · <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ''}${m.company ? ' · ' + esc(m.company) : ''}</p><p class="adm-msg-text">${esc(m.message)}</p>
      <div class="adm-msg-actions"><label class="sr-only" for="ms-${m.id}">Status</label><select id="ms-${m.id}" class="adm-status" data-msg-status="${m.id}">${MSG_STATUS.map(([v, l]) => `<option value="${v}" ${m.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select><button class="btn btn-sm" type="button" data-msg-del="${m.id}">${icon('trash', 'icon-sm')} Delete</button></div></div>
    </article>`).join('')}</div>` : '<div class="empty"><h2>No messages</h2><p class="muted">Contact form and wholesale requests appear here.</p></div>', 'Messages');
  }

  // ------------------------------------------------------------ categories
  function categories() {
    const cats = store.categories();
    const counts = {}; data.products.forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
    main.innerHTML = shell(`<div class="adm-card"><div class="adm-card-body">
      <ul class="adm-cats">${cats.map((c, i) => `<li data-cat="${c.id}">
        <label class="sr-only" for="cn-${c.id}">Category name</label><input id="cn-${c.id}" value="${esc(c.name)}" data-cat-name>
        <span class="muted mono" style="font-size:12px">${counts[c.id] || 0} items</span>
        <button class="icon-btn" type="button" aria-label="Move up" data-cat-move="-1" ${i === 0 ? 'disabled' : ''}>${icon('left', 'icon-sm')}</button>
        <button class="icon-btn" type="button" aria-label="Move down" data-cat-move="1" ${i === cats.length - 1 ? 'disabled' : ''}>${icon('right', 'icon-sm')}</button>
        <button class="btn btn-sm" type="button" data-cat-save>Save</button>
        <button class="btn btn-sm adm-danger" type="button" data-cat-del>${icon('trash', 'icon-sm')}</button>
      </li>`).join('')}</ul>
      <form class="adm-cat-add" data-cat-add><label class="sr-only" for="cat-new">New category name</label><input id="cat-new" name="name" placeholder="New category name" required><button class="btn btn-primary" type="submit">${icon('plus', 'icon-sm')} Add category</button></form>
      <p class="hint" style="margin-top:12px">Deleting a category keeps its products — they become “Uncategorized”. Categories appear in the header dropdown in this order.</p>
    </div></div>`, 'Categories');
  }

  // ------------------------------------------------------------ settings
  function settings() {
    const s = store.settings();
    const fld = (k, l, extra = '') => `<div class="field"><label for="st-${k}">${l}</label><input id="st-${k}" name="${k}" value="${esc(s[k] || '')}" ${extra}></div>`;
    main.innerHTML = shell(`<div class="adm-cols two">
      <form class="adm-card" data-settings><div class="adm-card-head"><h2>Store details</h2></div><div class="adm-card-body form">
        <div class="form-row two">${fld('phone', 'Phone', 'type="tel"')}${fld('email', 'Email', 'type="email"')}</div>
        ${fld('address1', 'Pickup address')}
        <div class="form-row three">${fld('city', 'City')}${fld('state', 'State', 'maxlength="2"')}${fld('zip', 'ZIP')}</div>
        ${fld('pickupHours', 'Pickup hours')}
        ${fld('pickupNote', 'Pickup note')}
        ${fld('announcement', 'Announcement bar', 'maxlength="140"')}<p class="hint">Separate messages with “·”.</p>
        <button class="btn btn-primary" type="submit">Save details</button>
      </div></form>
      <div style="display:grid;gap:16px;align-content:start">
        <form class="adm-card" data-password><div class="adm-card-head"><h2>Admin password</h2></div><div class="adm-card-body form">
          <div class="field"><label for="pw1">New password</label><input id="pw1" name="pw1" type="password" autocomplete="new-password" minlength="6" required></div>
          <div class="field"><label for="pw2">Confirm new password</label><input id="pw2" name="pw2" type="password" autocomplete="new-password" minlength="6" required></div>
          <p class="form-error" data-err hidden></p>
          <button class="btn" type="submit">Change password</button>
        </div></form>
        ${store.kind === 'local' ? `<div class="adm-card"><div class="adm-card-head"><h2>Data</h2></div><div class="adm-card-body form">
          <p class="hint">Preview data lives in this browser. Export a backup file to keep a copy.</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn btn-sm" type="button" data-export>${icon('download', 'icon-sm')} Export backup</button><label class="btn btn-sm">${icon('upload', 'icon-sm')} Import backup<input type="file" accept="application/json" class="sr-only" data-import></label><button class="btn btn-sm adm-danger" type="button" data-reset>Reset demo data</button></div>
          <div class="adm-confirm" data-reset-confirm hidden><p><b>Reset everything?</b> Products, orders and offers return to the demo catalog.</p><div><button class="btn btn-sm adm-danger" type="button" data-reset-yes>Reset</button><button class="btn btn-sm" type="button" data-reset-no>Cancel</button></div></div>
          <textarea class="sr-only" data-export-box aria-label="Backup data" readonly></textarea>
        </div></div>` : ''}
      </div>
    </div>`, 'Settings');
  }

  // ------------------------------------------------------------ events
  const onClick = async (e) => {
    const t = e.target;
    if (t.closest('[data-inv-scan]')) { try { await invScan(); } catch { toast('The scanner could not load. Check your connection and try again.'); } return; }
    if (t.closest('[data-sales-breakdown]')) { tab = 'sales'; editId = null; draft = null; render(); return; }
    const sb = t.closest('[data-sb]');
    if (sb) { sbUnit = sb.dataset.sb; salesPage(); return; }
    const sr = t.closest('[data-sbr]');
    if (sr) { sbRange = sr.dataset.sbr; salesPage(); return; }
    const pf = t.closest('[data-prof]');
    if (pf) { profitPeriod = pf.dataset.prof; profit(); return; }
    const rv = t.closest('[data-rev]');
    if (rv) { revPeriod = rv.dataset.rev; revenue(); return; }
    const tb = t.closest('[data-tab]');
    if (tb) { tab = tb.dataset.tab; editId = null; draft = null; render(); return; }
    if (t.closest('[data-logout]')) { await A.logout(); renderLogin(); return; }
    if (t.closest('[data-new]')) { tab = 'products'; editId = 'new'; draft = null; render(); return; }
    const ed = t.closest('[data-edit]');
    if (ed) { tab = 'products'; editId = ed.dataset.edit; draft = null; render(); return; }
    if (t.closest('[data-cancel-edit]')) { editId = null; draft = null; tab = 'products'; render(); return; }
    const inv = t.closest('[data-inv]');
    if (inv) { const p = await A.adjustInventory(inv.dataset.id, Number(inv.dataset.inv)); refreshStore(); if (p) { const row = inv.closest('tr'); $('b', inv.parentElement).textContent = p.inventory; row.classList.toggle('dim', p.inventory <= 0 || !p.published); } return; }
    const oo = t.closest('[data-open-order]');
    if (oo) { openOrder(oo.dataset.openOrder); return; }
    if (t.closest('[data-close-dlg]') || t.matches('dialog.modal')) { const d = t.closest('dialog'); if (d) d.close(); return; }
    const ask = t.closest('[data-od-ask]');
    if (ask) { $$('[data-od-confirm]').forEach((c) => { c.hidden = c.dataset.odConfirm !== ask.dataset.odAsk; }); const c = $(`[data-od-confirm="${ask.dataset.odAsk}"]`); c.scrollIntoView({ block: 'nearest' }); const inp = $('[data-od-amount]', c); if (inp) inp.focus(); return; }
    if (t.closest('[data-od-back]')) { $$('[data-od-confirm]').forEach((c) => { c.hidden = true; }); return; }
    const rf = t.closest('[data-od-refund], [data-od-partial], [data-od-fee]');
    if (rf) {
      const partial = rf.hasAttribute('data-od-partial');
      const fee = rf.hasAttribute('data-od-fee');
      const id = rf.dataset.odRefund || rf.dataset.odPartial || rf.dataset.odFee; const o = data.orders.find((x) => x.id === id);
      const left = o ? refundLeft(o) : 0;
      let amount = fee && o ? feeRefund(o) : left;
      if (fee && !(amount > 0)) { toast('Nothing left to refund after the 4.5% fee.'); return; }
      if (partial) {
        const inp = $('[data-od-amount]');
        amount = round2(Number(inp.value));
        if (!(amount > 0) || amount > left) { inp.setAttribute('aria-invalid', 'true'); inp.focus(); toast(`Enter an amount from $0.01 to ${money(left)}`); return; }
        inp.setAttribute('aria-invalid', 'false');
      }
      const box = rf.closest('[data-od-confirm]'); const label = rf.textContent;
      $$('button', box).forEach((b) => { b.disabled = true; }); rf.textContent = 'Refunding…';
      try {
        await A.refundOrder(id, partial || fee ? amount.toFixed(2) : null);
        if (!partial && o && o.status !== 'cancelled') await A.updateOrder(id, { status: 'cancelled', restock: true });
        refreshStore(); toast(`Refunded ${money(amount)} to the customer`);
        await loadAll(); orders(); openOrder(id);
      } catch (ex) {
        $$('button', box).forEach((b) => { b.disabled = false; }); rf.textContent = label;
        toast(ex.message || 'The refund did not go through.');
      }
      return;
    }
    if (t.closest('[data-scan]')) {
      const btn = t.closest('[data-scan]');
      btn.disabled = true;
      try {
        if (!window.MLScanner) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = ENV.root + 'assets/scanner.js' + (ENV.cfg.v ? '?v=' + ENV.cfg.v : ''); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
        window.MLScanner.open({
          onResult: (code) => {
            const inp = $('#ed-upc'); if (!inp) return;
            inp.value = code; inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.scrollIntoView({ block: 'center', behavior: 'smooth' });
            inp.classList.add('flash'); setTimeout(() => inp.classList.remove('flash'), 1200);
            toast(`UPC ${code} added`);
          },
          onError: (msg) => toast(msg),
        });
      } catch { toast('The scanner could not load. Check your connection and try again.'); }
      btn.disabled = false;
      return;
    }
    const tk = t.closest('[data-track]');
    if (tk) { openTracking(tk.dataset.track); return; }
    const dl = t.closest('[data-del-order]');
    if (dl) {
      const o = data.orders.find((x) => x.id === dl.dataset.delOrder); if (!o) return;
      const back = o.stockHeld !== false && ['new', 'processing', 'ready'].includes(o.status);
      if (!confirm(`Delete order #${o.number} for ${o.customer.name}?${back ? ' The items go back in stock.' : ''} This can't be undone.`)) { closeSwipes(); return; }
      try { await A.deleteOrder(o); refreshStore(); toast(`Order #${o.number} deleted`); await loadAll(); orders(); }
      catch (ex) { toast(ex.message || 'Could not delete the order'); }
      return;
    }
    const mk = t.closest('[data-ord-mark]');
    if (mk) {
      const sel = $(`#os-${mk.dataset.ordMark}`); const to = mk.dataset.to;
      if (sel && sel.value !== to && !(to === 'completed' && sel.value === 'shipped')) { sel.value = to; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      return;
    }
    const cf = t.closest('[data-confirm-order]');
    if (cf) {
      e.preventDefault(); e.stopPropagation();
      if (cf.disabled || cf.dataset.busy) return; cf.dataset.busy = '1';
      const id = cf.dataset.confirmOrder; cf.disabled = true;
      try { await A.confirmOrder(id); refreshStore(); await loadAll(); const d = $('#order-dlg'); if (d && d.open) { orders(); openOrder(id); } else if (tab === 'orders') orders(); else render(); }
      catch (ex) { cf.disabled = false; delete cf.dataset.busy; toast(ex.message || 'Could not confirm this order'); }
      return;
    }
    const co = t.closest('[data-cancel-order]');
    if (co) { await A.updateOrder(co.dataset.cancelOrder, { status: 'cancelled', restock: true }); refreshStore(); toast('Order cancelled and items restocked'); const d = t.closest('dialog'); if (d) d.close(); await loadAll(); orders(); return; }
    const ap = t.closest('[data-accept-price]');
    if (ap) { const o = data.offers.find((x) => x.id === ap.dataset.acceptPrice); const p = data.products.find((x) => x.id === o.productId); if (p) { await A.saveProduct({ ...p, originalPrice: p.originalPrice || p.price, price: o.amount }); await A.updateOffer(o.id, { status: 'accepted' }); refreshStore(); toast(`Price set to ${money(o.amount)} and offer accepted`); await loadAll(); offers(); } return; }
    const bulk = t.closest('[data-bulk]');
    if (bulk) {
      const ids = [...selected]; const act = bulk.dataset.bulk;
      if (act === 'delete' && !bulk.dataset.sure) { bulk.dataset.sure = '1'; bulk.textContent = `Confirm delete ${ids.length}`; bulk.classList.add('adm-danger'); return; }
      for (const id of ids) {
        const p = data.products.find((x) => x.id === id); if (!p) continue;
        if (act === 'discount') { const pctv = Math.min(95, Math.max(1, parseInt($('[data-bulk-pct]').value, 10) || 0)); const base = p.originalPrice || p.price; await A.saveProduct({ ...p, originalPrice: base, price: round2(base * (1 - pctv / 100)) }); }
        if (act === 'publish') await A.patchProduct(id, { published: true });
        if (act === 'unpublish') await A.patchProduct(id, { published: false });
        if (act === 'delete') await A.deleteProduct(id);
      }
      selected.clear(); refreshStore(); toast('Updated ' + ids.length + ' product' + (ids.length > 1 ? 's' : '')); await loadAll(); products(); return;
    }
    const cm = t.closest('[data-cat-move]');
    if (cm) { const li = cm.closest('[data-cat]'); const ids = store.categories().map((c) => c.id); const i = ids.indexOf(li.dataset.cat), j = i + Number(cm.dataset.catMove); [ids[i], ids[j]] = [ids[j], ids[i]]; await A.reorderCategories(ids); refreshStore(); categories(); return; }
    const cs = t.closest('[data-cat-save]');
    if (cs) { const li = cs.closest('[data-cat]'); const name = $('[data-cat-name]', li).value.trim(); if (!name) return; await A.saveCategory({ id: li.dataset.cat, name }); refreshStore(); toast('Category saved'); categories(); return; }
    const cd = t.closest('[data-cat-del]');
    if (cd) { if (!cd.dataset.sure) { cd.dataset.sure = '1'; cd.textContent = 'Confirm'; return; } await A.deleteCategory(cd.closest('[data-cat]').dataset.cat); refreshStore(); toast('Category deleted'); await loadAll(); categories(); return; }
    const od = t.closest('[data-offer-del]');
    if (od) { if (!od.dataset.sure) { od.dataset.sure = '1'; od.textContent = 'Tap again to delete'; return; } await A.deleteOffer(od.dataset.offerDel); await loadAll(); offers(); toast('Offer deleted'); return; }
    const md = t.closest('[data-msg-del]');
    if (md) { await A.deleteInquiry(md.dataset.msgDel); await loadAll(); (md.dataset.back === 'requests' ? orders : messages)(); toast('Deleted'); return; }
    if (t.closest('[data-export]')) { const json = await A.exportData(); const blob = new Blob([json], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mlgroup-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); toast('Backup downloaded'); return; }
    if (t.closest('[data-reset]')) { $('[data-reset-confirm]').hidden = false; return; }
    if (t.closest('[data-reset-no]')) { $('[data-reset-confirm]').hidden = true; return; }
    if (t.closest('[data-reset-yes]')) { await A.reset(); refreshStore(); toast('Demo data restored'); render(); }
  };
  const onChange = async (e) => {
    const t = e.target;
    if (t.matches('[data-pf-f]')) { prodFilter.f = t.value; products(); }
    if (t.matches('[data-sel]')) { t.checked ? selected.add(t.dataset.sel) : selected.delete(t.dataset.sel); const b = $('[data-bulk]'); b.hidden = !selected.size; $('[data-bulk-n]').textContent = `${selected.size} selected`; }
    if (t.matches('[data-sel-all]')) { $$('[data-sel]').forEach((c) => { c.checked = t.checked; t.checked ? selected.add(c.dataset.sel) : selected.delete(c.dataset.sel); }); const b = $('[data-bulk]'); b.hidden = !selected.size; $('[data-bulk-n]').textContent = `${selected.size} selected`; }
    if (t.matches('[data-pub]')) { await A.patchProduct(t.dataset.pub, { published: t.checked }); refreshStore(); t.nextElementSibling.textContent = t.checked ? 'Published' : 'Hidden'; toast(t.checked ? 'Published' : 'Hidden from store'); }
    if (t.matches('[data-of]')) { orderFilter = t.value; orders(); }
    if (t.matches('[data-order-status]')) { const id = t.dataset.orderStatus; try { await A.updateOrder(id, { status: t.value }); } catch (ex) { toast(ex.message || 'Could not update the order'); await loadAll(); if (tab === 'orders') orders(); return; } if ((data.orders.find((x) => x.id === id) || {}).stockHeld === false && t.value !== 'cancelled') refreshStore(); toast('Order status updated'); await loadAll(); const dlg = $('#order-dlg'); if (dlg && dlg.open) { orders(); openOrder(id); } else if (tab === 'orders') { const was = [...main.querySelectorAll('.ord-row[open]')].map((d) => d.dataset.oid); orders(); was.forEach((x) => { const d = main.querySelector(`.ord-row[data-oid="${x}"]`); if (d) d.open = true; }); } if (t.value === 'shipped') openTracking(id); }
    if (t.matches('[data-offer-status]')) { await A.updateOffer(t.dataset.offerStatus, { status: t.value }); toast('Offer updated'); await loadAll(); }
    if (t.matches('[data-msg-status]')) { await A.updateInquiry(t.dataset.msgStatus, { status: t.value }); await loadAll(); toast('Updated'); if (tab === 'requests' || tab === 'orders') orders(); }
    if (t.matches('[data-import]') && t.files[0]) { try { await A.importData(await t.files[0].text()); refreshStore(); toast('Backup imported'); render(); } catch (ex) { toast(ex.message, 'err'); } }
  };
  const onInvStock = async (e) => {
    if (!e.target.matches('[data-inv-setstock]')) return;
    const id = e.target.dataset.invSetstock; const n = parseInt(e.target.value, 10); const p = data.products.find((x) => x.id === id);
    if (!p || !(n >= 0) || n === p.inventory) { if (p) e.target.value = p.inventory; return; }
    try { const np = await A.patchProduct(id, { inventory: n }); p.inventory = np && np.inventory != null ? np.inventory : n; refreshStore(); invRefresh(id); } catch (ex) { toast(ex.message || 'Could not update stock'); e.target.value = p.inventory; }
  };
  main.addEventListener('change', onInvStock);
  main.addEventListener('change', (e) => { if (!e.target.matches('[data-inv-sort]')) return; invSort = e.target.value; inventory(); });
  const onInput = (e) => {
    if (e.target.matches('[data-inv-q]')) { invQ = e.target.value; $('.inv-list').innerHTML = invRowsHTML(); return; }
    if (e.target.matches('[data-cost]')) {
      const id = e.target.dataset.cost; const v = e.target.value; const p = data.products.find((x) => x.id === id);
      data.costs = data.costs || {}; if (v === '') delete data.costs[id]; else data.costs[id] = Number(v);
      const row = e.target.closest('[data-inv]'); if (row && p) $('[data-inv-total]', row).textContent = v === '' ? '—' : money(Number(v) * Math.max(0, p.inventory));
      invRefresh(null);
      clearTimeout(onInput.t); onInput.t = setTimeout(() => saveCost(id, v), 600);
      return;
    }
    if (e.target.matches('[data-pf-q]')) { prodFilter.q = e.target.value; const pos = e.target.selectionStart; products(); const i = $('[data-pf-q]'); i.focus(); i.setSelectionRange(pos, pos); } };
  const onSubmit = async (e) => {
    const f = e.target;
    if (f.matches('[data-login]')) {
      e.preventDefault();
      const btn = $('button[type="submit"]', f); btn.disabled = true;
      try { await A.login(f.elements.pw.value); render(); } catch (ex) { renderLogin(ex.message || 'Sign in failed.'); }
    }
    if (f.matches('[data-settings]')) { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); d.state = (d.state || '').toUpperCase(); await A.saveSettings(d); refreshStore(); toast('Store details saved'); }
    if (f.matches('[data-password]')) {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f)); const err = $('[data-err]', f);
      if (d.pw1.length < 6) { err.textContent = 'Use at least 6 characters.'; err.hidden = false; return; }
      if (d.pw1 !== d.pw2) { err.textContent = 'The passwords don’t match.'; err.hidden = false; return; }
      try { await A.changePassword(d.pw1); f.reset(); err.hidden = true; toast('Password changed'); } catch (ex) { err.textContent = ex.message; err.hidden = false; }
    }
    if (f.matches('[data-cat-add]')) { e.preventDefault(); const name = f.elements.name.value.trim(); if (!name) return; await A.saveCategory({ name }); refreshStore(); toast('Category added'); categories(); }
  };
  // label table cells so they can stack as cards on phones
  const labelTables = () => $$('table.tbl', main).forEach((t) => {
    const heads = $$('thead th', t).map((th) => th.textContent.trim());
    $$('tbody tr', t).forEach((tr) => $$('td', tr).forEach((td, i) => { if (!td.hasAttribute('data-label')) td.setAttribute('data-label', heads[i] || ''); }));
  });
  const mo = new MutationObserver(labelTables);
  mo.observe(main, { childList: true, subtree: true });
  main.addEventListener('click', onClick);
  main.addEventListener('change', onChange);
  // Swipe an order row left to reveal Delete.
  function closeSwipes(except) { main.querySelectorAll('.ord-swipe.open').forEach((w) => { if (w !== except) w.classList.remove('open'); }); }
  let sw = null;
  main.addEventListener('touchstart', (e) => { const w = e.target.closest('.ord-swipe'); sw = w ? { w, x: e.touches[0].clientX, y: e.touches[0].clientY, moved: false } : null; if (!w) closeSwipes(); }, { passive: true });
  main.addEventListener('touchmove', (e) => {
    if (!sw) return; const dx = e.touches[0].clientX - sw.x, dy = e.touches[0].clientY - sw.y;
    if (!sw.moved && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.5) { sw.moved = true; if (dx < 0) { closeSwipes(sw.w); sw.w.classList.add('open'); } else sw.w.classList.remove('open'); }
  }, { passive: true });
  main.addEventListener('click', (e) => { const w = e.target.closest('.ord-swipe'); if (w && w.classList.contains('open') && !e.target.closest('[data-del-order]')) { e.preventDefault(); e.stopPropagation(); w.classList.remove('open'); } }, true);
  main.addEventListener('input', onInput);
  main.addEventListener('submit', onSubmit);
  render();
  return () => { mo.disconnect(); main.removeEventListener('click', onClick); main.removeEventListener('change', onChange); main.removeEventListener('input', onInput); main.removeEventListener('submit', onSubmit); };
}

window.MLAdmin = { mount };
