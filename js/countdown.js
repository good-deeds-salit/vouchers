// Countdown to the fair: days, hours, minutes and seconds, computed in Israel time.
// At the start time the whole countdown element is removed from the page (no message, no leftover space), even if the page
// is already open, and it stays gone on every later visit.
const TIME_ZONE = "Asia/Jerusalem";
const FAIR_START = { year: 2026, month: 11, day: 27, hour: 15, minute: 0 }; // wall-clock time in Israel (= 13:00 UTC, Israel is UTC+2 in November)
const SECOND_MS = 1000;
const OVER_KEY = "gdv-countdown-over"; // remembered so a device whose clock is wrong never shows the countdown again

function wasOver() {
  try {
    return localStorage.getItem(OVER_KEY) === "1";
  } catch {
    return false; // storage blocked (private mode): the clock alone decides
  }
}

function markOver() {
  try {
    localStorage.setItem(OVER_KEY, "1");
  } catch {
    // ignore: the clock still hides it on every later visit
  }
}

// Offset (ms) of the time zone from UTC at the given instant, so daylight saving time never needs hard-coding.
function zoneOffsetMs(instant, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(instant);
  const value = (type) => Number(parts.find((part) => part.type === type).value);
  const asUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
  return asUtc - Math.floor(instant / 1000) * 1000;
}

// The UTC instant at which the given Israel wall-clock time happens.
export function zonedTimeToUtc({ year, month, day, hour, minute }, timeZone = TIME_ZONE) {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - zoneOffsetMs(guess, timeZone);
  return guess - zoneOffsetMs(first, timeZone); // second pass handles offset changes near the guess
}

export const FAIR_START_UTC = zonedTimeToUtc(FAIR_START);

// Remaining time as whole days, hours, minutes and seconds. Seconds round up, so values are never negative
// and "0 seconds" is never shown. Returns null once the fair has started.
export function getRemaining(now = Date.now(), start = FAIR_START_UTC) {
  const remainingMs = start - now;
  if (remainingMs <= 0) return null;
  const totalSeconds = Math.ceil(remainingMs / SECOND_MS);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    // ms until the displayed second changes
    nextChangeMs: remainingMs - (totalSeconds - 1) * SECOND_MS,
    // true during the last second: the next change is the removal itself, so it is scheduled for the exact start instant
    final: totalSeconds === 1,
  };
}

const pad = (value) => String(value).padStart(2, "0");

function createUnit(label) {
  const unit = document.createElement("span");
  unit.className = "countdown__unit";
  const number = document.createElement("strong");
  number.className = "countdown__number";
  const text = document.createElement("span");
  text.className = "countdown__label";
  text.textContent = label;
  unit.append(number, text);
  return { unit, number };
}

export function initCountdown(container) {
  let timer = null;
  let numbers = null; // the four number elements while the countdown is running

  function build() {
    const hint = document.createElement("span");
    hint.className = "visually-hidden";
    hint.textContent = "עד תחילת היריד: ";
    const units = ["ימים", "שעות", "דקות", "שניות"].map(createUnit);
    container.className = "countdown";
    container.replaceChildren(hint, ...units.map((entry) => entry.unit));
    numbers = units.map((entry) => entry.number);
  }

  function onVisible() {
    if (!document.hidden) render();
  }

  function remove() {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
    markOver();
    container.remove(); // the whole section disappears: no replacement text, no empty space
  }

  function render() {
    clearTimeout(timer);
    const remaining = getRemaining();
    if (remaining === null) {
      remove();
      return;
    }
    if (numbers === null) build();
    const values = [remaining.days, remaining.hours, remaining.minutes, remaining.seconds];
    numbers.forEach((number, index) => {
      const text = pad(values[index]);
      if (number.textContent !== text) number.textContent = text;
    });
    // +20 ms keeps a tick from firing just before a second boundary; in the last second the timer is exact (render() runs again if it fires a hair early)
    timer = setTimeout(render, remaining.nextChangeMs + (remaining.final ? 0 : 20));
  }

  if (wasOver()) {
    container.remove(); // already ended on an earlier visit: never shown again
    return;
  }
  render();
  if (!container.isConnected) return; // it ended right now: nothing more to do
  container.hidden = false;
  // Background tabs throttle timers, so refresh as soon as the page is visible again.
  document.addEventListener("visibilitychange", onVisible);
}
