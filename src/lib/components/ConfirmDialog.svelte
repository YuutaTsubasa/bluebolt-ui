<!--
  Modal confirm built on <dialog>. `danger` adds a hazard header; `timer` (seconds)
  shows a draining bar and cancels automatically when it runs out.
-->
<script>
  import Button from './Button.svelte';
  import HazardStripe from './HazardStripe.svelte';

  /**
   * @type {{
   *   open?: boolean, title: string, en?: string, message?: string, danger?: boolean,
   *   confirmLabel?: string, cancelLabel?: string, timer?: number,
   *   onconfirm?: () => void, oncancel?: () => void, children?: import('svelte').Snippet
   * }}
   */
  let {
    open = $bindable(false),
    title,
    en = '',
    message = '',
    danger = false,
    confirmLabel = '確定',
    cancelLabel = '取消',
    timer = 0,
    onconfirm,
    oncancel,
    children,
  } = $props();

  const uid = $props.id();
  /** @type {HTMLDialogElement | undefined} */
  let dlg = $state();
  let left = $state(0);

  $effect(() => {
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  });

  $effect(() => {
    if (!open || !timer) return;
    left = timer;
    const started = performance.now();
    const id = setInterval(() => {
      left = Math.max(0, timer - (performance.now() - started) / 1000);
      if (left <= 0) cancel();
    }, 100);
    return () => clearInterval(id);
  });

  function confirm() {
    open = false;
    onconfirm?.();
  }
  function cancel() {
    if (!open) return;
    open = false;
    oncancel?.();
  }
</script>

<dialog
  bind:this={dlg}
  class="bb-dialog"
  class:danger
  aria-labelledby="{uid}-title"
  oncancel={(e) => {
    e.preventDefault();
    cancel();
  }}
  onclick={(e) => {
    if (e.target === dlg) cancel();
  }}
>
  {#if open}
    <div class="card">
      {#if danger}<HazardStripe label="CAUTION" height={20} />{/if}
      <div class="inner">
        {#if en}<span class="en">{en}</span>{/if}
        <h2 id="{uid}-title">{title}</h2>
        {#if message}<p>{message}</p>{/if}
        {@render children?.()}
        {#if timer}
          <div class="timer" aria-label="剩餘 {Math.ceil(left)} 秒">
            <span class="bar" style:transform="scaleX({left / timer})"></span>
            <span class="sec bb-mono">{left.toFixed(1)}s</span>
          </div>
        {/if}
        <div class="actions">
          <Button variant="ghost" size="sm" onclick={cancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'accent' : 'primary'} size="sm" onclick={confirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  {/if}
</dialog>

<style>
  .bb-dialog {
    padding: 0;
    border: 0;
    background: transparent;
    max-width: min(480px, calc(100vw - 32px));
    width: 100%;
    color: var(--bb-ink);
    overflow: visible;
  }
  .bb-dialog::backdrop {
    background: rgb(10 42 128 / 0.45);
    backdrop-filter: blur(2px);
  }
  .card {
    background: var(--bb-surface);
    border: 2px solid var(--bb-ink);
    box-shadow: var(--bb-shadow);
    animation: bb-dlg-in var(--bb-t-enter) var(--bb-ease) both;
  }
  @keyframes bb-dlg-in {
    from {
      opacity: 0;
      clip-path: inset(0 calc(100% * var(--bb-motion)) 0 0);
      transform: translateX(calc(-24px * var(--bb-motion)));
    }
    to {
      opacity: 1;
      clip-path: inset(-20px);
      transform: none;
    }
  }
  .inner {
    padding: var(--bb-space-5) var(--bb-space-6) var(--bb-space-5);
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--bb-blue-text);
  }
  h2 {
    margin: 2px 0 var(--bb-space-3);
    font-size: var(--bb-text-xl);
    font-weight: 900;
  }
  p {
    margin: 0 0 var(--bb-space-4);
    color: var(--bb-ink-2);
    line-height: 1.6;
  }
  .timer {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: var(--bb-space-4);
  }
  .bar {
    flex: 1;
    height: 6px;
    background: var(--bb-yellow);
    box-shadow: inset 0 -2px 0 var(--bb-panel-ink);
    transform-origin: left;
    transition: transform 100ms linear;
  }
  .sec {
    min-width: 3.5em;
    text-align: right;
    color: var(--bb-ink-3);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--bb-space-4);
  }
</style>
