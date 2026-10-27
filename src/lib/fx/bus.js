/**
 * Tiny shared channel between UI and canvas effects. `surge()` makes every
 * mounted background churn for a moment (used for screen transitions).
 */
export const fxBus = { surge: 0 };

let raf = 0;

/**
 * Kick the background: ramps fxBus.surge up quickly, then decays over `duration` ms.
 * No-op visual under reduced motion (the backgrounds render a still frame).
 * @param {number} [duration]
 */
export function surge(duration = 1100) {
  if (typeof requestAnimationFrame === 'undefined') return;
  cancelAnimationFrame(raf);
  const start = performance.now();
  const from = fxBus.surge;
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    // fast attack (first 18%), slow release
    const up = Math.min(1, t / 0.18);
    const down = t < 0.18 ? 1 : 1 - (t - 0.18) / 0.82;
    fxBus.surge = Math.max(from * (1 - up), up * down * down);
    if (t < 1) raf = requestAnimationFrame(step);
    else fxBus.surge = 0;
  };
  raf = requestAnimationFrame(step);
}
