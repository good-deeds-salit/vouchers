// Category filter: options are generated from the eligible voucher data. No category names are hard-coded.
import { el } from "./dom.js";

const ALL_LABEL = "הכול";

// Unique primary and secondary categories, in order of first appearance.
export function getCategories(vouchers) {
  const categories = new Set();
  for (const voucher of vouchers) {
    for (const category of [voucher.category, ...(voucher.secondaryCategories ?? [])]) {
      if (typeof category === "string" && category.trim() !== "") categories.add(category);
    }
  }
  return [...categories];
}

// `category === null` means "all". Otherwise a voucher matches by primary or secondary category.
export function matchesCategory(voucher, category) {
  if (category === null) return true;
  return voucher.category === category || (voucher.secondaryCategories ?? []).includes(category);
}

// Builds the toggle buttons ("הכול" first). `onSelect(category)` is called only when the choice changes.
export function initCategoryFilter(nav, vouchers, onSelect) {
  const categories = getCategories(vouchers);
  nav.replaceChildren();
  if (categories.length === 0) {
    nav.hidden = true;
    return;
  }

  let selected = null;
  const options = [[null, ALL_LABEL], ...categories.map((category) => [category, category])];
  const buttons = options.map(([category, label]) => {
    const button = el("button", "category-filter__button", label);
    button.type = "button";
    button.addEventListener("click", () => {
      if (category === selected) return; // already active: keep the cards as they are
      selected = category;
      for (const [other, otherButton] of buttons) otherButton.setAttribute("aria-pressed", String(other === selected));
      onSelect(selected);
    });
    button.setAttribute("aria-pressed", String(category === selected));
    return [category, button];
  });

  nav.append(...buttons.map(([, button]) => button));
  nav.hidden = false;
}
