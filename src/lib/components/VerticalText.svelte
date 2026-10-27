<!--
  Big vertical serif text (e.g. 「直播中」) with an optional caption, characters
  sliding down one by one.
-->
<script>
  import { splitChars } from '../motion/index.js';

  /** @type {{ text: string, caption?: string, sub?: string, size?: string }} */
  let { text, caption = '', sub = '', size = 'clamp(4rem, 9vw, 8.5rem)' } = $props();
</script>

<div class="bb-vert" style:--size={size}>
  <span class="v" aria-label={text}>
    {#each splitChars(text) as ch, i}<span class="ch" aria-hidden="true" style:--i={i}>{ch}</span>{/each}
  </span>
  {#if caption || sub}
    <span class="cap">
      {#if caption}<b>{caption}</b>{/if}
      {#if sub}<small>{sub}</small>{/if}
    </span>
  {/if}
</div>

<style>
  .bb-vert {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  .v {
    writing-mode: vertical-rl;
    font-family: var(--bb-font-serif);
    font-weight: 900;
    font-size: var(--size);
    line-height: 1;
    color: var(--bb-blue-deep);
    text-shadow: 0.03em 0.03em 0 color-mix(in srgb, var(--bb-blue) 25%, transparent);
  }
  .ch {
    display: inline-block;
    animation: bb-vt-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(250ms * var(--bb-motion) + var(--i) * 110ms * var(--bb-motion));
  }
  @keyframes bb-vt-in {
    from {
      opacity: 0;
      transform: translateY(calc(-0.5em * var(--bb-motion)));
      clip-path: inset(0 0 calc(100% * var(--bb-motion)) 0);
    }
    to {
      clip-path: inset(0);
    }
  }
  .cap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: var(--bb-font-display);
    color: var(--bb-blue-deep);
    line-height: 1;
  }
  .cap b {
    font-weight: 400;
    font-size: 1.6rem;
  }
  .cap small {
    font-size: 1.05rem;
  }
</style>
