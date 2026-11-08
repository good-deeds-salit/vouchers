// Voucher search: filters as the visitor types. Searches the business name, the offer text, the additional offer
// information and the business description.

// Lower-cases, drops Hebrew points (niqqud) and collapses whitespace, so matching ignores case and extra spaces.
export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFC")
    .replace(/[֑-ׇ]/g, "")
    .toLocaleLowerCase("he")
    .replace(/\s+/g, " ")
    .trim();
}

const SEARCH_FIELDS = ["businessName", "offer", "offerDetails", "description"];

// An empty query matches every voucher; otherwise any searched field must contain the query (partial match).
export function matchesSearch(voucher, query) {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery === "") return true;
  return SEARCH_FIELDS.some((field) => normalizeText(voucher[field]).includes(normalizedQuery));
}

// Wires the search form. `onChange(query)` runs on every input change (no Enter needed) and after clearing.
export function initSearch(form, onChange) {
  const input = form.querySelector(".search__input");
  const clearButton = form.querySelector(".search__clear");

  function update() {
    clearButton.hidden = input.value === "";
    onChange(input.value);
  }

  function clear() {
    if (input.value === "") return;
    input.value = "";
    update();
    input.focus();
  }

  form.addEventListener("submit", (event) => event.preventDefault()); // Enter must not reload the page
  input.addEventListener("input", update);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") clear();
  });
  clearButton.addEventListener("click", clear);

  clearButton.hidden = input.value === "";
  form.hidden = false;
}
