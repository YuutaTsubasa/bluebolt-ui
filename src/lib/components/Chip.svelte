<!--
  Toggleable filter chip with a skewed tag shape.
-->
<script>
  /** @type {{ selected?: boolean, count?: number, onchange?: (v: boolean) => void, children?: import('svelte').Snippet }} */
  let { selected = $bindable(false), count, onchange, children } = $props();

  function toggle() {
    selected = !selected;
    onchange?.(selected);
  }
</script>

<button type="button" class="bb-chip" class:on={selected} aria-pressed={selected} onclick={toggle}>
  <span class="mark" aria-hidden="true"></span>
  <span class="lbl">{@render children?.()}</span>
  {#if count !== undefined}<span class="cnt">{count}</span>{/if}
</button>

<style>
  .bb-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px 5px 10px;
    border: 1.5px solid var(--bb-line-2);
    background: var(--bb-surface);
    color: var(--bb-ink-2);
    font: inherit;
    font-size: var(--bb-text-sm);
    font-weight: 700;
    cursor: pointer;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    padding-right: 18px;
    transition:
      background-color var(--bb-dur-2),
      color var(--bb-dur-2),
      border-color var(--bb-dur-2),
      transform var(--bb-dur-3) var(--bb-ease);
  }
  .bb-chip:hover {
    border-color: var(--bb-ink);
    color: var(--bb-ink);
  }
  .bb-chip:active {
    transform: translateY(calc(1px * var(--bb-motion)));
  }
  .mark {
    width: 8px;
    height: 8px;
    border: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: background-color var(--bb-dur-2);
  }
  .cnt {
    font-family: var(--bb-font-mono);
    font-size: 0.8em;
    opacity: 0.75;
  }
  .bb-chip.on {
    background: var(--bb-panel-ink);
    border-color: var(--bb-panel-ink);
    color: var(--bb-on-ink);
  }
  .bb-chip.on .mark {
    background: var(--bb-yellow);
    border-color: var(--bb-yellow);
  }
</style>
