// Data layer. The "local" backend keeps the whole store in this browser
// (IndexedDB) and is used for previews. When a database is configured in
// ML_CONFIG (see supabase.js), the shared backend is used instead.
import { CATEGORIES, PRODUCTS, SETTINGS } from './seed.js';
import { ENV, uid, slugify, round2, sha256, ls, ss, resizeImage, blobToDataURL } from './lib.js';
import { createSupabaseBackend } from './supabase.js';

const DB_KEY = 'mlgroup-db-v1';

function freshDB() {
  return {
    v: 1,
    products: JSON.parse(JSON.stringify(PRODUCTS)),
    categories: JSON.parse(JSON.stringify(CATEGORIES)),
    settings: { ...SETTINGS },
    orders: [], offers: [], inquiries: [], customers: [],
    nextOrder: 1001,
    adminHash: null,
  };
}

// ---------------------------------------------------------------- IndexedDB kv
const idb = {
  db: null,
  async open() {
    if (this.db) return this.db;
    this.db = await new Promise((res, rej) => {
      const r = indexedDB.open('mlgroup', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return this.db;
  },
  async get(k) {
    const db = await this.open();
    return new Promise((res, rej) => { const t = db.transaction('kv').objectStore('kv').get(k); t.onsuccess = () => res(t.result); t.onerror = () => rej(t.error); });
  },
  async set(k, v) {
    const db = await this.open();
    return new Promise((res, rej) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); });
  },
};

// ---------------------------------------------------------------- local backend
function createLocalBackend() {
  let db = null;
  let saveTimer = null;
  const persist = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try { await idb.set(DB_KEY, db); } catch { ls.set(DB_KEY, db); }
    }, 60);
  };
  const find = (id) => db.products.find((p) => p.id === id);
  const uniqueSlug = (slug, id) => {
    let s = slug || 'product', n = 2;
    while (db.products.some((p) => p.slug === s && p.id !== id)) s = `${slug}-${n++}`;
    return s;
  };

  return {
    kind: 'local',
    async init() {
      try { db = await idb.get(DB_KEY); } catch { db = null; }
      if (!db) db = ls.get(DB_KEY, null);
      if (!db || !db.products) { db = freshDB(); }
      if (!db.adminHash) db.adminHash = await sha256('MLGROUP');
      persist();
    },
    catalog() { return { products: db.products, categories: db.categories, settings: db.settings }; },

    async placeOrder(input) {
      const lines = [];
      for (const it of input.items) {
        const p = find(it.id);
        const qty = Math.max(1, Math.floor(it.qty));
        if (!p || !p.published || p.inventory <= 0) throw new Error(`${p ? p.title : 'An item in your cart'} is no longer available.`);
        if (p.inventory < qty) throw new Error(`Only ${p.inventory} left of “${p.title}”. Please lower the quantity.`);
        lines.push({ p, qty });
      }
      const pickup = input.fulfillment === 'pickup';
      const noShip = lines.find(({ p }) => p.noShipping);
      if (!pickup && noShip) throw new Error(`“${noShip.p.title}” is available for pick up only. Choose local pickup.`);
      const items = lines.map(({ p, qty }) => ({ productId: p.id, slug: p.slug, title: p.title, image: p.images[0] || null, price: p.price, qty, shipping: pickup ? 0 : p.shipping }));
      const subtotal = round2(items.reduce((s, i) => s + i.price * i.qty, 0));
      const shippingTotal = round2(items.reduce((s, i) => s + i.shipping, 0));
      lines.forEach(({ p, qty }) => { p.inventory -= qty; });
      let customerId = null;
      const email = (input.customer.email || '').trim().toLowerCase();
      if (input.createAccount && input.createAccount.password) {
        let c = db.customers.find((x) => x.email === email);
        if (!c) {
          c = { id: uid(), email, name: input.customer.name, phone: input.customer.phone, pw: await sha256(input.createAccount.password), createdAt: new Date().toISOString() };
          db.customers.push(c);
        }
        customerId = c.id;
        ls.set('ml-customer', c.id);
      } else {
        const me = ls.get('ml-customer', null);
        const c = me && db.customers.find((x) => x.id === me && x.email === email);
        if (c) customerId = c.id;
      }
      const order = {
        id: uid(), number: db.nextOrder++, createdAt: new Date().toISOString(), status: 'new',
        fulfillment: input.fulfillment, payment: input.payment,
        customer: { name: input.customer.name, email, phone: input.customer.phone },
        address: pickup ? null : input.address, notes: input.notes || '',
        items, subtotal, shippingTotal, total: round2(subtotal + shippingTotal), customerId,
      };
      db.orders.unshift(order);
      persist();
      return order;
    },
    async getOrder(id) { return db.orders.find((o) => o.id === id) || null; },
    async submitOffer(o) {
      const p = find(o.productId);
      if (!p) throw new Error('This product is no longer available.');
      db.offers.unshift({ id: uid(), productId: p.id, productTitle: p.title, productSlug: p.slug, productImage: p.images[0] || null, listPrice: p.price, name: o.name, phone: o.phone, amount: round2(o.amount), status: 'new', createdAt: new Date().toISOString() });
      persist();
    },
    async submitInquiry(q) {
      db.inquiries.unshift({ id: uid(), status: 'new', createdAt: new Date().toISOString(), ...q });
      persist();
    },

    // customer accounts (optional)
    async register({ email, password, name, phone }) {
      email = email.trim().toLowerCase();
      if (db.customers.some((c) => c.email === email)) throw new Error('An account with this email already exists. Try signing in.');
      const c = { id: uid(), email, name, phone, pw: await sha256(password), createdAt: new Date().toISOString() };
      db.customers.push(c); persist(); ls.set('ml-customer', c.id);
      return { email: c.email, name: c.name, phone: c.phone };
    },
    async login({ email, password }) {
      email = email.trim().toLowerCase();
      const c = db.customers.find((x) => x.email === email);
      if (!c || c.pw !== (await sha256(password))) throw new Error('Email or password is incorrect.');
      ls.set('ml-customer', c.id);
      return { email: c.email, name: c.name, phone: c.phone };
    },
    async logout() { ls.del('ml-customer'); },
    async me() {
      const id = ls.get('ml-customer', null);
      const c = id && db.customers.find((x) => x.id === id);
      if (!c) return null;
      return { email: c.email, name: c.name, phone: c.phone, orders: db.orders.filter((o) => o.customerId === c.id) };
    },

    // admin
    admin: {
      async login(pw) {
        if ((await sha256(pw)) !== db.adminHash) throw new Error('That password is incorrect.');
        ss.set('ml-admin', 1);
      },
      async logout() { ss.del('ml-admin'); },
      async session() { return !!ss.get('ml-admin', 0); },
      async changePassword(pw) { db.adminHash = await sha256(pw); persist(); },
      async products() { return db.products; },
      async saveProduct(input) {
        const p = input.id ? find(input.id) : null;
        const rec = { ...(p || {}), ...input };
        rec.slug = uniqueSlug(slugify(input.slug || input.title), rec.id);
        if (!p) {
          rec.id = uid(); rec.createdAt = new Date().toISOString();
          db.products.unshift(rec);
        } else Object.assign(p, rec);
        rec.updatedAt = new Date().toISOString();
        persist();
        return p || rec;
      },
      async deleteProduct(id) { db.products = db.products.filter((p) => p.id !== id); persist(); },
      async patchProduct(id, patch) { const p = find(id); if (p) Object.assign(p, patch); persist(); return p; },
      async adjustInventory(id, delta) { const p = find(id); if (p) p.inventory = Math.max(0, (p.inventory || 0) + delta); persist(); return p; },
      async orders() { return db.orders; },
      async updateOrder(id, patch) {
        const o = db.orders.find((x) => x.id === id); if (!o) return;
        if (patch.status === 'cancelled' && o.status !== 'cancelled' && patch.restock) {
          o.items.forEach((i) => { const p = find(i.productId); if (p) p.inventory += i.qty; });
        }
        delete patch.restock; Object.assign(o, patch); persist(); return o;
      },
      async offers() { return db.offers; },
      async deleteOffer(id) { db.offers = db.offers.filter((x) => x.id !== id); persist(); },
      async updateOffer(id, patch) { const o = db.offers.find((x) => x.id === id); if (o) Object.assign(o, patch); persist(); },
      async inquiries() { return db.inquiries; },
      async updateInquiry(id, patch) { const o = db.inquiries.find((x) => x.id === id); if (o) Object.assign(o, patch); persist(); },
      async deleteInquiry(id) { db.inquiries = db.inquiries.filter((x) => x.id !== id); persist(); },
      async saveCategory(c) {
        if (c.id) { const x = db.categories.find((k) => k.id === c.id); Object.assign(x, c, { slug: slugify(c.slug || c.name) }); }
        else db.categories.push({ id: uid(), name: c.name, slug: slugify(c.slug || c.name), sort: db.categories.length + 1 });
        persist();
      },
      async deleteCategory(id) {
        db.categories = db.categories.filter((c) => c.id !== id);
        db.products.forEach((p) => { if (p.categoryId === id) p.categoryId = null; });
        persist();
      },
      async reorderCategories(ids) { ids.forEach((id, i) => { const c = db.categories.find((k) => k.id === id); if (c) c.sort = i + 1; }); persist(); },
      async saveSettings(s) { Object.assign(db.settings, s); persist(); },
      async uploadImage(file) {
        const [lg, sm] = await Promise.all([resizeImage(file, 1400), resizeImage(file, 520)]);
        return { lg: await blobToDataURL(lg), sm: await blobToDataURL(sm) };
      },
      async removeImage() {},
      async exportData() { return JSON.stringify(db, null, 1); },
      async importData(json) { const d = JSON.parse(json); if (!d.products) throw new Error('That file is not an ML Group backup.'); db = d; persist(); },
      async reset() { const h = db.adminHash; db = freshDB(); db.adminHash = h; persist(); },
    },
  };
}

// ---------------------------------------------------------------- facade
let backend = null;
let cache = { products: [], categories: [], settings: { ...SETTINGS } };

export const store = {
  get kind() { return backend ? backend.kind : 'local'; },
  async init() {
    const cfg = ENV.cfg || {};
    if (cfg.supabaseUrl && cfg.supabaseKey && cfg.routing !== 'memory') {
      try {
        backend = createSupabaseBackend(cfg);
        await backend.init();
      } catch (e) {
        console.warn('Store database unreachable, using built-in catalog', e);
        backend = createLocalBackend();
        await backend.init();
        backend.offline = true;
      }
    } else {
      backend = createLocalBackend();
      await backend.init();
    }
    this.refresh();
  },
  get offline() { return !!(backend && backend.offline); },
  refresh() { cache = backend.catalog(); },
  async reload() { if (backend.reload) await backend.reload(); this.refresh(); },
  settings() { return cache.settings || SETTINGS; },
  categories() { return [...cache.categories].sort((a, b) => (a.sort || 0) - (b.sort || 0)); },
  category(key) { return cache.categories.find((c) => c.id === key || c.slug === key) || null; },
  // public catalog: published and in stock only
  products() { return cache.products.filter((p) => p.published && p.inventory > 0); },
  product(slug) { return this.products().find((p) => p.slug === slug) || null; },
  productById(id) { return cache.products.find((p) => p.id === id) || null; },
  placeOrder: (x) => backend.placeOrder(x).then((r) => { store.refresh(); return r; }),
  getOrder: (id) => backend.getOrder(id),
  submitOffer: (x) => backend.submitOffer(x),
  submitInquiry: (x) => backend.submitInquiry(x),
  account: {
    register: (x) => backend.register(x),
    login: (x) => backend.login(x),
    logout: () => backend.logout(),
    me: () => backend.me(),
  },
  get admin() { return backend.admin; },
};

// ---------------------------------------------------------------- cart
const CART_KEY = 'ml-cart';
export const cart = {
  lines() { return ls.get(CART_KEY, []).filter((l) => l && l.id && l.qty > 0); },
  save(lines) { ls.set(CART_KEY, lines); window.dispatchEvent(new CustomEvent('cart:change')); },
  items() {
    return this.lines().map((l) => {
      const p = store.productById(l.id);
      if (!p || !p.published || p.inventory <= 0) return null;
      return { product: p, qty: Math.min(l.qty, p.inventory) };
    }).filter(Boolean);
  },
  count() { return this.items().reduce((s, i) => s + i.qty, 0); },
  subtotal() { return round2(this.items().reduce((s, i) => s + i.product.price * i.qty, 0)); },
  add(id, qty = 1) {
    const p = store.productById(id); if (!p) return;
    const lines = this.lines();
    const l = lines.find((x) => x.id === id);
    if (l) l.qty = Math.min(p.inventory, l.qty + qty); else lines.push({ id, qty: Math.min(p.inventory, qty) });
    this.save(lines);
  },
  set(id, qty) {
    const p = store.productById(id);
    const lines = this.lines().map((l) => (l.id === id ? { ...l, qty: Math.max(1, Math.min(p ? p.inventory : qty, qty)) } : l));
    this.save(lines);
  },
  remove(id) { this.save(this.lines().filter((l) => l.id !== id)); },
  clear() { this.save([]); },
};
