<!--
  Bottom status bar: hazard stub, build text, barcode, a scrolling log line and key hints.
-->
<script>
  import Barcode from './Barcode.svelte';

  /**
   * @type {{ build?: string, log?: string[], keys?: { k: string, v: string }[], fixed?: boolean, children?: import('svelte').Snippet }}
   */
  let { build = '', log = [], keys = [], fixed = true, children } = $props();
  const line = $derived(log.join('   ·   '));
</script>

<footer class="bb-ticker" class:fixed>
  <span class="haz bb-hazard" aria-hidden="true"></span>
  {#if build}<span class="build">{build}</span>{/if}
  <span class="bc" aria-hidden="true"><Barcode value={build || 'bluebolt'} height={12} /></span>
  <div class="log" aria-live="off">
    {#key line}
      <span class="run">{line}</span>
    {/key}
  </div>
  {#if children}<span class="extra">{@render children()}</span>{/if}
  {#if keys.length}
    <span class="keys">
      {#each keys as k}<kbd>{k.k}</kbd><em>{k.v}</em>{/each}
    </span>
  {/if}
</footer>

<style>
  .bb-ticker {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 30px;
    padding: 0 12px;
    font-family: var(--bb-font-mono);
    font-size: 10.5px;
    color: var(--bb-ink-2);
    background: color-mix(in srgb, var(--bb-paper) 70%, transparent);
    border-top: 1px solid var(--bb-hud-line);
    z-index: 20;
  }
  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .haz {
    width: 70px;
    height: 8px;
    flex: none;
    background-size: 14px 14px;
  }
  .build {
    flex: none;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .bc {
    flex: none;
    color: var(--bb-ink);
  }
  .log {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    border-left: 2px solid var(--bb-ink);
    padding-left: 10px;
    mask-image: linear-gradient(90deg, #000 85%, transparent);
  }
  .run {
    display: inline-block;
    padding-left: 100%;
    animation: bb-tick 38s linear infinite;
  }
  @keyframes bb-tick {
    to {
      transform: translateX(calc(-100% * var(--bb-motion)));
    }
  }
  .extra {
    flex: none;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .keys {
    flex: none;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  kbd {
    padding: 0 5px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    font: inherit;
  }
  em {
    font-style: normal;
    margin-right: 6px;
  }
</style>
