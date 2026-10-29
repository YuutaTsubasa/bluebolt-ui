<!--
  App-style modal on <dialog>: light body with faint diagonal shapes, blurred
  backdrop, optional navy header (small subtitle + title + blue accent bar), an
  optional watermark, and either a row of buttons or a full-width split footer
  (secondary | primary, e.g. キャンセル | OK).
-->
<script>
  import Button from './Button.svelte';

  /**
   * @typedef {{ label: string, variant?: 'primary' | 'secondary' | 'ghost' | 'accent', onclick?: () => void, close?: boolean }} ModalAction
   * @type {{
   *   open?: boolean, title?: string, sub?: string, width?: string,
   *   tone?: 'light' | 'dark', header?: 'navy' | 'none',
   *   actions?: ModalAction[], split?: boolean, dismissable?: boolean,
   *   onclose?: () => void,
   *   children?: import('svelte').Snippet, watermark?: import('svelte').Snippet, footer?: import('svelte').Snippet
   * }}
   */
  let {
    open = $bindable(false),
    title = '',
    sub = '',
    width = '760px',
    tone = 'light',
    header = 'navy',
    actions = [],
    split = false,
    dismissable = true,
    onclose,
    children,
    watermark,
    footer,
  } = $props();

  const uid = $props.id();
  /** @type {HTMLDialogElement | undefined} */
  let dlg = $state();

  $effect(() => {
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  });

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  /** @param {ModalAction} a */
  function run(a) {
    a.onclick?.();
    if (a.close !== false) close();
  }
</script>

<dialog
  bind:this={dlg}
  class="bb-modal t-{tone}"
  style:--w={width}
  aria-labelledby={title ? `${uid}-t` : undefined}
  oncancel={(e) => {
    e.preventDefault();
    if (dismissable) close();
  }}
  onclick={(e) => {
    if (dismissable && e.target === dlg) close();
  }}
>
  {#if open}
    <div class="card" class:has-split={split && actions.length} class:bb-on-dark={tone === 'dark'}>
      <div class="deco" aria-hidden="true"></div>
      {#if watermark}<div class="wm" aria-hidden="true">{@render watermark()}</div>{/if}
      {#if title && header === 'navy'}
        <header class="navy">
          <span class="bar" aria-hidden="true"></span>
          <span class="txt">
            {#if sub}<small>{sub}</small>{/if}
            <b id="{uid}-t">{title}</b>
          </span>
        </header>
      {:else if title}
        <h2 class="bb-sr-only" id="{uid}-t">{title}</h2>
      {/if}
      <div class="body">
        {@render children?.()}
      </div>
      {#if footer}
        <footer class="row">{@render footer()}</footer>
      {:else if actions.length && !split}
        <footer class="row">
          {#each actions as a}
            <Button shape="rect" variant={a.variant ?? 'primary'} onclick={() => run(a)}>{a.label}</Button>
          {/each}
        </footer>
      {/if}
    </div>
    {#if split && actions.length}
      <div class="split">
        {#each actions as a, i}
          <button type="button" class="half v-{a.variant ?? (i === actions.length - 1 ? 'primary' : 'secondary')}" onclick={() => run(a)}>
            <span class="mark" aria-hidden="true"></span>
            <span class="lbl">{a.label}</span>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</dialog>

<style>
  .bb-modal {
    padding: 0;
    border: 0;
    background: transparent;
    width: min(var(--w), calc(100vw - 24px));
    max-width: none;
    color: var(--bb-on-yellow);
    overflow: visible;
  }
  .bb-modal::backdrop {
    background: rgb(10 14 26 / 0.45);
    backdrop-filter: blur(8px) saturate(0.8);
    -webkit-backdrop-filter: blur(8px) saturate(0.8);
  }
  .card {
    position: relative;
    overflow: hidden;
    background: var(--bb-sys-panel);
    box-shadow: 0 18px 40px rgb(0 0 0 / 0.4);
    animation: bb-modal-in var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-modal-in {
    from {
      opacity: 0;
      transform: translateY(calc(14px * var(--bb-motion))) scale(calc(1 - 0.03 * var(--bb-motion)));
    }
  }
  /* faint large diagonal shapes in the body */
  .deco {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(118deg, transparent 0 8%, var(--bb-sys-panel-2) 8% 18%, transparent 18%),
      linear-gradient(118deg, transparent 0 62%, var(--bb-sys-panel-2) 62% 70%, transparent 70% 82%, var(--bb-sys-panel-2) 82% 86%, transparent 86%);
    opacity: 0.9;
  }
  .wm {
    position: absolute;
    right: -4%;
    bottom: -10%;
    width: 46%;
    aspect-ratio: 1;
    opacity: 0.07;
    pointer-events: none;
    color: var(--bb-navy);
  }
  .wm :global(svg) {
    width: 100%;
    height: 100%;
  }
  .navy {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 24px 14px 92px;
    background: linear-gradient(90deg, var(--bb-navy) 0 45%, #4b5265 75%, #e0e1e3);
    color: #ffffff;
  }
  /* bluebolt mark: blue + yellow double bar */
  .bar {
    position: absolute;
    left: 74px;
    top: 14px;
    bottom: 14px;
    width: 10px;
    background: linear-gradient(90deg, var(--bb-blue) 0 4px, transparent 4px 6px, var(--bb-yellow) 6px);
    transform: skewX(var(--bb-skew));
  }
  .txt {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .txt small {
    font-size: 13px;
    font-weight: 700;
    opacity: 0.85;
  }
  .txt b {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }
  .body {
    position: relative;
    padding: 24px 32px;
    line-height: 1.9;
    font-weight: 700;
  }
  .row {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 24px;
    padding: 4px 32px 26px;
  }

  /* split footer: two full-width halves under the card */
  .split {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    animation: bb-modal-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(60ms * var(--bb-motion));
  }
  .half {
    position: relative;
    overflow: hidden;
    height: 60px;
    border: 0;
    color: #ffffff;
    font: inherit;
    font-weight: 800;
    letter-spacing: 0.08em;
    cursor: pointer;
    background: var(--bb-face-gray);
    transition: filter var(--bb-dur-2);
  }
  .half.v-primary {
    background: var(--bb-face-blue);
  }
  .half:hover {
    filter: brightness(1.12);
  }
  .half:focus-visible {
    outline: 3px solid var(--bb-yellow);
    outline-offset: -3px;
    box-shadow: none;
  }
  /* bluebolt mark: faint hazard band across each half */
  .mark {
    position: absolute;
    left: 18%;
    top: 0;
    bottom: 0;
    width: 22%;
    background: repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.14) 0 8px, transparent 8px 16px);
    transform: skewX(var(--bb-skew));
    pointer-events: none;
  }
  .half.v-primary .mark {
    background: repeating-linear-gradient(-45deg, color-mix(in srgb, var(--bb-yellow) 35%, transparent) 0 8px, transparent 8px 16px);
  }
  .lbl {
    position: relative;
  }

  .t-dark .card {
    background: var(--bb-sys-dark);
    color: #ffffff;
    box-shadow: inset 0 0 0 1px var(--bb-sys-dark-edge), 0 18px 40px rgb(0 0 0 / 0.5);
  }
  .t-dark .deco {
    opacity: 0.06;
  }
</style>
