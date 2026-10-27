<!--
  Live date/time card: big slanted date, weekday tag, ticking clock, optional stats row.
-->
<script>
  /** @type {{ stats?: { k: string, v: string | number }[], children?: import('svelte').Snippet }} */
  let { stats = [], children } = $props();

  let now = $state(new Date());
  $effect(() => {
    const id = setInterval(() => (now = new Date()), 1000);
    return () => clearInterval(id);
  });
  const p = (n) => String(n).padStart(2, '0');
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
</script>

<div class="bb-date">
  <div class="row">
    <span class="y">{now.getFullYear()}</span><span class="sl">/</span>
    <span class="md">{p(now.getMonth() + 1)}</span><span class="sl">/</span>
    <span class="md">{p(now.getDate())}</span>
    <span class="dow">{days[now.getDay()]}</span>
  </div>
  <div class="time bb-mono">{p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}</div>
  {#if stats.length}
    <div class="stats">
      {#each stats as s}<span><b>{s.k}</b> {s.v}</span>{/each}
    </div>
  {/if}
  {@render children?.()}
</div>

<style>
  .bb-date {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .row {
    display: flex;
    align-items: baseline;
    font-family: var(--bb-font-display);
    line-height: 0.9;
    transform: skewX(-8deg);
  }
  .y {
    font-size: 1.9rem;
  }
  .md {
    font-size: 3.4rem;
  }
  .sl {
    margin: 0 2px;
    font-size: 2.4rem;
    color: var(--bb-blue-text);
  }
  .dow {
    align-self: flex-start;
    margin-left: 6px;
    padding: 1px 6px;
    background: var(--bb-strip);
    color: var(--bb-yellow);
    font: 700 italic 13px var(--bb-font-cond);
  }
  .time {
    color: var(--bb-ink-3);
  }
  .stats {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    padding: 2px 8px;
    border: 1.5px solid var(--bb-ink);
    font-family: var(--bb-font-mono);
    font-size: 11px;
  }
  .stats b {
    font: 700 10px var(--bb-font-cond);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
