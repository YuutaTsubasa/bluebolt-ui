<!--
  Four L-shaped corner marks drawn just outside the parent's edges (the parent
  needs position: relative). Purely decorative; colour defaults to the primary.
-->
<script>
  /** @type {{ color?: string, size?: number, thickness?: number, inset?: number }} */
  let { color = 'var(--bb-primary-text)', size = 14, thickness = 1, inset = -1 } = $props();
</script>

<span
  class="bb-corners"
  aria-hidden="true"
  style:--_c={color}
  style:--_s="{size}px"
  style:--_w="{thickness}px"
  style:--_i="{inset}px"
>
  <span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span>
</span>

<style>
  .bb-corners {
    position: absolute;
    inset: var(--_i);
    pointer-events: none;
    z-index: 1;
  }
  span span {
    position: absolute;
    width: var(--_s);
    height: var(--_s);
    border: 0 solid var(--_c);
  }
  .tl { top: 0; left: 0; border-top-width: var(--_w); border-left-width: var(--_w); }
  .tr { top: 0; right: 0; border-top-width: var(--_w); border-right-width: var(--_w); }
  .bl { bottom: 0; left: 0; border-bottom-width: var(--_w); border-left-width: var(--_w); }
  .br { bottom: 0; right: 0; border-bottom-width: var(--_w); border-right-width: var(--_w); }
</style>
