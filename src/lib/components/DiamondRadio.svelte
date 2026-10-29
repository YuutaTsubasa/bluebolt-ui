<!--
  Labelled radio row with diamond markers; the chosen diamond fills with blue and
  glows, its label turns sky blue. Designed for dark settings panels but follows
  the current text colour, so it also works on light ones.
-->
<script>
  /**
   * @typedef {{ value: string, label: string }} Opt
   * @type {{ label: string, options: Opt[], value?: string, onchange?: (v: string) => void }}
   */
  let { label, options, value = $bindable(options[0]?.value), onchange } = $props();

  const uid = $props.id();

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    const i = options.findIndex((o) => o.value === value);
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + options.length) % options.length;
    value = options[j].value;
    onchange?.(value);
    /** @type {HTMLElement} */ (e.currentTarget).querySelectorAll('button')[j]?.focus();
  }
</script>

<div class="bb-diamond-row">
  <span class="lbl" id="{uid}-l">{label}</span>
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div class="opts" role="radiogroup" aria-labelledby="{uid}-l" {onkeydown}>
    {#each options as o (o.value)}
      {@const on = o.value === value}
      <button
        type="button"
        role="radio"
        aria-checked={on}
        tabindex={on ? 0 : -1}
        class:on
        onclick={() => {
          value = o.value;
          onchange?.(o.value);
        }}
      >
        <span class="dia" aria-hidden="true"></span>
        {o.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .bb-diamond-row {
    display: grid;
    grid-template-columns: minmax(7em, 12em) 1fr;
    align-items: center;
    gap: 0 20px;
    padding: 6px 0;
  }
  .lbl {
    font-weight: 800;
    font-size: var(--bb-text-sm);
  }
  .opts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 46px;
    padding-left: 24px;
    border-left: 2px solid currentColor;
  }
  button {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 4px 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-weight: 800;
    font-size: var(--bb-text-lg);
    cursor: pointer;
  }
  .dia {
    position: relative;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    border: 2.5px solid currentColor;
    background: #2a2440;
    transition:
      background-color var(--bb-dur-2),
      box-shadow var(--bb-dur-3) var(--bb-ease),
      transform var(--bb-dur-3) var(--bb-ease);
  }
  .dia::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: transparent;
    transition: background-color var(--bb-dur-2);
  }
  button:hover .dia {
    transform: rotate(45deg) scale(calc(1 + 0.1 * var(--bb-motion)));
  }
  button.on {
    color: var(--bb-sky);
  }
  button.on .dia {
    border-color: #ffffff;
    background: #ffffff;
    box-shadow: 0 0 10px 2px color-mix(in srgb, var(--bb-sky) 80%, transparent);
  }
  button.on .dia::after {
    background: linear-gradient(135deg, #3d9bff, #0063f0);
  }
  button:focus-visible {
    outline: none;
    box-shadow: none;
  }
  button:focus-visible .dia {
    outline: 2px solid var(--bb-yellow);
    outline-offset: 4px;
  }
</style>
