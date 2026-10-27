<!--
  Giant stepped navigation: huge condensed words indented like stairs. The active
  row sits on a black skewed strip with a yellow tag. `compact` shrinks it into a
  side list (e.g. after leaving the overview). Keyboard: ↑/↓, Home/End, Enter,
  and digit keys 1–9 anywhere on the page when `hotkeys` is on.
-->
<script>
  /**
   * @typedef {{ id: string, en: string, zh?: string }} StairItem
   * @type {{
   *   items: StairItem[], active?: string, compact?: boolean, hotkeys?: boolean,
   *   label?: string, onchange?: (id: string) => void
   * }}
   */
  let { items, active = $bindable(items[0]?.id), compact = false, hotkeys = true, label = '主選單', onchange } = $props();

  /** @type {HTMLElement[]} */
  const els = $state([]);

  function go(id, focus = false) {
    const i = items.findIndex((it) => it.id === id);
    if (i < 0) return;
    if (id !== active) {
      active = id;
      onchange?.(id);
    }
    if (focus) els[i]?.focus();
  }

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    const i = items.findIndex((it) => it.id === active);
    let j = -1;
    if (e.key === 'ArrowDown') j = (i + 1) % items.length;
    else if (e.key === 'ArrowUp') j = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = items.length - 1;
    if (j < 0) return;
    e.preventDefault();
    go(items[j].id, true);
  }

  $effect(() => {
    if (!hotkeys) return;
    /** @param {KeyboardEvent} e */
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = /** @type {HTMLElement} */ (e.target);
      if (t?.closest?.('input, textarea, select, [contenteditable="true"], dialog')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= items.length) go(items[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<nav class="bb-stair" class:compact aria-label={label}>
  <ul role="tablist" aria-orientation="vertical" {onkeydown}>
    {#each items as it, i (it.id)}
      {@const on = it.id === active}
      <li style:--i={i} role="presentation">
        <button
          type="button"
          role="tab"
          aria-selected={on}
          tabindex={on ? 0 : -1}
          class:on
          bind:this={els[i]}
          onclick={() => go(it.id)}
        >
          <span class="strip" aria-hidden="true"></span>
          <span class="en">{it.en}</span>
          {#if it.zh}<span class="zh">{it.zh}</span>{/if}
          <span class="no">{String(i + 1).padStart(2, '0')}</span>
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .bb-stair {
    --_size: min(clamp(1.9rem, 4vw, 4rem), 7.2vh);
    --_step: 0.42em;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    margin-left: calc(var(--i) * var(--_step) * var(--_ind, 1));
    transition: margin-left var(--bb-dur-4) var(--bb-ease);
    font-size: var(--_size);
    line-height: 0.86;
    animation: bb-stair-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(var(--i) * 40ms * var(--bb-motion));
  }
  @keyframes bb-stair-in {
    from {
      opacity: 0;
      transform: translateX(calc(-40px * var(--bb-motion))) skewX(calc(var(--bb-skew) * var(--bb-motion)));
    }
  }
  button {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 0.18em;
    padding: 0.04em 0.18em 0.04em 0.06em;
    border: 0;
    background: none;
    cursor: pointer;
    font: inherit;
    color: var(--bb-surface);
    isolation: isolate;
    transform-origin: left center;
    transition:
      transform var(--bb-dur-3) var(--bb-ease),
      color var(--bb-dur-2);
  }
  .en {
    font-family: var(--bb-font-display);
    text-transform: uppercase;
    letter-spacing: 0.005em;
    -webkit-text-stroke: 0.06em var(--bb-ink);
    paint-order: stroke fill;
    text-shadow: 0.05em 0.06em 0 rgb(11 15 26 / 0.18);
    transition: -webkit-text-stroke-color var(--bb-dur-2), color var(--bb-dur-2), font-size var(--bb-dur-4) var(--bb-ease);
  }
  .zh {
    align-self: center;
    font-family: var(--bb-font-zh);
    font-weight: 900;
    font-size: 0.26em;
    color: var(--bb-ink);
    letter-spacing: 0.04em;
  }
  .no {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: 0.2em;
    color: var(--bb-ink-3);
  }
  .strip {
    position: absolute;
    z-index: -1;
    inset: 0.02em -0.9em 0.02em -2em;
    background: var(--bb-strip);
    transform: skewX(var(--bb-skew)) scaleX(0);
    transform-origin: left center;
    transition: transform var(--bb-dur-3) var(--bb-ease);
    box-shadow: 0.08em 0.08em 0 var(--bb-blue);
  }
  button:hover:not(.on),
  button:focus-visible:not(.on) {
    transform: scale(calc(1 + 0.08 * var(--bb-motion))) translateX(calc(0.08em * var(--bb-motion)));
  }
  button:focus-visible {
    outline: none;
    box-shadow: none;
  }
  button:focus-visible .en {
    -webkit-text-stroke-color: var(--bb-blue);
  }
  button.on .strip {
    transform: skewX(var(--bb-skew)) scaleX(1);
  }
  button.on .en {
    color: var(--bb-blue-2);
    -webkit-text-stroke: 0;
    text-shadow: none;
  }
  button.on .zh {
    padding: 0.08em 0.3em;
    background: var(--bb-yellow);
    color: var(--bb-on-yellow);
  }
  button.on .no {
    color: var(--bb-yellow);
  }

  /* compact: a small side list */
  .compact {
    --_size: clamp(1.1rem, 1.5vw, 1.45rem);
    --_ind: 0.6;
  }
  .compact li {
    line-height: 1.12;
  }
  .compact .en {
    -webkit-text-stroke-width: 0;
    color: var(--bb-ink);
    text-shadow: none;
  }
  .compact .zh {
    font-size: 0.5em;
  }
  .compact .no {
    font-size: 0.45em;
  }
  .compact button.on .en {
    color: var(--bb-blue-2);
  }
</style>
