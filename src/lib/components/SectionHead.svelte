<!--
  Section heading: a rule with "SECTION / 01 / 07", a big display title, a
  "／／ 中文 · sub" line and optional ASCII deco on the right. `glitch` adds a
  rare jitter (off under reduced motion).
-->
<script>
  /**
   * @type {{ en: string, zh?: string, sub?: string, num?: string, total?: string, deco?: string,
   *   level?: 1 | 2 | 3, glitch?: boolean }}
   */
  let { en, zh = '', sub = '', num = '', total = '', deco = '', level = 2, glitch = false } = $props();
</script>

<div class="bb-sec-head" class:glitch>
  <div>
    {#if num}
      <div class="num-row">
        <span class="rule" aria-hidden="true"></span>
        <span class="num">SECTION / {num}{total ? ` / ${total}` : ''}</span>
      </div>
    {/if}
    <svelte:element this={`h${level}`} class="title">{en}</svelte:element>
    {#if zh || sub}<div class="sub">／／ {zh}{sub ? ` · ${sub}` : ''}</div>{/if}
  </div>
  {#if deco}<pre class="deco" aria-hidden="true">{deco}</pre>{/if}
</div>

<style>
  .bb-sec-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }
  .num-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .rule {
    width: 36px;
    height: 1px;
    background: var(--bb-primary-text);
  }
  .num {
    display: inline-block;
    font-family: var(--bb-font-mono);
    font-size: 11px;
    letter-spacing: 0.22em;
    color: var(--bb-primary-text);
  }
  .title {
    margin: 14px 0 0;
    font-family: var(--bb-font-display);
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: 400; /* display faces carry their own weight */
    line-height: 0.95;
    letter-spacing: 0.02em;
    color: var(--bb-ink);
    text-shadow: 0 0 40px color-mix(in srgb, var(--bb-accent) 25%, transparent);
  }
  .sub {
    margin-top: 10px;
    font-family: var(--bb-font-tech);
    font-size: 14px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--bb-ink-2);
  }
  .deco {
    margin: 0;
    font-family: var(--bb-font-mono);
    font-size: 11px;
    line-height: 1.7;
    text-align: right;
    color: var(--bb-ink-3);
  }
  .glitch .num,
  .glitch .title {
    animation: bb-glitch 4.4s infinite;
  }
  @keyframes bb-glitch {
    0%, 82%, 100% { transform: none; opacity: 1; }
    83% { transform: translateX(calc(-2px * var(--bb-motion))); opacity: calc(1 - 0.4 * var(--bb-motion)); }
    85% { transform: translateX(calc(2px * var(--bb-motion))); opacity: 1; }
    87% { transform: translateX(calc(-1px * var(--bb-motion))); opacity: calc(1 - 0.5 * var(--bb-motion)); }
    89% { transform: translateX(calc(1.5px * var(--bb-motion))); opacity: 1; }
    93% { transform: translateX(calc(0.5px * var(--bb-motion))); opacity: calc(1 - 0.25 * var(--bb-motion)); }
  }
</style>
