import { initShareButton } from "./share.js";
import { loadVouchers, getVisibleVouchers } from "./data.js";
import { renderVouchers, renderLoadError } from "./render.js";
import { initModal, openVoucher } from "./modal.js";
import { initScrollReveal } from "./reveal.js";
import { initCategoryFilter, matchesCategory } from "./filter.js";
import { initCountdown } from "./countdown.js";
import { initStats } from "./stats.js";

initShareButton(document.getElementById("share-button"));
initCountdown(document.getElementById("countdown"));

const grid = document.getElementById("voucher-grid");
const filterNav = document.getElementById("category-filter");
const statsSection = document.getElementById("stats");

initModal();

async function init() {
  try {
    const vouchers = getVisibleVouchers(await loadVouchers());
    let stopReveal = () => {};

    const show = (category) => {
      stopReveal();
      const matching = vouchers.filter((voucher) => matchesCategory(voucher, category));
      const emptyMessage = category === null ? undefined : "לא נמצאו שוברים בקטגוריה הזו.";
      stopReveal = initScrollReveal(renderVouchers(grid, matching, openVoucher, emptyMessage));
    };

    initStats(statsSection, vouchers); // totals use all eligible vouchers, independent of the filter
    show(null);
    initCategoryFilter(filterNav, vouchers, show);
  } catch (error) {
    console.error(error);
    filterNav.hidden = true;
    statsSection.hidden = true;
    renderLoadError(grid);
  }
}

init();
