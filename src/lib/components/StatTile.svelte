<!--
  KPI tile: bilingual label, big counting number, delta and optional sparkline.
-->
<script>
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { reducedMotion, inView } from '../motion/index.js';
  import Sparkline from './Sparkline.svelte';

  /**
   * @type {{
   *   label: string, en?: string, value: number, unit?: string, decimals?: number,
   *   delta?: number, deltaUnit?: string, spark?: number[], tone?: 'surface' | 'blue' | 'ink'
   * }}
   */
  let {
    label,
    en = '',
    value,
    unit = '',
    decimals = 0,
    delta,
    deltaUnit = '%',
    spark,
    tone = 'surface',
  } = $props();

  const shown = new Tween(0, { duration: 900, easing: cubicOut });
  let visible = $state(false);

  $effect(() => {
    if (!visible) return;
    shown.set(value, { duration: reducedMotion() ? 0 : 900 });
  });

  const fmt = $derived(
    shown.current.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );
</script>

<div class="bb-stat t-{tone}" use:inView={() => (visible = true)}>
  <div class="head">
    <span class="zh">{label}</span>
    {#if en}<span class="en">{en}</span>{/if}
  </div>
  <div class="val">
    <span class="bb-num n" aria-hidden="true">{fmt}</span>
    <span class="bb-sr-only">{value}{unit}</span>
    {#if unit}<span class="unit">{unit}</span>{/if}
  </div>
  <div class="foot">
    {#if delta !== undefined}
      <span class="delta" class:up={delta > 0} class:down={delta < 0}>
        {delta > 0 ? '▲' : delta < 0 ? '▼' : '■'}
        {Math.abs(delta)}{deltaUnit}
      </span>
    {/if}
    {#if spark?.length}
      <span class="spark"><Sparkline data={spark} /></span>
    {/if}
  </div>
</div>

<style>
  .bb-stat {
    --_bg: var(--bb-surface);
    --_fg: var(--bb-ink);
    --_muted: var(--bb-ink-3);
    --_line: var(--bb-blue);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--bb-space-2);
    padding: var(--bb-space-4) var(--bb-space-5);
    background: var(--_bg);
    color: var(--_fg);
    border-top: 3px solid var(--bb-blue);
  }
  .t-blue {
    --_bg: var(--bb-blue);
    --_fg: var(--bb-on-blue);
    --_muted: rgb(255 255 255 / 0.78);
    --_line: var(--bb-yellow);
    border-top-color: var(--bb-yellow);
  }
  .t-ink {
    --_bg: var(--bb-panel-ink);
    --_fg: var(--bb-on-ink);
    --_muted: var(--bb-on-ink-2);
    --_line: var(--bb-yellow);
    border-top-color: var(--bb-yellow);
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--bb-space-2);
  }
  .zh {
    font-weight: 700;
    font-size: var(--bb-text-sm);
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 600;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--_muted);
  }
  .val {
    display: flex;
    align-items: baseline;
    gap: var(--bb-space-1);
  }
  .n {
    font-size: 3rem;
  }
  .unit {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-lg);
    color: var(--_muted);
  }
  .foot {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--bb-space-3);
    min-height: 32px;
  }
  .delta {
    font-family: var(--bb-font-mono);
    font-size: var(--bb-text-xs);
    padding: 2px 6px;
    background: var(--bb-line);
  }
  .delta.up {
    background: var(--bb-yellow);
    color: var(--bb-on-yellow);
  }
  .delta.down {
    background: var(--bb-panel-ink);
    color: var(--bb-on-ink);
  }
  .t-ink .delta.down,
  .t-blue .delta.down {
    background: rgb(255 255 255 / 0.18);
  }
  .spark {
    color: var(--_line);
  }
</style>
