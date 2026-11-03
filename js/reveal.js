// Scroll reveal: cards fade in with a subtle upward movement the first time they enter the viewport.
// If IntersectionObserver is unavailable or the visitor prefers reduced motion, cards simply stay visible.
const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 4;

// Returns a function that stops observing (used before the cards are replaced, e.g. by the category filter).
export function initScrollReveal(cards) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reducedMotion || cards.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((entry) => entry.isIntersecting);
      entering.forEach((entry, index) => {
        // Small stagger between neighbouring cards that appear together.
        entry.target.style.transitionDelay = `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
        const card = entry.target;
        card.classList.add("is-revealed");
        observer.unobserve(card); // each card is revealed only once
        // Once the animation ends, drop the helper classes so normal hover styles apply again.
        card.addEventListener(
          "transitionend",
          () => {
            card.classList.remove("reveal-pending", "is-revealed");
            card.style.transitionDelay = "";
          },
          { once: true },
        );
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
  );

  // The hidden starting state is applied only here, once the observer is known to work.
  for (const card of cards) {
    card.classList.add("reveal-pending");
    observer.observe(card);
  }
  return () => observer.disconnect();
}
