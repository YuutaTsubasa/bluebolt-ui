<!--
  Section heading strip: solid blue on the left fading out to the right.
-->
<script>
  /** @type {{ title: string, en?: string, as?: string, children?: import('svelte').Snippet }} */
  let { title, en = '', as = 'h3', children } = $props();
</script>

<svelte:element this={as} class="bb-section-bar">
  <span class="t">{title}</span>
  {#if en}<span class="en">{en}</span>{/if}
  {@render children?.()}
</svelte:element>

<style>
  .bb-section-bar {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0;
    padding: 5px 14px;
    background: linear-gradient(90deg, var(--bb-blue) 0 30%, color-mix(in srgb, var(--bb-blue) 35%, transparent) 75%, transparent);
    color: var(--bb-on-blue);
    font-size: var(--bb-text-md);
    font-weight: 800;
    letter-spacing: 0.06em;
    animation: bb-sb-in var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-sb-in {
    from {
      clip-path: inset(0 calc(100% * var(--bb-motion)) 0 0);
    }
    to {
      clip-path: inset(0);
    }
  }
  .en {
    font-family: var(--bb-font-cond);
    font-size: 0.7em;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.75;
  }
</style>
