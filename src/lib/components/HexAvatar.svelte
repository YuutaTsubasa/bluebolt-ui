<!--
  Hexagonal avatar. Shows `src` when given, otherwise a primary-tinted gradient
  with the label's initials.
-->
<script>
  /** @type {{ src?: string | null, label?: string, size?: number, ring?: boolean }} */
  let { src = null, label = '', size = 72, ring = true } = $props();

  const initials = $derived(
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => [...w][0])
      .join('')
      .toUpperCase(),
  );
</script>

<span class="bb-hex" class:ring style:--_s="{size}px" role="img" aria-label={label || undefined}>
  <span class="face">
    {#if src}<img {src} alt="" />{:else}<span class="ini" aria-hidden="true">{initials}</span>{/if}
  </span>
</span>

<style>
  .bb-hex {
    --_clip: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    position: relative;
    display: inline-grid;
    width: var(--_s);
    height: var(--_s);
    flex: none;
    clip-path: var(--_clip);
  }
  .ring {
    /* the ring is the background showing through a 2px gap */
    padding: 2px;
    background: linear-gradient(135deg, var(--bb-primary-2), var(--bb-signal));
  }
  .face {
    display: grid;
    place-items: center;
    overflow: hidden;
    clip-path: var(--_clip);
    background: linear-gradient(135deg, var(--bb-primary), color-mix(in srgb, var(--bb-primary) 45%, var(--bb-black)));
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ini {
    font-family: var(--bb-font-display);
    font-size: calc(var(--_s) * 0.3);
    color: var(--bb-on-primary);
    letter-spacing: 0.04em;
  }
</style>
