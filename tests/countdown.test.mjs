// Regression tests for the fair countdown (js/countdown.js). No dependencies: run `node --test tests/` (Node 20.11 or newer).
// The page is simulated with a tiny fake DOM and mocked time, so the tests are fast and deterministic.
import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const countdownUrl = pathToFileURL(path.join(root, "js", "countdown.js")).href;
const { FAIR_START_UTC, getRemaining, initCountdown } = await import(countdownUrl);

const START = Date.UTC(2026, 10, 27, 13, 0, 0); // 27.11.2026 15:00 in Israel (UTC+2 in November)

/* ---------- minimal fake page ---------- */
function makeElement(tag = "p") {
  return {
    tagName: tag, className: "", textContent: "", hidden: true, children: [], isConnected: true, removed: false,
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; },
    remove() { this.isConnected = false; this.removed = true; },
  };
}
let created, listeners, store, storageBroken;
function installPage() {
  created = []; listeners = {}; store = {}; storageBroken = false;
  globalThis.document = {
    hidden: false,
    createElement(tag) { const el = makeElement(tag); created.push(el); return el; },
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    removeEventListener(type, fn) { listeners[type] = (listeners[type] || []).filter((f) => f !== fn); },
  };
  globalThis.localStorage = {
    getItem(k) { if (storageBroken) throw new Error("blocked"); return k in store ? store[k] : null; },
    setItem(k, v) { if (storageBroken) throw new Error("blocked"); store[k] = String(v); },
  };
}
const allText = () => created.map((el) => el.textContent).join("|");
const numbers = (container) => container.children.slice(1).map((unit) => unit.children[0].textContent); // [days, hours, minutes, seconds]

beforeEach(installPage);
afterEach(() => { mock.timers.reset(); delete globalThis.document; delete globalThis.localStorage; });

/* ---------- the target ---------- */
test("the countdown target is 27.11.2026 at 15:00 Israel time (13:00 UTC), on any machine time zone", () => {
  assert.equal(FAIR_START_UTC, START);
  assert.equal(new Date(START).toISOString(), "2026-11-27T13:00:00.000Z");
  const israel = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", dateStyle: "short", timeStyle: "medium", hourCycle: "h23" }).format(START);
  assert.equal(israel, "27/11/2026, 15:00:00");
  for (const tz of ["UTC", "America/New_York", "Pacific/Kiritimati", "Asia/Jerusalem"]) {
    const out = spawnSync(process.execPath, ["--input-type=module", "-e", `import(${JSON.stringify("file:///" + path.join(root, "js", "countdown.js").replace(/\\/g, "/"))}).then(m => console.log(m.FAIR_START_UTC))`], { env: { ...process.env, TZ: tz }, encoding: "utf8" });
    assert.equal(out.stdout.trim(), String(START), `target differs when the machine time zone is ${tz}`);
  }
});

test("getRemaining counts down to the target and is null at and after it", () => {
  assert.deepEqual({ ...getRemaining(START - 3 * 86400000 - 4 * 3600000 - 5 * 60000 - 6000), nextChangeMs: 0, final: false }, { days: 3, hours: 4, minutes: 5, seconds: 6, nextChangeMs: 0, final: false });
  assert.equal(getRemaining(START - 1).seconds, 1); assert.equal(getRemaining(START - 1).final, true);
  assert.equal(getRemaining(START), null);
  assert.equal(getRemaining(START + 1), null);
  assert.equal(getRemaining(START + 365 * 86400000), null);
});

/* ---------- running page ---------- */
test("while the fair has not started the countdown is visible and ticks", () => {
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START - 5000 });
  const el = makeElement(); initCountdown(el);
  assert.equal(el.isConnected, true); assert.equal(el.hidden, false); assert.equal(el.className, "countdown");
  assert.deepEqual(numbers(el), ["00", "00", "00", "05"]);
  mock.timers.tick(1020); assert.deepEqual(numbers(el), ["00", "00", "00", "04"]);   // the tick fires 20 ms after the boundary
  mock.timers.tick(2000); assert.deepEqual(numbers(el), ["00", "00", "00", "02"]);
  assert.equal(el.isConnected, true); assert.equal(store["gdv-countdown-over"], undefined, "nothing is remembered before the end");
});

test("at the exact start time an open page removes the whole countdown: no message, no replacement, nothing left", () => {
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START - 2500 });
  const el = makeElement(); initCountdown(el);
  assert.equal(el.isConnected, true);
  mock.timers.tick(2499); assert.equal(el.isConnected, true, "still there 1 ms before the start"); assert.deepEqual(numbers(el), ["00", "00", "00", "01"]);
  mock.timers.tick(1); assert.equal(Date.now(), START);
  assert.equal(el.isConnected, false, "removed at the exact start instant"); assert.equal(el.removed, true);
  assert.ok(!allText().includes("היריד התחיל"), "no replacement text"); assert.ok(!/מחכים לכם/.test(allText()));
  assert.equal(created.some((c) => c !== el && c.isConnected && /countdown/.test(c.className) && c.tagName === "p"), false, "no placeholder element was created");
  assert.equal(store["gdv-countdown-over"], "1", "remembered for later visits");
  assert.equal((listeners.visibilitychange || []).length, 0, "no leftover listener");
  mock.timers.tick(60000); assert.equal(el.isConnected, false);                    // and nothing brings it back
});

test("a tab whose timers were throttled in the background removes it as soon as it becomes visible", () => {
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START - 10000 });
  const el = makeElement(); initCountdown(el);
  assert.equal((listeners.visibilitychange || []).length, 1);
  mock.timers.setTime(START + 3000);                                                // the clock moved on, the throttled timer did not run
  document.hidden = true; listeners.visibilitychange.forEach((f) => f()); assert.equal(el.isConnected, true, "a hidden tab does nothing");
  document.hidden = false; listeners.visibilitychange.forEach((f) => f());
  assert.equal(el.isConnected, false); assert.equal(store["gdv-countdown-over"], "1"); assert.equal((listeners.visibilitychange || []).length, 0);
});

/* ---------- later visits ---------- */
test("opening the page after the start never shows the countdown (not even for a moment) and schedules nothing", () => {
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START + 1 });
  const el = makeElement(); initCountdown(el);
  assert.equal(el.isConnected, false); assert.equal(el.hidden, true, "never unhidden"); assert.equal(el.children.length, 0, "never filled");
  assert.equal(created.length, 0, "no countdown parts were built"); assert.equal(store["gdv-countdown-over"], "1");
  assert.equal((listeners.visibilitychange || []).length, 0);
  mock.timers.tick(10 * 60 * 1000);                                                 // no timer is pending
  assert.equal(el.isConnected, false);
});

test("once it has ended the countdown stays hidden on every later visit, even if the device clock is wrong (set back)", () => {
  store["gdv-countdown-over"] = "1";
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START - 30 * 86400000 });   // a clock one month early
  const el = makeElement(); initCountdown(el);
  assert.equal(el.isConnected, false); assert.equal(el.hidden, true); assert.equal(created.length, 0);
});

test("with storage blocked (private mode) the clock alone still hides it after the start, and the countdown still works before", () => {
  storageBroken = true;
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: START - 2000 });
  const before = makeElement(); initCountdown(before); assert.equal(before.isConnected, true);
  mock.timers.tick(2000); assert.equal(before.isConnected, false, "removed without storage");
  const later = makeElement(); initCountdown(later); assert.equal(later.isConnected, false);
});

/* ---------- the page itself ---------- */
test("the page has exactly one countdown element, empty and hidden until the script shows it; the old 'started' message and style are gone", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  assert.equal((html.match(/id="countdown"/g) || []).length, 1);
  assert.match(html, /<p class="countdown" id="countdown" hidden><\/p>/, "a lone, hidden, empty element: nothing else belongs to the countdown");
  for (const dir of ["js", "css"]) for (const f of readdirSync(path.join(root, dir))) {
    const text = readFileSync(path.join(root, dir, f), "utf8");
    assert.ok(!text.includes("היריד התחיל"), `${dir}/${f} still has the start message`);
    assert.ok(!text.includes("countdown--started"), `${dir}/${f} still has the started style`);
  }
  assert.ok(!html.includes("היריד התחיל"));
});

test("removing the countdown leaves no gap behind: all of its spacing belongs to the element itself (no sibling rules depend on it)", () => {
  const css = readFileSync(path.join(root, "css", "counters.css"), "utf8") + readdirSync(path.join(root, "css")).map((f) => readFileSync(path.join(root, "css", f), "utf8")).join("\n");
  assert.ok(!/\.countdown\s*[+~]/.test(css) && !/[+~]\s*\.countdown/.test(css) && !/#countdown\s*[+~]/.test(css) && !/[+~]\s*#countdown/.test(css), "a sibling selector depends on the countdown");
  assert.match(css, /\.countdown\s*\{[^}]*margin:\s*0\.7rem auto 0;/, "the margin is on the countdown element");
});
