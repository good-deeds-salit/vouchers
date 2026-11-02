# דוכן המעשים הטובים — Good Deeds Booth Vouchers

A static, mobile-first, RTL Hebrew website listing vouchers donated by local businesses for a community charity fair booth. All purchases and payments happen physically at the booth; there is no online checkout.

Plain HTML, CSS and JavaScript. No frameworks, no build step, no backend, no cost.

See `SPEC.md` (what we build) and `practice.md` (how we work).

## Preview locally (free)

The site loads data with `fetch` (from Stage B), so open it through a local web server, not by double-clicking `index.html`.

With Python (already installed on most machines):

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with Ctrl+C.

Alternative, if Node.js is installed:

```bash
npx serve .
```

## Folder structure

```
index.html          page
css/                base, header, layout, voucher, modal and banner styles
js/                 main.js, data.js, render.js, modal.js, reveal.js, share.js, dom.js, format.js
assets/             garland SVGs, images/ (optimized web images)
data/vouchers.json  voucher data (see below)
```

## Voucher data

All vouchers live in `data/vouchers.json`; nothing is hard-coded in HTML or JavaScript. See `SPEC.md` (section 8) for every field. A voucher is shown only when `published` is `true`, all required fields are present, and its `expirationDate` has not passed (valid through the end of that day, Israel time). Expired records stay in the file. Fictional vouchers must set `"isDemo": true` and are labeled "דוגמה" on the site.

## Images

Original business images (Hebrew filenames) are kept locally and ignored by Git. The website uses the optimized, ASCII-named copies in `assets/images/` (named after the business ID, e.g. `b-001-logo.png`).

## Open Graph placeholders

`index.html` contains placeholder `og:url` and `og:image` values. Replace them with the real URLs after GitHub Pages is deployed, and add the 1200×630 preview image.
