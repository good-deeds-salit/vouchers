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
css/                base, header and layout styles
js/                 main.js, share.js (more modules arrive in later stages)
assets/             bunting.svg, images/ (optimized web images)
data/               vouchers.json (added in Stage B)
```

## Images

Original business images (Hebrew filenames) are kept locally and ignored by Git. The website uses the optimized, ASCII-named copies in `assets/images/` (named after the business ID, e.g. `b-001-logo.png`).

## Open Graph placeholders

`index.html` contains placeholder `og:url` and `og:image` values. Replace them with the real URLs after GitHub Pages is deployed, and add the 1200×630 preview image.
