<!--
  Screen header: giant outlined number, black tag with the English name, big title
  and a short description. Re-mount (e.g. with {#key}) to replay the entrance.
-->
<script>
  import KineticText from './KineticText.svelte';

  /** @type {{ num: string, en: string, title: string, desc?: string, total?: string }} */
  let { num, en, title, desc = '', total = '' } = $props();
</script>

<header class="bb-screen-title">
  <span class="big" aria-hidden="true">{num}</span>
  <div class="txt">
    <span class="tag">{en}</span>
    <KineticText as="h2" text={title} class="title" delay={120} />
  </div>
  {#if desc || total}
    <p class="desc">
      {#if total}<span class="bb-label">Screen {num} / {total}</span><br />{/if}
      {desc}
    </p>
  {/if}
</header>

<style>
  .bb-screen-title {
    display: flex;
    align-items: flex-end;
    gap: 14px;
  }
  .big {
    font-family: var(--bb-font-display);
    font-size: clamp(4.5rem, 8vw, 7.5rem);
    line-height: 0.82;
    color: transparent;
    -webkit-text-stroke: 2px var(--bb-ink);
    letter-spacing: -0.02em;
    animation: bb-st-num var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-st-num {
    from {
      opacity: 0;
      transform: translateX(calc(-30px * var(--bb-motion))) scale(calc(1 + 0.3 * var(--bb-motion)));
    }
  }
  .txt {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding-bottom: 4px;
  }
  .tag {
    padding: 2px 12px 2px 8px;
    background: var(--bb-strip);
    color: var(--bb-blue-2);
    font: 700 italic 14px var(--bb-font-cond);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  .txt :global(.title) {
    margin: 0;
    font-weight: 900;
    font-size: clamp(2rem, 3.4vw, 3.2rem);
    line-height: 1;
    color: var(--bb-ink);
  }
  .desc {
    max-width: 22em;
    margin: 0 0 6px 8px;
    font-size: var(--bb-text-xs);
    line-height: 1.6;
    color: var(--bb-ink-2);
  }
</style>
