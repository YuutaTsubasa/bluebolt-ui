<!--
  Decorative ruler with minor/major ticks and numbers. Stretches to its container width.
-->
<script>
  /** @type {{ ticks?: number, every?: number, start?: number, step?: number, height?: number }} */
  let { ticks = 60, every = 10, start = 0, step = 1, height = 22 } = $props();
</script>

<div class="bb-ruler" style:height="{height}px" aria-hidden="true">
  {#each { length: ticks + 1 } as _, i}
    <span class="t" class:major={i % every === 0} class:mid={i % every === every / 2} style:left="{(i / ticks) * 100}%">
      {#if i % every === 0}<em>{start + i * step}</em>{/if}
    </span>
  {/each}
</div>

<style>
  .bb-ruler {
    position: relative;
    border-bottom: 1.5px solid var(--bb-ink);
    color: var(--bb-ink-3);
    margin: 0 8px;
  }
  .t {
    position: absolute;
    bottom: 0;
    width: 1px;
    height: 25%;
    background: currentColor;
  }
  .t.mid {
    height: 45%;
  }
  .t.major {
    height: 70%;
    width: 1.5px;
    background: var(--bb-ink);
  }
  .t:last-child em {
    left: auto;
    right: 4px;
  }
  em {
    position: absolute;
    left: 4px;
    top: -4px;
    font-style: normal;
    font-family: var(--bb-font-mono);
    font-size: 9px;
    color: var(--bb-ink-3);
  }
</style>
