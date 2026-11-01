<!--
  One line of a log / archive list: caret, date, a category chip, the title with a
  dotted leader, meta bits and an arrow. Renders a link when `href` is given.
  Collapses the chip to a dot and drops meta on narrow screens.
-->
<script>
  /**
   * @type {{
   *   title: string, href?: string, date?: string, time?: string,
   *   chip?: string, glyph?: string, color?: string, meta?: string[], onclick?: (e: MouseEvent) => void
   * }}
   */
  let { title, href = '', date = '', time = '', chip = '', glyph = '', color = '', meta = [], onclick } = $props();
</script>

<svelte:element
  this={href ? 'a' : onclick ? 'button' : 'div'}
  class="bb-logrow"
  href={href || undefined}
  type={!href && onclick ? 'button' : undefined}
  {onclick}
  style:--_a={color || null}
>
  <span class="carat" aria-hidden="true">&gt;</span>
  <span class="date">
    {date}{#if time}<span class="sep">·</span><span class="time">{time}</span>{/if}
  </span>
  <span class="chip">{#if chip}{#if glyph}<span aria-hidden="true">{glyph}</span>{/if}{chip}{/if}</span>
  <span class="ttl"><span class="t">{title}</span><span class="leader" aria-hidden="true"></span></span>
  <span class="meta">
    {#each meta as m, i}{#if i}<span class="sep">·</span>{/if}<span>{m}</span>{/each}
  </span>
  <span class="arrow" aria-hidden="true">→</span>
</svelte:element>

<style>
  .bb-logrow {
    --_a: var(--bb-primary-text);
    position: relative;
    display: grid;
    grid-template-columns: 14px 138px 110px minmax(0, 2.2fr) minmax(0, 1fr) 18px;
    align-items: center;
    gap: 14px;
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;
    border: 0;
    border-bottom: 1px solid var(--bb-line);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    text-decoration: none;
    transition: background var(--bb-dur-2);
  }
  a.bb-logrow,
  button.bb-logrow {
    cursor: pointer;
  }
  .bb-logrow:hover {
    background: linear-gradient(90deg, color-mix(in srgb, var(--bb-primary) 7%, transparent), transparent 80%);
  }
  .carat,
  .date,
  .meta,
  .arrow {
    font-family: var(--bb-font-mono);
    color: var(--bb-ink-3);
    white-space: nowrap;
  }
  .carat {
    font-size: 12px;
    font-weight: 700;
    transition: color var(--bb-dur-2);
  }
  .date,
  .meta {
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  .sep {
    margin: 0 6px;
    color: var(--bb-ink-4);
  }
  .chip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 3px 8px;
    font-family: var(--bb-font-tech);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--_a);
    background: color-mix(in srgb, var(--_a) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--_a) 33%, transparent);
  }
  .chip:empty {
    visibility: hidden;
  }
  .ttl {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .t {
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--bb-ink-2);
    transition: color var(--bb-dur-2);
  }
  .leader {
    flex: 1;
    min-width: 24px;
    border-top: 1px dotted var(--bb-line-2);
  }
  .meta {
    display: flex;
    justify-content: flex-end;
    overflow: hidden;
    color: var(--bb-ink-2);
  }
  .arrow {
    font-size: 14px;
    text-align: right;
    transition: color var(--bb-dur-2), transform var(--bb-dur-2) var(--bb-ease);
  }
  .bb-logrow:hover .t { color: var(--bb-ink); }
  .bb-logrow:hover .carat,
  .bb-logrow:hover .arrow { color: var(--_a); }
  .bb-logrow:hover .arrow { transform: translateX(calc(2px * var(--bb-motion))); }

  @media (max-width: 880px) {
    .bb-logrow { grid-template-columns: 14px 130px 110px minmax(0, 1fr) 18px; }
    .meta { display: none; }
  }
  @media (max-width: 600px) {
    .bb-logrow {
      grid-template-columns: 14px 90px 10px minmax(0, 1fr) 18px;
      gap: 8px;
      padding: 12px;
    }
    .leader,
    .date .sep,
    .time { display: none; }
    .chip {
      width: 10px;
      height: 10px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--_a);
      font-size: 0;
    }
  }
</style>
