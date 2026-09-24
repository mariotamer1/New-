// ML Group admin dashboard. Mounted by main.js at /admin with the shared store instance.
import { $, $$, esc, money, pctOff, href, img, imgTag, icon, logo, telHref, fmtDate, round2, slugify, ENV } from './lib.js';
import { toast } from './ui.js';

const TABS = [
  ['overview', 'Overview', 'chart'],
  ['products', 'Products', 'tag'],
  ['orders', 'Orders', 'box'],
  ['offers', 'Offers', 'cash'],
  ['requests', 'Requests', 'calendar'],
  ['messages', 'Messages', 'msg'],
  ['categories', 'Categories', 'layers'],
  ['settings', 'Settings', 'gear'],
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
    data = { products, orders, offers, inquiries };
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

  // ------------------------------------------------------------ shell
  function shell(body, title, actions = '') {
    const nNew = (k, st = 'new') => data[k].filter((x) => x.status === st).length;
    const badge = { orders: nNew('orders'), offers: nNew('offers'), requests: data.inquiries.filter((m) => m.type === 'pickup' && m.status === 'new').length, messages: data.inquiries.filter((m) => m.type !== 'pickup' && m.status === 'new').length };
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
    setURL();
    if (tab === 'products' && editId) return renderEditor();
    const views = { overview, products, orders, offers, requests, messages, categories, settings };
    (views[tab] || overview)();
  }

  // ------------------------------------------------------------ overview
  function overview() {
    const P = data.products;
    const live = P.filter((p) => p.published && p.inventory > 0);
    const out = P.filter((p) => p.inventory <= 0);
    const low = P.filter((p) => p.inventory > 0 && p.inventory <= 2).slice(0, 6);
    const since = Date.now() - 30 * 864e5;
    const rev = data.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt) > since).reduce((s, o) => s + o.total, 0);
    const tiles = [
      ['Live listings', live.length, 'Published and in stock'],
      ['Units in stock', P.reduce((s, p) => s + Math.max(0, p.inventory), 0), `${out.length} sold out (hidden)`],
      ['New orders', data.orders.filter((o) => o.status === 'new').length, `${data.orders.length} total`],
      ['New offers', data.offers.filter((o) => o.status === 'new').length, `${data.offers.length} total`],
      ['Sales · 30 days', money(rev), 'Excludes cancelled'],
      ['Messages', data.inquiries.filter((o) => o.status === 'new').length, 'Contact + wholesale'],
    ];
    main.innerHTML = shell(`
      <div class="adm-tiles">${tiles.map(([l, v, s]) => `<div class="adm-tile"><span class="eyebrow">${l}</span><b class="tabnum">${v}</b><span class="muted">${s}</span></div>`).join('')}</div>
      <div class="adm-cols">
        <section class="adm-card"><div class="adm-card-head"><h2>Recent orders</h2><button class="link" type="button" data-tab="orders">All orders</button></div>
          ${data.orders.length ? `<ul class="adm-list">${data.orders.slice(0, 6).map((o) => `<li><button type="button" data-open-order="${o.id}"><span><b class="mono">#${o.number}</b> ${esc(o.customer.name)}<small>${fmtDate(o.createdAt, true)} · ${o.items.length} item${o.items.length > 1 ? 's' : ''} · ${o.fulfillment === 'pickup' ? 'Pickup' : 'Ship'}</small></span><span class="tabnum">${money(o.total)}</span><span class="status s-${o.status}">${statusLabel(ORDER_STATUS, o.status)}</span></button></li>`).join('')}</ul>` : '<p class="muted adm-empty">No orders yet. They appear here as soon as a customer checks out.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>Latest offers</h2><button class="link" type="button" data-tab="offers">All offers</button></div>
          ${data.offers.length ? `<ul class="adm-list">${data.offers.slice(0, 6).map((o) => `<li><button type="button" data-tab="offers"><span><b>${money(o.amount)}</b> for ${esc(o.productTitle)}<small>${esc(o.name)} · ${esc(o.phone)} · ${fmtDate(o.createdAt, true)}</small></span><span class="status s-${o.status}">${statusLabel(OFFER_STATUS, o.status)}</span></button></li>`).join('')}</ul>` : '<p class="muted adm-empty">No offers yet. Offers from the “Make Offer” button land here.</p>'}
        </section>
        <section class="adm-card"><div class="adm-card-head"><h2>Low stock</h2><button class="link" type="button" data-tab="products">Inventory</button></div>
          ${low.length ? `<ul class="adm-list">${low.map((p) => `<li><button type="button" data-edit="${p.id}"><span>${esc(p.title)}<small>${catName(p.categoryId)}</small></span><b class="tabnum">${p.inventory} left</b></button></li>`).join('')}</ul>` : '<p class="muted adm-empty">Nothing is running low.</p>'}
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
  function renderEditor() {
    const isNew = editId === 'new';
    const p = isNew ? null : data.products.find((x) => x.id === editId);
    if (!isNew && !p) { editId = null; return products(); }
    if (!draft || draft._for !== editId) {
      draft = p ? JSON.parse(JSON.stringify(p)) : { title: '', slug: '', brand: '', upc: '', condition: 'New', categoryId: (store.categories()[0] || {}).id || null, description: '', price: '', originalPrice: '', shipping: 9.99, inventory: 1, published: true, bestDeal: false, images: [] };
      draft._for = editId;
    }
    const d = draft;
    const pct = d.originalPrice && d.price && Number(d.originalPrice) > Number(d.price) ? Math.round((1 - d.price / d.originalPrice) * 100) : '';
    main.innerHTML = shell(`
      <form class="adm-editor" novalidate data-editor>
        <div class="adm-ed-main">
          <section class="adm-card"><div class="adm-card-head"><h2>Details</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-title">Title</label><input id="ed-title" name="title" required maxlength="140" value="${esc(d.title)}" placeholder="e.g. 55&quot; 4K Smart TV – Open Box"></div>
            <div class="field"><label for="ed-desc">Description</label><textarea id="ed-desc" name="description" rows="8" placeholder="What it is, condition notes, what’s included. Start lines with • for bullet points.">${esc(d.description)}</textarea></div>
            <div class="form-row two">
              <div class="field"><label for="ed-brand">Brand <span class="opt">(optional)</span></label><input id="ed-brand" name="brand" value="${esc(d.brand || '')}"></div>
              <div class="field"><label for="ed-upc">UPC <span class="opt">(optional)</span></label><input id="ed-upc" name="upc" inputmode="numeric" maxlength="14" value="${esc(d.upc || '')}"><span class="hint">8–14 digits from the barcode.</span></div>
            </div>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Photos</h2><span class="muted" style="font-size:13px">First photo is the cover. Drag to reorder.</span></div><div class="adm-card-body">
            <div class="adm-photos" data-photos>${photosHTML(d)}</div>
            <label class="adm-drop" data-drop><input type="file" accept="image/*" multiple data-files class="sr-only">${icon('upload')}<span><b>Add photos</b> — click or drop images here</span><small>JPG, PNG, WebP or HEIC-converted. Resized automatically.</small></label>
            <p class="muted" data-upload-status aria-live="polite" style="font-size:13px"></p>
          </div></section>
        </div>
        <div class="adm-ed-side">
          <section class="adm-card"><div class="adm-card-head"><h2>Visibility</h2></div><div class="adm-card-body form">
            <label class="switch big"><input type="checkbox" name="published" ${d.published ? 'checked' : ''}><span>Published on the store</span></label>
            <p class="hint">Items with 0 in stock are hidden automatically.</p>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Pricing</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-orig">Original / retail price</label><div class="money-input"><span>$</span><input id="ed-orig" name="originalPrice" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(d.originalPrice ?? '')}"></div></div>
            <div class="form-row two">
              <div class="field"><label for="ed-pct">Discount %</label><input id="ed-pct" name="pct" type="number" inputmode="numeric" min="0" max="95" step="1" value="${pct}"></div>
              <div class="field"><label for="ed-price">Sale price</label><div class="money-input"><span>$</span><input id="ed-price" name="price" type="number" inputmode="decimal" min="0" step="0.01" required value="${esc(d.price ?? '')}"></div></div>
            </div>
            <p class="hint" data-price-hint>Enter a discount % to calculate the sale price automatically.</p>
            <div class="field"><label for="ed-ship">Shipping price</label><div class="money-input"><span>$</span><input id="ed-ship" name="shipping" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(d.shipping ?? 0)}"></div><span class="hint">Local pickup is always free.</span></div>
            <label class="check-row"><input type="checkbox" name="noShipping" ${d.noShipping ? 'checked' : ''}> <span><b>Not available for shipping</b><br><span class="hint">The store will only show “Available for pick up”.</span></span></label>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Inventory</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-inv">Quantity in stock</label><div class="qty" style="height:46px"><button type="button" aria-label="Decrease" data-ed-inv="-1">${icon('minus', 'icon-sm')}</button><input id="ed-inv" name="inventory" type="number" inputmode="numeric" min="0" step="1" value="${esc(d.inventory)}" style="width:80px"><button type="button" aria-label="Increase" data-ed-inv="1">${icon('plus', 'icon-sm')}</button></div></div>
          </div></section>
          <section class="adm-card"><div class="adm-card-head"><h2>Organize</h2></div><div class="adm-card-body form">
            <div class="field"><label for="ed-cat">Category</label><select id="ed-cat" name="categoryId">${store.categories().map((c) => `<option value="${c.id}" ${d.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}<option value="" ${!d.categoryId ? 'selected' : ''}>Uncategorized</option></select></div>
            <div class="field"><label for="ed-cond">Condition</label><select id="ed-cond" name="condition">${CONDITIONS.map((c) => `<option ${d.condition === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
            <div class="field"><label for="ed-slug">Web address</label><input id="ed-slug" name="slug" value="${esc(d.slug)}" placeholder="auto from title"><span class="hint">/products/<b data-slug-preview>${esc(d.slug || slugify(d.title) || 'product-name')}</b></span></div>
          </div></section>
          <p class="form-error" data-err hidden></p>
          <div class="adm-ed-actions">
            <button class="btn btn-primary btn-lg" type="submit">${isNew ? 'Create product' : 'Save changes'}</button>
            <button class="btn btn-lg" type="button" data-cancel-edit>Cancel</button>
            ${isNew ? '' : `<button class="btn btn-lg adm-danger" type="button" data-delete-product>${icon('trash', 'icon-sm')} Delete</button>`}
          </div>
          <div class="adm-confirm" data-confirm hidden><p><b>Delete this product?</b> This can’t be undone.</p><div><button class="btn btn-sm adm-danger" type="button" data-confirm-delete>Delete</button><button class="btn btn-sm" type="button" data-confirm-cancel>Keep it</button></div></div>
        </div>
      </form>`, isNew ? 'New product' : 'Edit product', `<button class="btn" type="button" data-cancel-edit>${icon('left', 'icon-sm')} All products</button>`);
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

  function wireEditor() {
    const form = $('[data-editor]');
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
      if (n === 'title' || n === 'slug') $('[data-slug-preview]').textContent = slugify(f('slug').value || f('title').value) || 'product-name';
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
      if (!(price > 0)) problems.push(['ed-price', 'Enter a sale price greater than $0.']);
      if (!(inv >= 0)) problems.push(['ed-inv', 'Inventory must be 0 or more.']);
      if (!(ship >= 0)) problems.push(['ed-ship', 'Shipping must be 0 or more.']);
      if (upc && (upc.length < 8 || upc.length > 14)) problems.push(['ed-upc', 'UPC should be 8–14 digits.']);
      $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid'));
      if (problems.length) { problems.forEach(([id]) => $('#' + id).setAttribute('aria-invalid', 'true')); err.textContent = problems.map((x) => x[1]).join(' '); err.hidden = false; $('#' + problems[0][0]).focus(); return; }
      const rec = {
        id: editId === 'new' ? undefined : editId, title: draft.title.trim(), slug: draft.slug.trim(), brand: draft.brand.trim(), upc,
        condition: draft.condition, categoryId: draft.categoryId || null, description: draft.description.trim(),
        price: round2(price), originalPrice: orig > price ? round2(orig) : null, shipping: round2(ship), inventory: inv,
        published: draft.published, bestDeal: false, noShipping: !!draft.noShipping, images: draft.images,
      };
      const btn = $('button[type="submit"]', form); btn.disabled = true; btn.textContent = 'Saving…';
      try {
        const saved = await A.saveProduct(rec);
        refreshStore();
        toast(editId === 'new' ? 'Product created' : 'Changes saved');
        editId = null; draft = null; tab = 'products';
        render();
        return saved;
      } catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; btn.textContent = 'Save changes'; }
    });
  }

  // ------------------------------------------------------------ orders
  let orderFilter = 'all';
  function orders() {
    const list = data.orders.filter((o) => orderFilter === 'all' || o.status === orderFilter);
    main.innerHTML = shell(`
      <div class="adm-toolbar"><div class="select"><label class="sr-only" for="of-f">Status</label><select id="of-f" data-of>${[['all', 'All orders'], ...ORDER_STATUS].map(([v, l]) => `<option value="${v}" ${orderFilter === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('down')}</div><span class="muted" style="font-size:14px">${list.length} order${list.length === 1 ? '' : 's'}</span></div>
      ${list.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Delivery</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
      ${list.map((o) => `<tr><td class="mono"><b>#${o.number}</b></td><td>${fmtDate(o.createdAt, true)}</td><td>${esc(o.customer.name)}<small>${esc(o.customer.phone)}</small></td><td>${o.items.reduce((s, i) => s + i.qty, 0)}</td><td>${o.fulfillment === 'pickup' ? 'Pickup' : 'Ship'}</td><td class="tabnum"><b>${money(o.total)}</b></td>
        <td><label class="sr-only" for="os-${o.id}">Status</label><select id="os-${o.id}" class="adm-status" data-order-status="${o.id}">${ORDER_STATUS.map(([v, l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
        <td><button class="btn btn-sm" type="button" data-open-order="${o.id}">View</button></td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty"><h2>No orders</h2><p class="muted">New orders from checkout appear here instantly.</p></div>'}
      <dialog class="modal adm-order-dlg" id="order-dlg" aria-labelledby="od-title"></dialog>`, 'Orders');
  }
  function openOrder(id) {
    const o = data.orders.find((x) => x.id === id); if (!o) return;
    if (!$('#order-dlg')) { tab = 'orders'; orders(); }
    const dlg = $('#order-dlg');
    const addr = o.address ? `${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}` : 'Local pickup';
    dlg.innerHTML = `<div class="modal-head"><h2 id="od-title">Order #${o.number}</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dlg>${icon('close')}</button></div>
      <div class="modal-body">
        <dl class="kv"><div><dt>Placed</dt><dd>${fmtDate(o.createdAt, true)}</dd></div><div><dt>Delivery</dt><dd>${o.fulfillment === 'pickup' ? 'Local pickup' : 'Shipping'}</dd></div><div><dt>Payment</dt><dd>${o.payment === 'pickup' ? 'Pay at pickup' : 'Send payment link'}</dd></div><div><dt>Total</dt><dd class="tabnum">${money(o.total)}</dd></div></dl>
        <div class="info-card"><h2>Customer</h2><p><b>${esc(o.customer.name)}</b></p><p><a href="${telHref(o.customer.phone)}">${esc(o.customer.phone)}</a> · <a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a></p><p class="muted">${addr}</p>${o.notes ? `<p><b>Notes:</b> ${esc(o.notes)}</p>` : ''}</div>
        <ul class="sum-items" style="max-height:none;border:1px solid var(--line)">${o.items.map((i) => `<li class="sum-item"><span class="th">${imgTag(i.image, { alt: '', sizes: '56px' })}<span class="q">${i.qty}</span></span><span class="t">${esc(i.title)}<small>${i.qty} × ${money(i.price)}${i.shipping ? ' · ship ' + money(i.shipping) : ''}</small></span><span class="p tabnum">${money(i.price * i.qty)}</span></li>`).join('')}</ul>
        <div class="sum-totals" style="padding:0"><div class="row"><span>Subtotal</span><span class="tabnum">${money(o.subtotal)}</span></div><div class="row"><span>Shipping</span><span class="tabnum">${money(o.shippingTotal)}</span></div><div class="row total"><span>Total</span><span class="tabnum">${money(o.total)}</span></div></div>
        <div class="field"><label for="od-status">Status</label><select id="od-status" data-order-status="${o.id}">${ORDER_STATUS.map(([v, l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${o.status !== 'cancelled' ? `<div><button class="btn adm-danger" type="button" data-cancel-order="${o.id}">Cancel order &amp; return items to stock</button></div>` : ''}
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
  function requests() {
    const list = data.inquiries.filter((m) => m.type === 'pickup');
    const parse = (m) => {
      const item = ((m.message || '').match(/Pickup request:\s*(.+)/) || [])[1] || 'Pickup request';
      const when = ((m.message || '').match(/When:\s*(.+)/) || [])[1] || '';
      return { item: item.trim(), when: when.trim() };
    };
    main.innerHTML = shell(list.length ? `<div class="adm-reqs">${list.map((m) => { const r = parse(m); const tel = String(m.phone || '').replace(/[^\d+]/g, ''); return `<details class="adm-req ${m.status === 'new' ? 'unread' : ''}">
      <summary><span class="adm-req-title"><b>${esc(r.item)}</b><small>${icon('calendar', 'icon-sm')} ${esc(r.when || fmtDate(m.createdAt, true))}</small></span>${m.status === 'new' ? '<span class="status s-new">New</span>' : `<span class="status s-${m.status}">${m.status === 'read' ? 'Confirmed' : 'Done'}</span>`}${icon('down')}</summary>
      <div class="adm-req-body">
        <dl class="kv"><div><dt>Name</dt><dd>${esc(m.name)}</dd></div><div><dt>Phone</dt><dd><a href="${telHref(m.phone)}">${esc(m.phone)}</a></dd></div><div><dt>Pickup time</dt><dd>${esc(r.when || '—')}</dd></div><div><dt>Requested</dt><dd>${fmtDate(m.createdAt, true)}</dd></div></dl>
        <div class="adm-req-actions">
          <a class="btn btn-primary" href="sms:${esc(tel)}">${icon('msg', 'icon-sm')} Text</a>
          <a class="btn" href="${telHref(m.phone)}">${icon('phone', 'icon-sm')} Call</a>
          <label class="sr-only" for="rq-${m.id}">Status</label><select id="rq-${m.id}" class="adm-status" data-msg-status="${m.id}"><option value="new" ${m.status === 'new' ? 'selected' : ''}>New</option><option value="read" ${m.status === 'read' ? 'selected' : ''}>Confirmed</option><option value="archived" ${m.status === 'archived' ? 'selected' : ''}>Done</option></select>
          <button class="btn btn-sm" type="button" data-msg-del="${m.id}" data-back="requests">${icon('trash', 'icon-sm')} Delete</button>
        </div>
      </div></details>`; }).join('')}</div>` : '<div class="empty"><h2>No pickup requests yet</h2><p class="muted">When a customer taps “Choose a date &amp; time” on a product, their request shows up here.</p></div>', 'Requests');
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
    if (md) { await A.deleteInquiry(md.dataset.msgDel); await loadAll(); (md.dataset.back === 'requests' ? requests : messages)(); toast('Deleted'); return; }
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
    if (t.matches('[data-order-status]')) { await A.updateOrder(t.dataset.orderStatus, { status: t.value }); toast('Order status updated'); await loadAll(); }
    if (t.matches('[data-offer-status]')) { await A.updateOffer(t.dataset.offerStatus, { status: t.value }); toast('Offer updated'); await loadAll(); }
    if (t.matches('[data-msg-status]')) { await A.updateInquiry(t.dataset.msgStatus, { status: t.value }); await loadAll(); toast('Updated'); if (tab === 'requests') requests(); }
    if (t.matches('[data-import]') && t.files[0]) { try { await A.importData(await t.files[0].text()); refreshStore(); toast('Backup imported'); render(); } catch (ex) { toast(ex.message, 'err'); } }
  };
  const onInput = (e) => { if (e.target.matches('[data-pf-q]')) { prodFilter.q = e.target.value; const pos = e.target.selectionStart; products(); const i = $('[data-pf-q]'); i.focus(); i.setSelectionRange(pos, pos); } };
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
  main.addEventListener('input', onInput);
  main.addEventListener('submit', onSubmit);
  render();
  return () => { mo.disconnect(); main.removeEventListener('click', onClick); main.removeEventListener('change', onChange); main.removeEventListener('input', onInput); main.removeEventListener('submit', onSubmit); };
}

window.MLAdmin = { mount };
