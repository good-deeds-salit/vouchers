// Donation totals shown above the category filter: unique businesses and the total number of vouchers.
// Totals are computed from the eligible vouchers (the same list the site shows), so they never depend on the filter.
const COUNT_UP_MS = 1000; // fixed duration: never grows with the totals

export function calculateTotals(vouchers) {
  const businessIds = new Set(vouchers.map((voucher) => voucher.businessId));
  // `quantity` is informational; a voucher without a valid quantity adds nothing to the voucher total.
  const voucherCount = vouchers.reduce(
    (sum, voucher) => sum + (Number.isInteger(voucher.quantity) && voucher.quantity > 0 ? voucher.quantity : 0),
    0,
  );
  return { businesses: businessIds.size, vouchers: voucherCount };
}

function formatNumber(value) {
  return new Intl.NumberFormat("he-IL").format(value);
}

// Counts up from 0 to the target. The clock starts on the first frame that is actually painted, so a page that
// was hidden or throttled never skips straight to the end. Resolves when the final value is shown.
function countUp(numberEl, target) {
  return new Promise((resolve) => {
    let start = null;
    function frame(now) {
      if (start === null) start = now;
      const progress = Math.min((now - start) / COUNT_UP_MS, 1);
      // The value follows the progress, not a +1 step timer: big totals jump several units per frame and still
      // arrive on time. Ease-in-out keeps small totals (1, 2, 3...) spread over the animation.
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      numberEl.textContent = formatNumber(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

export function initStats(container, vouchers) {
  const totals = calculateTotals(vouchers);
  if (vouchers.length === 0) {
    container.hidden = true;
    return;
  }

  const numbers = [...container.querySelectorAll("[data-stat]")];
  for (const numberEl of numbers) {
    const final = formatNumber(totals[numberEl.dataset.stat]);
    numberEl.textContent = final;
    numberEl.dataset.digits = String(final.length); // lets the CSS shrink very large totals so they stay inside the card
    numberEl.parentElement.querySelector(".visually-hidden").textContent = final;
  }
  container.hidden = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  // Waiting state: zeros shown softly until the section is really in view.
  for (const numberEl of numbers) numberEl.textContent = formatNumber(0);
  container.classList.add("stats--waiting");

  let started = false;
  function run() {
    if (started) return;
    started = true; // the animation runs only once per page load
    observer.disconnect();
    container.classList.remove("stats--waiting");
    container.classList.add("stats--counting");
    Promise.all(numbers.map((numberEl) => countUp(numberEl, totals[numberEl.dataset.stat]))).then(() => {
      container.classList.remove("stats--counting");
      container.classList.add("stats--done"); // brief settle pulse
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      if (document.hidden) {
        // Never animate unseen: wait until the tab is visible again.
        document.addEventListener("visibilitychange", () => !document.hidden && run(), { once: true });
      } else {
        run();
      }
    },
    { threshold: 0.9 },
  );
  observer.observe(container);
}
