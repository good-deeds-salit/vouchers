// Builds the compact voucher previews from voucher data. Uses DOM APIs and textContent only.
import { el } from "./dom.js";
import { createOfferBlock } from "./offer.js";

export function createVoucherCard(voucher, onOpen) {
  const card = el("button", "voucher-card");
  card.type = "button";
  card.setAttribute("aria-haspopup", "dialog");
  card.dataset.voucherId = voucher.id;

  // Decorative gift-wrap ribbons and bow sit behind the text.
  for (const className of [
    "voucher-card__ribbon voucher-card__ribbon--vertical",
    "voucher-card__ribbon voucher-card__ribbon--horizontal",
    "voucher-card__bow",
  ]) {
    const layer = el("span", className);
    layer.setAttribute("aria-hidden", "true");
    card.append(layer);
  }

  const content = el("span", "voucher-card__content");
  content.append(el("span", "voucher-card__name", voucher.businessName), ...createOfferBlock(voucher, "voucher-card"));
  if (voucher.isDemo) content.append(el("span", "demo-badge", "דוגמה"));

  card.append(content);
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
