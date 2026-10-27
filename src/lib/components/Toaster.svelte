<!--
  Renders the toast queue as ticket stubs sliding in from the right.
  Place once near the app root.
-->
<script>
  import { flip } from 'svelte/animate';
  import { toasts, dismiss } from './toast.svelte.js';
  import { reducedMotion } from '../motion/index.js';
  import { cubicOut, cubicIn } from 'svelte/easing';
  import Barcode from './Barcode.svelte';

  /** @type {{ position?: 'bottom-right' | 'top-right' }} */
  let { position = 'bottom-right' } = $props();

  function slideIn(node) {
    const r = reducedMotion();
    return {
      duration: r ? 120 : 420,
      easing: cubicOut,
      css: (t, u) =>
        r ? `opacity:${t}` : `opacity:${Math.min(1, t * 2)};transform:translateX(${u * 110}%) skewX(${u * -12}deg)`,
    };
  }
  function slideOut(node) {
    const r = reducedMotion();
    return {
      duration: r ? 120 : 260,
      easing: cubicIn,
      css: (t, u) => (r ? `opacity:${t}` : `opacity:${t};transform:translateX(${u * 40}%)`),
    };
  }
</script>

<div class="bb-toaster p-{position}" aria-live="polite" aria-relevant="additions">
  {#each toasts as t (t.id)}
    <div class="ticket tone-{t.tone}" role="status" in:slideIn out:slideOut animate:flip={{ duration: 260 }}>
      <div class="stub" aria-hidden="true">
        <span class="no bb-num">{String(t.id).padStart(3, '0')}</span>
        <Barcode value={`T${t.id}${t.title}`} height={26} />
      </div>
      <div class="main">
        {#if t.en}<span class="en">{t.en}</span>{/if}
        <strong>{t.title}</strong>
        {#if t.body}<p>{t.body}</p>{/if}
      </div>
      <button type="button" class="x" aria-label="關閉通知" onclick={() => dismiss(t.id)}>✕</button>
    </div>
  {/each}
</div>

<style>
  .bb-toaster {
    position: fixed;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: min(380px, calc(100vw - 40px));
    pointer-events: none;
  }
  .p-bottom-right {
    bottom: 20px;
    flex-direction: column-reverse;
  }
  .p-top-right {
    top: 20px;
  }
  .ticket {
    --_accent: var(--bb-blue);
    pointer-events: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    background: var(--bb-surface);
    color: var(--bb-ink);
    box-shadow: var(--bb-shadow);
    border: 2px solid var(--bb-ink);
  }
  .tone-success {
    --_accent: var(--bb-blue);
  }
  .tone-warn {
    --_accent: var(--bb-yellow);
  }
  .stub {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
    padding: 10px 12px;
    background: var(--_accent);
    color: var(--bb-on-blue);
    border-right: 2px dashed var(--bb-surface);
  }
  .tone-warn .stub {
    color: var(--bb-on-yellow);
  }
  .no {
    font-size: 1.5rem;
  }
  .main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 12px;
    min-width: 0;
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: var(--bb-text-xs);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bb-ink-3);
  }
  strong {
    font-weight: 800;
  }
  p {
    margin: 2px 0 0;
    font-size: var(--bb-text-sm);
    color: var(--bb-ink-2);
  }
  .x {
    align-self: start;
    margin: 6px;
    width: 28px;
    height: 28px;
    border: 0;
    background: none;
    color: var(--bb-ink-3);
    cursor: pointer;
    font-size: 14px;
  }
  .x:hover {
    color: var(--bb-ink);
    background: var(--bb-line);
  }
</style>
