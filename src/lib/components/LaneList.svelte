<!--
  Stack of slanted data rows (lanes / channels / scenes): code tab, bilingual
  name, note, a counter, a load bar and a big italic value. Rows step right like
  the StairMenu and slide in one after another.
-->
<script>
  /**
   * @typedef {{ code: string, title: string, en?: string, note?: string, count?: string | number, load?: number, value?: string, active?: boolean }} Lane
   * @type {{ lanes: Lane[], countLabel?: string, loadLabel?: string, step?: number, delay?: number }}
   */
  let { lanes, countLabel = 'CALL', loadLabel = 'LOAD', step = 8, delay = 0 } = $props();
</script>

<ol class="bb-lanes">
  {#each lanes as l, i}
    <li class:active={l.active} style:--i={i} style:margin-left="{i * step}px" style:--bb-delay="{delay}ms">
      <span class="code">{l.code}</span>
      <span class="nm"><b>{l.title}</b>{#if l.en}<small>{l.en}</small>{/if}</span>
      {#if l.note}<span class="note">{l.note}</span>{/if}
      {#if l.count !== undefined}<span class="cnt"><small>{countLabel}</small> <i>{l.count}</i></span>{/if}
      {#if l.load !== undefined}
        <span class="load"><small>{loadLabel}</small><span class="bar"><span style:width="{Math.round(l.load * 100)}%"></span></span></span>
      {/if}
      {#if l.value}<span class="val">{l.value}</span>{/if}
    </li>
  {/each}
</ol>

<style>
  .bb-lanes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  li {
    display: grid;
    grid-template-columns: 46px minmax(64px, auto) 1fr auto auto auto;
    align-items: center;
    gap: 10px;
    height: 30px;
    padding-right: 12px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    animation: bb-lane-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc((var(--bb-delay) + var(--i) * 60ms) * var(--bb-motion));
  }
  @keyframes bb-lane-in {
    from {
      opacity: 0;
      transform: translateX(calc(-30px * var(--bb-motion)));
    }
  }
  .code {
    align-self: stretch;
    display: grid;
    place-items: center;
    background: var(--bb-surface);
    color: var(--bb-ink);
    font: italic 400 15px var(--bb-font-display);
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  li.active .code {
    background: var(--bb-blue);
    color: var(--bb-on-blue);
  }
  .nm {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }
  .nm b {
    font-size: 13px;
    font-weight: 900;
  }
  .nm small {
    font: 700 8px var(--bb-font-cond);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--bb-blue-2);
  }
  .note {
    font-size: 11px;
    color: var(--bb-on-ink-2);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  small {
    font: 700 9px var(--bb-font-cond);
    letter-spacing: 0.08em;
    color: var(--bb-on-ink-2);
  }
  .cnt i {
    font: italic 400 19px var(--bb-font-display);
    color: var(--bb-on-strip);
  }
  .load {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .bar {
    width: 60px;
    height: 7px;
    background: rgb(255 255 255 / 0.15);
    transform: skewX(var(--bb-skew));
  }
  .bar span {
    display: block;
    height: 100%;
    background: var(--bb-blue-2);
  }
  .val {
    min-width: 3.2em;
    text-align: right;
    font: italic 400 20px var(--bb-font-display);
    color: var(--bb-yellow);
  }
</style>
