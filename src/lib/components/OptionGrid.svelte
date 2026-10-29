<!--
  Grid of bevelled option tiles (sort keys, filters...). The selected tile turns
  into a faceted blue face. Single choice (radio) or `multiple` (toggle buttons).
-->
<script>
  /**
   * @typedef {{ value: string, label: string, icon?: string }} Opt
   * @type {{
   *   options: Opt[], value?: string, values?: string[], multiple?: boolean,
   *   columns?: number, label?: string, onchange?: (v: string | string[]) => void
   * }}
   */
  let {
    options,
    value = $bindable(options[0]?.value),
    values = $bindable([]),
    multiple = false,
    columns = 4,
    label = '',
    onchange,
  } = $props();

  const isOn = (v) => (multiple ? values.includes(v) : v === value);

  function pick(v) {
    if (multiple) {
      values = values.includes(v) ? values.filter((x) => x !== v) : [...values, v];
      onchange?.(values);
    } else if (v !== value) {
      value = v;
      onchange?.(v);
    }
  }

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    if (multiple) return;
    const i = options.findIndex((o) => o.value === value);
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[e.key];
    if (!step) return;
    e.preventDefault();
    const j = Math.max(0, Math.min(options.length - 1, i + step));
    pick(options[j].value);
    /** @type {HTMLElement} */ (e.currentTarget).querySelectorAll('button')[j]?.focus();
  }
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
  class="bb-optgrid"
  style:--cols={columns}
  role={multiple ? 'group' : 'radiogroup'}
  aria-label={label || undefined}
  {onkeydown}
>
  {#each options as o, i (o.value)}
    {@const on = isOn(o.value)}
    <button
      type="button"
      class:on
      role={multiple ? undefined : 'radio'}
      aria-checked={multiple ? undefined : on}
      aria-pressed={multiple ? on : undefined}
      tabindex={multiple || on ? 0 : -1}
      style:--i={i}
      onclick={() => pick(o.value)}
    >
      {#if o.icon}<span class="ic" aria-hidden="true">{o.icon}</span>{/if}
      <span>{o.label}</span>
    </button>
  {/each}
</div>

<style>
  .bb-optgrid {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 18px 20px;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 52px;
    padding: 6px 10px;
    border: 0;
    background: var(--bb-face-light);
    box-shadow: inset 0 0 0 1.5px #0e0f15, var(--bb-sys-shadow);
    color: #0b0f1a;
    font: inherit;
    font-size: var(--bb-text-md);
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition:
      filter var(--bb-dur-2),
      transform var(--bb-dur-2) var(--bb-ease);
    animation: bb-opt-in var(--bb-t-enter) var(--bb-ease) both;
    animation-delay: calc(var(--i) * 18ms * var(--bb-motion));
  }
  @keyframes bb-opt-in {
    from {
      opacity: 0;
      transform: translateY(calc(8px * var(--bb-motion)));
    }
  }
  button:hover {
    filter: brightness(1.04);
    transform: translateY(calc(-1px * var(--bb-motion)));
  }
  button.on {
    background: var(--bb-face-blue);
    box-shadow: var(--bb-sys-shadow);
    color: #ffffff;
  }
  .ic {
    font-size: 0.95em;
  }
</style>
