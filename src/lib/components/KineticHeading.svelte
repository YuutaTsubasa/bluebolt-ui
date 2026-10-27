<!--
  Section heading: yellow number block, small English label, big Chinese title.
-->
<script>
  import KineticText from './KineticText.svelte';

  /**
   * @type {{
   *   title: string, en?: string, num?: string, sub?: string,
   *   level?: 1 | 2 | 3, size?: 'md' | 'lg' | 'hero', delay?: number, play?: unknown
   * }}
   */
  let { title, en = '', num = '', sub = '', level = 2, size = 'lg', delay = 0, play = 0 } = $props();
</script>

<header class="bb-heading s-{size}">
  {#if num}
    <span class="num bb-num" aria-hidden="true"><span>{num}</span></span>
  {/if}
  <div class="txt">
    {#if en}
      <KineticText text={en} class="en" {delay} {play} />
    {/if}
    <KineticText as="h{level}" text={title} class="zh" delay={delay + 80} {play} />
    {#if sub}<p class="sub">{sub}</p>{/if}
  </div>
</header>

<style>
  .bb-heading {
    display: flex;
    align-items: flex-end;
    gap: var(--bb-space-4);
  }
  .num {
    display: inline-grid;
    place-items: center;
    min-width: 1.6em;
    padding: 0.12em 0.3em 0.08em;
    background: var(--bb-yellow);
    color: var(--bb-on-yellow);
    transform: skewX(var(--bb-skew));
    font-size: 2.6rem;
    box-shadow: 4px 4px 0 var(--bb-panel-ink);
  }
  .num > span {
    transform: skewX(calc(-1 * var(--bb-skew)));
  }
  .txt {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .txt :global(.en) {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-sm);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--bb-blue-text);
  }
  .txt :global(.zh) {
    margin: 0;
    font-weight: 900;
    font-size: var(--bb-text-2xl);
    line-height: 1.1;
    letter-spacing: 0.02em;
    color: var(--bb-ink);
  }
  .sub {
    margin: var(--bb-space-1) 0 0;
    color: var(--bb-ink-3);
    font-size: var(--bb-text-sm);
  }
  .s-md .num { font-size: 1.8rem; }
  .s-md .txt :global(.zh) { font-size: var(--bb-text-xl); }
  .s-hero { align-items: center; }
  .s-hero .num { font-size: 4.4rem; }
  .s-hero .txt :global(.zh) { font-size: var(--bb-text-hero); line-height: 1; }
  .s-hero .txt :global(.en) { font-size: var(--bb-text-md); }
  /* hero titles usually sit on busy backgrounds: give the text its own paper */
  .s-hero .txt { align-items: flex-start; gap: 6px; }
  .s-hero .txt :global(.en),
  .s-hero .txt :global(.zh) {
    padding: 0.08em 0.25em;
    background: var(--bb-paper);
  }
  .s-hero .txt :global(.en) {
    background: var(--bb-panel-ink);
    color: var(--bb-yellow);
  }
</style>
