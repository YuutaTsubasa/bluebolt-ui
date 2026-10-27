<!--
  Giant two-line display word: first line outlined, second solid, letters dropping
  in one by one. Good as the centrepiece inside a RingDial.
-->
<script>
  import { splitChars } from '../motion/index.js';

  /** @type {{ top: string, bottom: string, size?: string, accent?: string }} */
  let { top, bottom, size = 'clamp(5rem, 13vw, 13rem)', accent = '' } = $props();
</script>

<div class="bb-display" style:--size={size} aria-label="{top}{bottom}">
  <span class="ln outline" aria-hidden="true">
    {#each splitChars(top) as ch, i}<span class="ch" style:--i={i}>{ch}</span>{/each}
  </span>
  <span class="ln solid" aria-hidden="true">
    {#each splitChars(bottom) as ch, i}<span class="ch" style:--i={i + top.length}>{ch}</span>{/each}
    {#if accent}<span class="accent">{accent}</span>{/if}
  </span>
</div>

<style>
  .bb-display {
    display: flex;
    flex-direction: column;
    font-family: var(--bb-font-display);
    font-size: var(--size);
    line-height: 0.84;
    letter-spacing: 0.01em;
    user-select: none;
  }
  .ln {
    position: relative;
    display: block;
    white-space: nowrap;
  }
  .solid {
    margin-left: 0.55em;
    color: var(--bb-ink);
  }
  .outline {
    color: transparent;
    -webkit-text-stroke: 0.025em var(--bb-ink);
  }
  .ch {
    display: inline-block;
    animation: bb-dw-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(200ms * var(--bb-motion) + var(--i) * 70ms * var(--bb-motion));
  }
  @keyframes bb-dw-in {
    from {
      opacity: 0;
      transform: translateY(calc(-0.4em * var(--bb-motion))) scaleY(calc(1 + 0.6 * var(--bb-motion)));
      filter: blur(calc(6px * var(--bb-motion)));
    }
  }
  .accent {
    position: absolute;
    right: -0.1em;
    top: 0.1em;
    writing-mode: vertical-rl;
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: 0.12em;
    letter-spacing: 0.3em;
    color: var(--bb-blue-text);
  }
</style>
