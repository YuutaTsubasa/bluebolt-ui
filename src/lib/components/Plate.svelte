<!--
  Card / panel with a cut corner, optional number tab and bilingual title.
  Wipes in from the left when it scrolls into view.
-->
<script>
  import { wipe } from '../motion/index.js';

  /**
   * @type {{
   *   tone?: 'surface' | 'blue' | 'soft' | 'ink' | 'yellow',
   *   num?: string, en?: string, title?: string, delay?: number, animate?: boolean,
   *   brackets?: boolean, grain?: boolean, class?: string,
   *   children?: import('svelte').Snippet, footer?: import('svelte').Snippet
   * }}
   */
  let {
    tone = 'surface',
    num = '',
    en = '',
    title = '',
    delay = 0,
    animate = true,
    brackets = false,
    grain = false,
    class: cls = '',
    children,
    footer,
  } = $props();
</script>

<section class="bb-plate-wrap {cls}" use:wipe={{ delay, enabled: animate }}>
  <div class="bb-plate t-{tone}" class:bb-brackets={brackets} class:bb-grain={grain}>
    {#if num || en || title}
      <header>
        {#if num}<span class="num bb-num">{num}</span>{/if}
        <div class="ttl">
          {#if en}<span class="en">{en}</span>{/if}
          {#if title}<h3>{title}</h3>{/if}
        </div>
      </header>
    {/if}
    <div class="body">
      {@render children?.()}
    </div>
    {#if footer}
      <footer>{@render footer()}</footer>
    {/if}
  </div>
</section>

<style>
  .bb-plate-wrap {
    min-width: 0;
  }
  .bb-plate {
    --_bg: var(--bb-surface);
    --_fg: var(--bb-ink);
    --_muted: var(--bb-ink-3);
    --_accent: var(--bb-blue-text);
    --bb-bracket-color: var(--bb-blue);
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding: var(--bb-space-5);
    background: var(--_bg);
    color: var(--_fg);
    clip-path: polygon(0 0, calc(100% - var(--bb-cut)) 0, 100% var(--bb-cut), 100% 100%, 0 100%);
    border-left: 4px solid var(--bb-blue);
  }
  .t-blue {
    --_bg: var(--bb-blue);
    --_fg: var(--bb-on-blue);
    --_muted: rgb(255 255 255 / 0.78);
    --_accent: var(--bb-yellow);
    --bb-bracket-color: var(--bb-yellow);
    border-left-color: var(--bb-yellow);
  }
  .t-soft {
    --_bg: var(--bb-blue-soft);
    --_muted: var(--bb-ink-2);
  }
  .t-ink {
    --_bg: var(--bb-panel-ink);
    --_fg: var(--bb-on-ink);
    --_muted: var(--bb-on-ink-2);
    --_accent: var(--bb-yellow);
    --bb-bracket-color: var(--bb-yellow);
    border-left-color: var(--bb-yellow);
  }
  .t-yellow {
    --_bg: var(--bb-yellow);
    --_fg: var(--bb-on-yellow);
    --_muted: rgb(11 15 26 / 0.7);
    --_accent: var(--bb-on-yellow);
    --bb-bracket-color: var(--bb-panel-ink);
    border-left-color: var(--bb-panel-ink);
  }
  header {
    display: flex;
    align-items: center;
    gap: var(--bb-space-3);
    margin-bottom: var(--bb-space-4);
  }
  .num {
    font-size: 2.2rem;
    color: var(--_accent);
  }
  .ttl {
    display: flex;
    flex-direction: column;
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--_muted);
  }
  h3 {
    margin: 0;
    font-size: var(--bb-text-lg);
    font-weight: 800;
    line-height: 1.2;
  }
  .body {
    color: inherit;
  }
  footer {
    margin-top: var(--bb-space-4);
    padding-top: var(--bb-space-3);
    border-top: 1px dashed currentColor;
    opacity: 0.85;
  }
</style>
