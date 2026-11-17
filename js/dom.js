// Tiny DOM helpers shared by the rendering code. Data is always inserted with textContent.
const SVG_NS = "http://www.w3.org/2000/svg";

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A business name may contain a line break in the data (e.g. a profession on its own second line). Each line is shown
// on its own line; a name without a line break is a plain text node, exactly as before.
export function nameElement(tag, className, name) {
  const lines = name.split("\n").map((line) => line.trim()).filter((line) => line !== "");
  if (lines.length < 2) return el(tag, className, name);
  const node = el(tag, className);
  for (const line of lines) node.append(el("span", "offer-line", line));
  return node;
}

// The name on a single line, for alt texts and running headings.
export function plainName(name) {
  return name.split("\n").map((line) => line.trim()).filter((line) => line !== "").join(" – ");
}

// Decorative inline icon from a single 24x24 path.
export function icon(pathData, className = "icon") {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathData);
  svg.append(path);
  return svg;
}
