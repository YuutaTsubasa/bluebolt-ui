<!--
  Yellow/black warning band with optional label; `moving` scrolls the stripes (off under reduced motion).
-->
<script>
  /** @type {{ label?: string, height?: number, moving?: boolean }} */
  let { label = '', height = 22, moving = false } = $props();
</script>

<div class="bb-hazard-band bb-hazard" class:moving style:height="{height}px" role={label ? 'note' : 'presentation'}>
  {#if label}<span>{label}</span>{/if}
</div>

<style>
  .bb-hazard-band {
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: 28.28px 28.28px;
  }
  .moving {
    animation: bb-hazard-move 1.2s linear infinite;
  }
  @keyframes bb-hazard-move {
    to {
      background-position: calc(28.28px * var(--bb-motion)) 0;
    }
  }
  span {
    padding: 1px 10px;
    background: var(--bb-panel-ink);
    color: var(--bb-yellow);
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }
</style>
