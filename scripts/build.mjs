// Builds:
//   site/                      deployable website (clean URLs, one HTML file per page for SEO)
//   dist/ML-Group.html         single self-contained file (open directly in a browser)
//   dist/ml-group-website.zip  zip of site/
//   dist/artifact.html         preview variant (no outer html/head tags)
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'src');
const SITE = path.join(ROOT, 'site');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://mariotamer.com/').replace(/\/?$/, '/');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'store.config.json'), 'utf8'));

fs.rmSync(SITE, { recursive: true, force: true });
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });
fs.mkdirSync(DIST, { recursive: true });

// ---------------------------------------------------------------- bundles
const common = { bundle: true, minify: true, format: 'iife', target: 'es2020', loader: { '.json': 'json' }, legalComments: 'none' };
const [appRes, adminRes] = await Promise.all([
  build({ ...common, entryPoints: [path.join(SRC, 'js/main.js')], write: false }),
  build({ ...common, entryPoints: [path.join(SRC, 'js/admin.js')], write: false }),
]);
const appJS = appRes.outputFiles[0].text;
const adminJS = adminRes.outputFiles[0].text;
const cssRes = await build({ entryPoints: [path.join(SRC, 'css/app.css')], bundle: true, minify: true, write: false });
const appCSS = cssRes.outputFiles[0].text;
fs.writeFileSync(path.join(SITE, 'assets/app.js'), appJS);
fs.writeFileSync(path.join(SITE, 'assets/admin.js'), adminJS);
fs.writeFileSync(path.join(SITE, 'assets/app.css'), appCSS);

// seed data for page metadata
const seedRes = await build({ entryPoints: [path.join(SRC, 'js/seed.js')], bundle: true, format: 'esm', platform: 'node', write: false, loader: { '.json': 'json' } });
const seedFile = path.join(DIST, '.seed.mjs');
fs.writeFileSync(seedFile, seedRes.outputFiles[0].text);
const { PRODUCTS, CATEGORIES } = await import(seedFile);
fs.rmSync(seedFile);

// ---------------------------------------------------------------- static files
fs.cpSync(path.join(SRC, 'img'), path.join(SITE, 'img'), { recursive: true, filter: (f) => !f.endsWith('manifest.json') });
const LOGO_D = 'M0 0H35L48 13V48H0Z M36.4 9a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0Z M6 41V20H11.6L15 30.4L18.4 20H24V41H19.3V29.6L16.9 36.6H13.1L10.7 29.6V41Z M27 20H32.2V36H41V41H27Z';
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 56 56"><style>path{fill:#0b0b0c}@media (prefers-color-scheme:dark){path{fill:#fff}}</style><path fill-rule="evenodd" d="${LOGO_D}"/></svg>`;
fs.writeFileSync(path.join(SITE, 'favicon.svg'), favicon);
fs.writeFileSync(path.join(SITE, 'logo.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#0b0b0c" fill-rule="evenodd" d="${LOGO_D}"/></svg>`);
fs.writeFileSync(path.join(SITE, 'site.webmanifest'), JSON.stringify({ name: 'ML Group', short_name: 'ML Group', start_url: '/', display: 'standalone', background_color: '#0b0b0c', theme_color: '#0b0b0c', icons: [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }));
for (const f of ['apple-touch-icon.png', 'icon-512.png', 'og-image.jpg']) {
  const p = path.join(SRC, 'img/brand', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(SITE, f));
}

// ---------------------------------------------------------------- page shells
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (n) => '$' + Number(n).toFixed(2);
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,600..900&family=Figtree:wght@400..800&family=IBM+Plex+Mono:wght@500&display=swap';
const DEFAULT_DESC = 'Discounted electronics, home goods, tools, appliances and more for retail and wholesale buyers. Fast shipping and free local pickup.';

function head({ title, desc, url, image, jsonld, rel, noindex, cfg }) {
  const full = title ? `${title} | ML Group` : 'ML Group — Big Savings. Great Products.';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc || DEFAULT_DESC)}">
<meta name="robots" content="${noindex ? 'noindex' : 'index,follow'}">
<meta name="theme-color" content="#0b0b0c">
<meta name="ml-root" content="${rel}">
${url ? `<link rel="canonical" href="${esc(url)}">` : ''}
<meta property="og:type" content="${jsonld && jsonld['@type'] === 'Product' ? 'product' : 'website'}">
<meta property="og:site_name" content="ML Group">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc || DEFAULT_DESC)}">
${url ? `<meta property="og:url" content="${esc(url)}">` : ''}
<meta property="og:image" content="${esc(image || SITE_URL + 'og-image.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${rel}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel}apple-touch-icon.png">
<link rel="manifest" href="${rel}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${rel}assets/app.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'ML Group', url: SITE_URL, logo: SITE_URL + 'logo.svg' })}</script>
${jsonld ? `<script type="application/ld+json" id="ld-page">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
<script>window.ML_CONFIG=${JSON.stringify(cfg)}</script>`;
}
const noscript = (inner) => `<noscript><div style="padding:24px;font-family:system-ui">${inner}<p>Please enable JavaScript to shop ML Group.</p></div></noscript>`;

function page(route, meta) {
  const depth = route === '/' ? 0 : route.split('/').filter(Boolean).length;
  const rel = depth ? '../'.repeat(depth) : './';
  const html = `<!doctype html>
<html lang="en">
<head>
${head({ ...meta, rel, url: SITE_URL + route.replace(/^\//, ''), cfg: CONFIG })}
</head>
<body>
<div id="app">${noscript(meta.body || `<h1>${esc(meta.title || 'ML Group')}</h1><p>${esc(meta.desc || DEFAULT_DESC)}</p>`)}</div>
<script src="${rel}assets/app.js" defer></script>
</body>
</html>`;
  const dir = path.join(SITE, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const live = PRODUCTS.filter((p) => p.published && p.inventory > 0);
const pct = (p) => (p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);
page('/', { title: '', desc: 'Big savings on electronics, home goods, tools, appliances, toys and more. Fast shipping, free local pickup, and wholesale pricing from ML Group.', body: `<h1>Big savings. Great products.</h1><ul>${live.map((p) => `<li><a href="products/${p.slug}/">${esc(p.title)}</a> — ${money(p.price)}</li>`).join('')}</ul>` });
page('/products', { title: 'All Products', desc: 'Shop all discounted products at ML Group — electronics, home & kitchen, tools, appliances, toys and more.' });
page('/categories', { title: 'Categories', desc: 'Browse ML Group deals by category.' });
for (const c of CATEGORIES) page(`/categories/${c.slug}`, { title: c.name, desc: `Shop discounted ${c.name.toLowerCase()} at ML Group. Big savings, fast shipping and free local pickup.` });
const condMap = { New: 'NewCondition', Refurbished: 'RefurbishedCondition' };
for (const p of live) {
  const url = SITE_URL + 'products/' + p.slug;
  const c = CATEGORIES.find((x) => x.id === p.categoryId);
  page(`/products/${p.slug}`, {
    title: p.title,
    desc: `${p.title} — ${p.condition}, ${money(p.price)}${pct(p) ? ` (${pct(p)}% off)` : ''}. Shipping ${money(p.shipping)} or free local pickup at ML Group.`,
    image: SITE_URL + p.images[0].lg,
    jsonld: { '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: p.id, gtin12: p.upc, image: p.images.map((i) => SITE_URL + i.lg), description: p.description.replace(/\n+/g, ' ').replace(/•/g, ''), brand: { '@type': 'Brand', name: p.brand }, category: c && c.name,
      offers: { '@type': 'Offer', url, priceCurrency: 'USD', price: p.price.toFixed(2), availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/' + (condMap[p.condition] || 'UsedCondition'), seller: { '@type': 'Organization', name: 'ML Group' }, shippingDetails: { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: p.shipping.toFixed(2), currency: 'USD' }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' } } } },
    body: `<h1>${esc(p.title)}</h1><p>${esc(p.condition)} · ${money(p.price)}${p.originalPrice ? ` (retail ${money(p.originalPrice)})` : ''} · Shipping ${money(p.shipping)} · Local pickup available · UPC ${p.upc}</p><p>${esc(p.description)}</p>`,
  });
}
page('/wholesale', { title: 'Wholesale', desc: 'Wholesale and bulk purchasing from ML Group: mixed lots, case packs and pallets with volume pricing.' });
page('/about', { title: 'About', desc: 'ML Group is a retail and wholesale seller offering discounted products at competitive prices.' });
page('/contact', { title: 'Contact', desc: 'Contact ML Group — phone, email, and local pickup information.' });
page('/shipping-policy', { title: 'Shipping & Pickup', desc: 'ML Group shipping prices, delivery times and free local pickup details.' });
page('/refund-policy', { title: 'Refund Policy', desc: 'ML Group refund and return policy.' });
for (const r of ['/checkout', '/account', '/admin', '/order']) page(r, { title: r.slice(1).replace(/^\w/, (m) => m.toUpperCase()), noindex: true });

// 404 fallback: boots the app for any unknown URL (new products added in the admin, order pages)
const f404 = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8')
  .replace(/content="\.\/"/, 'content="/"').replace(/href="\.\//g, 'href="/').replace(/src="\.\//g, 'src="/')
  .replace(/<link rel="canonical"[^>]*>/, '').replace('content="index,follow"', 'content="noindex"');
fs.writeFileSync(path.join(SITE, '404.html'), f404);

// host configs so clean URLs for new products work everywhere
fs.writeFileSync(path.join(SITE, '_redirects'), '/products/*  /index.html  200\n/order/*  /index.html  200\n/categories/*  /index.html  200\n');
fs.writeFileSync(path.join(SITE, 'vercel.json'), JSON.stringify({ cleanUrls: false, trailingSlash: false, rewrites: [{ source: '/products/:slug', destination: '/index.html' }, { source: '/order/:id', destination: '/index.html' }, { source: '/categories/:slug', destination: '/index.html' }] }, null, 1));
fs.writeFileSync(path.join(SITE, '.htaccess'), 'Options -MultiViews\nDirectoryIndex index.html\nErrorDocument 404 /404.html\nRewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [L]\n');
fs.writeFileSync(path.join(SITE, 'robots.txt'), `User-agent: *\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /account/\nSitemap: ${SITE_URL}sitemap.xml\n`);
const urls = ['', 'products', 'categories', 'wholesale', 'about', 'contact', 'shipping-policy', 'refund-policy', ...CATEGORIES.map((c) => 'categories/' + c.slug), ...live.map((p) => 'products/' + p.slug)];
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`);

// ---------------------------------------------------------------- single-file builds
function embedImages(maxEach = 'sm') {
  const map = {};
  for (const p of PRODUCTS) for (const im of p.images) {
    const b64 = fs.readFileSync(path.join(SRC, im.sm)).toString('base64');
    map[im.sm] = map[im.lg] = 'data:image/webp;base64,' + b64;
  }
  return map;
}
const embed = embedImages();
const favData = 'data:image/svg+xml,' + encodeURIComponent(favicon);
const inlineScript = (js) => js.replace(/<\/script/gi, '<\\/script');
const single = (cfg) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>ML Group — Big Savings. Great Products.</title>
<meta name="description" content="${DEFAULT_DESC}">
<meta name="theme-color" content="#0b0b0c">
<link rel="icon" href="${favData}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${appCSS}</style>
<script>window.ML_CONFIG=${JSON.stringify(cfg)};window.ML_EMBED=${JSON.stringify(embed)};</script>
</head>
<body>
<div id="app"></div>
<script>${inlineScript(adminJS)}</script>
<script>${inlineScript(appJS)}</script>
</body>
</html>`;
fs.writeFileSync(path.join(DIST, 'ML-Group.html'), single({ ...CONFIG, routing: 'hash' }));
const art = single({ routing: 'memory' })
  .replace(/^<!doctype html>\n<html lang="en">\n<head>\n/, '')
  .replace('</head>\n<body>\n', '')
  .replace('</body>\n</html>', '')
  .replace(/<meta charset="utf-8">\n<meta name="viewport"[^>]*>\n/, '');
fs.writeFileSync(path.join(DIST, 'artifact.html'), art);

execSync(`cd "${SITE}" && zip -qr "${path.join(DIST, 'ml-group-website.zip')}" . -x '.DS_Store'`);
const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + ' KB';
console.log('app.js', kb(path.join(SITE, 'assets/app.js')), '| admin.js', kb(path.join(SITE, 'assets/admin.js')), '| css', kb(path.join(SITE, 'assets/app.css')));
console.log('ML-Group.html', kb(path.join(DIST, 'ML-Group.html')), '| zip', kb(path.join(DIST, 'ml-group-website.zip')), '| pages', live.length + 20);

// GitHub Pages copy: served from the /docs folder of this repo
const DOCS = path.join(ROOT, 'docs');
fs.rmSync(DOCS, { recursive: true, force: true });
fs.cpSync(SITE, DOCS, { recursive: true });
fs.writeFileSync(path.join(DOCS, 'CNAME'), new URL(SITE_URL).hostname + '\n');
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');
console.log('docs/ ready for GitHub Pages →', new URL(SITE_URL).hostname);
