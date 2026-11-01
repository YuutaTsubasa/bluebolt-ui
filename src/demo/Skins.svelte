<script>
  import { Segmented, SectionHead, LogRow, Panel, Tele, ScanBar, StatusLamp, VLabel, HexAvatar, Button, Tag, HudBackdrop, setTheme, setSkin } from 'bluebolt-ui';
  import Sampler from './Sampler.svelte';

  const params = new URLSearchParams(location.search);
  let skin = $state(params.get('skin') ?? 'azure');
  let theme = $state(params.get('theme') ?? 'auto');
  $effect(() => setTheme(theme));
  $effect(() => {
    setSkin(skin === 'fusion' ? 'azure' : skin);
    document.documentElement.classList.toggle('demo-fusion', skin === 'fusion');
  });

  const log = [
    { date: '2026.10.31', time: '21:00', chip: 'STREAM', glyph: '▶', title: 'Free Riders Recompiled 全破挑戰', meta: ['3:12:40', '#翼直播'] },
    { date: '2026.10.27', time: '20:30', chip: 'DEV', glyph: '⌘', color: 'var(--bb-signal-deep)', title: 'bluebolt-ui 多套樣式：azure skin', meta: ['v0.4.0'] },
    { date: '2026.10.20', chip: 'ART', glyph: '✦', color: '#7c3aed', title: '新的 Fan Art 收錄', meta: ['#悠然翼繪'] },
    { date: '2026.10.12', time: '22:00', chip: 'STREAM', glyph: '▶', title: '雜談：鍵盤與手把的配置', meta: ['1:45:02'] },
  ];
</script>

<HudBackdrop coords={false} rulerX={null} />

<div class="page">
  <aside class="rail l"><VLabel>BLUEBOLT · SKINS · 2026</VLabel></aside>
  <aside class="rail r"><VLabel>SCROLL ↓</VLabel></aside>

  <nav class="bar">
    <a class="back" href="./">◂ demo</a>
    <Segmented
      size="sm"
      label="樣式"
      bind:value={skin}
      options={[
        { value: 'bluebolt', label: 'bluebolt' },
        { value: 'azure', label: 'azure' },
        { value: 'fusion', label: '融合' },
      ]}
    />
    <Segmented
      size="sm"
      label="主題"
      bind:value={theme}
      options={[
        { value: 'auto', label: '自動' },
        { value: 'light', label: '淺' },
        { value: 'dark', label: '深' },
      ]}
    />
  </nav>

  <!-- a page laid out like yuuta-tsubasa.studio, built only from library parts -->
  <section class="hero">
    <div class="intro">
      <span class="kicker">// SIGNAL ESTABLISHED · TAIWAN VTUBER</span>
      <h1>YUUTA<br />TSUBASA</h1>
      <p>程式系台灣 VTuber。這一頁全部用 bluebolt-ui 的元件組成；切換上方的「樣式」，同一份標記會換成另一套 skin。</p>
      <div class="cta">
        <Button shape="rect">最新直播</Button>
        <Button shape="rect" variant="ghost">關於我</Button>
      </div>
    </div>
    <Panel corners from="right" cut={false} title="Pilot Status" sub="狀態">
      <div class="pilot">
        <HexAvatar label="Yuuta Tsubasa" size={84} />
        <div class="tele">
          <Tele label="CALLSIGN" value="悠太翼" />
          <Tele label="AGENCY" value="ULTIMATE-UTOPIA" />
          <Tele label="NEXT" value="11.03 21:00" accent="var(--bb-primary-text)" />
          <StatusLamp state="live" en="ON AIR" />
        </div>
      </div>
      <div class="vitals">
        <ScanBar label="SONIC LOVE" value={99} />
        <ScanBar label="CODING POWER" value={88} />
        <ScanBar label="STREAMING VALUE" value={92} />
      </div>
    </Panel>
  </section>

  <section class="sec">
    <SectionHead num="05" total="07" en="LOG" zh="開發與直播紀錄" sub="RECENT" deco={'[ 4 ENTRIES ]\nSORT :: DATE ↓'} glitch />
    <div class="log">
      {#each log as e}<LogRow {...e} href="#log" />{/each}
    </div>
  </section>

  <section class="sec">
    <SectionHead num="—" en="SKINS" zh="同一組元件，三套樣式" sub="SIDE BY SIDE" />
    <p class="note">
      每一欄都是同樣的標記，只差外層的 <code>data-skin</code>。「融合」是 azure 再把 signal 換回 bluebolt 的黃黑、打開斜角與硬陰影；
      只改語意變數，沒有改任何元件。
    </p>
    <div class="cols">
      <div data-skin="bluebolt"><Sampler name="bluebolt" note='data-skin="bluebolt"' /></div>
      <div data-skin="azure"><Sampler name="azure" note='data-skin="azure"' /></div>
      <div data-skin="azure" class="demo-fusion"><Sampler name="fusion" note="azure + yellow signal" /></div>
    </div>
    <div class="tags">
      <Tag variant="outline">--bb-primary</Tag><Tag variant="outline">--bb-signal</Tag><Tag variant="outline">--bb-font-display</Tag>
      <Tag variant="outline">--bb-skew</Tag><Tag variant="outline">--bb-slant</Tag><Tag variant="outline">--bb-hard</Tag><Tag variant="outline">--bb-glow</Tag>
    </div>
  </section>
</div>

<style>
  .page {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 72px 80px;
  }
  .rail {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
  }
  .rail.l { left: 20px; }
  .rail.r { right: 20px; }
  .bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    justify-content: flex-end;
    padding: 18px 0;
    border-bottom: 1px solid var(--bb-line);
  }
  .back {
    margin-right: auto;
    font-family: var(--bb-font-mono);
    font-size: 12px;
    color: var(--bb-primary-text);
    text-decoration: none;
  }
  .hero {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 48px;
    align-items: center;
    padding: 64px 0;
  }
  .kicker {
    font-family: var(--bb-font-mono);
    font-size: 11px;
    letter-spacing: 0.22em;
    color: var(--bb-primary-text);
  }
  h1 {
    margin: 16px 0;
    font-family: var(--bb-font-display);
    font-weight: 400;
    font-size: clamp(3.5rem, 8vw, 6.5rem);
    line-height: 0.92;
    letter-spacing: 0.02em;
    color: var(--bb-ink);
  }
  .intro p {
    max-width: 34em;
    line-height: 1.8;
    color: var(--bb-ink-2);
  }
  .cta {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  .pilot {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .tele {
    flex: 1;
    display: grid;
    gap: 4px;
    justify-items: stretch;
  }
  .tele :global(.bb-lamp) {
    justify-self: start;
    margin-top: 6px;
  }
  .vitals {
    display: grid;
    gap: 12px;
    margin-top: 20px;
  }
  .sec {
    padding: 48px 0;
  }
  .log {
    margin-top: 32px;
    border-top: 1px solid var(--bb-line);
  }
  .note {
    max-width: 52em;
    margin: 24px 0;
    line-height: 1.8;
    color: var(--bb-ink-2);
  }
  code {
    font-family: var(--bb-font-mono);
    color: var(--bb-primary-text);
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }
  @media (max-width: 960px) {
    .page { padding: 0 16px 64px; }
    .rail { display: none; }
    .hero,
    .cols { grid-template-columns: 1fr; }
  }
</style>
