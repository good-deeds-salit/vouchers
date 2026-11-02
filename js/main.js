import { initShareButton } from "./share.js";
import { loadVouchers, getVisibleVouchers } from "./data.js";
import { renderVouchers, renderLoadError } from "./render.js";

initShareButton(document.getElementById("share-button"));

const grid = document.getElementById("voucher-grid");

function openVoucher() {
  // The details modal is added in the next commit.
}

async function init() {
  try {
    const vouchers = getVisibleVouchers(await loadVouchers());
    renderVouchers(grid, vouchers, openVoucher);
  } catch (error) {
    console.error(error);
    renderLoadError(grid);
  }
}

init();

// Stage C (feature/category-filter) will build the category filter from the same data.
