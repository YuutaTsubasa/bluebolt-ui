<!--
  Settings / options screen: a skewed blue band on the left with a huge vertical
  outlined title, a column of outlined nav buttons (active one turns white), and
  a dark translucent content panel. Slots for the top-left and top-right bars.
-->
<script>
  /**
   * @typedef {{ id: string, label: string, icon?: string }} NavItem
   * @type {{
   *   title?: string, items: NavItem[], active?: string, fixed?: boolean,
   *   onchange?: (id: string) => void,
   *   children?: import('svelte').Snippet, topLeft?: import('svelte').Snippet, topRight?: import('svelte').Snippet,
   *   navFoot?: import('svelte').Snippet
   * }}
   */
  let {
    title = 'OPTION & SETTING',
    items,
    active = $bindable(items[0]?.id),
    fixed = false,
    onchange,
    children,
    topLeft,
    topRight,
    navFoot,
  } = $props();

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    const i = items.findIndex((it) => it.id === active);
    const d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + items.length) % items.length;
    active = items[j].id;
    onchange?.(active);
    /** @type {HTMLElement} */ (e.currentTarget).querySelectorAll('button')[j]?.focus();
  }
</script>

<div class="bb-settings bb-on-dark" class:fixed>
  <div class="band" aria-hidden="true">
    <span class="band-t">{title}</span>
  </div>
  {#if topLeft}<div class="tl">{@render topLeft()}</div>{/if}
  {#if topRight}<div class="tr">{@render topRight()}</div>{/if}

  <nav aria-label={title}>
    <ul role="tablist" aria-orientation="vertical" {onkeydown}>
      {#each items as it, i (it.id)}
        {@const on = it.id === active}
        <li style:--i={i}>
          <button
            type="button"
            role="tab"
            aria-selected={on}
            tabindex={on ? 0 : -1}
            class:on
            onclick={() => {
              active = it.id;
              onchange?.(it.id);
            }}
          >
            {#if it.icon}<span class="ic" aria-hidden="true">{it.icon}</span>{/if}
            <span class="l">{it.label}</span>
          </button>
        </li>
      {/each}
    </ul>
    {#if navFoot}<div class="nav-foot">{@render navFoot()}</div>{/if}
  </nav>

  <section class="panel" role="tabpanel">
    {#key active}
      <div class="panel-in">{@render children?.()}</div>
    {/key}
  </section>
</div>

<style>
  .bb-settings {
    position: relative;
    inset: 0;
    display: grid;
    grid-template-columns: minmax(150px, 14%) minmax(160px, 12.5%) 1fr;
    grid-template-rows: 64px 1fr;
    gap: 0 24px;
    min-height: 100%;
    padding: 0 28px 40px 0;
    box-sizing: border-box;
    color: #ffffff;
    background: rgb(8 12 22 / 0.62);
    backdrop-filter: blur(10px) saturate(0.8);
    -webkit-backdrop-filter: blur(10px) saturate(0.8);
    overflow: hidden;
  }
  .fixed {
    position: fixed;
    z-index: 900;
  }
  .band {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 9%;
    width: 12%;
    background: linear-gradient(180deg, #0a5ce0, #1c45d8 60%, #0b3fcb);
    clip-path: polygon(38% 0, 100% 0, 62% 100%, 0 100%);
    animation: bb-band-in var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-band-in {
    from {
      transform: translateY(calc(-30% * var(--bb-motion)));
      opacity: 0;
    }
  }
  .band-t {
    position: absolute;
    left: 6%;
    bottom: 2%;
    writing-mode: vertical-rl;
    transform: rotate(180deg) skewY(12deg);
    font-family: var(--bb-font-display);
    font-style: italic;
    font-size: clamp(3rem, 9vh, 5.4rem);
    letter-spacing: 0.04em;
    white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 1.5px rgb(255 255 255 / 0.9);
  }
  .tl {
    grid-column: 1 / 3;
    grid-row: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    padding-left: 6%;
    z-index: 1;
  }
  .tr {
    grid-column: 3;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    z-index: 1;
  }
  nav {
    grid-column: 2;
    grid-row: 2;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 18px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  li {
    animation: bb-set-nav-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(var(--i) * 40ms * var(--bb-motion));
  }
  @keyframes bb-set-nav-in {
    from {
      opacity: 0;
      transform: translateX(calc(-18px * var(--bb-motion)));
    }
  }
  button {
    display: grid;
    grid-template-columns: 34px 1fr;
    align-items: center;
    width: 100%;
    min-height: 46px;
    padding: 0 12px;
    border: 1.5px solid rgb(255 255 255 / 0.9);
    background: rgb(8 14 30 / 0.35);
    color: #ffffff;
    font: inherit;
    font-weight: 800;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition:
      background-color var(--bb-dur-2),
      color var(--bb-dur-2);
  }
  button:hover:not(.on) {
    background: rgb(61 155 255 / 0.18);
  }
  button.on {
    background: linear-gradient(118deg, #ffffff 0 60%, #e6ebf6 60%);
    color: #0b0f1a;
  }
  .ic {
    font-size: 20px;
    text-align: center;
  }
  .l {
    text-align: center;
  }
  .nav-foot {
    margin-top: 6px;
  }
  .panel {
    grid-column: 3;
    grid-row: 2;
    position: relative;
    min-width: 0;
    margin-top: 18px;
    padding: 22px 24px;
    border: 1.5px solid var(--bb-sys-dark-edge);
    background: var(--bb-sys-dark);
    overflow: auto;
    z-index: 1;
  }
  .panel-in {
    animation: bb-set-panel-in var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-set-panel-in {
    from {
      opacity: 0;
      transform: translateY(calc(10px * var(--bb-motion)));
    }
  }
  @media (max-width: 760px) {
    .bb-settings {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr;
      padding: 0 12px 24px;
      gap: 12px;
    }
    .band {
      display: none;
    }
    .tl,
    .tr,
    nav,
    .panel {
      grid-column: 1;
      grid-row: auto;
      padding-left: 0;
    }
    ul {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
    }
    li {
      flex: 1 1 40%;
    }
  }
</style>
