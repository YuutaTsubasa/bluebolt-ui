<!-- One block of components; rendered once per skin on the skins page. -->
<script>
  import { Panel, Button, Tag, Gauge, HazardStripe, ScanBar, Tele, StatusLamp, Chip, Plate, HexAvatar } from 'bluebolt-ui';

  /** @type {{ name: string, note: string }} */
  let { name, note } = $props();
  let chip = $state(true);
</script>

<div class="sampler">
  <header>
    <HexAvatar label={name} size={44} />
    <div>
      <b>{name}</b>
      <small>{note}</small>
    </div>
  </header>

  <Panel num="01" title="Signal" sub="訊號" corners from="up">
    <div class="tele">
      <Tele label="SKIN" value={name} />
      <Tele label="PRIMARY" value="--bb-primary" accent="var(--bb-primary-text)" />
      <Tele label="SIGNAL" value="--bb-signal" accent="var(--bb-signal-deep)" />
    </div>
    <ScanBar label="SYNC" value={82} />
  </Panel>

  <div class="row">
    <Button>開始</Button>
    <Button variant="accent">加速</Button>
    <Button variant="ghost">取消</Button>
  </div>
  <div class="row">
    <Button shape="rect">決定</Button>
    <Button shape="rect" variant="secondary">返回</Button>
  </div>
  <div class="row">
    <Tag>SKILL</Tag>
    <Tag variant="yellow">-20%</Tag>
    <Tag variant="blue">NEW</Tag>
    <Tag variant="outline">LV.12</Tag>
    <Chip bind:selected={chip} count={12}>台麻</Chip>
  </div>
  <div class="row"><StatusLamp state="live" en="LIVE" /><StatusLamp state="warn" en="WARN" /></div>
  <Gauge value={0.86} label="負載" en="LOAD" segments={16} />
  <HazardStripe label="CAUTION — 注意" height={18} />
  <Plate tone="blue" num="02" en="Boost" title="雷光衝刺" animate={false}>
    <span class="bb-on-dark">衝刺時速度提升 <span class="bb-hl-y">12%</span>。</span>
  </Plate>
</div>

<style>
  .sampler {
    display: grid;
    gap: 16px;
    align-content: start;
    min-width: 0;
    padding: 20px;
    background: var(--bb-page);
    color: var(--bb-ink);
    font-family: var(--bb-font-body);
    border: 1px solid var(--bb-line);
  }
  header {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  header b {
    display: block;
    font-family: var(--bb-font-display);
    font-size: 1.5rem;
    line-height: 1;
    letter-spacing: 0.04em;
  }
  header small {
    font-family: var(--bb-font-mono);
    font-size: 11px;
    color: var(--bb-ink-3);
  }
  .tele {
    display: grid;
    gap: 4px;
    margin-bottom: 12px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
</style>
