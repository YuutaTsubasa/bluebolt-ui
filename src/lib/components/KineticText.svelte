<!--
  Text that rises in per character with a skew + clip reveal.
  Change `play` (any value) to replay the entrance.
-->
<script>
  import { splitChars } from '../motion/index.js';

  /** @type {{ text: string, as?: string, delay?: number, play?: unknown, class?: string }} */
  let { text, as = 'span', delay = 0, play = 0, class: cls = '' } = $props();

  const chars = $derived(splitChars(text));
</script>

<svelte:element this={as} class="bb-kin {cls}" aria-label={text} style:--bb-delay="{delay}ms">
  {#key `${text}|${play}`}
    {#each chars as ch, i}<span class="bb-kin-ch" aria-hidden="true" style:--i={i}>{ch}</span>{/each}
  {/key}
</svelte:element>

<style>
  .bb-kin {
    display: inline-block;
  }
</style>
