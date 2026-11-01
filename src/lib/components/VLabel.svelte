<!--
  Small vertical label reading bottom to top (side rails, "SCROLL ↓").
  For big vertical kanji use VerticalText.
-->
<script>
  /** @type {{ color?: string, children?: import('svelte').Snippet }} */
  let { color = '', children } = $props();
</script>

<span class="bb-vlabel" style:color={color || null}>{@render children?.()}</span>

<style>
  .bb-vlabel {
    display: inline-block;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: var(--bb-font-mono);
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--bb-ink-3);
  }
</style>
