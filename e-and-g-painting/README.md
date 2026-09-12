# E & G Painting, LLC — one-page site

Self-contained static site. Open `index.html` in a browser; no server or build step.

## Structure
```
index.html                     entire page (HTML + CSS + JS inline)
assets/font/display.woff2      Bricolage Grotesque (headlines)
assets/font/body.woff2         Inter (body)
assets/img/favicon.svg         logo mark
assets/img/icon-180.png        apple touch icon
assets/img/og.jpg              1200x630 social card
assets/img/map.svg             stylized locator (links to real Google Maps)
assets/img/before-*.jpg        before/after pairs
assets/img/after-*.jpg
assets/world/leg-0{1,2,3}.mp4  scroll-scrubbed film, desktop H.264
assets/world/leg-0{1,2,3}-mobile.mp4
assets/world/leg-0{1,2,3}-poster.jpg   exact first frame of each encoded clip
```
Binary assets are not committed here; they ship in the delivered zip.

## The hero
Three chained clips play as ONE continuous paint-ribbon journey. Each leg was
generated starting from the **actual last rendered frame** of the previous leg,
so the ribbon carries across seams instead of cutting.

Scroll position drives `video.currentTime`. Legs are weighted by real duration,
seeks are coalesced against `video.seeking`, and motion is eased toward the
target rather than snapped. Before the first scroll the opening leg autoplays
muted on a loop; the first scroll hands control to the scrubber.

`prefers-reduced-motion: reduce` removes the sticky stage and every video fetch,
and renders the same eight chapters as a static illustrated list.

## Accuracy
Business facts come only from the Google Business Profile. Prices, awards,
years in business and full weekday hours are absent from that source and are
therefore absent here. Reviews are quoted verbatim.
