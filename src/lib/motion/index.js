/**
 * Motion helpers and Svelte actions. The keyframes live in base.css; these
 * actions only add classes, observe visibility and spawn ripple elements.
 * Every effect respects --bb-motion (0 under reduced motion).
 */

/** True when the page is in reduced-motion mode (system setting or data-motion="reduce"). */
export function reducedMotion() {
  if (typeof document === 'undefined') return false;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--bb-motion').trim();
  return v === '0';
}

/**
 * Force the motion mode for the whole page. "auto" follows the OS setting.
 * @param {'auto' | 'full' | 'reduce'} mode
 */
export function setMotion(mode) {
  const root = document.documentElement;
  if (mode === 'auto') root.removeAttribute('data-motion');
  else root.setAttribute('data-motion', mode);
}

/**
 * Force the colour theme. "auto" follows the OS setting.
 * @param {'auto' | 'light' | 'dark'} theme
 */
export function setTheme(theme) {
  const root = document.documentElement;
  if (theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

/** Split a string into grapheme-ish characters (keeps surrogate pairs together). */
export function splitChars(text) {
  return Array.from(text ?? '');
}

/**
 * Wipe an element in from the left (with a yellow leading edge) when it scrolls into view.
 * @param {HTMLElement} node
 * @param {{ delay?: number, once?: boolean, enabled?: boolean }} [params]
 */
export function wipe(node, params = {}) {
  let { delay = 0, once = true, enabled = true } = params;
  if (!enabled) return {};
  node.classList.add('bb-wipe');
  node.style.setProperty('--bb-delay', `${delay}ms`);

  if (typeof IntersectionObserver === 'undefined') {
    node.classList.add('is-in');
    return {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          node.classList.add('is-in');
          if (once) io.disconnect();
        } else if (!once) {
          node.classList.remove('is-in');
        }
      }
    },
    { threshold: 0.15 },
  );
  io.observe(node);
  return {
    update(p = {}) {
      delay = p.delay ?? 0;
      node.style.setProperty('--bb-delay', `${delay}ms`);
    },
    destroy() {
      io.disconnect();
    },
  };
}

/**
 * Light sweep across the element on hover (CSS-driven; the action just adds the class).
 * @param {HTMLElement} node
 */
export function sheen(node) {
  node.classList.add('bb-sheen');
  return {
    destroy() {
      node.classList.remove('bb-sheen');
    },
  };
}

/**
 * Circular ripple from the pointer position on press. The ripple is drawn into
 * the first descendant marked `data-ripple` (so it can be clipped to an inner
 * plate), or into the node itself.
 * @param {HTMLElement} node
 * @param {{ color?: string }} [params]
 */
export function ripple(node, params = {}) {
  let color = params.color;
  const host = () => /** @type {HTMLElement} */ (node.querySelector('[data-ripple]') ?? node);
  {
    const h = host();
    const style = getComputedStyle(h);
    if (style.position === 'static') h.style.position = 'relative';
    if (style.overflow === 'visible') h.style.overflow = 'hidden';
  }

  /** @param {PointerEvent} e */
  function onDown(e) {
    if (reducedMotion() || e.button > 0) return;
    const target = host();
    const r = target.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const size = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    const dot = document.createElement('span');
    dot.className = 'bb-ripple-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = dot.style.height = `${size}px`;
    if (color) dot.style.setProperty('--bb-ripple-color', color);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
    target.append(dot);
  }

  node.addEventListener('pointerdown', onDown);
  return {
    update(p = {}) {
      color = p.color;
    },
    destroy() {
      node.removeEventListener('pointerdown', onDown);
    },
  };
}

/**
 * Calls back once when the element first becomes visible.
 * @param {HTMLElement} node
 * @param {() => void} callback
 */
export function inView(node, callback) {
  if (typeof IntersectionObserver === 'undefined') {
    callback?.();
    return {};
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      callback?.();
      io.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(node);
  return {
    destroy() {
      io.disconnect();
    },
  };
}
