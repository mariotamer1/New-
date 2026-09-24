// Shared store database (Supabase). Every admin change is written here immediately,
// so all customers and devices see the same products, orders, offers and messages.
import { uid, slugify, round2, ls, resizeImage } from './lib.js';
import { PRODUCTS, CATEGORIES } from './seed.js';

const ADMIN_EMAIL = 'admin@mlgroup.store';
const SESSION_KEY = 'ml-admin-sb';
const CUST_KEY = 'ml-cust-token';
const LOCAL_DB_KEY = 'mlgroup-db-v1';

const fromProduct = (r) => ({
  id: r.id, slug: r.slug, title: r.title, brand: r.brand || '', upc: r.upc || '', condition: r.condition,
  categoryId: r.category_id, description: r.description || '', price: Number(r.price),
  originalPrice: r.original_price == null ? null : Number(r.original_price), shipping: Number(r.shipping),
  noShipping: !!r.no_shipping, inventory: r.inventory, published: r.published, bestDeal: r.best_deal,
  images: r.images || [], createdAt: r.created_at, updatedAt: r.updated_at,
});
const toProduct = (p) => {
  const o = {
    slug: p.slug, title: p.title, brand: p.brand || null, upc: p.upc || null, condition: p.condition || 'New',
    category_id: p.categoryId || null, description: p.description || '', price: Number(p.price) || 0,
    original_price: p.originalPrice ? Number(p.originalPrice) : null, shipping: Number(p.shipping) || 0,
    no_shipping: !!p.noShipping, inventory: Math.max(0, parseInt(p.inventory, 10) || 0), published: p.published !== false,
    best_deal: !!p.bestDeal, images: p.images || [], updated_at: new Date().toISOString(),
  };
  if (p.id) o.id = p.id;
  return o;
};
const fromOffer = (r) => ({ id: r.id, productId: r.product_id, productTitle: r.product_title, productSlug: r.product_slug, productImage: r.product_image, listPrice: Number(r.list_price), name: r.name, phone: r.phone, amount: Number(r.amount), status: r.status, createdAt: r.created_at });
const fromOrder = (r) => ({ id: r.id, number: r.number, createdAt: r.created_at, status: r.status, fulfillment: r.fulfillment, payment: r.payment, customer: r.customer, address: r.address, notes: r.notes || '', items: r.items, subtotal: Number(r.subtotal), shippingTotal: Number(r.shipping_total), total: Number(r.total), customerId: r.customer_id });
const fromInquiry = (r) => ({ id: r.id, type: r.type, name: r.name, email: r.email, phone: r.phone, company: r.company, message: r.message, status: r.status, createdAt: r.created_at });

export function createSupabaseBackend(cfg) {
  const URL_ = cfg.supabaseUrl.replace(/\/$/, '');
  const KEY = cfg.supabaseKey;
  const cache = { products: [], categories: [], settings: {} };
  let session = ls.get(SESSION_KEY, null);

  async function token() {
    if (!session) return null;
    if (Date.now() / 1000 > session.expires_at - 60) {
      try {
        const r = await raw('POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: session.refresh_token }, { anon: true });
        saveSession(r);
      } catch { session = null; ls.del(SESSION_KEY); return null; }
    }
    return session.access_token;
  }
  function saveSession(r) {
    session = { access_token: r.access_token, refresh_token: r.refresh_token, expires_at: r.expires_at || Math.floor(Date.now() / 1000) + (r.expires_in || 3600) };
    ls.set(SESSION_KEY, session);
  }
  async function raw(method, path, body, { anon = false, headers = {}, rawBody = null } = {}) {
    const t = anon ? null : await token();
    const res = await fetch(URL_ + path, {
      method,
      headers: { apikey: KEY, Authorization: 'Bearer ' + (t || KEY), ...(rawBody ? {} : { 'Content-Type': 'application/json' }), ...headers },
      body: rawBody || (body === undefined ? undefined : JSON.stringify(body)),
    });
    const text = await res.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = (data && (data.message || data.msg || data.error_description || data.error)) || `Request failed (${res.status})`;
      const err = new Error(msg); err.status = res.status; throw err;
    }
    return data;
  }
  const rest = (method, path, body, prefer) => raw(method, '/rest/v1/' + path, body, { headers: prefer ? { Prefer: prefer } : {} });
  const rpc = (fn, args) => raw('POST', '/rest/v1/rpc/' + fn, args || {});

  async function loadCatalog() {
    const [products, categories, settings] = await Promise.all([
      rest('GET', 'products?select=*&order=created_at.desc'),
      rest('GET', 'categories?select=*&order=sort'),
      rest('GET', 'settings?select=data&id=eq.1'),
    ]);
    cache.products = products.map(fromProduct);
    cache.categories = categories;
    cache.settings = (settings[0] && settings[0].data) || {};
  }

  async function uploadBlob(blob, name) {
    const path = `${new Date().toISOString().slice(0, 7)}/${name}`;
    await raw('POST', `/storage/v1/object/product-images/${path}`, undefined, { rawBody: blob, headers: { 'Content-Type': blob.type, 'x-upsert': 'true', 'cache-control': 'max-age=31536000' } });
    return `${URL_}/storage/v1/object/public/product-images/${path}`;
  }
  async function dataUrlToBlob(u) { return (await fetch(u)).blob(); }

  // First admin sign-in: publish whatever this browser's preview store holds
  // (the owner's earlier edits) — or the starter catalog — to the live database.
  async function firstPublish() {
    if (cache.settings.imported) return;
    let local = null;
    try {
      local = await new Promise((res) => {
        const r = indexedDB.open('mlgroup', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => { try { const g = r.result.transaction('kv').objectStore('kv').get(LOCAL_DB_KEY); g.onsuccess = () => res(g.result || null); g.onerror = () => res(null); } catch { res(null); } };
        r.onerror = () => res(null);
      });
    } catch {}
    if (!local) local = ls.get(LOCAL_DB_KEY, null);
    const products = local && local.products ? local.products : PRODUCTS;
    const categories = local && local.categories ? local.categories : CATEGORIES;
    for (const c of categories) await rest('POST', 'categories?on_conflict=id', { id: c.id, slug: slugify(c.slug || c.name), name: c.name, sort: c.sort || 0 }, 'resolution=merge-duplicates');
    const keep = new Set(categories.map((c) => c.id));
    for (const c of cache.categories) if (!keep.has(c.id)) await rest('DELETE', `categories?id=eq.${encodeURIComponent(c.id)}`);
    for (const p of products) {
      const images = [];
      for (const im of p.images || []) {
        if (/^data:/.test(im.lg || im.sm || '')) {
          const n = uid();
          images.push({ lg: await uploadBlob(await dataUrlToBlob(im.lg || im.sm), n + '.webp'), sm: await uploadBlob(await dataUrlToBlob(im.sm || im.lg), n + '-sm.webp'), alt: im.alt || '' });
        } else images.push(im);
      }
      const row = toProduct({ ...p, images });
      if (!keep.has(row.category_id)) row.category_id = null;
      row.created_at = p.createdAt || new Date().toISOString();
      await rest('POST', 'products?on_conflict=id', row, 'resolution=merge-duplicates');
    }
    const settings = { ...cache.settings, ...(local && local.settings ? local.settings : {}), imported: true };
    await rest('PATCH', 'settings?id=eq.1', { data: settings });
    await loadCatalog();
  }

  const backend = {
    kind: 'supabase',
    async init() { await loadCatalog(); },
    async reload() { await loadCatalog(); },
    catalog() { return cache; },

    async placeOrder(input) {
      const o = await rpc('place_order', { p: { ...input, createAccount: undefined, customerToken: ls.get(CUST_KEY, null) } });
      if (input.createAccount && input.createAccount.password) {
        try { ls.set(CUST_KEY, await rpc('customer_register', { p_email: input.customer.email, p_password: input.createAccount.password, p_name: input.customer.name, p_phone: input.customer.phone })); } catch {}
      }
      o.items.forEach((i) => { const p = cache.products.find((x) => x.id === i.productId); if (p) p.inventory -= i.qty; });
      return o;
    },
    async getOrder(id) { try { return await rpc('get_order', { p_id: id }); } catch { return null; } },
    async submitOffer(o) { await rpc('submit_offer', { p_product_id: o.productId, p_name: o.name, p_phone: o.phone, p_amount: o.amount }); },
    async submitInquiry(q) { await rpc('submit_inquiry', { p: q }); },

    async register(d) { ls.set(CUST_KEY, await rpc('customer_register', { p_email: d.email, p_password: d.password, p_name: d.name, p_phone: d.phone || '' })); },
    async login(d) { ls.set(CUST_KEY, await rpc('customer_login', { p_email: d.email, p_password: d.password })); },
    async logout() { const t = ls.get(CUST_KEY, null); if (t) await rpc('customer_logout', { p_token: t }).catch(() => {}); ls.del(CUST_KEY); },
    async me() { const t = ls.get(CUST_KEY, null); if (!t) return null; const r = await rpc('customer_me', { p_token: t }).catch(() => null); if (!r) ls.del(CUST_KEY); return r; },

    admin: {
      async login(pw) {
        let r;
        try { r = await raw('POST', '/auth/v1/token?grant_type=password', { email: ADMIN_EMAIL, password: pw }, { anon: true }); }
        catch (e) { throw new Error(e.status === 400 ? 'That password is incorrect.' : 'Could not reach the store database. Check your connection.'); }
        saveSession(r);
        await loadCatalog();
        await firstPublish();
      },
      async logout() { try { await raw('POST', '/auth/v1/logout'); } catch {} session = null; ls.del(SESSION_KEY); await loadCatalog(); },
      async session() { return !!(await token()); },
      async changePassword(pw) { await raw('PUT', '/auth/v1/user', { password: pw }); },
      async products() { await loadCatalog(); return cache.products; },
      async saveProduct(input) {
        let slug = slugify(input.slug || input.title) || 'product';
        const taken = (s) => cache.products.some((p) => p.slug === s && p.id !== input.id);
        for (let n = 2; taken(slug); n++) slug = `${slugify(input.slug || input.title)}-${n}`;
        const row = toProduct({ ...input, slug });
        const res = input.id
          ? await rest('PATCH', `products?id=eq.${encodeURIComponent(input.id)}`, row, 'return=representation')
          : await rest('POST', 'products', row, 'return=representation');
        const p = fromProduct(res[0]);
        const i = cache.products.findIndex((x) => x.id === p.id);
        if (i >= 0) cache.products[i] = p; else cache.products.unshift(p);
        return p;
      },
      async deleteProduct(id) { await rest('DELETE', `products?id=eq.${encodeURIComponent(id)}`); cache.products = cache.products.filter((p) => p.id !== id); },
      async patchProduct(id, patch) {
        const map = { published: 'published', bestDeal: 'best_deal', noShipping: 'no_shipping', inventory: 'inventory' };
        const body = {}; Object.entries(patch).forEach(([k, v]) => { if (map[k]) body[map[k]] = v; });
        const res = await rest('PATCH', `products?id=eq.${encodeURIComponent(id)}`, body, 'return=representation');
        const p = fromProduct(res[0]); const i = cache.products.findIndex((x) => x.id === id); if (i >= 0) cache.products[i] = p; return p;
      },
      async adjustInventory(id, delta) {
        const n = await rpc('admin_adjust_inventory', { p_id: id, p_delta: delta });
        const p = cache.products.find((x) => x.id === id); if (p) p.inventory = n; return p;
      },
      async orders() { return (await rest('GET', 'orders?select=*&order=created_at.desc')).map(fromOrder); },
      async updateOrder(id, patch) {
        if (patch.status === 'cancelled' && patch.restock) { await rpc('admin_cancel_order', { p_id: id, p_restock: true }); await loadCatalog(); return; }
        await rest('PATCH', `orders?id=eq.${id}`, { status: patch.status });
      },
      async offers() { return (await rest('GET', 'offers?select=*&order=created_at.desc')).map(fromOffer); },
      async deleteOffer(id) { await rest('DELETE', `offers?id=eq.${id}`); },
      async updateOffer(id, patch) { await rest('PATCH', `offers?id=eq.${id}`, { status: patch.status }); },
      async inquiries() { return (await rest('GET', 'inquiries?select=*&order=created_at.desc')).map(fromInquiry); },
      async updateInquiry(id, patch) { await rest('PATCH', `inquiries?id=eq.${id}`, { status: patch.status }); },
      async deleteInquiry(id) { await rest('DELETE', `inquiries?id=eq.${id}`); },
      async saveCategory(c) {
        if (c.id) await rest('PATCH', `categories?id=eq.${encodeURIComponent(c.id)}`, { name: c.name, slug: slugify(c.slug || c.name) });
        else await rest('POST', 'categories', { name: c.name, slug: slugify(c.name), sort: cache.categories.length + 1 });
        await loadCatalog();
      },
      async deleteCategory(id) { await rest('DELETE', `categories?id=eq.${encodeURIComponent(id)}`); await loadCatalog(); },
      async reorderCategories(ids) { for (let i = 0; i < ids.length; i++) await rest('PATCH', `categories?id=eq.${encodeURIComponent(ids[i])}`, { sort: i + 1 }); await loadCatalog(); },
      async saveSettings(s) { const data = { ...cache.settings, ...s }; await rest('PATCH', 'settings?id=eq.1', { data }); cache.settings = data; },
      async uploadImage(file) {
        const [lg, sm] = await Promise.all([resizeImage(file, 1400), resizeImage(file, 520)]);
        const n = uid(); const ext = lg.type === 'image/webp' ? 'webp' : 'jpg';
        return { lg: await uploadBlob(lg, `${n}.${ext}`), sm: await uploadBlob(sm, `${n}-sm.${ext}`) };
      },
      async removeImage() {}, // photos stay in storage so a cancelled edit never breaks a listing
    },
  };
  return backend;
}
