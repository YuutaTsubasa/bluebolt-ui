<!--
  Full-screen diagonal "cut-in" banner (stage start, level up, round clear...).
  Set `show = true`; it sweeps in, holds for `duration` ms, sweeps out and resets `show`.
-->
<script>
  import { cubicOut, cubicIn } from 'svelte/easing';
  import { reducedMotion } from '../motion/index.js';
  import KineticText from './KineticText.svelte';

  /**
   * @type {{
   *   show?: boolean, title: string, en?: string, num?: string,
   *   duration?: number, tone?: 'blue' | 'yellow', ondone?: () => void
   * }}
   */
  let { show = $bindable(false), title, en = '', num = '', duration = 1400, tone = 'blue', ondone } = $props();

  $effect(() => {
    if (!show) return;
    const id = setTimeout(() => {
      show = false;
      ondone?.();
    }, duration);
    return () => clearTimeout(id);
  });

  function bandIn() {
    const r = reducedMotion();
    return {
      duration: r ? 120 : 380,
      easing: cubicOut,
      css: (t, u) => (r ? `opacity:${t}` : `transform:translateX(${u * 110}%) skewX(${u * -20}deg)`),
    };
  }
  function bandOut() {
    const r = reducedMotion();
    return {
      duration: r ? 120 : 300,
      easing: cubicIn,
      css: (t, u) => (r ? `opacity:${t}` : `transform:translateX(${-u * 110}%) skewX(${u * 20}deg)`),
    };
  }
</script>

{#if show}
  <div class="bb-cutin t-{tone}" role="status" aria-live="assertive">
    <div class="band" in:bandIn out:bandOut>
      <div class="stripe top" aria-hidden="true"></div>
      <div class="content">
        {#if num}<span class="num bb-num" aria-hidden="true">{num}</span>{/if}
        <div class="txt">
          {#if en}<KineticText text={en} class="en" delay={120} />{/if}
          <KineticText text={title} class="zh" delay={180} />
        </div>
      </div>
      <div class="stripe bottom" aria-hidden="true"></div>
    </div>
  </div>
{/if}

<style>
  .bb-cutin {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: grid;
    place-items: center;
    pointer-events: none;
    overflow: hidden;
  }
  .band {
    --_bg: var(--bb-blue);
    --_fg: var(--bb-on-blue);
    --_hl: var(--bb-yellow);
    width: 140vw;
    transform-origin: center;
    rotate: -6deg;
    background: var(--_bg);
    color: var(--_fg);
    box-shadow: 0 12px 0 var(--bb-panel-ink);
  }
  .t-yellow .band {
    --_bg: var(--bb-yellow);
    --_fg: var(--bb-on-yellow);
    --_hl: var(--bb-blue);
  }
  .stripe {
    height: 10px;
    background: repeating-linear-gradient(90deg, var(--_hl) 0 40px, transparent 40px 52px);
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--bb-space-5);
    padding: var(--bb-space-5) 0;
  }
  .num {
    font-size: clamp(4rem, 12vw, 9rem);
    color: var(--_hl);
    -webkit-text-stroke: 2px var(--bb-panel-ink);
  }
  .txt {
    display: flex;
    flex-direction: column;
  }
  .txt :global(.en) {
    font-family: var(--bb-font-display);
    font-size: clamp(1.2rem, 3vw, 2rem);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--_hl);
  }
  .txt :global(.zh) {
    font-weight: 900;
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    line-height: 1;
  }
</style>
