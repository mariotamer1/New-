import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/labels.html', { waitUntil: 'load' });
await p.pdf({ path: 'upc-labels-6x4.pdf', width: '6in', height: '4in', printBackground: true, preferCSSPageSize: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await p.setViewportSize({ width: 576, height: 384 });
await p.screenshot({ path: 'page1.png' });
await b.close();
