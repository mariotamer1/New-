# Rescue Drywall — one-page site

Professional drywall repair, restoration, replacement and finishing. Orting, Washington.

## Files

| File | What it is |
|---|---|
| `index.html` | The entire site — markup, styles and scripts in one standalone file. No build step, no dependencies. |
| `og-image.png` | 1200×630 social share image, referenced by the Open Graph / Twitter tags. |

Open `index.html` in a browser, or upload both files to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, or plain shared hosting).
Keep the two files side by side.

## Editing business details

Everything editable lives in one `CONFIG` block near the top of the `<script>`
tag in `index.html`. Search for `EDIT THIS BLOCK ONLY`.

```js
const CONFIG = {
  phone: "(253) 651-4343",   // tap-to-call, shown across the site
  email: "",                 // estimate requests get emailed here
  formEndpoint: "",          // optional: Formspree / Basin / Netlify Forms URL
  hours: [],                 // [["Mon – Fri","7:00 AM – 5:00 PM"], ["Saturday","By appointment"]]
  serviceAreas: [],          // ["Orting","South Prairie","Buckley","Sumner","Puyallup"]
  reviews: []                // [{ quote:"...", name:"Sarah M.", source:"Google", rating:5 }]
};
```

**Anything left empty is hidden from the page**, rather than filled with
placeholder text — so nothing unverified is ever published. The reviews
section, the hours panel and the service-area tags do not render at all
until you supply real content.

### How the estimate form sends

The form tries these in order, using whichever you have configured:

1. `formEndpoint` — posts the request as JSON (recommended; requests land in your inbox/dashboard).
2. `email` — opens a pre-filled email to that address.
3. Phone only (current setup) — shows the finished request with a **Text It To Us**
   button that opens the visitor's messaging app addressed to your number,
   plus a copy button.

Adding an `email` or a `formEndpoint` upgrades it to a true inbox submission.

### If you deploy on a different domain

Update the `<link rel="canonical">` and `og:url` values in `<head>` to match.

## Before & After images

The three comparisons are drawn in code (illustrations of typical drywall
damage and finished repair), so the section works with no photography.
When you have real job photos, replace the two `<canvas>` elements inside
`.ba-stage` with `<img>` tags and remove the `beforeAfter` script block.

## Accessibility & performance notes

- The hero animation is scroll-controlled, never autoplaying. Visitors with
  `prefers-reduced-motion: reduce` get a static hero instead, and the page
  also works with JavaScript disabled.
- No external JavaScript, no tracking, no image payload — only two webfont
  requests from Google Fonts.
- Canvas resolution is capped at 1.5× on phones and 2× on desktop, and the
  animation stops rendering entirely once the hero scrolls out of view.
