<!--
  Segmented control / tab strip with a sliding skewed indicator.
  Arrow keys move the selection (radio-group semantics).
-->
<script>
  /**
   * @typedef {{ value: string, label: string, en?: string }} Option
   * @type {{ options: Option[], value?: string, label?: string, size?: 'sm' | 'md', onchange?: (v: string) => void }}
   */
  let { options, value = $bindable(options[0]?.value), label = '', size = 'md', onchange } = $props();

  /** @type {Record<string, HTMLButtonElement>} */
  const btns = $state({});
  let ind = $state({ x: 0, w: 0, ready: false });

  function measure() {
    const b = btns[value];
    if (!b) return;
    ind = { x: b.offsetLeft, w: b.offsetWidth, ready: true };
  }

  $effect(() => {
    value;
    measure();
  });

  $effect(() => {
    const ro = new ResizeObserver(measure);
    for (const b of Object.values(btns)) ro.observe(b);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  });

  function pick(v) {
    if (v === value) return;
    value = v;
    onchange?.(v);
  }

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    const i = options.findIndex((o) => o.value === value);
    let j = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % options.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + options.length) % options.length;
    else return;
    e.preventDefault();
    pick(options[j].value);
    btns[options[j].value]?.focus();
  }
</script>

<!-- focus lives on the radio buttons inside (roving tabindex) -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div class="bb-seg s-{size}" role="radiogroup" aria-label={label || undefined} {onkeydown}>
  <span
    class="ind"
    class:ready={ind.ready}
    style:transform="translateX({ind.x}px) skewX(var(--bb-skew))"
    style:width="{ind.w}px"
    aria-hidden="true"
  ></span>
  {#each options as o (o.value)}
    <button
      type="button"
      role="radio"
      aria-checked={o.value === value}
      tabindex={o.value === value ? 0 : -1}
      class:on={o.value === value}
      bind:this={btns[o.value]}
      onclick={() => pick(o.value)}
    >
      <span class="zh">{o.label}</span>
      {#if o.en}<span class="en">{o.en}</span>{/if}
    </button>
  {/each}
</div>

<style>
  .bb-seg {
    position: relative;
    display: inline-flex;
    padding: 4px;
    gap: 2px;
    background: var(--bb-surface);
    border: 2px solid var(--bb-ink);
    isolation: isolate;
  }
  .ind {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    z-index: -1;
    background: var(--bb-blue);
    box-shadow: 3px 3px 0 var(--bb-yellow);
    opacity: 0;
  }
  .ind.ready {
    opacity: 1;
    transition:
      transform var(--bb-dur-3) var(--bb-ease),
      width var(--bb-dur-3) var(--bb-ease);
  }
  button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0.45em 1.1em;
    border: 0;
    background: none;
    color: var(--bb-ink-2);
    font: inherit;
    font-weight: 700;
    line-height: 1.1;
    cursor: pointer;
    transition: color var(--bb-dur-2);
  }
  button:hover {
    color: var(--bb-ink);
  }
  button.on {
    color: var(--bb-on-blue);
  }
  .en {
    font-family: var(--bb-font-cond);
    font-weight: 600;
    font-size: 0.65em;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.75;
  }
  .s-sm button {
    font-size: var(--bb-text-sm);
    padding: 0.35em 0.9em;
  }
</style>
