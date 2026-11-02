// Builds the compact voucher previews from voucher data. Uses DOM APIs and textContent only.
import { el } from "./dom.js";
import { formatShekel } from "./format.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// Small decorative gift bow, shown on top of the ribbon.
function createBow() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "voucher-card__bow");
  svg.setAttribute("viewBox", "0 0 40 28");
  svg.setAttribute("aria-hidden", "true");
  const shapes = [
    "M20 18C8 23 1 12 8 5C14 0 19 9 20 18Z",
    "M20 18C32 23 39 12 32 5C26 0 21 9 20 18Z",
    "M17 17h6l1.5 9h-9z",
  ];
  for (const d of shapes) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}

export function createVoucherCard(voucher, onOpen) {
  const card = el("button", "voucher-card");
  card.type = "button";
  card.setAttribute("aria-haspopup", "dialog");
  card.dataset.voucherId = voucher.id;

  const ribbon = el("span", "voucher-card__ribbon");
  ribbon.setAttribute("aria-hidden", "true");
  card.append(ribbon, createBow());

  card.append(el("span", "voucher-card__name", voucher.businessName));
  card.append(el("span", "voucher-card__offer", voucher.offer));

  // What the buyer pays. Only a genuine originalValue is ever struck through.
  const price = el("span", "voucher-card__price");
  price.append("מחיר השובר: ", el("strong", "", formatShekel(voucher.discountedPrice)), " בלבד");
  card.append(price);

  if (typeof voucher.originalValue === "number") {
    const original = el("span", "voucher-card__original");
    original.append("מחיר רגיל: ", el("del", "", formatShekel(voucher.originalValue)));
    card.append(original);
  }

  if (voucher.isDemo) card.append(el("span", "demo-badge", "דוגמה"));

  card.addEventListener("click", () => onOpen(voucher, card));
  return card;
}

export function renderVouchers(container, vouchers, onOpen) {
  container.replaceChildren();
  if (vouchers.length === 0) {
    container.append(el("p", "voucher-grid__message", "אין כרגע שוברים להצגה."));
    return [];
  }
  const cards = vouchers.map((voucher) => createVoucherCard(voucher, onOpen));
  container.append(...cards);
  return cards;
}

export function renderLoadError(container) {
  container.replaceChildren(
    el("p", "voucher-grid__message", "לא הצלחנו לטעון את השוברים כרגע. נסו לרענן את הדף."),
  );
}
