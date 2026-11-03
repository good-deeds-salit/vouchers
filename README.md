# דוכן המעשים הטובים — Good Deeds Booth Vouchers

A static, mobile-first, RTL Hebrew website listing vouchers donated by local businesses for a community charity fair booth. All purchases and payments happen physically at the booth; there is no online checkout.

Plain HTML, CSS and JavaScript. No frameworks, no build step, no backend, no cost.

See `SPEC.md` (what we build) and `practice.md` (how we work).

## Preview locally (free, no cache)

The site loads data with `fetch`, so open it through a local web server, not by double-clicking `index.html`.

Use the included development server. It uses only Python's standard library and sends no-cache headers, so a normal browser refresh always shows the latest HTML, CSS and JavaScript:

```bash
python tools/dev_server.py
```

Then open <http://localhost:8000>. Stop the server with Ctrl+C.

- Another port: `python tools/dev_server.py --port 8001`.
- If port 8000 is already in use, the script says so and exits. It never stops another server. An older plain server (such as `python -m http.server`) may serve cached, outdated files, so stop it yourself or use a different port.
- If a page ever looks out of date, do a hard refresh (Ctrl+Shift+R) and check the port you are viewing.
- The dev server is for local development only. GitHub Pages serves the site itself and never uses `tools/dev_server.py`.

Alternative, if Node.js is installed: `npx serve .` (this one may cache files; prefer the dev server above).

## Folder structure

```
index.html          page
css/                base, header, layout, filter, voucher, modal and banner styles
js/                 main.js, data.js, filter.js, render.js, modal.js, reveal.js, share.js, dom.js, format.js
assets/             garland and ribbon SVGs, images/ (optimized web images)
tools/              dev_server.py (local no-cache development server)
data/vouchers.json  voucher data (see below)
```

## Voucher data

All vouchers live in `data/vouchers.json`; nothing is hard-coded in HTML or JavaScript. See `SPEC.md` (section 8) for every field. A voucher is shown only when `published` is `true`, all required fields are present, and its `expirationDate` has not passed (valid through the end of that day, Israel time). Expired records stay in the file. Optional `quantity` (a positive whole number) is shown as "כמות שוברים: N" below the price; it is informational only, not live stock. In a future Google Sheets import, the column "כמות שוברים" maps to `quantity`. Fictional vouchers must set `"isDemo": true` and are labeled "דוגמה" on the site.

## Category filter

The filter above the voucher grid is generated in the browser from the `category` and `secondaryCategories` of the vouchers that are currently shown (published and not expired); no category names are hard-coded. "הכול" is always first and selected by default, and a voucher matches a category by its primary or secondary category. The filter is shown even when there is only one category, and hidden when there are none. Selecting the already active option does nothing. To add a category, just use it in a voucher in `data/vouchers.json`.

## Images

Original business images (Hebrew filenames) are kept locally and ignored by Git. The website uses the optimized, ASCII-named copies in `assets/images/` (named after the business ID, e.g. `b-001-logo.png`).

## Open Graph placeholders

`index.html` contains placeholder `og:url` and `og:image` values. Replace them with the real URLs after GitHub Pages is deployed, and add the 1200×630 preview image.
