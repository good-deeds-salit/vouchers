// Countdown to the fair: days, hours, minutes and seconds, computed in Israel time.
const TIME_ZONE = "Asia/Jerusalem";
const FAIR_START = { year: 2026, month: 11, day: 27, hour: 15, minute: 0 }; // wall-clock time in Israel
const STARTED_MESSAGE = "היריד התחיל! מחכים לכם ברחבת המועדון ❤️";
const SECOND_MS = 1000;

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
// and "0 seconds" only appears together with the start message. Returns null once the fair has started.
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

  function render() {
    clearTimeout(timer);
    const remaining = getRemaining();
    if (remaining === null) {
      numbers = null;
      container.className = "countdown countdown--started";
      container.replaceChildren(STARTED_MESSAGE);
      return;
    }
    if (numbers === null) build();
    const values = [remaining.days, remaining.hours, remaining.minutes, remaining.seconds];
    numbers.forEach((number, index) => {
      const text = pad(values[index]);
      if (number.textContent !== text) number.textContent = text;
    });
    timer = setTimeout(render, remaining.nextChangeMs + 20);
  }

  render();
  container.hidden = false;
  // Background tabs throttle timers, so refresh as soon as the page is visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) render();
  });
}
