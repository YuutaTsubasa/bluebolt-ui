<!--
  Segmented skewed meter. Segments past `warnAt` light up yellow.
-->
<script>
  /**
   * @type {{
   *   value: number, label?: string, en?: string, segments?: number,
   *   warnAt?: number, showValue?: boolean
   * }}
   */
  let { value, label = '', en = '', segments = 20, warnAt = 0.8, showValue = true } = $props();

  const v = $derived(Math.max(0, Math.min(1, value)));
  const lit = $derived(Math.round(v * segments));
</script>

<div
  class="bb-gauge"
  role="meter"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={Math.round(v * 100)}
  aria-label={label || en || 'gauge'}
>
  {#if label || en || showValue}
    <div class="head">
      <span class="lbl">
        {#if label}<span class="zh">{label}</span>{/if}
        {#if en}<span class="en">{en}</span>{/if}
      </span>
      {#if showValue}<span class="pct bb-num">{Math.round(v * 100)}<small>%</small></span>{/if}
    </div>
  {/if}
  <div class="segs" style:--n={segments}>
    {#each { length: segments } as _, i}
      <span
        class="seg"
        class:on={i < lit}
        class:warn={i < lit && (i + 1) / segments > warnAt}
        style:--i={i}
      ></span>
    {/each}
  </div>
</div>

<style>
  .bb-gauge {
    display: flex;
    flex-direction: column;
    gap: var(--bb-space-2);
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .lbl {
    display: flex;
    align-items: baseline;
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
    color: var(--bb-ink-3);
  }
  .pct {
    font-size: 1.6rem;
  }
  .pct small {
    font-size: 0.55em;
    margin-left: 2px;
  }
  .segs {
    display: grid;
    grid-template-columns: repeat(var(--n), 1fr);
    gap: 3px;
    height: 18px;
    padding: 0 4px;
  }
  .seg {
    background: var(--bb-line);
    transform: skewX(var(--bb-skew));
    transition: background-color var(--bb-dur-2) linear;
    transition-delay: calc(var(--i) * 18ms * var(--bb-motion));
  }
  .seg.on {
    background: var(--bb-blue);
  }
  .seg.warn {
    background: var(--bb-yellow);
    box-shadow: inset 0 -3px 0 var(--bb-panel-ink);
  }
</style>
