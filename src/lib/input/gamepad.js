/**
 * Minimal gamepad polling that turns D-pad / left stick / face buttons into
 * menu intents. Only one listener loop runs no matter how many subscribers.
 *
 * Intents: 'up' | 'down' | 'left' | 'right' | 'confirm' | 'back'
 */

/** @type {Set<(intent: string) => void>} */
const listeners = new Set();
let raf = 0;
/** @type {Record<string, boolean>} */
let prev = {};

const REPEAT_DELAY = 380;
const REPEAT_RATE = 110;
/** @type {Record<string, number>} */
const nextRepeat = {};

function read(pad) {
  const b = (i) => !!pad.buttons[i]?.pressed;
  const ax = pad.axes[0] ?? 0;
  const ay = pad.axes[1] ?? 0;
  return {
    up: b(12) || ay < -0.5,
    down: b(13) || ay > 0.5,
    left: b(14) || ax < -0.5,
    right: b(15) || ax > 0.5,
    confirm: b(0),
    back: b(1),
  };
}

function tick(now) {
  const pads = navigator.getGamepads?.() ?? [];
  /** @type {Record<string, boolean>} */
  const state = {};
  for (const pad of pads) {
    if (!pad) continue;
    const s = read(pad);
    for (const k in s) state[k] = state[k] || s[k];
  }
  for (const k in state) {
    const repeatable = k !== 'confirm' && k !== 'back';
    if (state[k] && !prev[k]) {
      emit(k);
      nextRepeat[k] = now + REPEAT_DELAY;
    } else if (state[k] && repeatable && now >= nextRepeat[k]) {
      emit(k);
      nextRepeat[k] = now + REPEAT_RATE;
    }
  }
  prev = state;
  raf = requestAnimationFrame(tick);
}

function emit(intent) {
  for (const l of listeners) l(intent);
}

/**
 * Subscribe to gamepad menu intents. Returns an unsubscribe function.
 * @param {(intent: string) => void} listener
 */
export function onGamepadIntent(listener) {
  if (typeof navigator === 'undefined' || !navigator.getGamepads) return () => {};
  listeners.add(listener);
  if (!raf) raf = requestAnimationFrame(tick);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      prev = {};
    }
  };
}
