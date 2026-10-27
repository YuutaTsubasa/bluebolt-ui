<script>
  import {
    Button,
    KineticHeading,
    Plate,
    GameMenu,
    CutIn,
    StatTile,
    Gauge,
    StatusLamp,
    Segmented,
    Chip,
    Toaster,
    toast,
    ConfirmDialog,
    HazardStripe,
    Ruler,
    Barcode,
    setTheme,
    setMotion,
  } from 'bluebolt-ui';
  import { InkBackground } from 'bluebolt-ui/fx';

  let theme = $state('auto');
  let motion = $state('auto');
  $effect(() => setTheme(theme));
  $effect(() => setMotion(motion));

  const menu = [
    { id: 'start', title: '開始遊戲', en: 'Start', hint: 'ENTER', desc: '從上次的存檔繼續。選單支援 ↑↓、W/S、Enter 與手把十字鍵。' },
    { id: 'versus', title: '對戰模式', en: 'Versus', hint: '2P', desc: '本機雙人對戰。選中時藍色斜板滑入、編號變成黃色方塊。' },
    { id: 'gallery', title: '收藏圖鑑', en: 'Gallery', hint: '42/60', desc: '已解鎖的角色與場景。' },
    { id: 'online', title: '線上排行', en: 'Ranking', hint: 'OFFLINE', disabled: true, desc: '' },
    { id: 'settings', title: '設定', en: 'Settings', hint: 'F2', desc: '畫面、音量與動態效果。可在這裡把動態改成「減少」。' },
  ];
  let sel = $state(0);
  let heroPlay = $state(0);

  let cutin = $state(false);
  let cutinTone = $state('blue');
  let confirmOpen = $state(false);
  let dangerOpen = $state(false);

  let tab = $state('day');
  const chips = $state([
    { label: '台麻', on: true, n: 12 },
    { label: '排球', on: false, n: 7 },
    { label: '闖天下', on: true, n: 21 },
    { label: '跑跑樂', on: false, n: 4 },
    { label: '音鬥樂', on: false, n: 9 },
  ]);

  const stats = {
    day: [
      { label: '同時觀看', en: 'Viewers', value: 1284, delta: 12.4, spark: [3, 4, 4, 6, 5, 8, 9, 8, 11, 13] },
      { label: '平均幀率', en: 'Avg FPS', value: 59.8, decimals: 1, unit: 'fps', delta: 0, spark: [60, 60, 59, 60, 58, 60, 60, 59, 60, 60] },
      { label: '延遲', en: 'Latency', value: 42, unit: 'ms', delta: -8, spark: [60, 55, 58, 50, 48, 46, 45, 44, 43, 42] },
    ],
    week: [
      { label: '同時觀看', en: 'Viewers', value: 8930, delta: 4.1, spark: [8, 7, 9, 10, 9, 11, 12] },
      { label: '平均幀率', en: 'Avg FPS', value: 59.4, decimals: 1, unit: 'fps', delta: -0.3, spark: [60, 59, 59, 60, 58, 59, 59] },
      { label: '延遲', en: 'Latency', value: 47, unit: 'ms', delta: 3, spark: [40, 42, 45, 44, 47, 46, 47] },
    ],
  };

  const swatches = [
    ['--bb-blue', '藍 主色'],
    ['--bb-blue-soft', '淡藍 色板'],
    ['--bb-blue-text', '藍 文字'],
    ['--bb-yellow', '黃 訊號'],
    ['--bb-ink', '黑 文字'],
    ['--bb-paper', '白 底色'],
    ['--bb-surface', '白 卡片'],
    ['--bb-panel-ink', '黑 面板'],
  ];
  let swatchValues = $state({});
  function readSwatches() {
    const cs = getComputedStyle(document.documentElement);
    swatchValues = Object.fromEntries(swatches.map(([v]) => [v, cs.getPropertyValue(v).trim()]));
  }
  $effect(() => {
    theme;
    readSwatches();
    const mq = matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', readSwatches);
    return () => mq.removeEventListener('change', readSwatches);
  });

  let now = $state(new Date());
  $effect(() => {
    const id = setInterval(() => (now = new Date()), 1000);
    return () => clearInterval(id);
  });
  const pad = (n) => String(n).padStart(2, '0');
</script>

<header class="topbar">
  <div class="brand">
    <span class="bolt" aria-hidden="true"></span>
    <span class="name">BLUEBOLT<b>UI</b></span>
    <span class="ver bb-mono">v0.1.0</span>
  </div>
  <div class="tools">
    <StatusLamp state="live" en="Demo" label="展示中" />
    <Segmented
      size="sm"
      label="主題"
      bind:value={theme}
      options={[
        { value: 'auto', label: '自動', en: 'Auto' },
        { value: 'light', label: '淺色', en: 'Light' },
        { value: 'dark', label: '深色', en: 'Dark' },
      ]}
    />
    <Segmented
      size="sm"
      label="動態"
      bind:value={motion}
      options={[
        { value: 'auto', label: '跟系統', en: 'Auto' },
        { value: 'full', label: '完整', en: 'Full' },
        { value: 'reduce', label: '減少', en: 'Reduce' },
      ]}
    />
    <div class="clock" aria-label="目前時間">
      <span class="md bb-num">{pad(now.getMonth() + 1)}.{pad(now.getDate())}</span>
      <span class="hm bb-mono">{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}</span>
    </div>
  </div>
</header>

<section class="hero bb-grain">
  <InkBackground />
  <div class="hero-in">
    <KineticHeading
      level={1}
      size="hero"
      num="00"
      en="Blue · White · Yellow · Black"
      title="可重複使用的遊戲介面"
      play={heroPlay}
    />
    <p class="lead">
      設計 token、動態 action、Svelte 5 元件，一次帶走。<br />
      滑鼠在背景上移動會攪動墨水；系統開了「減少動態」時會自動變成靜態。
    </p>
    <div class="row wrap">
      <Button size="lg" en="Play" onclick={() => { cutinTone = 'blue'; cutin = true; }}>播放 Cut-in</Button>
      <Button size="lg" variant="accent" en="Replay" onclick={() => heroPlay++}>重播標題</Button>
      <Button size="lg" variant="ghost" en="Docs" href="#tokens">看配色</Button>
    </div>
  </div>
  <div class="hero-ruler"><Ruler ticks={80} every={10} step={5} /></div>
</section>

<main>
  <section class="sec">
    <KineticHeading num="01" en="Game Menu" title="選單" sub="鍵盤、滑鼠、手把都能操作" />
    <div class="grid menu-grid">
      <Plate tone="surface" brackets>
        <GameMenu
          items={menu}
          bind:selected={sel}
          label="主選單"
          onchoose={(it) => toast({ title: `選擇了「${it.title}」`, en: 'Selected', tone: 'success' })}
        />
      </Plate>
      <Plate tone="ink" num={String(sel + 1).padStart(2, '0')} en={menu[sel].en} title={menu[sel].title} delay={120} grain>
        <p class="desc">{menu[sel].desc}</p>
        <div class="kv">
          <span class="bb-label">Slot</span><span class="bb-mono">A-{pad(sel * 7 + 3)}</span>
          <span class="bb-label">Status</span><span class="bb-mono">{menu[sel].disabled ? 'LOCKED' : 'READY'}</span>
        </div>
        {#snippet footer()}
          <Barcode value={menu[sel].id} showText />
        {/snippet}
      </Plate>
    </div>
  </section>

  <section class="sec">
    <div class="sec-head">
      <KineticHeading num="02" en="Telemetry" title="數據" />
      <Segmented
        bind:value={tab}
        label="區間"
        options={[
          { value: 'day', label: '今天', en: 'Day' },
          { value: 'week', label: '本週', en: 'Week' },
        ]}
      />
    </div>
    <div class="grid stats">
      {#each stats[tab] as s, i (s.en)}
        <StatTile {...s} tone={i === 0 ? 'blue' : 'surface'} />
      {/each}
      <Plate tone="surface" en="Load" title="系統負載" animate={false}>
        <div class="gauges">
          <Gauge label="CPU" en="i9" value={tab === 'day' ? 0.46 : 0.58} />
          <Gauge label="GPU" en="RTX" value={tab === 'day' ? 0.88 : 0.72} />
          <Gauge label="VRAM" value={0.31} segments={16} />
        </div>
      </Plate>
    </div>
    <div class="lamps">
      <StatusLamp state="ok" en="OBS" />
      <StatusLamp state="live" en="Stream" />
      <StatusLamp state="warn" en="Mic" label="音量過大" />
      <StatusLamp state="off" en="Thor" />
    </div>
  </section>

  <section class="sec">
    <KineticHeading num="03" en="Controls" title="控制" />
    <div class="grid ctl">
      <Plate en="Buttons" title="按鈕">
        <div class="row wrap">
          <Button en="Primary">確認</Button>
          <Button variant="accent" en="Accent">強調</Button>
          <Button variant="ink" en="Ink">深色</Button>
          <Button variant="ghost" en="Ghost">次要</Button>
          <Button size="sm" disabled>停用</Button>
        </div>
      </Plate>
      <Plate en="Filters" title="篩選標籤" delay={80}>
        <div class="row wrap">
          {#each chips as c}
            <Chip bind:selected={c.on} count={c.n}>{c.label}</Chip>
          {/each}
        </div>
        <p class="hint">已選：{chips.filter((c) => c.on).map((c) => c.label).join('、') || '（無）'}</p>
      </Plate>
    </div>
  </section>

  <section class="sec">
    <KineticHeading num="04" en="Feedback" title="回饋" />
    <div class="row wrap">
      <Button variant="primary" en="Toast" onclick={() => toast({ title: '存檔完成', en: 'Saved', body: '第 3 格 · 02:14:09' })}>通知</Button>
      <Button variant="accent" en="Warn" onclick={() => toast({ title: '手把電量低', en: 'Battery', tone: 'warn', body: '剩下 8%' })}>警告通知</Button>
      <Button variant="ink" en="Dialog" onclick={() => (confirmOpen = true)}>確認對話框</Button>
      <Button variant="ghost" en="Danger" onclick={() => (dangerOpen = true)}>危險操作（倒數）</Button>
      <Button variant="accent" en="Clear!" onclick={() => { cutinTone = 'yellow'; cutin = true; }}>黃色 Cut-in</Button>
    </div>
  </section>

  <section class="sec" id="tokens">
    <KineticHeading num="05" en="Tokens" title="配色" sub="切換上方的主題看深色值" />
    <div class="swatches">
      {#each swatches as [v, name]}
        <div class="sw">
          <span class="chip" style:background="var({v})"></span>
          <span class="nm">{name}</span>
          <span class="bb-mono v">{v}</span>
          <span class="bb-mono hex">{swatchValues[v]}</span>
        </div>
      {/each}
    </div>
  </section>
</main>

<footer class="foot">
  <HazardStripe label="bluebolt-ui · private build" moving />
  <div class="foot-in">
    <span class="bb-label">Yuuta Tsubasa · tailsmachine</span>
    <Barcode value="BLUEBOLT-UI-0.1.0" showText />
  </div>
</footer>

<Toaster />
<CutIn bind:show={cutin} tone={cutinTone} num={cutinTone === 'blue' ? '01' : ''} en={cutinTone === 'blue' ? 'Stage Start' : 'Round Clear'} title={cutinTone === 'blue' ? '第一關 開始！' : '過關！'} />
<ConfirmDialog
  bind:open={confirmOpen}
  en="Confirm"
  title="覆蓋存檔？"
  message="第 3 格已經有資料，覆蓋之後無法復原。"
  confirmLabel="覆蓋"
  onconfirm={() => toast({ title: '已覆蓋存檔', en: 'Overwritten', tone: 'success' })}
/>
<ConfirmDialog
  bind:open={dangerOpen}
  danger
  en="Danger"
  title="刪除所有紀錄？"
  message="10 秒內沒有確認會自動取消。"
  confirmLabel="刪除"
  timer={10}
  onconfirm={() => toast({ title: '（展示）已刪除', en: 'Deleted', tone: 'warn' })}
  oncancel={() => toast({ title: '已取消', en: 'Cancelled' })}
/>

<style>
  :global(body) {
    min-height: 100vh;
  }
  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding: 10px 24px;
    background: color-mix(in srgb, var(--bb-paper) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 2px solid var(--bb-ink);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .bolt {
    width: 22px;
    height: 30px;
    background: var(--bb-yellow);
    clip-path: polygon(55% 0, 0 58%, 42% 58%, 30% 100%, 100% 36%, 56% 36%, 75% 0);
    filter: drop-shadow(2px 2px 0 var(--bb-blue));
  }
  .name {
    font-family: var(--bb-font-display);
    font-size: 1.5rem;
    letter-spacing: 0.04em;
  }
  .name b {
    margin-left: 4px;
    padding: 0 6px;
    background: var(--bb-blue);
    color: var(--bb-on-blue);
    font-weight: 400;
  }
  .ver {
    color: var(--bb-ink-3);
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .clock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1;
  }
  .clock .md {
    font-size: 1.3rem;
  }
  .clock .hm {
    color: var(--bb-ink-3);
  }

  .hero {
    position: relative;
    min-height: 520px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 2px solid var(--bb-ink);
  }
  .hero-in {
    position: relative;
    z-index: 2;
    padding: 64px 48px 72px;
    max-width: 1100px;
  }
  .lead {
    max-width: 36em;
    margin: 20px 0 32px;
    padding: 12px 16px;
    background: var(--bb-surface);
    border-left: 4px solid var(--bb-yellow);
    line-height: 1.7;
    color: var(--bb-ink-2);
  }
  .hero-ruler {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    z-index: 2;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 80px;
  }
  .sec {
    margin-top: 64px;
  }
  .sec-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .grid {
    display: grid;
    gap: 20px;
    margin-top: 24px;
  }
  .menu-grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  }
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .ctl {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  .row {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .row.wrap {
    flex-wrap: wrap;
  }
  .sec > .row {
    margin-top: 24px;
  }
  .desc {
    margin: 0 0 16px;
    line-height: 1.7;
    min-height: 3.4em;
  }
  .kv {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 6px 16px;
    align-items: baseline;
  }
  .kv .bb-label {
    color: var(--bb-on-ink-2);
  }
  .gauges {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .lamps {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .hint {
    margin: 14px 0 0;
    font-size: var(--bb-text-sm);
    color: var(--bb-ink-3);
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 24px;
  }
  .sw {
    display: grid;
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto auto;
    column-gap: 12px;
    padding: 10px;
    background: var(--bb-surface);
    border: 1px solid var(--bb-line);
  }
  .sw .chip {
    grid-row: 1 / 4;
    border: 1px solid var(--bb-line-2);
  }
  .nm {
    font-weight: 700;
  }
  .v,
  .hex {
    color: var(--bb-ink-3);
    font-size: 0.75rem;
  }
  .foot-in {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 28px;
  }
  @media (max-width: 760px) {
    .menu-grid {
      grid-template-columns: 1fr;
    }
    .hero-in {
      padding: 40px 20px 56px;
    }
    .topbar {
      position: static;
      padding: 10px 16px;
    }
    main {
      padding: 16px 16px 64px;
    }
  }
</style>
