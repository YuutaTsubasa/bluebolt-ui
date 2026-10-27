<!--
  Status indicator lamp. "live" pulses (static under reduced motion), "warn" shows hazard stripes.
-->
<script>
  /** @type {{ state?: 'ok' | 'live' | 'warn' | 'off', label?: string, en?: string }} */
  let { state = 'ok', label = '', en = '' } = $props();

  const names = { ok: '正常', live: '直播中', warn: '警告', off: '離線' };
</script>

<span class="bb-lamp s-{state}" role="status">
  <span class="dot" aria-hidden="true"></span>
  <span class="txt">
    <span class="zh">{label || names[state]}</span>
    {#if en}<span class="en">{en}</span>{/if}
  </span>
</span>

<style>
  .bb-lamp {
    display: inline-flex;
    align-items: center;
    gap: var(--bb-space-2);
    padding: 4px 10px 4px 8px;
    border: 1px solid var(--bb-line-2);
    background: var(--bb-surface);
    line-height: 1.1;
  }
  .dot {
    position: relative;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background: var(--bb-blue);
  }
  .zh {
    font-weight: 700;
    font-size: var(--bb-text-sm);
  }
  .en {
    margin-left: 6px;
    font-family: var(--bb-font-cond);
    font-weight: 600;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--bb-ink-3);
  }
  .s-live .dot {
    background: var(--bb-yellow);
    box-shadow: 0 0 0 1.5px var(--bb-panel-ink);
  }
  .s-live .dot::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--bb-yellow);
    opacity: 0;
    animation: bb-pulse 1.4s var(--bb-ease) infinite;
  }
  .s-warn {
    border-color: var(--bb-panel-ink);
  }
  .s-warn .dot {
    transform: none;
    width: 14px;
    background: repeating-linear-gradient(-45deg, var(--bb-yellow) 0 3px, var(--bb-panel-ink) 3px 6px);
  }
  .s-off .dot {
    background: var(--bb-ink-4);
  }
  .s-off .zh {
    color: var(--bb-ink-3);
  }
</style>
