<!--
  Numbered game-style menu. A skewed blue plate slides under the selected row.
  Keyboard: ↑/↓ (or W/S) to move, Enter/Space to choose, Home/End. Optional gamepad.
-->
<script>
  import { onGamepadIntent } from '../input/gamepad.js';

  /**
   * @typedef {{ id: string, title: string, en?: string, hint?: string, disabled?: boolean }} MenuItem
   * @type {{
   *   items: MenuItem[], selected?: number, label?: string, gamepad?: boolean,
   *   onchoose?: (item: MenuItem, index: number) => void,
   *   onback?: () => void
   * }}
   */
  let { items, selected = $bindable(0), label = 'Menu', gamepad = true, onchoose, onback } = $props();

  /** @type {HTMLElement[]} */
  const rows = [];
  /** @type {HTMLElement | undefined} */
  let root = $state();

  function move(dir) {
    const n = items.length;
    let i = selected;
    for (let k = 0; k < n; k++) {
      i = (i + dir + n) % n;
      if (!items[i].disabled) break;
    }
    select(i, true);
  }

  function select(i, focus = false) {
    if (items[i]?.disabled) return;
    selected = i;
    if (focus) rows[i]?.focus();
  }

  function choose(i) {
    if (items[i]?.disabled) return;
    selected = i;
    onchoose?.(items[i], i);
  }

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    const k = e.key;
    if (k === 'ArrowDown' || k === 's' || k === 'S') move(1);
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') move(-1);
    else if (k === 'Home') select(items.findIndex((it) => !it.disabled), true);
    else if (k === 'End') select(items.findLastIndex((it) => !it.disabled), true);
    else if (k === 'Enter' || k === ' ') choose(selected);
    else if (k === 'Escape' || k === 'Backspace') onback?.();
    else return;
    e.preventDefault();
  }

  $effect(() => {
    if (!gamepad) return;
    return onGamepadIntent((intent) => {
      // only drive the menu that currently holds focus (or the first one if nothing does)
      const active = document.activeElement;
      if (active && active !== document.body && !root?.contains(active)) return;
      if (intent === 'down') move(1);
      else if (intent === 'up') move(-1);
      else if (intent === 'confirm') choose(selected);
      else if (intent === 'back') onback?.();
    });
  });
</script>

<div class="bb-menu" role="menu" aria-label={label} tabindex="-1" bind:this={root} {onkeydown}>
  {#each items as item, i (item.id)}
    <!-- keyboard is handled on the menu container (roving tabindex) -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="row"
      class:is-on={i === selected}
      class:is-off={item.disabled}
      role="menuitem"
      tabindex={i === selected ? 0 : -1}
      aria-disabled={item.disabled ? 'true' : undefined}
      style:--i={i}
      bind:this={rows[i]}
      onpointerenter={() => select(i)}
      onfocus={() => select(i)}
      onclick={() => choose(i)}
    >
      <span class="bar" aria-hidden="true"></span>
      <span class="no bb-num">{String(i + 1).padStart(2, '0')}</span>
      <span class="txt">
        <span class="zh">{item.title}</span>
        {#if item.en}<span class="en">{item.en}</span>{/if}
      </span>
      {#if item.hint}<span class="hint">{item.hint}</span>{/if}
      <span class="arrow" aria-hidden="true">▶</span>
    </div>
  {/each}
</div>

<style>
  .bb-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
    outline: none;
  }
  .row {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: var(--bb-space-4);
    padding: var(--bb-space-3) var(--bb-space-5) var(--bb-space-3) var(--bb-space-4);
    cursor: pointer;
    color: var(--bb-ink);
    isolation: isolate;
    outline: none;
    user-select: none;
    animation: bb-menu-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(var(--i) * 45ms * var(--bb-motion));
  }
  @keyframes bb-menu-in {
    from {
      opacity: 0;
      transform: translateX(calc(-28px * var(--bb-motion))) skewX(calc(var(--bb-skew) * var(--bb-motion)));
    }
  }
  .bar {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--bb-blue);
    transform: skewX(var(--bb-skew)) scaleX(0);
    transform-origin: left center;
    transition: transform var(--bb-dur-3) var(--bb-ease);
    box-shadow: 6px 6px 0 var(--bb-panel-ink);
  }
  .row.is-on .bar {
    transform: skewX(var(--bb-skew)) scaleX(1);
  }
  .no {
    display: inline-grid;
    place-items: center;
    width: 2.3em;
    height: 1.6em;
    font-size: 1.35rem;
    color: var(--bb-ink-3);
    transition: color var(--bb-dur-2), background-color var(--bb-dur-2), transform var(--bb-dur-3) var(--bb-ease);
  }
  .txt {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    transition: transform var(--bb-dur-3) var(--bb-ease);
  }
  .zh {
    font-weight: 800;
    font-size: var(--bb-text-lg);
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 600;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bb-ink-3);
  }
  .hint {
    font-family: var(--bb-font-mono);
    font-size: var(--bb-text-xs);
    color: var(--bb-ink-3);
  }
  .arrow {
    color: var(--bb-yellow);
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity var(--bb-dur-2), transform var(--bb-dur-3) var(--bb-ease);
  }

  .row.is-on {
    color: var(--bb-on-blue);
  }
  .row.is-on .no {
    background: var(--bb-yellow);
    color: var(--bb-on-yellow);
    transform: skewX(var(--bb-skew));
  }
  .row.is-on .txt {
    transform: translateX(calc(6px * var(--bb-motion)));
  }
  .row.is-on .en,
  .row.is-on .hint {
    color: rgb(255 255 255 / 0.8);
  }
  .row.is-on .arrow {
    opacity: 1;
    transform: none;
    animation: bb-menu-nudge 0.9s var(--bb-ease) infinite;
    animation-play-state: running;
  }
  @keyframes bb-menu-nudge {
    50% { transform: translateX(calc(4px * var(--bb-motion))); }
  }
  .row:focus-visible .bar {
    outline: 3px solid var(--bb-yellow);
    outline-offset: 2px;
  }
  .row.is-off {
    cursor: not-allowed;
    opacity: 0.4;
  }
</style>
