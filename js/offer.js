// Shared offer/price block used by the voucher preview and the details modal.
// Everything comes from the voucher data: the offer text, voucherValue and discountedPrice.
import { el } from "./dom.js";
import { formatShekel } from "./format.js";

const AMOUNT = /\d[\d,.]*\s?₪/; // the shekel amount written inside the offer text, e.g. "100 ₪"

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

  if (lead) nodes.push(el("span", `${prefix}__lead`, lead));
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
