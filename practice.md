# practice.md — Permanent Development Instructions

These rules apply to every task in this project. Documentation is in English; the website itself is in Hebrew with full RTL support.

## Before you start
1. Read `SPEC.md` and `practice.md` before implementing any change.
2. Confirm the current Git branch matches the stage you are working on (see SPEC section 11). If it does not, stop and ask.
3. If a requirement is ambiguous or information is missing, ask a short question instead of guessing.

## Budget
- The project must cost **nothing**. Maximum acceptable additional expense is US$5, and only with the user's explicit advance approval.
- No paid APIs, hosting, databases or premium libraries. Free GitHub Pages only. No backend in the initial version.
- Never activate a service that might generate charges without asking first. Check free-tier terms before proposing anything.

## Content and language
- All user-facing text is Hebrew. Code, comments, commit messages and docs are English.
- Use the exact Hebrew header texts from SPEC section 4 (title, subtitle, intro, date, time, location, booth notice), in the specified order. Do not rephrase them.
- Use the exact Avi voucher wording from SPEC 8.6.
- Pages use `lang="he"` and `dir="rtl"`. Prefer CSS logical properties over left/right.
- Isolate phone numbers, prices and URLs so they display correctly in RTL.
- Use "קולינריה", not "אוכל".
- Never show the text "שובר מתנה" on voucher cards.

## Data integrity
- Never invent business details. This includes phone numbers, WhatsApp links, logos, images, descriptions and the public website URL. Missing items use the defined fallbacks.
- Fictional vouchers are marked `isDemo: true` and visibly labeled "דוגמה". Real vouchers (such as אבי שף הבית) are never labeled as demo.
- Keep voucher data in `data/vouchers.json`, never hard-coded in HTML or JS.
- IDs (`id`, `businessId`) are unique and never reused.
- No `soldOut` field and no inventory logic.
- Expired vouchers are filtered out at runtime but their records stay in the data file.
- Only approved, published vouchers appear as real offers.
- Categories come from the data; never hard-code a list. Infer categories from business name, description and offer, reuse existing ones, prefer broad intuitive categories, and flag ambiguity with `categoryReview` and report it.
- No live AI calls from the public site.
- Never strike through `voucherValue`; only a genuine, present `originalValue` is struck through (SPEC 6.1). Field names: `voucherValue`, `discountedPrice`, optional `originalValue`.
- Store the Avi description verbatim (SPEC 8.6); never rewrite approved business text.
- Business WhatsApp group buttons and the site-level "שתפו בוואטסאפ" button are different features; keep them separate.

## Image assets
- Real business logos and photos supplied by the user are used as-is. Never replace them with AI-generated images or placeholders.
- Never rename, move, delete or modify the user's original image files without explicit approval. Copies for the website (ASCII names, web-optimized, under `assets/images/`) are made only after approval.
- Keep image paths relative and GitHub Pages compatible.
- Originals with Hebrew names are excluded from Git via `.gitignore`; only optimized ASCII-named copies named after the business ID (e.g. `b-001-logo.png`) are committed.
- Never display empty fields or invent contact details, conditions, images or links. Show a business WhatsApp button only when a valid invitation URL exists.

## Design
- Preserve approved design decisions: charcoal cards, subtle semi-transparent ribbon, cream and restrained gold accents, elegant bunting, compact header, system font stack. Propose any change first.
- Mobile-first: base styles for small screens, enhance with `min-width` queries. Check at 320px, 375px, 768px and desktop. Aim for 4–6 compact previews on a typical phone screen without hurting readability.
- Accessibility is required: semantic HTML, keyboard operability, visible focus, AA contrast, meaningful Hebrew alt text, `prefers-reduced-motion`, modal focus management with Escape to close and focus return, no tiny nested scroll areas.

## Code quality
- Plain HTML, CSS and JavaScript only. No frameworks (unless explicitly approved), build tools or backend. Document a free local dev server in the README.
- No unnecessary dependencies. Any third-party asset (fonts, icons, libraries) requires approval.
- Keep code small, readable and organized by responsibility (data loading, rendering, modal, share, styles). Use CSS custom properties for colors, spacing and fonts.
- Relative paths only (GitHub Pages compatible). Local images live in `assets/images/` with ASCII filenames and optimized sizes.
- Render data with DOM APIs / `textContent`; do not inject data as raw HTML.
- Do not implement the future-expansion items in SPEC section 13, and do not add code that blocks them.

## Git
- Work on the correct branch for the stage: Stage A `main`, Stage B `feature/vouchers`, Stage C `feature/category-filter`.
- The initial commit on `main` is approved. All later commits are small, focused on one concern, with descriptive English messages (imperative mood).
- **Every push to GitHub requires explicit approval**, including the first push to `main`. Approval for one push does not cover the next.
- **Creating the public GitHub repository requires explicit approval.**
- **Never merge a Pull Request or delete a branch without explicit approval.** Each feature branch gets its own Pull Request for the user to review.
- **Never delete feature branches, even after merging** — they are needed to demonstrate the workflow for the user's course.
- Never commit secrets, personal data or unoptimized large images.
- Do not start any Git action until the user approves the documents.

## Before proposing a merge
Run and report on the relevant checks:
- Serve locally over HTTP (not `file://`); no console errors or failed requests.
- Test mobile and desktop widths, in RTL, with no horizontal scroll.
- Keyboard-only walkthrough (Tab, Enter, Space, Escape) and a reduced-motion check.
- Validate `vouchers.json` (valid JSON, unique IDs, required fields, image paths resolve).
- Confirm every acceptance criterion for the stage in SPEC section 14.
- Review the full diff for stray files, debug code, invented data and any leftover outdated Avi offer values (75 ₪ / 150 ₪ or 100 ₪ / 200 ₪). The current offer is pay 50 ₪, receive 100 ₪.

## Architecture and scope
- Do not make major architectural changes (file structure, data schema, new tooling, new dependencies) without explicit approval. Propose them with reasoning first.
- Update `SPEC.md` or `practice.md` only when the user asks, or propose the edit and wait.

## Communication
- After finishing work, explain briefly: what changed, what was checked, what still needs a decision. Report failed checks and risks honestly.
- Then stop and wait for approval before moving to the next step or stage.
