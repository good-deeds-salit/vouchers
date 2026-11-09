# SPEC.md — Good Deeds Booth Vouchers Website

Project folder: `good-deeds-vouchers`
Status: Revision 4 (approved with final clarifications). Stage A in progress.

All documentation is written in English. **All user-facing website content is in Hebrew, with full RTL support.**

---

## 1. Overview

A mobile-first, RTL Hebrew website for a community charity fair booth called **"דוכן המעשים הטובים"**, at the village fair (היריד המושבי).

Local businesses donate vouchers. Visitors browse the available offers before the fair. **All purchases and payments happen physically at the booth.** There is no online checkout, cart, payment, or online purchasing functionality of any kind, and the page must say so clearly (section 4).

## 2. Technical and budget constraints

**Zero additional cost whenever possible.** The maximum acceptable additional expense is US$5, and any expense needs the user's explicit approval in advance. No service that might generate charges may be activated without asking first.

- Plain HTML, CSS and JavaScript (ES modules allowed). No frameworks unless explicitly approved. No build step.
- No paid APIs, paid services, paid hosting, paid databases or premium libraries. No external AI API calls.
- No backend in the initial version.
- Hosting: free GitHub Pages from a **public** GitHub repository. Relative asset paths only (no absolute `/` paths).
- Avoid unnecessary external dependencies. Any third-party asset needs explicit approval.
- Fonts: a Hebrew-compatible **system font stack** (no web fonts). Custom fonts may be reconsidered later, with approval.
- Code must be simple, maintainable and well organized.
- The README (added in Stage A) includes instructions for a **free local development server**, for example `python -m http.server 8000` (or `npx serve`, if Node is already installed), then opening `http://localhost:8000`. Needed because `vouchers.json` is loaded with `fetch`, which does not work from `file://`.

## 3. Design requirements

- Elegant, festive, welcoming. Festive but not childish.
- **Voucher cards:** soft charcoal / dark gray, with a **subtle, semi-transparent gift ribbon** decoration on each voucher. Consistent visual identity across all vouchers.
- **Palette:** charcoal base with cream and subtle/restrained gold accents.
- **Header:** decorative triangular bunting / flag garlands near the top of the homepage. Festive and community-oriented, but elegant.
- **Do NOT display the text "שובר מתנה"** on voucher cards. A subtle gift icon is welcome. Content and pricing are the main focus of each card.
- Clean, readable Hebrew typography (system font stack).
- Fully responsive, mobile-first, RTL (`<html lang="he" dir="rtl">`).
- Phone numbers, prices and URLs must render correctly inside RTL text (`dir="ltr"` / `<bdi>` / `unicode-bidi: isolate` on those fragments).
- Accessible: AA contrast, visible focus states, full keyboard support, semantic HTML, `prefers-reduced-motion` respected.
- Approved design decisions are preserved (see `practice.md`).

## 4. Homepage header and fair details

Exact Hebrew text, in this order:

1. Main title: **השוברים השווים של דוכן המעשים הטובים** — always displayed on exactly two lines: "השוברים השווים" / "של דוכן המעשים הטובים"
2. Subtitle: **כל ההכנסות לתרומה ❤️** (emoji added in the Stage A visual refinement)
3. Introductory sentence: **גלו את השוברים שיהיו זמינים לרכישה בדוכן המעשים הטובים ביריד המושבי** (no emoji; bold, smaller than the subtitle). Immediately below it, in regular weight and without emoji: **כל השוברים, המוצרים והשירותים נתרמו באהבה גדולה על ידי העסקים המופיעים מטה**
3a. A delicate gold divider (thin gold lines from both sides, a small outlined gold heart in the center) sits below the two introductory sentences and above the date/time/location row.
4. Fair date: **27.11.26**
5. Time: **15:00**
6. Location: **רחבת המועדון** (final clarification: this shortened form replaces the earlier longer sentence; the title, subtitle and introductory sentence above are unchanged)

Rules:
- The introductory sentence appears below the subtitle and above the date, time and location.
- Exact booth purchase notice: **הרכישה והתשלום מתבצעים בדוכן ביריד בלבד**. It clearly communicates that vouchers are purchased and paid for physically at the fair booth and not online. It is placed after the date/time/location block (or as a slim banner), without changing the order of the elements above.
- The header is attractive, festive and **compact**, especially on mobile, so voucher previews start high on the screen.
- A visible website-level share button labeled **שתפו בוואטסאפ** (see section 10): rounded pill, WhatsApp green background (slightly darkened so white text keeps AA contrast), white WhatsApp icon and white text, subtle shadow, comfortable but not oversized. The booth notice sits next to it when space allows, as regular-weight plain text (no border, background or pill).
- **Garlands:** exactly two separate colorful garlands hang from opposite upper corners, asymmetrically: the right garland spans about 60% of the page width and the left about 40%, each with a natural downward curve and triangular flags following it. No black or charcoal flags. Their inner ends meet naturally at the top, without overlapping flags, and the title stays unobstructed. On wide screens the pair is capped in size and centered.
- The visual reference screenshot supplied by the user is inspiration only: its fictional businesses and voucher layouts are never copied, and real data (e.g. Avi Chef) is never altered.

### 4.1 Closing donation banner

Below the **complete** voucher grid (and so also after future filtering) a warm closing banner is shown: soft cream/gold background, thin rounded gold border, generously rounded corners, a subtle outlined icon of hands holding a heart, centered RTL text. Exact texts:

- **כל ההכנסות לתרומה לעמותה נבחרת.** (emphasized)
- **הצביעו והשפיעו בבחירת העמותה!** (emphasized)
- בקשו את הברקוד לסריקה מהמוכרת בדוכן (regular)

It feels warm and meaningful, not like an advertisement. There is no online voting form and no QR code on the site; visitors request the QR code physically at the booth.

## 5. Layout (mobile-first, high priority)

The site is viewed mainly on phones.

- Target: roughly **4–6 compact voucher previews** visible on a typical mobile screen before further scrolling, including the compact header. Readability and accessibility are never sacrificed for this target; small screens may show fewer.
- Two-column voucher grid on mobile where practical (single column only if content cannot fit legibly, e.g. at about 320px); more columns on wider screens.
- Cards are visually consistent and easy to scan.

## 6. Voucher preview (card)

Each preview clearly shows:
- Business name
- Voucher offer
- **Actual purchasing value** (`voucherValue`: what the buyer can redeem)
- Discounted purchase price (`discountedPrice`: what the buyer pays at the booth)
- Original value with strikethrough **only where a genuine original price exists** (see 6.1)
- Subtle ribbon and a subtle gift icon; no "שובר מתנה" text

### 6.1 Price display rules

The customer must immediately understand what they pay and what they get.

- **The actual voucher value (`voucherValue`) is never displayed with a strikethrough.**
- Strikethrough applies only to `originalValue`, a genuine regular price, and only when that field is present (e.g. a workshop normally 200 ₪, sold for 120 ₪).
- For a voucher where the buyer pays X and receives value Y (e.g. pay 50 ₪, receive 100 ₪), both are shown explicitly, with the voucher value stated as the thing received and the price as what is paid. See the exact Avi wording in 8.6.

### 6.2 Scroll reveal (Stage B)

Voucher cards progressively reveal as visitors scroll:
- Smooth fade-in with a subtle upward movement.
- Triggered with `IntersectionObserver`.
- A small stagger between adjacent cards where appropriate.
- Each card is revealed only once.
- No infinite scrolling, no artificial loading delays, no paid or external libraries.
- Respects `prefers-reduced-motion` (cards simply appear).
- Cards stay visible if JavaScript or `IntersectionObserver` is unavailable (the hidden initial state is applied only by JavaScript once the observer is confirmed to exist).

## 7. Voucher details view (modal)

The original 3D flip-card concept is replaced because mobile usability matters more. Previews are compact and open an elegant, accessible **details modal** when clicked. A subtle reveal/scale/fade animation is allowed if it improves the experience; a full 3D flip is not required.

The details view includes:
- Full business description (displayed exactly as stored in the data)
- The business's actual logo
- The selected business image
- Voucher expiration date (`DD.MM.YYYY`)
- Contact details (phone as a `tel:` link, when provided)
- Business website button
- Business WhatsApp group button, **when a valid link is provided**, placed alongside the website button, with a recognizable WhatsApp icon if practical (inline SVG, no external icon library). Default label: **הצטרפו לקבוצת העדכונים השקטה**. It opens the group invitation link (`target="_blank"` with `rel="noopener noreferrer"`) and must work on mobile and desktop.
- Voucher terms and conditions (only when provided)

Requirements:
- Works well on mobile (near full-screen sheet) and desktop (centered dialog).
- Clearly visible close button.
- Preview cards are real `<button>` elements; the modal opens by mouse, touch, Enter and Space.
- Escape closes the modal. Focus moves into the modal when opened, is kept within it, and returns to the originating preview when closed. The page behind is inert and does not scroll.
- Vertical scrolling for long content using a **single** scroll area (no tiny nested scroll boxes).
- Links and buttons remain independently clickable.
- Use the native `<dialog>` element (`showModal()`) unless a documented problem prevents it.
- Respects `prefers-reduced-motion`.

**Two different WhatsApp features, never to be confused:** (a) the business-specific WhatsApp group button in the modal, which opens that business's group invitation; (b) the site-level **שתפו בוואטסאפ** button, which shares the website URL (section 10).

## 8. Data architecture

Voucher data lives in `data/vouchers.json`, separate from HTML, and is rendered dynamically by JavaScript (`fetch` + DOM creation, using `textContent` / DOM APIs rather than raw HTML injection).

### 8.1 File shape

```json
{
  "schemaVersion": 1,
  "vouchers": [ { ...voucher } ]
}
```

### 8.2 Voucher fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique voucher ID, e.g. `v-001`. Never reused. |
| `businessId` | string | yes | Stable business ID, e.g. `b-001`. A business may have several vouchers. Future image matching keys off this. |
| `businessName` | string | yes | Hebrew. |
| `offer` | string | yes | Hebrew voucher offer text. |
| `voucherValue` | number | yes | **Approved.** The amount the customer can redeem, in ILS. Never struck through. |
| `discountedPrice` | number | yes | **Approved name** (replaces the earlier draft name `price`). The price the customer pays at the charity booth, in ILS. |
| `quantity` | number | no | **Optional, informational only.** Whole number of vouchers offered, shown as "כמות שוברים: N" below the price on the card and in the modal. Hidden when missing or not a positive whole number. Not live inventory: it is never reduced, and there is no stock management or sold-out behavior. |
| `originalValue` | number | no | **Optional.** A genuine regular price, in ILS, when applicable. The only value ever struck through. |
| `description` | string | yes | Full business description (modal), stored and shown verbatim. A line break (`
`) separates paragraphs; the modal renders each as its own paragraph. |
| `logo` | string | no | Relative path under `assets/images/`. |
| `image` | string | no | Relative path under `assets/images/`. |
| `imageAlt` | string | no | Hebrew alt text for `image`. Logo alt defaults to the business name. |
| `category` | string | yes | Primary category (exactly one). |
| `secondaryCategories` | string[] | no | Zero or more. |
| `categoryReview` | object | no | `{ "needsReview": true, "note": "..." }` for ambiguous classifications. |
| `expirationDate` | string | yes | ISO `YYYY-MM-DD`; displayed as `DD.MM.YYYY`. |
| `phone` | string | no | Contact phone. |
| `website` | string | no | Full `https://` URL. |
| `whatsappGroupUrl` | string | no | Valid WhatsApp link (`https://chat.whatsapp.com/...` or `https://wa.me/...`); button shown only if present and valid. |
| `terms` | string | no | Section shown only if present. |
| `offerDetails` | string | no | Additional information about the offer (the form's "מידע נוסף על השובר / ההטבה"), shown in the modal under the photo. Not rendered when missing or empty. |
| `redemptionLocation` | string | no | Where the voucher can be redeemed. Shown in the modal after the terms, as a bold label "מקום המימוש:" on its own line with the location on the next line. Not rendered when missing. |
| `published` | boolean | yes | Only `true` vouchers appear. |
| `publishedAt` | string | no | ISO date, informational / for future import. |
| `isDemo` | boolean | yes | `true` for fictional placeholder data. |

There is **no** `soldOut` field and no inventory management.

### 8.3 Visibility rules

A voucher is shown publicly only if `published` is `true` **and** it is not expired. Vouchers remain valid **through the end of their `expirationDate` in Israel time** (`Asia/Jerusalem`). Expired records **stay in the data file**; they are only excluded from the listing and from the filter options.

### 8.4 Images and fallbacks

- Local images are in `assets/images/`, referenced by **relative** paths (GitHub Pages compatible), with ASCII filenames (e.g. `b-001-logo.png`) and web-optimized sizes.
- Missing logo or image: a neutral placeholder (or omitted section) — layout never breaks.
- Missing phone/website/WhatsApp/terms: that button or section is not rendered. No empty elements, dead links or "undefined" text.
- The description is required for the modal; a voucher with no description is not published.
- Only the user's actual supplied images are used for real businesses. No AI-generated images and no stock placeholders in place of real assets.

### 8.5 Demo and real data

- Fictional vouchers carry `isDemo: true` and a visible **"דוגמה"** label on the card and in the modal. Use obviously fake names (e.g. "עסק לדוגמה"), `example.com` URLs and invalid phone numbers.
- Real vouchers have `isDemo: false` and are never labeled as demo.
- Real business details are never invented. Only approved, published vouchers appear as real offers.

### 8.6 Real voucher: אבי שף הבית (final)

| Field | Value |
|---|---|
| `businessName` | אבי שף הבית |
| `category` | קולינריה (no secondary categories; no review needed) |
| `voucherValue` | 100 |
| `discountedPrice` | 50 |
| `quantity` | 3 |
| `originalValue` | not specified (field omitted) |
| `expirationDate` | 2027-02-28 (displayed 28.02.2027) |
| `website` | https://www.aviprivatechef.com |
| `whatsappGroupUrl` | https://chat.whatsapp.com/INzEPXYWQHU2GMhKLcxyjh |
| `logo` | the user's actual logo file (see 8.7) |
| `image` | the user's actual business photo (see 8.7) |
| `phone` | 054-456-4602 (verified). Displayed in the details view as a clickable link: `tel:0544564602`. |
| `terms` | not supplied; omitted. Nothing is invented. |
| `isDemo` | `false` |
| `published` | `true` (approved real offer) |

Offer, exact Hebrew wording on the front of the voucher:
- **שובר לקנייה חופשית בשווי 100 ₪**
- **מחיר השובר: 50 ₪ בלבד**

The customer pays 50 ₪ and receives 100 ₪ to spend freely on the business's available menus. The 100 ₪ is the actual voucher value and is never struck through. It must be immediately clear that the customer receives 100 ₪ of purchasing value for 50 ₪.

Full description, exact text, to be stored and displayed **without rewriting**:

> "אבי שף הבית" מזמין אתכם ליהנות מפופ-אפים מיוחדים במרפסת השף, עם מנות ייחודיות בעבודת יד. בין הפופ-אפים תוכלו למצוא גם את "הר בורגר" - המבורגריית הבוטיק על ההר.
>
> בנוסף, תוכלו ליהנות מחבילות אוכל ביתי וטעים במשלוח עד הבית, באמצע השבוע ובימי שישי.
>
> השובר ניתן למימוש בכל תפריטי העסק, לבחירתכם.

(This replaces the earlier wording. It has three paragraphs. When stored in JSON, the inner double quotes are escaped and paragraphs are separated by `
`; the modal shows each as its own paragraph and the text is unchanged.)

The details modal shows a WhatsApp button labeled **הצטרפו לקבוצת העדכונים השקטה** next to the website button.

All references to the earlier 75/150 and 100/200 offers are removed from the documentation and must not appear in data or code.

### 8.7 Avi Chef image assets (located)

The user placed two files directly in the project root. Both were found and viewed; neither has been renamed, moved, deleted or modified.

| Role | Exact filename | Path (relative to project root) | Format / size |
|---|---|---|---|
| Logo | `לוגו אבי שף הבית.png` | `./לוגו אבי שף הבית.png` | PNG, 2000×2000 px, ~163 KB. Green badge with a white cooking-pot icon and the business name. |
| Selected business photo | `קולאז אבי שף הבית.jpg` | `./קולאז אבי שף הבית.jpg` | JPEG, 2048×1365 px, ~432 KB. Collage of eight photos: burgers, churros, the chef cooking on the terrace, and a pop-up event. |

Rules for using them:
- The originals stay exactly where and as they are unless the user approves otherwise.
- **Approved:** the website references **optimized ASCII-named copies** under `assets/images/`, named after the business ID: `assets/images/b-001-logo.png` and `assets/images/b-001-photo.jpg` (Avi Chef is business `b-001`). Copies are web-sized with good visual quality and mobile-friendly file sizes. They were prepared in Stage A.
- The original Hebrew-named files remain completely unchanged and are excluded from Git via `.gitignore`. Only the optimized copies are committed.
- Approved alt text for the photo: "קולאז' של מנות ושל השף אבי בפעולה" (verified against the actual image: burgers, churros, the chef cooking and a pop-up event).

## 9. Categories and filtering

- The filter UI is generated automatically from categories present in the eligible (published, non-expired) voucher data. Nothing is hard-coded.
- The first option is **"הכול"** (default, shows everything).
- Use **"קולינריה"**, never "אוכל".
- Each voucher has one primary category and optional secondary categories. Filtering matches **primary or secondary**.
- During development, and in future data imports, Claude infers categories from the business name, business description and voucher offer:
  - The category list is not fixed. Reuse an existing category whenever appropriate.
  - Suggest a new broad, intuitive category only when needed (e.g. yoga → "גוף ונפש" or another suitable broad category). Avoid duplicates and overly specific categories.
  - Starting examples: קולינריה, גוף ונפש, השכלה, טכנולוגיה, לעסקים, סדנאות ופנאי.
  - Ambiguous cases get `categoryReview.needsReview = true` and are reported for manual review.
- The filter is shown even when only one category exists ("הכול" plus that category) and hidden when there are no categories. Selecting the already active option does not re-render the cards.
- Filter controls are keyboard accessible, expose the active state (`aria-pressed`), and show a Hebrew empty-state message if nothing matches.
- **No live AI calls or live AI classification on the public website.** Categories are fixed in the data at authoring/import time.

## 9.0 Voucher order

- The eligible vouchers are shuffled **once per page load** (`js/shuffle.js`); the order stays fixed during the visit, so search, category filters and the modal preserve the relative order and "הכול" restores the same order. Cards of a business with several voucher types are spread out as evenly as practical. One card per voucher regardless of `quantity`. No shuffle button, animation or dependency; `data/vouchers.json` keeps its original order.

## 9.0 Voucher search

- A search field with the placeholder **חפשו עסק, מוצר או שירות** sits directly above the category filter. It filters as the visitor types (no Enter), matches the **business name, the offer text (`offer`), `offerDetails` and the business `description`**, supports partial matches, and ignores case, Hebrew points and extra spaces around or inside the query. A clear (X) button appears when the field has text (Escape also clears it).
- Search and category apply **together**: a voucher is shown only if it matches the selected category **and** any of those fields matches the query. Changing the category keeps the query, and clearing the query keeps the category.
- When nothing matches the query, the message **לא נמצאו שוברים התואמים לחיפוש** is shown. With no eligible vouchers at all, the field is hidden and the existing "אין כרגע שוברים להצגה." message remains.
- The search never changes the countdown or the donation totals, which always use all eligible vouchers.

## 9.1 Event countdown and donation totals

**Countdown** (in the header, below the gold heart divider and above the date/time/location row; no heading):
- Counts down to **27.11.2026, 15:00 Israel time** (`Asia/Jerusalem`) and shows days, hours, minutes and seconds (`ימים`, `שעות`, `דקות`, `שניות`) in one row inside an elegant cream-and-gold frame with large numbers. Visual order, left to right, on every screen size: days, hours, minutes, seconds. The start instant is derived from the Israel wall-clock time with `Intl`, so daylight saving time is never hard-coded. It updates every second while the page is open.
- Seconds round up, so values are never negative. When the time is reached the whole countdown is replaced by: **היריד התחיל! מחכים לכם ברחבת המועדון ❤️**

**Totals** (directly above the category filter, two counters side by side, no heading):
- **עסקים שתרמו ❤️** = number of unique `businessId` values among the eligible vouchers.
- **שוברים שנתרמו 🎁** = sum of `quantity` across the eligible vouchers (a voucher with `quantity: 3` adds 3). A voucher without a valid `quantity` adds 0 to this total (its business is still counted).
- "Eligible" means the same list the site shows (published, valid, not expired). Totals are computed from the data, never hard-coded, and do not change with the category filter. The section is hidden when there are no eligible vouchers.
- Numbers count up from 0 once, when the section is first fully in view and the page is visible (a fixed duration of about 1 second regardless of the totals, with values computed from the animation progress and ease-in-out so small totals still step visibly, plus a brief settle pulse at the end). The animation clock starts on the first painted frame, so a hidden or throttled page never skips to the end. With `prefers-reduced-motion` the final values show immediately.

## 10. Website WhatsApp sharing and Open Graph

- A visible site-level button **"שתפו בוואטסאפ"** opens WhatsApp (`https://wa.me/?text=...`, URL-encoded) with a prepared Hebrew message plus the actual website URL (taken from the page at click time, so no URL is invented). The message wording is proposed at implementation and approved by the user. This button only shares the website; it is unrelated to business WhatsApp group links.
- Open Graph and Twitter Card metadata (`summary_large_image`) are set in `index.html`: `og:title`, `og:description`, `og:image` (+ type, width, height, alt), `og:url`, `og:type`, `og:locale` (`he_IL`), `og:site_name`, and a canonical link.
- Plan a dedicated **1200×630** social preview image, stored locally in the project (`assets/images/og-preview.jpg`, 1200×630, ~130 KB), featuring: the website title, the subtitle "כל ההכנסות לתרומה", festive bunting, the fair date and location, and the same visual identity as the site.
- `og:url`, `og:image` and the canonical link use the absolute public URL `https://good-deeds-salit.github.io/vouchers/` (required by most crawlers).

## 11. Git workflow (training project)

| Stage | Branch | Scope |
|---|---|---|
| A | `main` | Initial structure; branding, compact header (title, subtitle, intro, date, time, location, booth notice), festive bunting and basic layout, share button, OG metadata, README with local server instructions. **No voucher cards.** |
| B | `feature/vouchers` | Voucher cards, structured voucher data, image support and accessible details modal. Own Pull Request. |
| C | `feature/category-filter` | Dynamic category filtering. Own Pull Request. |

Rules:
- The **initial commit on `main` is approved.**
- **Creating the public GitHub repository, every push to GitHub (including the first push to `main`), merging any Pull Request and deleting any branch all require explicit approval.**
- Each feature branch has its own Pull Request, which the user reviews before merging.
- **Feature branches are never deleted after merging** — they are needed to demonstrate the Git workflow for the user's course.
- Public repository and free GitHub Pages hosting are planned.

## 12. Planned structure (proposal — to be approved)

```
good-deeds-vouchers/
├─ index.html
├─ css/        (base, layout, bunting, voucher, modal styles)
├─ js/         (data loading, rendering, modal, share, filter)
├─ data/vouchers.json
├─ assets/images/   (web-ready images incl. og-preview image)
├─ לוגו אבי שף הבית.png      (user's original, untouched)
├─ קולאז אבי שף הבית.jpg     (user's original, untouched)
├─ SPEC.md
├─ practice.md
└─ README.md   (how to run locally with a free dev server)
```

## 13. Future expansion — NOT to be implemented now

The initial architecture stays compatible with, but does not implement:

- Businesses upload logos and photos to Google Drive, possibly with Hebrew filenames.
- Associating files with businesses via unique `businessId`.
- Matching by Hebrew business names and filenames.
- Identifying logos versus business photos.
- Flagging ambiguous matches for manual review and approval.
- Storing confirmed Google Drive file IDs.
- Preserving the original uploaded files.
- Publishing only approved vouchers and images (hence `published`).
- Using optimized local website images instead of direct Google Drive image links.
- Future Google Sheets integration for business and voucher data. Business IDs and voucher IDs are distinct identifiers, and the import must support multiple vouchers belonging to the same business.
- Google Sheets column **"כמות שוברים"** maps to the `quantity` field (informational number only).
- AI-assisted category inference during import (offline only, never on the public site).

Compatibility for now: stable `businessId`, `published` flag, `schemaVersion`, path-based image fields fillable by an import script, and no assumption of a fixed category list. A future `driveFileIds` field may be added later with approval; not now.

## 14. Acceptance criteria per stage

**Stage A:** loads at mobile and desktop widths; RTL correct; header texts exact and in the specified order (title, subtitle, intro, date, time, location); exact booth notice present; bunting rendered; compact header on mobile; share button works; OG metadata present with placeholder URLs; the 1200×630 social preview image is a separate follow-up task (not part of the first Stage A commit) and must exist before deployment; README with local server instructions; no console errors; no horizontal scroll at 320px; no voucher cards.

**Stage B:** scroll reveal per section 6.2 works (once per card, reduced-motion respected, cards visible without JS/IntersectionObserver); published, non-expired vouchers render from JSON as compact previews (two columns on mobile); preview shows name, offer, voucher value, price, and strikethrough only for a genuine `originalValue`; no "שובר מתנה" text; modal opens by mouse, touch and keyboard, closes by close button and Escape, manages focus, scrolls as one area; links work independently; demo vouchers labeled "דוגמה"; missing fields use fallbacks; expired vouchers excluded (record kept); the Avi voucher shows the exact wording (100 ₪ value, 50 ₪ price), uses the actual logo and photo, has the verbatim description, the phone link (`tel:0544564602`), the website button and the "הצטרפו לקבוצת העדכונים השקטה" button, and is not marked demo; no 75/150 or 100/200 references anywhere; reduced motion respected; no horizontal scroll at 320px.

**Stage C:** filter built from data including "הכול"; no hard-coded categories; primary and secondary matching; accessible; empty state; ambiguous categories reported for manual review.
