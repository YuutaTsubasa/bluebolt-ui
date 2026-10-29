<!--
  Two-column stat sheet: dark label chips (optional icon) with values beside them.
-->
<script>
  /** @type {{ items: { label: string, value: string | number, icon?: string }[], columns?: number }} */
  let { items, columns = 2 } = $props();
</script>

<dl class="bb-statlist" style:--cols={columns}>
  {#each items as it}
    <div class="row">
      <dt>{#if it.icon}<span aria-hidden="true">{it.icon}</span>{/if}{it.label}</dt>
      <dd>{it.value}</dd>
    </div>
  {/each}
</dl>

<style>
  .bb-statlist {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 6px 22px;
    margin: 0;
  }
  .row {
    display: grid;
    grid-template-columns: minmax(6.5em, auto) 1fr;
    align-items: center;
    gap: 12px;
  }
  dt {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    background: rgb(20 22 34 / 0.55);
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
  }
  dd {
    margin: 0;
    font: 400 1.05rem var(--bb-font-display);
    letter-spacing: 0.04em;
  }
</style>
