<!--
  Thin progress / level bar with a label, a percentage and a travelling shine.
-->
<script>
  /** @type {{ value?: number, label?: string, color?: string }} */
  let { value = 75, label = '', color = '' } = $props();
  const pct = $derived(Math.max(0, Math.min(100, Math.round(value))));
</script>

<div class="bb-scan" style:--_c={color || null}>
  <div class="hdr">
    <span>{label}</span>
    <span class="pct">{pct}%</span>
  </div>
  <div class="track" role="progressbar" aria-label={label || undefined} aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}>
    <div class="fill" style:width="{pct}%"><span class="shine"></span></div>
  </div>
</div>

<style>
  .bb-scan {
    --_c: var(--bb-primary);
    width: 100%;
  }
  .hdr {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-family: var(--bb-font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--bb-ink-3);
  }
  .pct {
    color: var(--bb-primary-text);
  }
  .track {
    position: relative;
    height: 4px;
    overflow: hidden;
    background: color-mix(in srgb, var(--_c) 14%, transparent);
  }
  .fill {
    position: relative;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(90deg, var(--_c), var(--bb-signal));
    box-shadow: 0 0 12px color-mix(in srgb, var(--_c) 70%, transparent);
    transition: width var(--bb-dur-4) var(--bb-ease);
  }
  .shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.45), transparent);
    opacity: var(--bb-motion);
    animation: bb-scan 1.4s linear infinite;
  }
  @keyframes bb-scan {
    from { transform: translateX(-100%); }
    to { transform: translateX(calc(100% * var(--bb-motion))); }
  }
</style>
