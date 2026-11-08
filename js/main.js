import { initShareButton } from "./share.js";
import { loadVouchers, getVisibleVouchers } from "./data.js";
import { renderVouchers, renderLoadError } from "./render.js";
import { initModal, openVoucher } from "./modal.js";
import { initScrollReveal } from "./reveal.js";
import { initCategoryFilter, matchesCategory } from "./filter.js";
import { initSearch, matchesSearch, normalizeText } from "./search.js";
import { initCountdown } from "./countdown.js";
import { initStats } from "./stats.js";
import { shuffleVouchers } from "./shuffle.js";

initShareButton(document.getElementById("share-button"));
initCountdown(document.getElementById("countdown"));

const grid = document.getElementById("voucher-grid");
const filterNav = document.getElementById("category-filter");
const searchForm = document.getElementById("voucher-search");
const searchStatus = document.getElementById("search-status");
const statsSection = document.getElementById("stats");

const NO_SEARCH_RESULTS = "לא נמצאו שוברים התואמים לחיפוש";
const NO_CATEGORY_RESULTS = "לא נמצאו שוברים בקטגוריה הזו.";

initModal();

async function init() {
  try {
    // Random order, fixed for this page load: filtering and search only take subsets of this same array.
    const vouchers = shuffleVouchers(getVisibleVouchers(await loadVouchers()));
    // The category and the search query are kept together, so each one survives a change of the other.
    const state = { category: null, query: "" };
    let stopReveal = () => {};
    let shownKey = null;

    // `animate` is true for category changes (cards reveal as before) and false while typing (no flicker).
    const show = ({ animate, quiet = false }) => {
      const matching = vouchers.filter(
        (voucher) => matchesCategory(voucher, state.category) && matchesSearch(voucher, state.query),
      );
      const key = matching.map((voucher) => voucher.id).join("|");
      if (key === shownKey) return; // same result as already shown: leave the cards and animations alone
      shownKey = key;

      stopReveal();
      const searching = normalizeText(state.query) !== "";
      const emptyMessage = searching ? NO_SEARCH_RESULTS : state.category === null ? undefined : NO_CATEGORY_RESULTS;
      const cards = renderVouchers(grid, matching, openVoucher, emptyMessage);
      stopReveal = animate ? initScrollReveal(cards) : () => {};
      if (!quiet) searchStatus.textContent = matching.length === 0 ? (emptyMessage ?? "") : `נמצאו ${matching.length} שוברים`;
    };

    initStats(statsSection, vouchers); // totals use all eligible vouchers, independent of search and filter
    show({ animate: true, quiet: true }); // first render: nothing to announce
    if (vouchers.length > 0) {
      initSearch(searchForm, (query) => {
        state.query = query;
        show({ animate: false });
      });
    }
    initCategoryFilter(filterNav, vouchers, (category) => {
      state.category = category;
      show({ animate: true });
    });
  } catch (error) {
    console.error(error);
    filterNav.hidden = true;
    searchForm.hidden = true;
    statsSection.hidden = true;
    renderLoadError(grid);
  }
}

init();
