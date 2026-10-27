<!--
  Decorative barcode derived from a string (not a real symbology). Uses currentColor.
-->
<script>
  /** @type {{ value: string, height?: number, showText?: boolean }} */
  let { value, height = 32, showText = false } = $props();

  const bars = $derived.by(() => {
    let h = 2166136261;
    const out = [];
    let x = 0;
    for (let i = 0; i < 28; i++) {
      h ^= value.charCodeAt(i % Math.max(1, value.length)) + i;
      h = Math.imul(h, 16777619) >>> 0;
      const w = 1 + (h % 3);
      const gap = 1 + ((h >>> 3) % 2);
      out.push({ x, w });
      x += w + gap;
    }
    return { list: out, width: x };
  });
</script>

<span class="bb-barcode" aria-hidden="true">
  <svg viewBox="0 0 {bars.width} {height}" width={bars.width} {height} preserveAspectRatio="none">
    {#each bars.list as b}<rect x={b.x} y="0" width={b.w} {height} />{/each}
  </svg>
  {#if showText}<span class="t">{value}</span>{/if}
</span>

<style>
  .bb-barcode {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
  }
  svg {
    display: block;
    fill: currentColor;
  }
  .t {
    font-family: var(--bb-font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
  }
</style>
