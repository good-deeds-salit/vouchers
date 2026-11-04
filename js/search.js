// Business-name search: filters as the visitor types. Only business names are searched.

// Lower-cases, drops Hebrew points (niqqud) and collapses whitespace, so matching ignores case and extra spaces.
export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFC")
    .replace(/[֑-ׇ]/g, "")
    .toLocaleLowerCase("he")
    .replace(/\s+/g, " ")
    .trim();
}

// An empty query matches every voucher; otherwise the business name must contain the query (partial match).
export function matchesBusinessName(voucher, query) {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery === "") return true;
  return normalizeText(voucher.businessName).includes(normalizedQuery);
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
