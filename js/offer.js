// Shared offer/price block used by the voucher preview and the details modal.
// Everything comes from the voucher data: the offer text, voucherValue and discountedPrice.
import { el } from "./dom.js";
import { formatShekel } from "./format.js";

const AMOUNT = /\d[\d,.]*\s?(?:₪|ש["״]ח)/; // the shekel amount written inside the offer text, e.g. "100 ₪" or "100 ש״ח"

// The lead text; a hyphenated word such as "פופ-אפ" is wrapped in a non-wrapping span so it never splits across lines.
// The visible text is unchanged and wrapping stays normal everywhere else.
const HYPHENATED = /[\p{L}\d]+-[\p{L}\d]+/gu;
function leadNode(text, className) {
  const node = el("span", className);
  let last = 0;
  for (const match of text.matchAll(HYPHENATED)) {
    if (match.index > last) node.append(text.slice(last, match.index));
    node.append(el("span", "nowrap", match[0]));
    last = match.index + match[0].length;
  }
  if (last < text.length) node.append(text.slice(last));
  return node;
}

// Splits the offer text around its amount: the descriptive lead and an optional tail.
// The amount itself is shown separately and large, from voucherValue.
export function splitOffer(offerText) {
  const match = AMOUNT.exec(offerText);
  if (!match) return { lead: offerText.trim(), tail: "" };
  return {
    lead: offerText.slice(0, match.index).trim(),
    tail: offerText.slice(match.index + match[0].length).trim(),
  };
}

// Returns the nodes: description line(s), the large value received, the price paid and the optional quantity.
// `prefix` is the BEM block name of the caller (e.g. "voucher-card").
export function createOfferBlock(voucher, prefix) {
  const { lead, tail } = splitOffer(voucher.offer);
  const nodes = [];

  if (lead) nodes.push(leadNode(lead, `${prefix}__lead`));
  // An offer without its own amount (the original submitted wording) gets a small label so the value reads clearly.
  if (!AMOUNT.test(voucher.offer)) nodes.push(el("span", `${prefix}__lead`, "בשווי"));
  nodes.push(el("strong", `${prefix}__value`, formatShekel(voucher.voucherValue)));
  if (tail) nodes.push(el("span", `${prefix}__lead`, tail));

  // What the buyer pays. Only a genuine originalValue is ever struck through.
  const price = el("span", `${prefix}__price`);
  const line = el("span", `${prefix}__price-line`);
  line.append(
    el("strong", `${prefix}__price-amount`, formatShekel(voucher.discountedPrice)),
    el("span", `${prefix}__price-suffix`, "בלבד"),
  );
  price.append(el("span", `${prefix}__price-label`, "מחיר השובר:"), line);
  nodes.push(price);

  // Informational only (not live stock): shown when quantity is a positive whole number.
  if (Number.isInteger(voucher.quantity) && voucher.quantity > 0) {
    const quantity = el("span", `${prefix}__quantity`, "כמות שוברים: ");
    quantity.append(el("bdi", "", String(voucher.quantity)));
    nodes.push(quantity);
  }

  if (typeof voucher.originalValue === "number") {
    const original = el("span", `${prefix}__original`);
    original.append("מחיר רגיל: ", el("del", "", formatShekel(voucher.originalValue)));
    nodes.push(original);
  }
  return nodes;
}
