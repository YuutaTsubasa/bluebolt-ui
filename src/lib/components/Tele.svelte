<!--
  Telemetry row: small label, a dashed leader and a value. Stack several for a
  readout block.
-->
<script>
  /** @type {{ label?: string, value?: string | number, accent?: string }} */
  let { label = '', value = '', accent = '' } = $props();
</script>

<div class="bb-tele">
  <span class="lbl">{label}</span>
  <span class="dash" aria-hidden="true"></span>
  <span class="val" style:color={accent || null}>{value}</span>
</div>

<style>
  .bb-tele {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-family: var(--bb-font-mono);
    font-size: 11px;
    line-height: 1.5;
  }
  .lbl {
    flex-shrink: 0;
    padding-top: 1px;
    letter-spacing: 0.1em;
    color: var(--bb-ink-3);
  }
  .dash {
    flex: 1 0 12px;
    margin-top: 9px;
    border-top: 1px dashed var(--bb-line-2);
  }
  .val {
    min-width: 0;
    font-weight: 500;
    text-align: right;
    word-break: break-word;
    color: var(--bb-ink);
  }
</style>
