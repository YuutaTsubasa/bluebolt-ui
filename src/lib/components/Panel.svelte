<!--
  Frosted-glass HUD panel with an iridescent edge, a black slanted header strip
  carrying a yellow number badge, and an optional link on the right. Enters with
  a tilted fly-in (staggered via `delay`); `tilt` gives it a slight 3D lean.
-->
<script>
  /**
   * @type {{
   *   num?: string, title?: string, sub?: string, link?: string, onlink?: () => void,
   *   tone?: 'glass' | 'ink' | 'blue', tilt?: 'left' | 'right' | 'none',
   *   from?: 'left' | 'right' | 'up' | 'down', delay?: number, cut?: boolean, pad?: boolean,
   *   class?: string, style?: string, children?: import('svelte').Snippet
   * }}
   */
  let {
    num = '',
    title = '',
    sub = '',
    link = '',
    onlink,
    tone = 'glass',
    tilt = 'none',
    from = 'right',
    delay = 0,
    cut = true,
    pad = true,
    class: cls = '',
    style = '',
    children,
  } = $props();
</script>

<section
  class="bb-panel t-{tone} tilt-{tilt} from-{from} {cls}"
  class:cut
  style:--bb-delay="{delay}ms"
  {style}
>
  {#if title || num}
    <header>
      {#if num}<span class="num">{num}</span>{/if}
      <h3><span class="t">{title}</span>{#if sub}<span class="s">{sub}</span>{/if}</h3>
      {#if link}
        <button type="button" class="link" onclick={onlink}>{link} <span aria-hidden="true">▶</span></button>
      {/if}
    </header>
  {/if}
  <div class="body" class:pad>
    {@render children?.()}
  </div>
</section>

<style>
  .bb-panel {
    --_bg: var(--bb-glass);
    --_fg: var(--bb-ink);
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--_fg);
    background: var(--_bg);
    backdrop-filter: blur(14px) saturate(1.5);
    -webkit-backdrop-filter: blur(14px) saturate(1.5);
    box-shadow:
      inset 0 0 0 1px var(--bb-glass-edge),
      0 18px 40px -18px rgb(11 15 26 / 0.45);
    animation: bb-panel-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(var(--bb-delay) * var(--bb-motion));
    --_tx: 60px;
    --_ty: 0px;
    --_ry: -18deg;
  }
  .bb-panel::before {
    /* iridescent rim */
    content: '';
    position: absolute;
    inset: 0;
    padding: 1.5px;
    background: linear-gradient(
      125deg,
      rgb(255 255 255 / 0.9),
      color-mix(in srgb, var(--bb-blue) 55%, transparent) 30%,
      rgb(255 255 255 / 0.4) 50%,
      color-mix(in srgb, var(--bb-yellow) 60%, transparent) 75%,
      rgb(255 255 255 / 0.9)
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.8;
  }
  .cut {
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
  .from-left { --_tx: -60px; --_ry: 18deg; }
  .from-up { --_tx: 0px; --_ty: -40px; --_ry: 0deg; }
  .from-down { --_tx: 0px; --_ty: 40px; --_ry: 0deg; }
  @keyframes bb-panel-in {
    from {
      opacity: 0;
      transform: perspective(900px)
        translate(calc(var(--_tx) * var(--bb-motion)), calc(var(--_ty) * var(--bb-motion)))
        rotateY(calc(var(--_ry) * var(--bb-motion)));
      filter: blur(calc(8px * var(--bb-motion)));
    }
  }
  .tilt-left {
    transform: perspective(1400px) rotateY(5deg);
  }
  .tilt-right {
    transform: perspective(1400px) rotateY(-5deg);
  }

  .t-ink {
    --_bg: color-mix(in srgb, var(--bb-panel-ink) 92%, transparent);
    --_fg: var(--bb-on-ink);
  }
  .t-blue {
    --_bg: color-mix(in srgb, var(--bb-blue) 82%, transparent);
    --_fg: var(--bb-on-blue);
  }

  header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 10px 0 0;
    padding-right: 12px;
    min-height: 26px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  }
  .num {
    display: grid;
    place-items: center;
    align-self: stretch;
    min-width: 30px;
    padding: 0 6px;
    background: var(--bb-yellow);
    color: var(--bb-on-yellow);
    font-family: var(--bb-font-display);
    font-size: 15px;
    clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  }
  h3 {
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
  }
  .t {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-style: italic;
    font-size: 15px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .s {
    font-weight: 700;
    font-size: 12px;
    opacity: 0.75;
  }
  .link {
    border: 0;
    background: none;
    color: inherit;
    font: 700 12px var(--bb-font-zh);
    cursor: pointer;
    white-space: nowrap;
  }
  .link span {
    color: var(--bb-yellow);
    font-size: 10px;
  }
  .link:hover {
    color: var(--bb-yellow);
  }
  .body {
    position: relative;
    flex: 1;
    min-height: 0;
  }
  .body.pad {
    padding: 12px 16px 14px;
  }
</style>
