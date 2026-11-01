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
    background: var(--bb-black);
    color: var(--bb-white);
    box-shadow: calc(2px * var(--bb-hard)) calc(2px * var(--bb-hard)) 0 rgb(0 0 0 / 0.25);
  }
  .v-yellow {
    background: var(--bb-face-signal);
    color: var(--bb-on-signal);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
  }
  .v-blue {
    background: var(--bb-face-primary);
    color: var(--bb-on-primary);
  }
  .v-outline {
    border: 1.5px solid currentColor;
    padding: 1.5px 10.5px;
  }
</style>
