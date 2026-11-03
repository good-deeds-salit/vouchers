// Accessible voucher details modal built on the native <dialog> element.
// showModal() makes the page behind inert, traps focus and closes on Escape.
import { el, icon } from "./dom.js";
import { formatDate, phoneHref } from "./format.js";
import { createOfferBlock } from "./offer.js";
import { isValidWhatsAppUrl, isValidWebsiteUrl } from "./data.js";

const ICONS = {
  whatsapp:
    "M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.3 14.96l-.31-.18-3.12.82.83-3.04-.2-.32A8.1 8.1 0 0 1 12.04 3.8zM8.6 7.5c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.06 3.3 5.1 4.5 2.52 1 3.03.8 3.58.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51z",
  globe:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 9h-3.1a15.7 15.7 0 0 0-1.4-6A8 8 0 0 1 18.9 11zM12 4c.9 1.2 1.6 3.4 1.8 7h-3.6C10.4 7.4 11.1 5.2 12 4zM4.1 13h3.1c.1 2.2.6 4.3 1.4 6A8 8 0 0 1 4.1 13zm3.1-2H4.1a8 8 0 0 1 4.5-6c-.8 1.7-1.3 3.8-1.4 6zM12 20c-.9-1.2-1.6-3.4-1.8-7h3.6c-.2 3.6-.9 5.8-1.8 7zm3.4-1c.8-1.7 1.3-3.8 1.4-6h3.1a8 8 0 0 1-4.5 6z",
  phone:
    "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z",
};

let dialog;
let body;
let lastTrigger = null;

function externalLink(className, href, iconPath, label) {
  const link = el("a", className);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.append(icon(iconPath), el("span", "", label));
  return link;
}

function buildHeader(voucher) {
  const header = el("div", "voucher-dialog__header");
  if (voucher.logo) {
    const logo = el("img", "voucher-dialog__logo");
    logo.src = voucher.logo;
    logo.alt = `לוגו ${voucher.businessName}`;
    logo.width = 64;
    logo.height = 64;
    logo.addEventListener("error", () => logo.remove());
    header.append(logo);
  }
  const title = el("h2", "voucher-dialog__title", voucher.businessName);
  title.id = "voucher-dialog-title";
  header.append(title);
  if (voucher.isDemo) header.append(el("span", "demo-badge", "דוגמה"));
  return header;
}

function buildOffer(voucher) {
  const box = el("div", "voucher-dialog__offer");
  box.append(...createOfferBlock(voucher, "voucher-dialog"));
  return box;
}

function buildPhoto(voucher) {
  if (!voucher.image) return null;
  const photo = el("img", "voucher-dialog__photo");
  photo.src = voucher.image;
  photo.alt = voucher.imageAlt ?? "";
  photo.decoding = "async";
  photo.addEventListener("error", () => photo.remove());
  return photo;
}

// The description keeps its paragraphs: each line break in the data becomes its own <p>.
function buildDescription(voucher) {
  const wrapper = el("div", "voucher-dialog__description");
  for (const paragraph of voucher.description.split(/\r?\n/)) {
    if (paragraph.trim() !== "") wrapper.append(el("p", "", paragraph));
  }
  return wrapper;
}

function buildDetails(voucher) {
  const list = el("dl", "voucher-dialog__details");
  list.append(el("dt", "", "תוקף עד"), el("dd", "", formatDate(voucher.expirationDate)));
  if (voucher.phone) {
    const phone = el("a", "voucher-dialog__phone");
    phone.href = phoneHref(voucher.phone);
    phone.dir = "ltr";
    phone.append(icon(ICONS.phone), el("span", "", voucher.phone));
    const value = el("dd");
    value.append(phone);
    list.append(el("dt", "", "טלפון"), value);
  }
  return list;
}

function buildTerms(voucher) {
  if (!voucher.terms) return null;
  const section = el("section", "voucher-dialog__terms");
  section.append(el("h3", "", "תנאי השובר"), el("p", "", voucher.terms));
  return section;
}

function buildActions(voucher) {
  const actions = [];
  if (isValidWebsiteUrl(voucher.website)) {
    actions.push(externalLink("action-button action-button--site", voucher.website, ICONS.globe, "לאתר העסק"));
  }
  if (isValidWhatsAppUrl(voucher.whatsappGroupUrl)) {
    actions.push(
      externalLink(
        "action-button action-button--whatsapp",
        voucher.whatsappGroupUrl,
        ICONS.whatsapp,
        "הצטרפו לקבוצת העדכונים השקטה",
      ),
    );
  }
  if (actions.length === 0) return null;
  const wrapper = el("div", "voucher-dialog__actions");
  wrapper.append(...actions);
  return wrapper;
}

export function openVoucher(voucher, trigger) {
  lastTrigger = trigger ?? null;
  const parts = [
    buildHeader(voucher),
    buildOffer(voucher),
    buildPhoto(voucher),
    buildDescription(voucher),
    buildDetails(voucher),
    buildTerms(voucher),
    buildActions(voucher),
  ].filter(Boolean);
  body.replaceChildren(...parts);
  dialog.scrollTop = 0;
  document.body.classList.add("modal-open");
  dialog.showModal();
}

export function initModal() {
  dialog = document.getElementById("voucher-dialog");
  body = document.getElementById("voucher-dialog-body");

  dialog.querySelector(".voucher-dialog__close").addEventListener("click", () => dialog.close());

  // Clicking the dimmed backdrop (outside the panel) closes the modal.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Runs for the close button, Escape and the backdrop alike.
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    lastTrigger = null;
  });
}
