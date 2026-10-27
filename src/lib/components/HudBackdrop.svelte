<!--
  Technical-paper overlay for full-screen layouts: dot grid, crosshair marks,
  edge coordinate letters and an optional vertical ruler. Purely decorative.
-->
<script>
  /** @type {{ fixed?: boolean, dots?: boolean, crosses?: boolean, coords?: boolean, rulerX?: string | null, label?: string }} */
  let { fixed = true, dots = true, crosses = true, coords = true, rulerX = '62%', label = '' } = $props();
</script>

<div class="bb-hud-backdrop" class:fixed aria-hidden="true">
  {#if dots}<div class="dots"></div>{/if}
  {#if crosses}<div class="crosses"></div>{/if}
  {#if coords}
    <span class="co" style="left:26%;top:12px">A</span>
    <span class="co" style="left:62%;top:12px">B</span>
    <span class="co" style="left:26%;bottom:28px">C</span>
    <span class="co" style="left:62%;bottom:28px">D</span>
  {/if}
  {#if rulerX}
    <div class="ruler" style:left={rulerX}>
      {#each { length: 9 } as _, i}<span style:top="{8 + i * 10}%"><em>{i * 5}</em></span>{/each}
      {#if label}<b>{label}</b>{/if}
    </div>
  {/if}
</div>

<style>
  .bb-hud-backdrop {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    color: var(--bb-hud-line);
  }
  .fixed {
    position: fixed;
  }
  .dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--bb-hud-dot) 1px, transparent 1.2px);
    background-size: 16px 16px;
    mask-image: linear-gradient(90deg, #000, rgb(0 0 0 / 0.5) 40%, #000);
  }
  .crosses {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cpath d='M80 74v12M74 80h12' stroke='%23000' stroke-opacity='.28' stroke-width='1'/%3E%3C/svg%3E");
    background-size: 160px 160px;
    background-position: -80px -80px;
  }
  :global(:root[data-theme='dark']) .crosses {
    filter: invert(1);
  }
  .co {
    position: absolute;
    font-family: var(--bb-font-cond);
    font-size: 11px;
    color: var(--bb-ink-3);
  }
  .ruler {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px solid var(--bb-hud-line);
  }
  .ruler span {
    position: absolute;
    left: 0;
    width: 8px;
    border-top: 1px solid var(--bb-hud-line);
  }
  .ruler em {
    position: absolute;
    left: 12px;
    top: -6px;
    font-style: normal;
    font-family: var(--bb-font-mono);
    font-size: 9px;
    color: var(--bb-ink-3);
  }
  .ruler b {
    position: absolute;
    top: 6%;
    left: -14px;
    writing-mode: vertical-rl;
    font: 600 10px var(--bb-font-cond);
    letter-spacing: 0.3em;
    color: var(--bb-ink-3);
  }
</style>
