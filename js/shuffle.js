// Random display order, decided once per page load (the caller keeps the result for the whole visit).
// A new array is returned; the source data and data/vouchers.json are never touched.
// A business with several voucher types has its cards spread out among the other businesses: the k cards of a
// business get evenly spaced sort positions with a random offset, so they are not bunched together.

function shuffled(items, random) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleVouchers(vouchers, random = Math.random) {
  const groups = new Map();
  for (const voucher of vouchers) {
    if (!groups.has(voucher.businessId)) groups.set(voucher.businessId, []);
    groups.get(voucher.businessId).push(voucher);
  }
  const slots = [];
  for (const group of groups.values()) {
    const offset = random();
    shuffled(group, random).forEach((voucher, index) => {
      slots.push({ voucher, position: (index + offset) / group.length, tie: random() });
    });
  }
  slots.sort((a, b) => a.position - b.position || a.tie - b.tie);
  return slots.map((slot) => slot.voucher);
}
