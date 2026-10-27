<!--
  Tiny line chart that draws itself in; the last point gets a yellow marker.
-->
<script>
  /** @type {{ data: number[], width?: number, height?: number, label?: string }} */
  let { data, width = 120, height = 32, label = '' } = $props();

  const pad = 3;
  const pts = $derived.by(() => {
    if (!data?.length) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const step = data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;
    return data.map((v, i) => [pad + i * step, height - pad - ((v - min) / span) * (height - pad * 2)]);
  });
  const d = $derived(pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(''));
  const last = $derived(pts.at(-1));
</script>

<svg
  class="bb-spark"
  viewBox="0 0 {width} {height}"
  {width}
  {height}
  role={label ? 'img' : undefined}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
>
  {#key d}
    <path class="area" d="{d}L{width - pad} {height}L{pad} {height}Z" />
    <path class="line" {d} pathLength="1" />
    {#if last}
      <rect class="dot" x={last[0] - 3} y={last[1] - 3} width="6" height="6" />
    {/if}
  {/key}
</svg>

<style>
  .bb-spark {
    display: block;
    overflow: visible;
  }
  .line {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: bb-spark-draw var(--bb-t-enter) var(--bb-ease) both;
  }
  .area {
    fill: currentColor;
    opacity: 0.12;
  }
  .dot {
    fill: var(--bb-yellow);
    stroke: var(--bb-panel-ink);
    stroke-width: 1.5;
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(45deg);
  }
  @keyframes bb-spark-draw {
    from {
      stroke-dashoffset: var(--bb-motion);
    }
  }
</style>
