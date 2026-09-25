// Storefront pages. Each page returns { title, description, html, mount, jsonld, image }.
import { $, $$, esc, money, pctOff, href, img, imgTag, icon, barcode, telHref, ls, round2, ENV } from './lib.js';
import { store, cart } from './store.js';
import { cardHTML, priceHTML, mountCarousels, searchProducts, toast, addToCart } from './ui.js';

// Whole-dollar prices drop the cents so tile tags fit on small screens.
const tileMoney = (n) => (Number(n) % 1 ? money(n) : money(n).replace(/\.00$/, ''));

const catName = (id) => (store.category(id) || {}).name || 'Other';
const bestDeals = () => {
  const all = store.products();
  return all.slice().sort((a, b) => pctOff(b) - pctOff(a));
};

// ---------------------------------------------------------------- home
export function home() {
  const s = store.settings();
  const deals = bestDeals();
  const pick = (slug) => store.product(slug);
  const heroSlugs = ['portable-bluetooth-cd-boombox', 'countertop-microwave-1-1-cu-ft', 'portable-steel-toolbox-20-inch', 'velvet-accent-chair-mango', 'vintage-tin-toy-car', 'robot-vacuum-cleaner'];
  let hero = heroSlugs.map(pick).filter(Boolean);
  deals.forEach((p) => { if (hero.length < 6 && !hero.includes(p)) hero.push(p); });
  hero = hero.slice(0, 6);
  const cats = store.categories();
  const counts = {}; store.products().forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
  const catImg = (c) => { const p = deals.find((x) => x.categoryId === c.id); return p ? p.images[0] : null; };
  const maxOff = Math.max(0, ...store.products().map(pctOff));
  return {
    title: '',
    description: `Big savings on electronics, home goods, tools, appliances, toys and more — up to ${maxOff}% off retail. Fast shipping, free local pickup, and wholesale pricing from ML Group.`,
    html: `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Retail &amp; wholesale · Up to ${maxOff}% off</p>
          <h1 class="display"><span>Big savings.</span><span>Great products.</span></h1>
          <p class="hero-lede">ML Group offers brand-new products sourced from big retailers like Walmart and Amazon, and more. Every item is new and was purchased through clearance opportunities—we simply pass the savings on to you at prices below retail.</p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="${href('/products')}">Browse Deals ${icon('arrow', 'icon-sm')}</a>
          </div>
          <div class="hero-proof"><span>${icon('truck')} Ships nationwide</span><span>${icon('store')} Free local pickup</span></div>
        </div>
        <div class="hero-collage" aria-label="Featured deals">
          ${hero.map((p, i) => `<a class="hero-tile ${i === 0 ? 'big' : ''}" href="${href('/products/' + p.slug)}">
            ${imgTag(p.images[0], { alt: p.title, eager: i < 3, sizes: i === 0 ? '(min-width:900px) 34vw, 66vw' : '(min-width:900px) 17vw, 33vw' })}
            <span class="cat">${esc(p.title)}</span>
            <span class="tag">${pctOff(p) ? `<b class="was-slash tabnum">${tileMoney(p.originalPrice)}</b>` : ''}<span class="tabnum">${tileMoney(p.price)}</span></span>
          </a>`).join('')}
        </div>
      </div>
    </section>
    <section class="proof-strip on-ink" aria-label="Why shop ML Group">
      <ul class="wrap">
        <li>${icon('percent')}<div><b>Up to ${maxOff}% off</b><span>Below retail, every day</span></div></li>
        <li>${icon('store')}<div><b>Local pickup</b><span>Always free, always available</span></div></li>
        <li>${icon('truck')}<div><b>Fast shipping</b><span>Flat price shown on every item</span></div></li>
        <li>${icon('box')}<div><b>Wholesale</b><span>Case packs &amp; pallets</span></div></li>
      </ul>
    </section>
    <section class="section" aria-labelledby="deals-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="deals-h">Shop our products</h2><p>Brand-new items below retail. When they’re gone, they’re gone.</p></div><a class="link-arrow" href="${href('/products')}">View all products ${icon('arrow', 'icon-sm')}</a></div>
        <div class="grid cols-4">${deals.slice(0, 8).map((p) => cardHTML(p)).join('')}</div>
      </div>
    </section>
    <section class="section band alt" aria-labelledby="cats-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="cats-h">Shop by category</h2></div><a class="link-arrow" href="${href('/categories')}">All categories ${icon('arrow', 'icon-sm')}</a></div>
        <div class="cat-grid six">${cats.map((c) => `<a class="cat-tile" href="${href('/categories/' + c.slug)}"><div class="ct-img">${imgTag(catImg(c), { alt: '', sizes: '(min-width:1200px) 16vw, 50vw' })}</div><div class="ct-body"><div><h3>${esc(c.name)}</h3><span class="ct-count">${counts[c.id] || 0} items</span></div>${icon('arrow')}</div></a>`).join('')}</div>
      </div>
    </section>
    <section class="band ws-band on-ink" aria-labelledby="ws-h">
      <div class="wrap">
        <div style="display:grid;gap:18px">
          <p class="eyebrow">For resellers, stores &amp; businesses</p>
          <h2 id="ws-h">Buy by the case. Save by the pallet.</h2>
          <p>ML Group works with buyers who need larger quantities — mixed lots, case packs and full pallets at wholesale pricing.</p>
          <div class="hero-cta"><a class="btn btn-invert btn-lg" href="${href('/wholesale')}">Wholesale pricing</a><a class="btn btn-ghost-ink btn-lg" href="${telHref(s.phone)}">${icon('phone', 'icon-sm')} ${esc(s.phone)}</a></div>
        </div>
        <ul class="ws-points">
          <li>${icon('layers')}<div><b>Volume discounts</b><span>Tiered pricing starting at 10 units.</span></div></li>
          <li>${icon('box')}<div><b>Mixed lots &amp; pallets</b><span>Electronics, home, tools and general merchandise.</span></div></li>
          <li>${icon('truck')}<div><b>Freight or dock pickup</b><span>We load your truck or arrange LTL shipping.</span></div></li>
        </ul>
      </div>
    </section>
    <section class="section" aria-labelledby="pickup-h">
      <div class="wrap">
        <div class="section-head"><div><h2 id="pickup-h">Local pickup, made easy</h2><p>${s.address1 ? esc(s.address1) + ', ' : ''}${esc(s.city)}, ${esc(s.state)} · ${esc(s.pickupHours)}</p></div></div>
        <ol class="steps">
          <li><h3>Order online</h3><p>Choose “Local pickup” at checkout — it’s always free.</p></li>
          <li><h3>Get a text</h3><p>We’ll text you when your order is ready, usually within one business day.</p></li>
          <li><h3>Pick it up</h3><p>Show your order number. We’ll help load large items.</p></li>
        </ol>
      </div>
    </section>`,
    mount: (root) => mountCarousels(root),
  };
}

// ---------------------------------------------------------------- catalog
const VIEWS = [['grid4', '4-column grid', 'grid4'], ['grid2', '2-column grid', 'grid2'], ['list', 'List view', 'list'], ['scroll', 'Horizontal scrolling', 'rows']];
const SORTS = [['deals', 'Featured'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low'], ['new', 'Newest']];
const RANGES = [['', 'Any price'], ['0-25', 'Under $25'], ['25-100', '$25 – $100'], ['100-500', '$100 – $500'], ['500-', '$500 & up']];

export function catalog({ query, params = {} }) {
  const catSlug = params.cat || query.get('category') || '';
  const cat = catSlug ? store.category(catSlug) : null;
  const state = {
    q: query.get('q') || '', cat: cat ? cat.slug : '', deals: query.get('deals') === '1',
    min: query.get('min') || '', max: query.get('max') || '',
    sort: query.get('sort') || 'deals', view: query.get('view') || ls.get('ml-view', 'grid4'), shown: 24,
  };
  const title = cat ? cat.name : state.q ? `Search: ${state.q}` : 'All Products';
  const lead = cat ? `Discounted ${cat.name.toLowerCase()} — new and like-new stock at below-retail prices.` : 'Everything in stock right now. Filter by category or price.';
  return {
    title, description: cat ? `Shop discounted ${cat.name.toLowerCase()} at ML Group. Big savings, fast shipping and free local pickup.` : 'Shop all discounted products at ML Group — electronics, home & kitchen, tools, appliances, toys and more.',
    path: cat ? '/categories/' + cat.slug : '/products',
    html: `
    <div class="page-head"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span>${cat ? `<a href="${href('/categories')}">Categories</a><span aria-hidden="true">/</span><span aria-current="page">${esc(cat.name)}</span>` : '<span aria-current="page">Products</span>'}</nav>
      <h1>${esc(title)}</h1><p>${esc(lead)}</p>
    </div></div>
    <div class="wrap catalog">
      <aside class="filters" aria-label="Filters" data-filters></aside>
      <div>
        <div class="toolbar">
          <p class="result-count" data-count aria-live="polite"></p>
          <button class="btn btn-sm filter-btn" type="button" data-open-filters>${icon('filter', 'icon-sm')} Filters</button>
          <div class="select"><label class="sr-only" for="sort">Sort by</label><select id="sort" data-sort>${SORTS.map(([v, l]) => `<option value="${v}" ${state.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('down')}</div>
          <div class="views" role="group" aria-label="View">${VIEWS.map(([v, l, ic]) => `<button type="button" aria-label="${l}" title="${l}" aria-pressed="${state.view === v}" data-view="${v}">${icon(ic)}</button>`).join('')}</div>
        </div>
        <div class="active-filters" data-active></div>
        <div data-results></div>
      </div>
    </div>
    <dialog class="modal" id="filter-dialog" aria-labelledby="filter-title"><div class="modal-head"><h2 id="filter-title">Filters</h2><button class="icon-btn" type="button" aria-label="Close filters" data-close-filters>${icon('close')}</button></div><div class="modal-body" data-filters-m></div><div class="modal-body" style="padding-top:0"><button class="btn btn-primary btn-block" type="button" data-close-filters>Show results</button></div></dialog>`,
    mount(root, { navigateReplace }) {
      const filterHTML = (sfx) => {
        const counts = {};
        store.products().forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
        const range = `${state.min}-${state.max}`;
        return `
        <div class="f-group"><h3>Category</h3><div class="f-options">
          <label class="f-opt"><input type="radio" name="cat${sfx}" value="" ${!state.cat ? 'checked' : ''}> All categories <span class="count">${store.products().length}</span></label>
          ${store.categories().map((c) => `<label class="f-opt"><input type="radio" name="cat${sfx}" value="${c.slug}" ${state.cat === c.slug ? 'checked' : ''}> ${esc(c.name)} <span class="count">${counts[c.id] || 0}</span></label>`).join('')}
        </div></div>
        <div class="f-group"><h3>Price</h3><div class="f-options">
          ${RANGES.map(([v, l]) => `<label class="f-opt"><input type="radio" name="range${sfx}" value="${v}" ${(v === '' ? !state.min && !state.max : range === v) ? 'checked' : ''}> ${l}</label>`).join('')}
        </div>
        <div class="price-inputs" style="margin-top:10px"><label><span>$</span><input type="number" inputmode="numeric" min="0" placeholder="Min" aria-label="Minimum price" name="min${sfx}" value="${esc(state.min)}"></label><span aria-hidden="true">–</span><label><span>$</span><input type="number" inputmode="numeric" min="0" placeholder="Max" aria-label="Maximum price" name="max${sfx}" value="${esc(state.max)}"></label></div></div>`;
      };
      const filtered = () => {
        let list = state.q ? searchProducts(state.q) : store.products().slice();
        if (state.cat) { const c = store.category(state.cat); list = list.filter((p) => c && p.categoryId === c.id); }
        const mn = parseFloat(state.min), mx = parseFloat(state.max);
        if (!isNaN(mn)) list = list.filter((p) => p.price >= mn);
        if (!isNaN(mx)) list = list.filter((p) => p.price <= mx);
        const by = { deals: (a, b) => (pctOff(b) - pctOff(a)), 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, new: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)) };
        if (!(state.q && state.sort === 'deals')) list.sort(by[state.sort] || by.deals);
        return list;
      };
      const syncURL = () => {
        const q = new URLSearchParams();
        if (state.q) q.set('q', state.q);
        if (state.deals) q.set('deals', '1');
        if (state.min) q.set('min', state.min);
        if (state.max) q.set('max', state.max);
        if (state.sort !== 'deals') q.set('sort', state.sort);
        const base = state.cat ? '/categories/' + state.cat : '/products';
        navigateReplace(base + (q.toString() ? '?' + q : ''));
      };
      const renderResults = () => {
        const list = filtered();
        $('[data-count]', root).innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'product' : 'products'}`;
        const chips = [];
        if (state.q) chips.push(['q', `“${state.q}”`]);
        if (state.cat) chips.push(['cat', catName((store.category(state.cat) || {}).id)]);
        if (state.min || state.max) chips.push(['price', `${state.min ? '$' + state.min : '$0'} – ${state.max ? '$' + state.max : 'any'}`]);
        $('[data-active]', root).innerHTML = chips.map(([k, l]) => `<button class="chip" type="button" data-clear-f="${k}" aria-label="Remove filter ${esc(l)}">${esc(l)} ${icon('close')}</button>`).join('') + (chips.length > 1 ? '<button class="link" type="button" data-clear-f="all" style="font-size:13px">Clear all</button>' : '');
        const box = $('[data-results]', root);
        if (!list.length) {
          box.innerHTML = `<div class="empty"><h2>No matches</h2><p class="muted">Try removing a filter or searching for something else.</p><button class="btn" type="button" data-clear-f="all">Clear filters</button></div>`;
          return;
        }
        if (state.view === 'scroll') {
          const groups = store.categories().map((c) => [c, list.filter((p) => p.categoryId === c.id)]).filter(([, l]) => l.length);
          const other = list.filter((p) => !store.category(p.categoryId));
          if (other.length) groups.push([{ name: 'More', slug: '' }, other]);
          box.innerHTML = `<div class="shelves">${groups.map(([c, l]) => `<section><div class="shelf-head"><h3>${esc(c.name)}</h3>${c.slug ? `<a href="${href('/categories/' + c.slug)}">See all ${l.length}</a>` : ''}</div><div class="shelf" tabindex="0" aria-label="${esc(c.name)} products, scroll horizontally">${l.map((p) => cardHTML(p, { sizes: '260px' })).join('')}</div></section>`).join('')}</div>`;
        } else {
          const cls = { grid4: 'cols-4', grid2: 'cols-2big', list: 'list' }[state.view] || 'cols-4';
          const sizes = state.view === 'grid2' ? '(min-width:1024px) 38vw, 50vw' : state.view === 'list' ? '220px' : '(min-width:1024px) 20vw, 50vw';
          box.innerHTML = `<div class="grid ${cls}">${list.slice(0, state.shown).map((p) => cardHTML(p, { sizes })).join('')}</div>${list.length > state.shown ? `<div class="load-more"><button class="btn btn-lg" type="button" data-more>Show more (${list.length - state.shown} left)</button></div>` : ''}`;
        }
        mountCarousels(box);
      };
      const renderFilters = () => { $('[data-filters]', root).innerHTML = filterHTML(''); const m = $('[data-filters-m]', root); if (m) m.innerHTML = filterHTML('-m'); };
      const update = () => { renderFilters(); renderResults(); syncURL(); };
      root.addEventListener('change', (e) => {
        const t = e.target; const n = (t.name || '').replace(/-m$/, '');
        if (n === 'cat') { state.cat = t.value; }
        else if (n === 'deals') state.deals = t.checked;
        else if (n === 'range') { const [a, b] = t.value.split('-'); state.min = a || ''; state.max = b || ''; }
        else if (n === 'min' || n === 'max') state[n] = t.value.trim();
        else if (t.matches('[data-sort]')) state.sort = t.value;
        else return;
        state.shown = 24; update();
      });
      root.addEventListener('click', (e) => {
        const v = e.target.closest('[data-view]');
        if (v) { state.view = v.dataset.view; ls.set('ml-view', state.view); $$('[data-view]', root).forEach((b) => b.setAttribute('aria-pressed', b === v)); renderResults(); }
        const c = e.target.closest('[data-clear-f]');
        if (c) { const k = c.dataset.clearF; if (k === 'q' || k === 'all') state.q = ''; if (k === 'cat' || k === 'all') state.cat = ''; if (k === 'deals' || k === 'all') state.deals = false; if (k === 'price' || k === 'all') { state.min = ''; state.max = ''; } update(); }
        if (e.target.closest('[data-more]')) { state.shown += 24; renderResults(); }
        if (e.target.closest('[data-open-filters]')) $('#filter-dialog').showModal();
        if (e.target.closest('[data-close-filters]')) $('#filter-dialog').close();
      });
      renderFilters(); renderResults();
    },
  };
}

// ---------------------------------------------------------------- product
export function product({ params }) {
  const p = store.product(params.slug);
  if (!p) return notFound('This item is sold out or no longer available.');
  const s = store.settings();
  const off = pctOff(p);
  const c = store.category(p.categoryId);
  const related = store.products().filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);
  const ims = p.images.length ? p.images : [null];
  const condMap = { 'New': 'NewCondition', 'Refurbished': 'RefurbishedCondition' };
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: p.id, gtin12: p.upc || undefined,
    image: p.images.map((i) => img(i.lg)), description: p.description.replace(/\n+/g, ' ').replace(/•/g, ''),
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined, category: c ? c.name : undefined,
    offers: { '@type': 'Offer', url: ENV.root + 'products/' + p.slug, priceCurrency: 'USD', price: p.price.toFixed(2), availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/' + (condMap[p.condition] || 'UsedCondition'), seller: { '@type': 'Organization', name: 'ML Group' },
      shippingDetails: p.noShipping ? undefined : { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: Number(p.shipping).toFixed(2), currency: 'USD' }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' } } },
  };
  const para = esc(p.description).split(/\n\n+/).map((b) => (b.trim().startsWith('•') ? `<ul>${b.split('\n').map((l) => `<li>${l.replace(/^•\s*/, '')}</li>`).join('')}</ul>` : `<p>${b.replace(/\n/g, '<br>')}</p>`)).join('');
  return {
    title: p.title, image: p.images[0] && p.images[0].lg, jsonld, path: '/products/' + p.slug,
    description: `${p.title} — ${p.condition}, ${money(p.price)}${off ? ` (${off}% off)` : ''}. ${p.noShipping ? 'Available for local pickup only' : `Shipping ${money(p.shipping)} or free local pickup`} at ML Group.`,
    html: `
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb" style="margin-top:18px"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span><a href="${href('/products')}">Products</a><span aria-hidden="true">/</span>${c ? `<a href="${href('/categories/' + c.slug)}">${esc(c.name)}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page" class="crumb-title">${esc(p.title)}</span></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="g-main" data-carousel>
            <div class="track">${ims.map((im, i) => `<div>${imgTag(im, { alt: i ? `${p.title} – photo ${i + 1}` : p.title, eager: i === 0, sizes: '(min-width:900px) 50vw, 100vw', w: 960 })}</div>`).join('')}</div>
            ${off ? `<span class="badge">-${off}%</span>` : ''}
            ${ims.length > 1 ? `<button class="car-btn prev" type="button" aria-label="Previous photo" data-car="-1">${icon('left')}</button><button class="car-btn next" type="button" aria-label="Next photo" data-car="1">${icon('right')}</button><span class="g-count" aria-hidden="true">1 / ${ims.length}</span>` : ''}
          </div>
          ${ims.length > 1 ? `<div class="g-thumbs">${ims.map((im, i) => `<button type="button" aria-label="Show photo ${i + 1}" aria-current="${i === 0}">${imgTag(im, { alt: '', sizes: '84px' })}</button>`).join('')}</div>` : ''}
        </div>
        <div class="pdp-info">
          <div style="display:grid;gap:10px">
            ${p.brand ? `<p class="pdp-brand"><a href="${href('/products?q=' + encodeURIComponent(p.brand))}">${esc(p.brand)}</a></p>` : ''}
            <h1>${esc(p.title)}</h1>
            <div class="cond-row"><span class="cond">Condition: ${esc(p.condition)}</span>${p.inventory <= 5 ? `<span class="stock-low">Only ${p.inventory} left</span>` : '<span class="muted" style="font-size:14px">In stock</span>'}</div>
          </div>
          <div class="pdp-price">
            <div class="row"><span class="now tabnum">${money(p.price)}</span>${off ? `<span class="off">-${off}%</span>` : ''}</div>
            ${off ? `<div class="row"><span class="was">Retail <s class="tabnum">${money(p.originalPrice)}</s></span><span class="save">You save ${money(p.originalPrice - p.price)}</span></div>` : ''}
          </div>
          <ul class="facts">
            <li class="pickup-split"><div class="ps-left">${icon('store')}<div><b>Available for pick up</b><span>Free pickup · ${esc(s.city)}, ${esc(s.state)}</span></div></div><button class="ps-right" type="button" data-schedule="${p.id}"><b>Choose a date &amp; time</b>${icon('calendar')}</button></li>
            ${p.noShipping ? '' : `<li>${icon('truck')}<div><b>Available for shipping</b><span>Shipping: ${p.shipping > 0 ? money(p.shipping) : 'Free'} · ships in 1–2 business days</span></div></li>`}
          </ul>
          <div class="buy-row">
            <div class="qty" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" data-q="-1">${icon('minus', 'icon-sm')}</button><input id="pdp-qty" type="number" inputmode="numeric" min="1" max="${p.inventory}" value="1" aria-label="Quantity"><button type="button" aria-label="Increase quantity" data-q="1">${icon('plus', 'icon-sm')}</button></div>
            <button class="btn btn-primary btn-lg" type="button" data-pdp-add>Add to Cart</button>
            <button class="btn btn-lg btn-offer" type="button" data-offer="${p.id}">Make Offer</button>
          </div>
          ${p.upc ? `<div class="upc">${barcode(p.upc)}<dl><dt>UPC</dt><dd>${esc(p.upc)}</dd></dl></div>` : ''}
          <section class="desc" aria-labelledby="desc-h"><h2 id="desc-h">Description</h2><div class="prose">${para}</div></section>
        </div>
      </div>
      ${related.length ? `<section class="section" style="padding-top:0" aria-labelledby="rel-h"><div class="section-head"><h2 id="rel-h">More ${esc(c ? c.name : '')} deals</h2>${c ? `<a class="link-arrow" href="${href('/categories/' + c.slug)}">View all ${icon('arrow', 'icon-sm')}</a>` : ''}</div><div class="grid cols-4">${related.map((x) => cardHTML(x)).join('')}</div></section>` : ''}
    </div>
    <div class="sticky-buy" data-sticky><button class="btn" type="button" data-offer="${p.id}">Make Offer</button><button class="btn btn-primary" type="button" data-add="${p.id}">Add · ${money(p.price)}</button></div>`,
    mount(root) {
      mountCarousels(root);
      const q = $('#pdp-qty', root);
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-q]');
        if (b) q.value = Math.min(p.inventory, Math.max(1, (parseInt(q.value, 10) || 1) + Number(b.dataset.q)));
        if (e.target.closest('[data-schedule]')) openPickup(p);
        if (e.target.closest('[data-pdp-add]')) addToCart(p.id, Math.min(p.inventory, Math.max(1, parseInt(q.value, 10) || 1)));
      });
      const buy = $('.buy-row', root), sticky = $('[data-sticky]', root);
      if ('IntersectionObserver' in window && buy && sticky) {
        const io = new IntersectionObserver(([en]) => sticky.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < 0));
        io.observe(buy);
        return () => io.disconnect();
      }
    },
  };
}

// ---------------------------------------------------------------- categories
export function categories() {
  const counts = {}; store.products().forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
  const deals = bestDeals();
  return {
    title: 'Categories', description: 'Browse ML Group deals by category — electronics, home & kitchen, tools, appliances, toys and more.',
    html: `<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Categories</span></nav><h1>Categories</h1><p>Pick a department. Every listing shows its condition, discount, shipping price and local pickup.</p></div></div>
    <div class="wrap section" style="padding-top:28px"><div class="cat-grid">${store.categories().map((c) => { const p = deals.find((x) => x.categoryId === c.id); return `<a class="cat-tile" href="${href('/categories/' + c.slug)}"><div class="ct-img">${imgTag(p && p.images[0], { alt: '', sizes: '(min-width:900px) 33vw, 50vw' })}</div><div class="ct-body"><div><h3>${esc(c.name)}</h3><span class="ct-count">${counts[c.id] || 0} items</span></div>${icon('arrow')}</div></a>`; }).join('')}</div></div>`,
  };
}

// ---------------------------------------------------------------- wholesale / about / contact
function inquiryForm(type) {
  const ws = type === 'wholesale';
  return `<form class="form" novalidate data-inquiry="${type}">
    <div class="form-row two"><div class="field"><label for="iq-name">Name</label><input id="iq-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="iq-phone">Phone</label><input id="iq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div></div>
    <div class="form-row two"><div class="field"><label for="iq-email">Email</label><input id="iq-email" name="email" type="email" autocomplete="email" required></div>
    ${ws ? '<div class="field"><label for="iq-company">Company <span class="opt">(optional)</span></label><input id="iq-company" name="company" autocomplete="organization"></div>' : '<div class="field"><label for="iq-topic">Topic</label><select id="iq-topic" name="company"><option>Question about an item</option><option>Order help</option><option>Local pickup</option><option>Returns</option><option>Something else</option></select></div>'}</div>
    ${ws ? '<div class="field"><label for="iq-qty">What are you looking for?</label><select id="iq-qty" name="interest"><option>Mixed lots</option><option>Case packs of one item</option><option>Full pallets</option><option>Truckloads</option><option>Not sure yet</option></select></div>' : ''}
    <div class="field"><label for="iq-msg">${ws ? 'Categories, quantities and budget' : 'Message'}</label><textarea id="iq-msg" name="message" required maxlength="2000"></textarea></div>
    <div class="hp" aria-hidden="true"><label for="iq-web">Website</label><input id="iq-web" name="website" tabindex="-1" autocomplete="off"></div>
    <p class="form-error" data-err hidden></p>
    <button class="btn btn-primary btn-lg" type="submit">${ws ? 'Request wholesale pricing' : 'Send message'}</button>
  </form>`;
}
function mountInquiry(root) {
  const form = $('[data-inquiry]', root); if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    const err = $('[data-err]', form);
    const checks = [['iq-name', !String(f.name).trim()], ['iq-phone', String(f.phone).replace(/\D/g, '').length < 10], ['iq-email', !/^\S+@\S+\.\S+$/.test(f.email)], ['iq-msg', !String(f.message).trim()]];
    checks.forEach(([id, bad]) => $('#' + id).setAttribute('aria-invalid', bad ? 'true' : 'false'));
    const first = checks.find(([, bad]) => bad);
    if (first) { err.textContent = 'Please fill in your name, a 10-digit phone number, a valid email and a message.'; err.hidden = false; $('#' + first[0]).focus(); return; }
    const btn = $('button[type="submit"]', form); btn.disabled = true;
    try {
      if (!f.website) await store.submitInquiry({ type: form.dataset.inquiry, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), company: (f.company || '').trim(), message: (f.interest ? `[${f.interest}] ` : '') + f.message.trim() });
      form.innerHTML = `<div class="success"><span class="check">${icon('check')}</span><h3>Message sent</h3><p>Thanks, ${esc(f.name.split(' ')[0])}. We’ll get back to you within one business day.</p></div>`;
    } catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; }
  });
}

export function wholesale() {
  const s = store.settings();
  return {
    title: 'Wholesale', description: 'Wholesale and bulk purchasing from ML Group: mixed lots, case packs and pallets of discounted merchandise with volume pricing.',
    html: `<section class="band on-ink"><div class="wrap" style="padding-block:48px 52px;display:grid;gap:16px">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}" style="color:#b9b9b3">Home</a><span aria-hidden="true">/</span><span aria-current="page" style="color:#fff">Wholesale</span></nav>
      <p class="eyebrow">ML Group Wholesale</p>
      <h1 class="display" style="font-size:clamp(38px,8vw,80px)">Bulk deals for<br>serious buyers.</h1>
      <p style="color:#b9b9b3;max-width:56ch;font-size:17.5px">We work with resellers, retailers, flea-market vendors and businesses that want larger quantities of discounted merchandise. Tell us what you need and we’ll put together a quote.</p>
      <div class="hero-cta"><a class="btn btn-invert btn-lg" href="#ws-form">Request pricing</a><a class="btn btn-ghost-ink btn-lg" href="${telHref(s.phone)}">${icon('phone', 'icon-sm')} ${esc(s.phone)}</a></div>
    </div></section>
    <section class="section"><div class="wrap" style="display:grid;gap:28px">
      <div class="section-head" style="margin:0"><div><h2>Volume pricing</h2><p>Discounts off our already-reduced retail prices. Mix and match within a category.</p></div></div>
      <div class="tiers">
        <div class="tier"><span class="t-qty">10–49 units</span><span class="t-off">10% off</span><p>Case packs and small mixed lots.</p></div>
        <div class="tier"><span class="t-qty">50–199 units</span><span class="t-off">20% off</span><p>Larger mixed lots, priority picking.</p></div>
        <div class="tier dark"><span class="t-qty">Pallets &amp; truckloads</span><span class="t-off">Custom</span><p>Manifested pallets with freight quotes.</p></div>
      </div>
      <ol class="steps">
        <li><h3>Tell us what you need</h3><p>Categories, quantities, condition and budget.</p></li>
        <li><h3>Get a quote</h3><p>We send available lots, photos and pricing within one business day.</p></li>
        <li><h3>Pay &amp; pick up</h3><p>Dock pickup is free, or we arrange LTL freight to your door.</p></li>
      </ol>
    </div></section>
    <section class="section band alt" id="ws-form"><div class="wrap split" style="padding-block:0">
      <div style="display:grid;gap:14px;align-content:start"><h2 class="display" style="font-size:clamp(28px,5vw,44px)">Request wholesale pricing</h2><p class="muted">Prefer to talk? Call or text <a href="${telHref(s.phone)}"><b>${esc(s.phone)}</b></a> or email <a href="mailto:${esc(s.email)}"><b>${esc(s.email)}</b></a>.</p>
      <ul class="info-list" style="margin-top:8px"><li>${icon('check')}<span>No minimum to request a quote</span></li><li>${icon('check')}<span>Resale certificates accepted</span></li><li>${icon('check')}<span>Photos and manifests on request</span></li></ul></div>
      <div class="info-card" style="background:#fff">${inquiryForm('wholesale')}</div>
    </div></section>`,
    mount: mountInquiry,
  };
}

export function about() {
  const s = store.settings();
  const top = Math.max(0, ...store.products().map(pctOff));
  return {
    title: 'About', description: 'ML Group sells only brand-new products bought from major retailers like Walmart, Amazon, Target, Costco and Best Buy — at prices below retail. Receipts available on request.',
    html: `<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span><span aria-current="page">About</span></nav><h1>About ML Group</h1></div></div>
    <div class="wrap split">
      <div class="prose">
        <p><b>ML Group sells brand-new products from the stores you already trust — for less than you’d pay on the shelf.</b></p>
        <p>We buy only brand-new items from major retailers like <b>Walmart, Amazon, Target, Costco, Best Buy</b> and other big-name stores, mostly through clearance and closeout opportunities. Then we pass those savings straight on to you, so you get the exact same products at a discount.</p>
        <h2>100% brand new — guaranteed</h2>
        <p>Every item we sell is brand new. Nothing is used, refurbished or pre-owned in any way. We stand behind that: if you’d like proof, just ask and we’ll show you the <b>original store receipt</b> for your item.</p>
        <h2>Why our prices are lower</h2>
        <ul>
          <li>We buy clearance and closeout stock from major retailers at a deep discount.</li>
          <li>We sell direct to you — no middlemen and no store overhead.</li>
          <li>Local pickup is always free, and shipping prices are shown up front on every item.</li>
        </ul>
        <h2>Visit us</h2>
        <p>Pickup is in ${s.address1 ? esc(s.address1) + ', ' : ''}${esc(s.city)}, ${esc(s.state)}${s.zip ? ' ' + esc(s.zip) : ''} — ${esc(s.pickupHours)}. Questions? Call or text <a href="${telHref(s.phone)}">${esc(s.phone)}</a>.</p>
        <p><a class="btn btn-primary" href="${href('/products')}">Browse Deals ${icon('arrow', 'icon-sm')}</a></p>
      </div>
      <div style="display:grid;gap:12px;align-content:start">
        <div class="tiers"><div class="tier"><span class="t-qty">Products in stock</span><span class="t-off tabnum">${store.products().length}</span></div><div class="tier dark"><span class="t-qty">Up to</span><span class="t-off">${top}% off</span></div></div>
        <div class="info-card"><h2>Our promise</h2><ul class="info-list">
          <li>${icon('check')}<div><b>Always brand new</b><span class="muted">Never used, never refurbished — in original packaging.</span></div></li>
          <li>${icon('store')}<div><b>From major retailers</b><span class="muted">Walmart, Amazon, Target, Costco, Best Buy and more.</span></div></li>
          <li>${icon('list')}<div><b>Receipts on request</b><span class="muted">Ask and we’ll show you the original store receipt.</span></div></li>
          <li>${icon('percent')}<div><b>Below retail prices</b><span class="muted">The same products you’d find in store, for less.</span></div></li>
        </ul></div>
      </div>
    </div>`,
  };
}

export function contact() {
  const s = store.settings();
  return {
    title: 'Contact', description: `Contact ML Group — call or text ${s.phone}, email ${s.email}, or visit our local pickup location.`,
    html: `<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav><h1>Contact us</h1><p>Questions about an item, an order or local pickup? We answer quickly.</p></div></div>
    <div class="wrap split">
      <div style="display:grid;gap:16px;align-content:start">
        <div class="info-card"><h2>Get in touch</h2><ul class="info-list">
          <li>${icon('phone')}<div><b>Call or text</b><a href="${telHref(s.phone)}">${esc(s.phone)}</a></div></li>
          <li>${icon('mail')}<div><b>Email</b><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></div></li>
        </ul></div>
        <div class="info-card"><h2>Local pickup</h2><ul class="info-list">
          <li>${icon('pin')}<div><b>${esc(s.address1 || `${s.city}, ${s.state}`)}</b><span>${s.address1 ? `${esc(s.city)}, ${esc(s.state)} ${esc(s.zip)}` : 'Exact address sent with your pickup confirmation'}</span></div></li>
          <li>${icon('clock')}<div><b>Pickup hours</b><span>${esc(s.pickupHours)}</span></div></li>
          <li>${icon('store')}<div><b>How it works</b><span>Choose “Local pickup” at checkout. We text you when it’s ready. ${esc(s.pickupNote)}</span></div></li>
        </ul>
        <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address1 ? s.address1 + ', ' : ''}${s.city}, ${s.state} ${s.zip}`)}" target="_blank" rel="noopener">${icon('pin', 'icon-sm')} Get directions</a></div>
      </div>
      <div class="info-card"><h2>Send a message</h2>${inquiryForm('contact')}</div>
    </div>`,
    mount: mountInquiry,
  };
}

export function policy({ kind }) {
  const s = store.settings();
  const ship = kind === 'shipping';
  return {
    title: ship ? 'Shipping & Pickup' : 'Refund Policy',
    description: ship ? 'ML Group shipping prices, delivery times and free local pickup details.' : 'ML Group refund and return policy for retail purchases.',
    html: `<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${href('/')}">Home</a><span aria-hidden="true">/</span><span aria-current="page">${ship ? 'Shipping & Pickup' : 'Refund Policy'}</span></nav><h1>${ship ? 'Shipping &amp; pickup' : 'Refund policy'}</h1></div></div>
    <div class="wrap section" style="padding-top:28px"><div class="prose">${ship ? `
      <p>Every product page shows its exact shipping price. Shipping is charged once per item line, and local pickup is always free.</p>
      <h2>Shipping</h2><ul><li>Orders ship within 1–2 business days to the contiguous United States.</li><li>Tracking is sent by text or email as soon as your order ships.</li><li>Large items (furniture, appliances) ship by freight; we’ll call to schedule delivery.</li></ul>
      <h2>Local pickup</h2><ul><li>Location: ${s.address1 ? esc(s.address1) + ', ' : ''}${esc(s.city)}, ${esc(s.state)} ${esc(s.zip)}.</li><li>Hours: ${esc(s.pickupHours)}.</li><li>We’ll text you when your order is ready — usually within one business day. ${esc(s.pickupNote)}</li><li>Orders are held for 7 days.</li></ul>` : `
      <p>We want you to be happy with your deal. If something isn’t right, contact us within <b>3 days</b> of delivery or pickup.</p>
      <h2>Returns</h2><ul><li>New items (only) can be returned and fully refunded if the product is unused/same condition as received as new, or defective/doesn’t work/broken. Within 3 days after delivery or pick up.</li></ul>
      <h2>Refunds</h2><ul><li>Refunds go back to your original payment method within 5 business days of receiving the return.</li><li>Original shipping is non-refundable unless we made an error.</li><li>Items not as described or damaged in shipping are refunded in full, including shipping.</li></ul>
      <h2>Start a return</h2><p>Call or text ${esc(s.phone)} or email ${esc(s.email)} with your order number.</p>`}</div></div>`,
  };
}

// ---------------------------------------------------------------- checkout
export function checkout() {
  const s = store.settings();
  return {
    title: 'Checkout', noindex: true, description: 'Secure checkout — guest checkout, shipping or free local pickup.',
    html: `<div class="page-head"><div class="wrap"><h1>Checkout</h1><p>No account needed. Choose shipping or free local pickup.</p></div></div><div class="wrap" data-co></div>`,
    mount(root, { navigate }) {
      const box = $('[data-co]', root);
      const draft = { fulfillment: 'shipping', payment: store.canPayPal ? 'paypal' : 'link', ...ls.get('ml-co', {}) };
      const draw = () => {
        const items = cart.items();
        if (!items.length) { box.innerHTML = `<div class="empty" style="margin-block:32px 64px"><h2>Your cart is empty</h2><p class="muted">Add something from today’s deals to check out.</p><a class="btn btn-primary" href="${href('/products')}">Browse Deals</a></div>`; return; }
        const pickupOnly = items.filter((i) => i.product.noShipping);
        if (pickupOnly.length) draft.fulfillment = 'pickup';
        const pickup = draft.fulfillment === 'pickup';
        const shipTotal = round2(items.reduce((t, i) => t + i.product.shipping, 0));
        const sub = cart.subtotal();
        if (!pickup && draft.payment === 'pickup') draft.payment = 'link';
        if (draft.payment === 'paypal' && !store.canPayPal) draft.payment = 'link';
        // A $0 order skips the payment step entirely.
        const free = round2(sub + (pickup ? 0 : shipTotal)) === 0;
        const payPal = !free && draft.payment === 'paypal';
        box.innerHTML = `<form class="checkout" novalidate data-co-form>
          <div>
            <section class="co-section"><h2><span class="n">1</span> Contact</h2><div class="co-body">
              <div class="field"><label for="co-name">Full name</label><input id="co-name" name="name" autocomplete="name" required value="${esc(draft.name || '')}"></div>
              <div class="form-row two"><div class="field"><label for="co-email">Email</label><input id="co-email" name="email" type="email" autocomplete="email" required value="${esc(draft.email || '')}"><span class="hint">For your receipt and order updates.</span></div>
              <div class="field"><label for="co-phone">Phone</label><input id="co-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${esc(draft.phone || '')}"><span class="hint">We text when your order ships or is ready.</span></div></div>
            </div></section>
            <section class="co-section"><h2><span class="n">2</span> Delivery</h2><div class="co-body">
              <div class="radio-cards" role="radiogroup" aria-label="Delivery method">
                ${pickupOnly.length ? `<p class="pickup-box"><b>${icon('store', 'icon-sm')} Pick up only</b><span>${pickupOnly.map((i) => esc(i.product.title)).join(', ')} ${pickupOnly.length > 1 ? 'are' : 'is'} not available for shipping, so this order is for local pickup.</span></p>` : `<label class="radio-card"><input type="radio" name="fulfillment" value="shipping" ${!pickup ? 'checked' : ''}><div><b>Ship to me</b><span>Ships in 1–2 business days</span></div><span class="rc-price tabnum">${money(shipTotal)}</span></label>`}
                <label class="radio-card"><input type="radio" name="fulfillment" value="pickup" ${pickup ? 'checked' : ''}><div><b>Local pickup</b><span>${esc(s.city)}, ${esc(s.state)} · ready in about 1 business day</span></div><span class="rc-price">Free</span></label>
              </div>
              ${pickup ? `<div class="pickup-box"><b>${icon('store', 'icon-sm')} Pickup location</b><span>${s.address1 ? esc(s.address1) + ', ' : ''}${esc(s.city)}, ${esc(s.state)} ${esc(s.zip)}</span><span>${esc(s.pickupHours)}</span><span class="muted">${esc(s.pickupNote)}</span></div>` : `
              <div class="field"><label for="co-a1">Street address</label><input id="co-a1" name="line1" autocomplete="address-line1" required value="${esc(draft.line1 || '')}"></div>
              <div class="field"><label for="co-a2">Apt, suite, unit <span class="opt">(optional)</span></label><input id="co-a2" name="line2" autocomplete="address-line2" value="${esc(draft.line2 || '')}"></div>
              <div class="form-row three"><div class="field"><label for="co-city">City</label><input id="co-city" name="city" autocomplete="address-level2" required value="${esc(draft.city || '')}"></div>
              <div class="field"><label for="co-state">State</label><input id="co-state" name="state" autocomplete="address-level1" required maxlength="2" value="${esc(draft.state || '')}" style="text-transform:uppercase"></div>
              <div class="field"><label for="co-zip">ZIP</label><input id="co-zip" name="zip" autocomplete="postal-code" inputmode="numeric" required value="${esc(draft.zip || '')}"></div></div>`}
            </div></section>
            <section class="co-section"><h2><span class="n">3</span> Payment</h2><div class="co-body">
              ${free ? `<input type="hidden" name="payment" value="free"><p class="pickup-box"><b>${icon('check', 'icon-sm')} No payment needed</b><span>Your order total is $0.00 — just place your order.</span></p>` : `
              <div class="radio-cards" role="radiogroup" aria-label="Payment method">
                ${store.canPayPal ? `<label class="radio-card"><input type="radio" name="payment" value="paypal" ${payPal ? 'checked' : ''}><div><b>PayPal, Venmo or card</b><span>Pay now securely with PayPal, Venmo, or any debit or credit card — no PayPal account needed.</span></div>${icon('lock')}</label>` : ''}
                <label class="radio-card"><input type="radio" name="payment" value="link" ${draft.payment === 'link' ? 'checked' : ''}><div><b>Pay by secure card link</b><span>After we confirm your items, we text and email a secure payment link. Nothing is charged until you pay.</span></div>${icon('link')}</label>
                ${pickup ? `<label class="radio-card"><input type="radio" name="payment" value="pickup" ${draft.payment === 'pickup' ? 'checked' : ''}><div><b>Pay at pickup</b><span>Cash or card when you collect your order.</span></div>${icon('cash')}</label>` : ''}
                ${pickup && draft.payment === 'pickup' ? `<div class="pickup-when" data-pk-when>${draft.pickupWhen ? `${icon('calendar', 'icon-sm')}<span>Pickup: <b>${esc(draft.pickupWhen)}</b></span><button class="btn-link" type="button" data-pk-open>Change</button>` : `<button class="btn" type="button" data-pk-open>${icon('calendar', 'icon-sm')} Choose date &amp; time</button>`}</div>` : ''}
              </div>`}
              <div class="field"><label for="co-notes">Order notes <span class="opt">(optional)</span></label><textarea id="co-notes" name="notes" style="min-height:80px">${esc(draft.notes || '')}</textarea></div>
            </div></section>
            <section class="co-section"><h2><span class="n">4</span> Account <span class="muted" style="font:600 12px var(--font-body);letter-spacing:.08em">(OPTIONAL)</span></h2><div class="co-body">
              <label class="check-row"><input type="checkbox" name="create" ${draft.create ? 'checked' : ''} data-create> <span>Create an account to track orders and check out faster next time.</span></label>
              <div class="field" data-pw ${draft.create ? '' : 'hidden'}><label for="co-pw">Choose a password</label><input id="co-pw" name="password" type="password" autocomplete="new-password" minlength="8"><span class="hint">At least 8 characters.</span></div>
            </div></section>
          </div>
          <aside class="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul class="sum-items">${items.map(({ product: p, qty }) => `<li class="sum-item"><span class="th">${imgTag(p.images[0], { alt: '', sizes: '56px' })}<span class="q">${qty}</span></span><span class="t">${esc(p.title)}<small>${esc(p.condition)} · ${qty} × ${money(p.price)}${!pickup ? ` · ship ${money(p.shipping)}` : ''}${p.noShipping ? ' · pick up only' : ''}</small></span><span class="p tabnum">${money(p.price * qty)}</span></li>`).join('')}</ul>
            <div class="sum-totals">
              <div class="row"><span>Subtotal</span><span class="tabnum">${money(sub)}</span></div>
              <div class="row"><span>${pickup ? 'Local pickup' : 'Shipping'}</span><span class="tabnum">${pickup ? 'Free' : money(shipTotal)}</span></div>
              <div class="row total"><span>Total</span><span class="tabnum">${money(sub + (pickup ? 0 : shipTotal))}</span></div>
              <p class="form-error" data-err hidden></p>
              ${payPal ? `<div class="pp-wrap" data-pp><p class="muted" data-pp-loading style="font-size:13px">Loading PayPal…</p></div>` : `<button class="btn btn-primary btn-lg btn-block" type="submit" style="margin-top:8px">${icon('lock', 'icon-sm')} Place order</button>`}
              <p class="form-note">By placing your order you agree to our <a href="${href('/refund-policy')}">refund policy</a>.</p>
            </div>
          </aside>
        </form>`;
      };
      let ppOrder = null;
      const mountPayPal = async () => {
        const host = $('[data-pp]', box); if (!host) return;
        const form = $('[data-co-form]', box);
        const fail = (msg) => { const err = $('[data-err]', box); if (err) { err.textContent = msg; err.hidden = false; } };
        const release = async () => { if (!ppOrder) return; const id = ppOrder.id; ppOrder = null; try { await store.paypal('cancel', id); await store.reload(); } catch {} };
        let paypal;
        try { paypal = await loadPayPal(); } catch { host.innerHTML = ''; fail('PayPal could not load. Choose another payment method or try again.'); return; }
        if (!host.isConnected) return;
        host.innerHTML = '';
        paypal.Buttons({
          style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 48 },
          onClick: (data, actions) => (validate(form) ? actions.resolve() : actions.reject()),
          createOrder: async () => {
            const v = validate(form); if (!v) throw new Error('Please complete the highlighted fields.');
            await release();
            ppOrder = await store.placeOrder(orderInput(v));
            if (v.payPickup) store.submitInquiry({ type: 'pickup', name: v.d.name.trim(), phone: v.d.phone.trim(), email: v.d.email.trim(), company: '', message: `Pickup request: ${cart.items().map((i) => (i.qty > 1 ? i.qty + ' × ' : '') + i.product.title).join(', ')} (Order #${ppOrder.number})\nWhen: ${draft.pickupWhen}` }).catch(() => {});
            const r = await store.paypal('create', ppOrder.id);
            return r.id;
          },
          onApprove: async () => {
            host.innerHTML = '<p class="muted" style="font-size:14px">Confirming your payment…</p>';
            try {
              await store.paypal('capture', ppOrder.id);
              const id = ppOrder.id; ppOrder = null;
              delete draft.pickupWhen; ls.set('ml-co', draft);
              cart.clear(); ls.set('ml-last-order', id);
              navigate('/order/' + id);
            } catch (ex) { await release(); drawAll(); fail(ex.message || 'Your payment did not go through. You have not been charged.'); }
          },
          onCancel: async () => { await release(); fail('Payment cancelled — you have not been charged.'); },
          onError: async (ex) => { await release(); fail((ex && ex.message && !/^\s*$/.test(ex.message) && ex.message.length < 160) ? ex.message : 'PayPal could not complete the payment. You have not been charged.'); },
        }).render(host).catch(() => fail('PayPal could not load. Choose another payment method.'));
      };
      const drawAll = () => { draw(); mountPayPal(); };
      draw(); mountPayPal();
      const pickTime = () => {
        const items = cart.items(); if (!items.length) return;
        const f = $('[data-co-form]', box); const d = f ? Object.fromEntries(new FormData(f)) : draft;
        const p = items.length === 1 ? items[0].product : { ...items[0].product, title: `${items.length} items in your order` };
        openPickup(p, { name: d.name, phone: d.phone, onPick: ({ name, phone, when }) => {
          const form = $('[data-co-form]', box);
          if (form) Object.assign(draft, Object.fromEntries(new FormData(form)));
          Object.assign(draft, { name, phone, pickupWhen: when }); delete draft.password; ls.set('ml-co', draft); drawAll();
        } });
      };
      box.addEventListener('click', (e) => { if (e.target.closest('[data-pk-open]')) pickTime(); });
      box.addEventListener('input', (e) => { const f = e.target.closest('form'); if (!f) return; const d = Object.fromEntries(new FormData(f)); Object.assign(draft, d, { create: !!d.create }); delete draft.password; ls.set('ml-co', draft); });
      box.addEventListener('change', (e) => {
        if (e.target.name === 'fulfillment' || e.target.name === 'payment') { const f = e.target.closest('form'); Object.assign(draft, Object.fromEntries(new FormData(f))); delete draft.password; ls.set('ml-co', draft); drawAll(); if (e.target.name === 'payment' && e.target.value === 'pickup') pickTime(); }
        if (e.target.matches('[data-create]')) { $('[data-pw]', box).hidden = !e.target.checked; draft.create = e.target.checked; }
      });
      // Returns the form values, or null after highlighting what is missing.
      const validate = (f) => {
        const d = Object.fromEntries(new FormData(f));
        const err = $('[data-err]', f);
        const pickup = d.fulfillment === 'pickup';
        const checks = [['co-name', !String(d.name).trim()], ['co-email', !/^\S+@\S+\.\S+$/.test(d.email)], ['co-phone', String(d.phone).replace(/\D/g, '').length < 10]];
        if (!pickup) checks.push(['co-a1', !String(d.line1).trim()], ['co-city', !String(d.city).trim()], ['co-state', !/^[A-Za-z]{2}$/.test(String(d.state).trim())], ['co-zip', !/^\d{5}(-\d{4})?$/.test(String(d.zip).trim())]);
        if (d.create) checks.push(['co-pw', String(d.password || '').length < 8]);
        checks.forEach(([id, bad]) => { const el = $('#' + id, f); if (el) el.setAttribute('aria-invalid', bad ? 'true' : 'false'); });
        const first = checks.find(([, bad]) => bad);
        if (first) { err.textContent = 'Please complete the highlighted fields.'; err.hidden = false; $('#' + first[0], f).focus(); return null; }
        const payPickup = pickup && d.payment === 'pickup';
        if (payPickup && !draft.pickupWhen) { err.textContent = 'Please choose a pickup date and time.'; err.hidden = false; pickTime(); return null; }
        err.hidden = true;
        return { d, pickup, payPickup };
      };
      const orderInput = ({ d, pickup, payPickup }) => ({
        items: cart.items().map((i) => ({ id: i.product.id, qty: i.qty })),
        customer: { name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim() },
        fulfillment: d.fulfillment, payment: d.payment,
        address: pickup ? null : { line1: d.line1.trim(), line2: (d.line2 || '').trim(), city: d.city.trim(), state: d.state.trim().toUpperCase(), zip: d.zip.trim() },
        notes: [payPickup ? `Pickup time: ${draft.pickupWhen}` : '', (d.notes || '').trim()].filter(Boolean).join('\n'),
        createAccount: d.create ? { password: d.password } : null,
      });
      box.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const v = validate(f); if (!v) return;
        const { d, payPickup } = v;
        const err = $('[data-err]', f);
        if (d.payment === 'paypal') return;
        const btn = $('button[type="submit"]', f); btn.disabled = true; btn.textContent = 'Placing order…';
        try {
          const order = await store.placeOrder(orderInput(v));
          if (payPickup) store.submitInquiry({ type: 'pickup', name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim(), company: '', message: `Pickup request: ${cart.items().map((i) => (i.qty > 1 ? i.qty + ' × ' : '') + i.product.title).join(', ')}${order.number ? ` (Order #${order.number})` : ''}\nWhen: ${draft.pickupWhen}` }).catch(() => {});
          delete draft.pickupWhen; ls.set('ml-co', draft);
          cart.clear();
          ls.set('ml-last-order', order.id);
          navigate('/order/' + order.id);
        } catch (ex) {
          err.textContent = ex.message || 'We could not place your order. Please try again.'; err.hidden = false; btn.disabled = false; btn.innerHTML = `${icon('lock', 'icon-sm')} Place order`;
        }
      });
    },
  };
}

// ---------------------------------------------------------------- order confirmation
export function order({ params }) {
  return {
    title: 'Order confirmed', noindex: true,
    html: `<div class="wrap" data-order><p style="padding:48px 0" class="muted">Loading your order…</p></div>`,
    async mount(root) {
      const box = $('[data-order]', root);
      const o = await store.getOrder(params.id);
      const s = store.settings();
      if (!o) { box.innerHTML = `<div class="empty" style="margin-block:40px"><h2>Order not found</h2><p class="muted">If you just placed an order, check your email or call ${esc(s.phone)}.</p><a class="btn btn-primary" href="${href('/')}">Back to home</a></div>`; return; }
      const pickup = o.fulfillment === 'pickup';
      box.innerHTML = `<div class="confirm">
        <div class="confirm-head"><span class="check">${icon('check')}</span><p class="eyebrow">Order #${o.number}</p><h1>Thank you, ${esc(o.customer.name.split(' ')[0])}!</h1>
        <p class="muted" style="max-width:60ch">We received your order and emailed a receipt to <b>${esc(o.customer.email)}</b>. ${o.payment === 'free' ? 'No payment was needed for this order.' : o.payment === 'paypal' ? (o.paidAt ? 'Your payment was received — thank you!' : 'Your payment is being confirmed.') : o.payment === 'pickup' ? 'You’ll pay when you pick up.' : 'We’ll text a secure payment link to ' + esc(o.customer.phone) + ' once your items are confirmed.'}</p></div>
        <dl class="kv">
          <div><dt>Order number</dt><dd class="mono">#${o.number}</dd></div>
          <div><dt>Delivery</dt><dd>${pickup ? 'Local pickup (free)' : 'Shipping'}</dd></div>
          <div><dt>Payment</dt><dd>${o.payment === 'free' ? 'Free — no payment' : o.payment === 'paypal' ? (o.paidAt ? 'Paid · PayPal' : 'PayPal (not completed)') : o.payment === 'pickup' ? 'Pay at pickup' : 'Secure payment link'}</dd></div>
          <div><dt>Total</dt><dd class="tabnum">${money(o.total)}</dd></div>
        </dl>
        ${pickup ? `<div class="pickup-box"><b>${icon('store', 'icon-sm')} Pick up at</b><span>${s.address1 ? esc(s.address1) + ', ' : ''}${esc(s.city)}, ${esc(s.state)} ${esc(s.zip)}</span><span>${esc(s.pickupHours)} — we’ll text you when it’s ready.</span></div>` : `<div class="pickup-box"><b>${icon('truck', 'icon-sm')} Shipping to</b><span>${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}, ${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}</span></div>`}
        <div class="summary" style="position:static"><h2>Items</h2><ul class="sum-items" style="max-height:none">${o.items.map((i) => `<li class="sum-item"><span class="th">${imgTag(i.image, { alt: '', sizes: '56px' })}<span class="q">${i.qty}</span></span><span class="t">${esc(i.title)}<small>${i.qty} × ${money(i.price)}</small></span><span class="p tabnum">${money(i.price * i.qty)}</span></li>`).join('')}</ul>
        <div class="sum-totals"><div class="row"><span>Subtotal</span><span class="tabnum">${money(o.subtotal)}</span></div><div class="row"><span>${pickup ? 'Local pickup' : 'Shipping'}</span><span class="tabnum">${pickup ? 'Free' : money(o.shippingTotal)}</span></div><div class="row total"><span>Total</span><span class="tabnum">${money(o.total)}</span></div></div></div>
        <div class="hero-cta"><a class="btn btn-primary" href="${href('/products')}">Keep shopping</a><a class="btn" href="${telHref(s.phone)}">${icon('phone', 'icon-sm')} Questions? ${esc(s.phone)}</a></div>
      </div>`;
    },
  };
}

// ---------------------------------------------------------------- account
export function account() {
  return {
    title: 'My account', noindex: true,
    html: `<div class="page-head"><div class="wrap"><h1>My account</h1><p>Accounts are optional — you can always check out as a guest.</p></div></div><div class="wrap" data-acct style="padding-block:28px 64px;max-width:760px"></div>`,
    async mount(root) {
      const box = $('[data-acct]', root);
      const draw = async (tab = 'login') => {
        const me = await store.account.me();
        if (me) {
          box.innerHTML = `<div style="display:grid;gap:20px"><div class="info-card"><h2>${esc(me.name || 'Welcome back')}</h2><p class="muted">${esc(me.email)}${me.phone ? ' · ' + esc(me.phone) : ''}</p><div><button class="btn btn-sm" type="button" data-logout>${icon('logout', 'icon-sm')} Sign out</button></div></div>
          <h2 class="display" style="font-size:26px">Order history</h2>
          ${me.orders.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Delivery</th><th>Total</th></tr></thead><tbody>${me.orders.map((o) => `<tr><td><a href="${href('/order/' + o.id)}" class="mono"><b>#${o.number}</b></a></td><td>${new Date(o.createdAt).toLocaleDateString()}</td><td><span class="status s-${o.status}">${esc(o.status)}</span></td><td>${o.fulfillment === 'pickup' ? 'Pickup' : 'Shipping'}</td><td class="tabnum">${money(o.total)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No orders yet.</p>'}</div>`;
          return;
        }
        box.innerHTML = `<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="${tab === 'login'}" data-tab="login">Sign in</button><button type="button" role="tab" aria-selected="${tab === 'register'}" data-tab="register">Create account</button></div>
          <form class="form" novalidate data-acct-form="${tab}" style="padding-top:20px;max-width:440px">
            ${tab === 'register' ? '<div class="field"><label for="ac-name">Name</label><input id="ac-name" name="name" autocomplete="name" required></div><div class="field"><label for="ac-phone">Phone <span class="opt">(optional)</span></label><input id="ac-phone" name="phone" type="tel" autocomplete="tel"></div>' : ''}
            <div class="field"><label for="ac-email">Email</label><input id="ac-email" name="email" type="email" autocomplete="email" required></div>
            <div class="field"><label for="ac-pw">Password</label><input id="ac-pw" name="password" type="password" autocomplete="${tab === 'register' ? 'new-password' : 'current-password'}" required minlength="8"></div>
            <p class="form-error" data-err hidden></p>
            <button class="btn btn-primary btn-lg" type="submit">${tab === 'register' ? 'Create account' : 'Sign in'}</button>
          </form>`;
      };
      box.addEventListener('click', async (e) => {
        const t = e.target.closest('[data-tab]'); if (t) draw(t.dataset.tab);
        if (e.target.closest('[data-logout]')) { await store.account.logout(); toast('Signed out'); draw(); }
      });
      box.addEventListener('submit', async (e) => {
        e.preventDefault(); const f = e.target; const d = Object.fromEntries(new FormData(f)); const err = $('[data-err]', f);
        if (!/^\S+@\S+\.\S+$/.test(d.email) || String(d.password).length < 8 || (f.dataset.acctForm === 'register' && !String(d.name).trim())) { err.textContent = 'Enter your name, a valid email and a password of at least 8 characters.'; err.hidden = false; return; }
        try { if (f.dataset.acctForm === 'register') await store.account.register(d); else await store.account.login(d); toast('Signed in'); draw(); }
        catch (ex) { err.textContent = ex.message; err.hidden = false; }
      });
      draw();
    },
  };
}

export function notFound(msg) {
  const deals = bestDeals().slice(0, 4);
  return {
    title: 'Not found', noindex: true, status: 404,
    html: `<div class="wrap section"><div class="empty" style="margin-bottom:40px"><h2>${esc(msg || 'Page not found')}</h2><p class="muted">Try searching, or check out these deals.</p><a class="btn btn-primary" href="${href('/products')}">Browse all products</a></div><div class="grid cols-4">${deals.map((p) => cardHTML(p)).join('')}</div></div>`,
    mount: (root) => mountCarousels(root),
  };
}

// ---------------------------------------------------------------- PayPal SDK
let paypalSdk = null;
function loadPayPal() {
  if (window.paypal && window.paypal.Buttons) return Promise.resolve(window.paypal);
  if (!paypalSdk) paypalSdk = new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(ENV.cfg.paypalClientId)}&currency=USD&intent=capture&components=buttons&enable-funding=venmo`;
    sc.onload = () => (window.paypal ? res(window.paypal) : rej(new Error('PayPal unavailable')));
    sc.onerror = () => { paypalSdk = null; sc.remove(); rej(new Error('PayPal unavailable')); };
    document.head.appendChild(sc);
  });
  return paypalSdk;
}

// ---------------------------------------------------------------- pickup scheduler
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function slotsFor(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const weekend = day === 0 || day === 6;
  const start = 11, end = 22; // Monday–Sunday 11am–10pm
  const out = [];
  const now = new Date();
  for (let h = start; h < end; h++) for (const m of [0, 30]) {
    const t = new Date(dateStr + `T${pad(h)}:${pad(m)}:00`);
    if (t > new Date(now.getTime() + 30 * 60000)) out.push(`${pad(h)}:${pad(m)}`);
  }
  return out;
}
const fmtSlot = (hm) => { const [h, m] = hm.split(':').map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };

function openPickup(p, opts = {}) {
  const co = !!opts.onPick;
  const s = store.settings();
  let dlg = $('#pickup-dialog');
  if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'pickup-dialog'; dlg.className = 'modal'; dlg.setAttribute('aria-labelledby', 'pk-title'); document.body.appendChild(dlg); }
  const today = new Date();
  let first = new Date(today);
  while (!slotsFor(isoDay(first)).length) first.setDate(first.getDate() + 1);
  const max = new Date(today); max.setDate(max.getDate() + 60);
  const timeOpts = (day) => { const sl = slotsFor(day); return sl.length ? sl.map((t) => `<option value="${t}">${fmtSlot(t)}</option>`).join('') : '<option value="">Closed this day — pick another date</option>'; };
  const contactFields = `<div class="field"><label for="pk-name">Name</label><input id="pk-name" name="name" autocomplete="name" required maxlength="80" value="${esc(opts.name || '')}"></div>
      <div class="field"><label for="pk-phone">Phone number</label><input id="pk-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(555) 555-5555" maxlength="24" value="${esc(opts.phone || '')}"></div>`;
  dlg.innerHTML = `
    <div class="modal-head"><h2 id="pk-title">${co ? 'Choose a pickup time' : 'Schedule pickup'}</h2><button class="icon-btn" type="button" aria-label="Close" data-close-dialog>${icon('close')}</button></div>
    <form class="modal-body form" novalidate data-pickup-form>
      <div class="offer-item">${imgTag(p.images[0], { alt: '', sizes: '64px' })}<div><b>${esc(p.title)}</b><span>Free pickup · ${esc(s.city)}, ${esc(s.state)}</span></div></div>
      ${co ? contactFields : ''}
      <div class="form-row two">
        <div class="field"><label for="pk-date">${icon('calendar', 'icon-sm')} Date</label><input id="pk-date" name="date" type="date" required min="${isoDay(first)}" max="${isoDay(max)}" value="${isoDay(first)}"></div>
        <div class="field"><label for="pk-time">${icon('clock', 'icon-sm')} Time</label><select id="pk-time" name="time" required>${timeOpts(isoDay(first))}</select></div>
      </div>
      <p class="hint">${esc(s.pickupHours)}</p>
      ${co ? '' : contactFields}
      <div class="hp" aria-hidden="true"><label for="pk-web">Website</label><input id="pk-web" name="website" tabindex="-1" autocomplete="off"></div>
      <p class="form-error" data-err hidden></p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${co ? 'Confirm pickup time' : 'Submit'}</button>
    </form>`;
  const form = $('[data-pickup-form]', dlg);
  $('#pk-date', dlg).addEventListener('change', (e) => { $('#pk-time', dlg).innerHTML = timeOpts(e.target.value); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    const err = $('[data-err]', form);
    const checks = [['pk-date', !f.date], ['pk-time', !f.time], ['pk-name', !String(f.name).trim()], ['pk-phone', String(f.phone).replace(/\D/g, '').length < 10]];
    checks.forEach(([id, bad]) => $('#' + id, form).setAttribute('aria-invalid', bad ? 'true' : 'false'));
    const bad = checks.find(([, b]) => b);
    if (bad) { err.textContent = 'Please choose a date and time, and enter your name and a 10-digit phone number.'; err.hidden = false; $('#' + bad[0], form).focus(); return; }
    const when = `${new Date(f.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${fmtSlot(f.time)}`;
    if (co) { dlg.close(); opts.onPick({ name: f.name.trim(), phone: f.phone.trim(), when }); return; }
    const btn = $('button[type="submit"]', form); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      if (!f.website) await store.submitInquiry({ type: 'pickup', name: f.name.trim(), phone: f.phone.trim(), email: '', company: '', message: `Pickup request: ${p.title}\nWhen: ${when}` });
      const first = esc(f.name.trim().split(' ')[0]);
      form.innerHTML = `<div class="success"><span class="check">${icon('check')}</span><h3>Thank you ${first}, we will text you shortly to confirm with you!</h3><p class="muted">Requested: ${esc(when)}</p><button class="btn btn-primary" type="button" data-close-dialog>Close</button></div>`;
    } catch (ex) { err.textContent = ex.message || 'Something went wrong. Please try again.'; err.hidden = false; btn.disabled = false; btn.textContent = 'Submit'; }
  });
  dlg.onclick = (e) => { if (e.target === dlg || e.target.closest('[data-close-dialog]')) dlg.close(); };
  dlg.onclose = () => { if (co && opts.onClose) opts.onClose(); };
  dlg.showModal();
}
