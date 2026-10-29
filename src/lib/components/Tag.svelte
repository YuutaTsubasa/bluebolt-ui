<!--
  Small label: black tag (limits, "SKILL"), yellow discount tag, blue tag, or outline.
-->
<script>
  /** @type {{ variant?: 'ink' | 'yellow' | 'blue' | 'outline', size?: 'sm' | 'md', children?: import('svelte').Snippet }} */
  let { variant = 'ink', size = 'md', children } = $props();
</script>

<span class="bb-tag v-{variant} s-{size}">{@render children?.()}</span>

<style>
  .bb-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 1.3;
    white-space: nowrap;
  }
  .s-sm {
    padding: 1px 7px;
    font-size: 12px;
  }
  .v-ink {
    background: #0b0f1a;
    color: #ffffff;
    box-shadow: 2px 2px 0 rgb(0 0 0 / 0.25);
  }
  .v-yellow {
    background: var(--bb-face-yellow);
    color: #0b0f1a;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
  }
  .v-blue {
    background: var(--bb-face-blue);
    color: #ffffff;
  }
  .v-outline {
    border: 1.5px solid currentColor;
    padding: 1.5px 10.5px;
  }
</style>
