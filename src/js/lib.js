// Shared helpers: environment, formatting, icons, logo, images, barcode.
const CFG = (typeof window !== 'undefined' && window.ML_CONFIG) || {};

function computeRoot() {
  const meta = document.querySelector('meta[name="ml-root"]');
  try { return new URL(meta ? meta.content : './', location.href).href; } catch { return location.href; }
}

export const ENV = {
  cfg: CFG,
  routing: CFG.routing || (location.protocol === 'file:' ? 'hash' : 'path'),
  root: computeRoot(),
  embed: (typeof window !== 'undefined' && window.ML_EMBED) || null,
};
ENV.rootPath = new URL(ENV.root).pathname;

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pctOff = (p) => (p.originalPrice && Number(p.originalPrice) > Number(p.price) ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);
export const slugify = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/["']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
export const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const fmtDate = (iso, time) => { try { return new Date(iso).toLocaleString('en-US', time ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return ''; } };
export const telHref = (s) => 'tel:' + String(s || '').replace(/[^\d+]/g, '');
export const round2 = (n) => Math.round(Number(n) * 100) / 100;
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

export function href(path) {
  path = path || '/';
  if (ENV.routing === 'path') return ENV.rootPath + path.replace(/^\//, '');
  return '#' + path;
}

export function img(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (ENV.embed && ENV.embed[path]) return ENV.embed[path];
  return ENV.root + path;
}

// <img> with srcset for bundled/uploaded images {sm, lg}
export function imgTag(im, { alt = '', sizes = '(min-width:1024px) 25vw, 50vw', eager = false, cls = '', w = 480 } = {}) {
  if (!im) return `<img class="${cls}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" width="${w}" height="${w}">`;
  const sm = img(im.sm || im.lg);
  const lg = img(im.lg || im.sm);
  const set = sm !== lg && !ENV.embed ? ` srcset="${esc(sm)} 480w, ${esc(lg)} 960w" sizes="${sizes}"` : '';
  return `<img class="${cls}" src="${esc(sm)}"${set} alt="${esc(alt || im.alt || '')}" width="${w}" height="${w}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  bag: '<path d="M5.5 8h13l-1 13h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  grid4: '<path d="M3 5h3.5v5.5H3zM8.5 5H12v5.5H8.5zM14 5h3.5v5.5H14zM19.5 5H21v5.5h-1.5zM3 13.5h3.5V19H3zM8.5 13.5H12V19H8.5zM14 13.5h3.5V19H14zM19.5 13.5H21V19h-1.5z"/>',
  grid2: '<rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/>',
  list: '<rect x="3.5" y="4.5" width="5" height="5"/><rect x="3.5" y="14.5" width="5" height="5"/><path d="M11.5 6h9M11.5 8.5h6M11.5 16h9M11.5 18.5h6"/>',
  rows: '<rect x="2.5" y="6" width="6" height="12"/><rect x="10" y="6" width="6" height="12"/><path d="M17.5 6h4v12h-4"/>',
  truck: '<path d="M2.5 6.5h11.5v10H2.5z"/><path d="M14 9.5h4.2l3.3 3.4v3.6H14"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  store: '<path d="M4 10.5V20h16v-9.5"/><path d="M3 10.5 5 4h14l2 6.5z"/><path d="M9.5 20v-5.5h5V20"/>',
  tag: '<path d="M3 12.5V4h8.5l9.5 9.5-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13.5h10L18 7"/>',
  phone: '<path d="M5 3.5h3.5l2 5-2.5 1.6a11 11 0 0 0 5.9 5.9l1.6-2.5 5 2v3.5a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2"/>',
  mail: '<rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  filter: '<path d="M3.5 6h17M7 12h10M10.5 18h3"/>',
  refund: '<path d="M4 12a8 8 0 1 0 2.8-6.1"/><path d="M4 4.5v4.5h4.5"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
  logout: '<path d="M14 4h6v16h-6"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',
  inbox: '<path d="M3 13.5 5.5 5h13l2.5 8.5V19H3z"/><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v6M18 9v6"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;

// Logo: a price tag / shipping label with "ML" knocked out.
export const LOGO_D = 'M0 0H35L48 13V48H0Z M36.4 9a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0Z M6 41V20H11.6L15 30.4L18.4 20H24V41H19.3V29.6L16.9 36.6H13.1L10.7 29.6V41Z M27 20H32.2V36H41V41H27Z';
export const logoSvg = (label) => `<svg viewBox="0 0 48 48" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><path fill="currentColor" fill-rule="evenodd" d="${LOGO_D}"/></svg>`;
export const logo = (withWord = true) => `${logoSvg()}${withWord ? '<span class="logo-word">GROUP</span>' : ''}`;

// UPC-A barcode as inline SVG
const L_CODES = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
export function barcode(code) {
  const d = String(code || '').replace(/\D/g, '');
  if (d.length !== 12) return '';
  let bits = '101';
  for (let i = 0; i < 6; i++) bits += L_CODES[+d[i]];
  bits += '01010';
  for (let i = 6; i < 12; i++) bits += L_CODES[+d[i]].replace(/./g, (b) => (b === '1' ? '0' : '1'));
  bits += '101';
  const guards = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
  let rects = '';
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') rects += `<rect x="${i}" y="0" width="1" height="${guards.has(i) ? 44 : 38}"/>`;
  }
  return `<svg viewBox="0 0 95 44" aria-hidden="true" preserveAspectRatio="none" style="width:142px;height:44px"><g fill="currentColor">${rects}</g></svg>`;
}

// Resize an uploaded image file to WebP (falls back to JPEG) at a max edge.
export async function resizeImage(file, max) {
  const url = URL.createObjectURL(file);
  try {
    const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * scale), h = Math.round(im.naturalHeight * scale);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h);
    let blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.82));
    if (!blob || blob.type !== 'image/webp') blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.86));
    return blob;
  } finally { URL.revokeObjectURL(url); }
}
export const blobToDataURL = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });

export async function sha256(s) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return 'plain:' + s; }
}

// safe storage helpers
export const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
export const ss = {
  get(k, d) { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { sessionStorage.removeItem(k); } catch {} },
};
