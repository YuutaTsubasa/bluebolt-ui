<script>
  import {
    StairMenu,
    RingDial,
    DisplayWord,
    Panel,
    LaneList,
    DateCard,
    Ticker,
    HudBackdrop,
    ScreenTitle,
    VerticalText,
    Barcode,
    Segmented,
    Toaster,
    toast,
    setTheme,
    setMotion,
  } from 'bluebolt-ui';
  import { ChromeBackground, surge } from 'bluebolt-ui/fx';
  import Gallery from './Gallery.svelte';

  const screens = [
    { id: 'overview', en: 'Overview', zh: '總覽' },
    { id: 'stream', en: 'Stream', zh: '直播' },
    { id: 'scenes', en: 'Scenes', zh: '場景' },
    { id: 'games', en: 'Games', zh: '遊戲' },
    { id: 'metrics', en: 'Metrics', zh: '數據' },
    { id: 'controls', en: 'Controls', zh: '元件' },
  ];
  let screen = $state('overview');
  const idx = $derived(screens.findIndex((s) => s.id === screen));
  const isOverview = $derived(screen === 'overview');

  let theme = $state('auto');
  let motion = $state('auto');
  $effect(() => setTheme(theme));
  $effect(() => setMotion(motion));

  const lanes = [
    { code: 'S01', title: '開場', en: 'Opening', note: '倒數＋BGM', count: 12, load: 0.3, value: '0:45', active: true },
    { code: 'S02', title: '雜談', en: 'Talk', note: '聊天室精選', count: 48, load: 0.62, value: '1:12' },
    { code: 'S03', title: '遊戲', en: 'Gameplay', note: 'Free Riders', count: 7, load: 0.85, value: '2:30' },
    { code: 'S04', title: '歌回', en: 'Karaoke', note: '音量偵測', count: 3, load: 0.12, value: '0:00' },
    { code: 'S05', title: '收尾', en: 'Ending', note: '感謝名單', count: 1, load: 0.05, value: '0:00' },
  ];

  const chat = [
    { who: 'Mika', text: '今天的新畫面好帥！' },
    { who: 'Ren', text: '藍色這次很有感' },
    { who: 'Tails', text: '等等要玩哪一關？' },
  ];

  const events = [
    ['13:00', '開播', 'RUN'],
    ['13:02', '場景', 'S02'],
    ['13:05', '超級留言', '¥500'],
    ['13:09', '新訂閱', 'x3'],
    ['13:14', '場景', 'S03'],
    ['13:20', '音量', 'PEAK'],
    ['13:21', '聊天', '+120'],
    ['13:28', '剪輯點', 'MARK'],
  ];

  const log = [
    '13:00:46 STREAM start bitrate=8000 encoder=nvenc',
    'scene=S03 source=game-capture fps=60',
    'chat rate=34/min viewers=1284',
    'mic peak=-6dB limiter=on',
  ];

  function onScreen(id) {
    surge();
  }
</script>

<ChromeBackground amount={isOverview ? 0.85 : 0.6} ribbons={0.85} />
<HudBackdrop label="BLUEBOLT — STREAM CONSOLE — 2026" />

<div class="stage" class:overview={isOverview}>
  <!-- left: brand + stair menu -->
  <aside class="nav">
    <div class="brand">
      <span class="bolt" aria-hidden="true"></span>
      <span class="yr">2026</span>
      <span class="nm">bluebolt</span>
      <span class="sub">STREAM<br />CONSOLE</span>
      <span class="on">ONLINE</span>
    </div>
    <StairMenu items={screens} bind:active={screen} compact={!isOverview} onchange={onScreen} />
    <div class="nav-foot">
      <span class="dia" aria-hidden="true"></span> ONLINE <span class="bb-mono t">01:12:11</span>
    </div>
  </aside>

  <!-- the dial travels between centre stage and the right edge -->
  <div class="dial-wrap">
    <RingDial labels={screens.map((s) => s.en)} active={idx} caption={isOverview ? 'bluebolt' : ''}>
      {#if isOverview}
        <DisplayWord top="BLUE" bottom="BOLT" accent="UI KIT" />
      {:else}
        <span class="dial-num">{String(idx + 1).padStart(2, '0')}</span>
      {/if}
    </RingDial>
  </div>

  {#key screen}
    <div class="screen">
      {#if screen === 'overview'}
        <div class="console-tag">
          <span class="ct">bluebolt Console</span>
          <span class="cs">STREAM / SCENE / CHAT<br />STATUS AT A GLANCE</span>
        </div>

        <div class="right">
          <DateCard stats={[{ k: 'Viewers', v: 1284 }, { k: 'Chat/min', v: 34 }]} />
          <Panel num="05" title="Audience" sub="觀眾" link="詳細" delay={120}>
            <div class="kpis">
              <span><small>NOW</small><b>1,284</b></span>
              <span><small>PEAK</small><b>1,530</b></span>
              <span><small>NEW</small><b class="y">36</b></span>
            </div>
          </Panel>
          <Panel num="06" title="Latency — 15 min" sub="延遲" link="數據" delay={200}>
            <div class="lat">
              <span><small>ENCODE</small><b>4.1ms</b><em>編碼 P50</em></span>
              <span><small>ENCODE</small><b>6.8ms</b><em>編碼 P95</em></span>
              <span><small>GLASS-TO-GLASS</small><b>1.9s</b><em>端到端</em></span>
              <span><small>DROPPED</small><b>0.02%</b><em>掉幀</em></span>
            </div>
          </Panel>
          <Panel num="03" title="Now Talking" sub="聊天室" delay={280}>
            <ul class="chat">
              {#each chat as c}<li><b>{c.who}</b><span>{c.text}</span></li>{/each}
            </ul>
          </Panel>
          <Panel num="04" title="Recent Events" sub="事件" tone="ink" delay={360} link="紀錄">
            <table class="ev">
              <tbody>
                {#each events as e, i}
                  <tr class:hl={i === 0}><td class="bb-mono">{e[0]}</td><td>{e[1]}</td><td class="r">{e[2]}</td></tr>
                {/each}
              </tbody>
            </table>
          </Panel>
        </div>

        <div class="lanes">
          <Panel num="02" title="Scenes — 5 lanes" sub="場景" from="left" delay={160} link="場景">
            <LaneList {lanes} countLabel="CUE" loadLabel="CPU" delay={260} />
          </Panel>
        </div>

        <div class="status">
          <Panel num="01" title="Status — Stream" sub="直播狀態" tone="glass" from="down" delay={240}>
            <div class="st">
              <div class="st-main">
                <span class="bb-shout air">ON AIR</span>
                <span class="st-sub"><b>直播中</b> UP 01:12:11</span>
                <dl>
                  <dt>CH</dt><dd>#雜談 · 遊戲回</dd>
                  <dt>GUEST</dt><dd><i>Mika</i><i>Ren</i><i>Tails</i></dd>
                  <dt>OUTPUT</dt><dd><code>1080p60</code><code>8000kbps</code><code class="dim">rec.mkv</code></dd>
                  <dt>BUDGET</dt><dd class="budget"><span class="bb-hazard-lite" style="--w:64%"></span><em>64%</em></dd>
                </dl>
              </div>
              <button class="stop" type="button" onclick={() => toast({ title: '（展示）停止直播', en: 'Stop', tone: 'warn' })}>
                <span class="sq" aria-hidden="true"></span>
                <b>停止直播</b><small>STOP</small>
              </button>
            </div>
          </Panel>
        </div>
      {:else if screen === 'stream'}
        <div class="sec-head"><ScreenTitle num="02" en="Stream Control" title="直播" total="06" desc="開播、暫停、收播的流程與狀態。數字鍵 1–6 切換畫面。" /></div>
        <div class="vert"><VerticalText text="直播中" caption="2026.10.27 TUE." sub="13:00 Started" /></div>
        <div class="col-l">
          <Panel num="B" title="/health & Guard" sub="檢查" from="left" delay={100}>
            <dl class="dots">
              <dt>狀態</dt><dd>直播中</dd>
              <dt>編碼器</dt><dd>NVENC H.264</dd>
              <dt>位元率</dt><dd>8000 kbps</dd>
              <dt>麥克風</dt><dd>-12 dB</dd>
              <dt>錄影</dt><dd>rec_2026-10-27.mkv</dd>
            </dl>
          </Panel>
          <Panel num="E" title="Procedure" sub="開播流程" from="left" delay={200}>
            <ol class="proc">
              <li>STANDBY</li><li>CHECK</li><li>START</li><li class="on">ON AIR</li><li>END</li>
            </ol>
            <div class="steps">
              <div><b>01 CHECK</b><p>確認麥克風、場景、聊天室連線都正常。</p></div>
              <div><b>02 START</b><p>倒數 10 秒後切到開場場景。</p></div>
              <div><b>03 END</b><p>播感謝名單，錄影自動存檔。</p></div>
            </div>
          </Panel>
        </div>
        <div class="col-r">
          <Panel num="H" title="History — 48 h" sub="紀錄" tone="ink" delay={260}>
            <ul class="hist">
              <li><span class="bb-mono">10/27 13:00</span> 直播中</li>
              <li><span class="bb-mono">10/26 21:00</span> 歌回 2h14m</li>
              <li><span class="bb-mono">10/25 20:30</span> 遊戲回 3h02m</li>
            </ul>
            <Barcode value="history-48h" showText />
          </Panel>
        </div>
      {:else}
        <div class="sec-head">
          <ScreenTitle
            num={String(idx + 1).padStart(2, '0')}
            en={screens[idx].en}
            title={screens[idx].zh}
            total="06"
            desc="元件展示。數字鍵 1–6 切換畫面。"
          />
        </div>
        <div class="gallery">
          <Gallery section={screen} />
        </div>
      {/if}
    </div>
  {/key}
</div>

<Ticker
  build="bluebolt / stream console — build 2026.10"
  {log}
  keys={[{ k: '1-6', v: '畫面' }, { k: 'Tab', v: '移動' }, { k: 'Enter', v: '決定' }]}
>
    
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
    <Segmented
      size="sm"
      label="動態"
      bind:value={motion}
      options={[
        { value: 'auto', label: '系統' },
        { value: 'full', label: '完整' },
        { value: 'reduce', label: '減少' },
      ]}
    />
</Ticker>
<Toaster />

<style>
  :global(body) {
    overflow: hidden;
  }
  .stage {
    position: relative;
    z-index: 2;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }

  /* compact theme/motion switches inside the ticker */
  :global(.bb-ticker .extra .bb-seg) {
    padding: 1px;
    border-width: 1px;
  }
  :global(.bb-ticker .extra .bb-seg button) {
    font-size: 10px;
    padding: 1px 8px;
  }

  /* ---------- nav ---------- */
  .nav {
    position: absolute;
    left: 14px;
    top: 12px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: min(30vw, 440px);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 1.5px solid var(--bb-ink);
  }
  .bolt {
    width: 14px;
    height: 20px;
    background: var(--bb-yellow);
    clip-path: polygon(55% 0, 0 58%, 42% 58%, 30% 100%, 100% 36%, 56% 36%, 75% 0);
    filter: drop-shadow(1.5px 1.5px 0 var(--bb-blue));
  }
  .yr {
    font: italic 400 1.2rem var(--bb-font-display);
    padding-right: 8px;
    border-right: 1.5px solid var(--bb-ink);
  }
  .nm {
    font-weight: 900;
    font-size: 1.3rem;
    letter-spacing: -0.01em;
  }
  .sub {
    font: 700 8px/1 var(--bb-font-cond);
    letter-spacing: 0.1em;
    color: var(--bb-ink-2);
  }
  .on {
    margin-left: auto;
    padding: 1px 8px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    font: 700 italic 10px var(--bb-font-cond);
    letter-spacing: 0.1em;
    transform: skewX(-12deg);
  }
  .nav-foot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--bb-hud-line);
    font: 700 11px var(--bb-font-cond);
    letter-spacing: 0.1em;
  }
  .nav-foot .t {
    margin-left: auto;
    color: var(--bb-ink-3);
  }
  .dia {
    width: 8px;
    height: 8px;
    border: 1.5px solid var(--bb-ink);
    transform: rotate(45deg);
  }
  .toggles {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* ---------- dial ---------- */
  .dial-wrap {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: 47%;
    transform: translate(-50%, -50%);
    transition:
      transform 1s var(--bb-ease),
      left 1s var(--bb-ease),
      top 1s var(--bb-ease);
  }
  .stage:not(.overview) .dial-wrap {
    left: 84%;
    top: 30%;
    transform: translate(-50%, -50%) scale(0.55);
  }
  .dial-num {
    font-family: var(--bb-font-display);
    font-size: 11rem;
    color: transparent;
    -webkit-text-stroke: 2px var(--bb-ink);
  }

  /* ---------- screens ---------- */
  .screen {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }
  .screen > :global(*) {
    pointer-events: auto;
  }
  .console-tag {
    position: absolute;
    left: 31%;
    top: 40px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    pointer-events: none;
  }
  .ct {
    align-self: flex-start;
    padding: 1px 6px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    font: 700 10px var(--bb-font-zh);
  }
  .cs {
    font: 600 9px/1.3 var(--bb-font-cond);
    letter-spacing: 0.1em;
    color: var(--bb-ink-2);
  }

  .right {
    position: absolute;
    right: 14px;
    top: 14px;
    bottom: 34px;
    width: min(23vw, 340px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .right > :global(.bb-date) {
    padding: 8px 12px;
    background: var(--bb-glass-strong);
    box-shadow: inset 0 0 0 1px var(--bb-glass-edge);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .right > :global(.bb-panel:last-child) {
    flex: 1;
    min-height: 0;
  }
  .kpis {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .kpis span,
  .lat span {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }
  small {
    font: 700 9px var(--bb-font-cond);
    letter-spacing: 0.12em;
    color: var(--bb-ink-3);
  }
  .kpis b {
    font: italic 400 2.1rem var(--bb-font-display);
  }
  .kpis b.y {
    color: var(--bb-blue-text);
  }
  .lat {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
  }
  .lat span:nth-child(odd) {
    border-right: 1.5px solid var(--bb-ink);
  }
  .lat b {
    margin: 2px 0;
    font: italic 400 1.45rem var(--bb-font-display);
  }
  .lat em {
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
  }
  .chat {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .chat li {
    display: flex;
    align-items: stretch;
    font-size: 12px;
  }
  .chat b {
    padding: 3px 8px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    font-size: 11px;
  }
  .chat span {
    flex: 1;
    padding: 3px 8px;
    background: var(--bb-surface);
    box-shadow: inset 0 0 0 1px var(--bb-ink);
  }
  .chat li:first-child b {
    background: var(--bb-blue);
  }
  .ev {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .ev td {
    padding: 4px 4px;
    border-bottom: 1px solid rgb(255 255 255 / 0.08);
  }
  .ev td:first-child {
    color: var(--bb-on-ink-2);
    width: 4em;
  }
  .ev .r {
    text-align: right;
    font: italic 400 14px var(--bb-font-display);
  }
  .ev tr.hl td {
    background: var(--bb-blue);
    color: var(--bb-on-blue);
  }

  .lanes {
    position: absolute;
    left: 0;
    bottom: 36px;
    width: min(31vw, 470px);
    height: 36%;
  }
  .lanes > :global(.bb-panel) {
    height: 100%;
  }
  .status {
    position: absolute;
    left: calc(min(31vw, 470px) + 14px);
    right: calc(min(23vw, 340px) + 28px);
    bottom: 36px;
    height: 31%;
  }
  .status > :global(.bb-panel) {
    height: 100%;
    --bb-glass: color-mix(in srgb, var(--bb-blue-soft) 70%, transparent);
  }
  .st {
    display: flex;
    gap: 16px;
    height: 100%;
  }
  .st-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .air {
    font-size: clamp(2.6rem, min(5vw, 9vh), 5.4rem);
    color: var(--bb-ink);
  }
  .st-sub {
    font-size: 11px;
  }
  .st-sub b {
    padding: 1px 6px;
    margin-right: 6px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
  }
  dl {
    display: grid;
    grid-template-columns: 70px 1fr;
    gap: 3px 10px;
    margin: 6px 0 0;
    font-size: 11px;
  }
  dt {
    font: 700 9px var(--bb-font-cond);
    letter-spacing: 0.14em;
    align-self: center;
  }
  dd {
    margin: 0;
    display: flex;
    gap: 6px;
    align-items: center;
    padding-bottom: 3px;
    border-bottom: 1px solid var(--bb-hud-line);
  }
  dd i {
    font-style: normal;
    padding: 0 6px;
    border: 1.5px solid var(--bb-ink);
    background: var(--bb-surface);
    transform: skewX(-10deg);
  }
  dd code {
    padding: 0 5px;
    background: var(--bb-strip);
    color: var(--bb-on-strip);
    font-family: var(--bb-font-mono);
    font-size: 10px;
  }
  dd code.dim {
    background: none;
    color: var(--bb-ink-3);
    text-decoration: line-through;
  }
  .budget {
    gap: 10px;
  }
  .bb-hazard-lite {
    flex: 1;
    height: 8px;
    background:
      linear-gradient(90deg, transparent var(--w), var(--bb-line) var(--w)),
      repeating-linear-gradient(-60deg, var(--bb-ink) 0 6px, transparent 6px 10px);
  }
  .budget em {
    font-style: normal;
    font-family: var(--bb-font-mono);
  }
  .stop {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 120px;
    padding: 14px 10px;
    border: 2px solid var(--bb-ink);
    background: var(--bb-surface);
    color: var(--bb-ink);
    cursor: pointer;
    box-shadow: 5px 5px 0 var(--bb-ink);
    transition:
      transform var(--bb-dur-3) var(--bb-ease),
      box-shadow var(--bb-dur-3) var(--bb-ease);
  }
  .stop:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 var(--bb-blue);
  }
  .stop .sq {
    width: 26px;
    height: 26px;
    background: var(--bb-yellow);
    box-shadow: inset 0 0 0 2px var(--bb-ink);
  }
  .stop b {
    font-size: 14px;
  }
  .stop small {
    color: var(--bb-ink-2);
  }

  /* ---------- secondary screens ---------- */
  .sec-head {
    position: absolute;
    left: calc(min(30vw, 440px) * 0.62 + 30px);
    top: 18px;
  }
  .vert {
    position: absolute;
    right: calc(min(26vw, 360px) + 40px);
    top: 34%;
  }
  .col-l {
    position: absolute;
    left: calc(min(30vw, 440px) * 0.62 + 30px);
    top: 190px;
    width: min(34vw, 480px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .col-r {
    position: absolute;
    right: 14px;
    bottom: 40px;
    width: min(26vw, 360px);
  }
  .dots dt {
    font: 700 12px var(--bb-font-zh);
    letter-spacing: 0;
  }
  .proc {
    list-style: none;
    display: flex;
    gap: 6px;
    margin: 0 0 10px;
    padding: 0;
  }
  .proc li {
    padding: 2px 8px;
    border: 1.5px solid var(--bb-ink);
    font: 700 italic 10px var(--bb-font-cond);
    letter-spacing: 0.08em;
    transform: skewX(-10deg);
  }
  .proc li.on {
    background: var(--bb-blue);
    color: var(--bb-on-blue);
    border-color: var(--bb-blue);
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .steps div {
    padding: 6px 8px;
    border: 1.5px solid var(--bb-ink);
    background: var(--bb-surface);
  }
  .steps p {
    margin: 4px 0 0;
    font-size: 11px;
    line-height: 1.5;
  }
  .hist {
    list-style: none;
    margin: 0 0 10px;
    padding: 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .hist span {
    color: var(--bb-yellow);
    margin-right: 8px;
  }
  .gallery {
    position: absolute;
    left: calc(min(30vw, 440px) * 0.62 + 30px);
    right: min(30vw, 420px);
    top: 170px;
    bottom: 40px;
    overflow: auto;
    padding: 4px 8px 20px 4px;
  }

  /* ---------- narrow screens: stack and scroll ---------- */
  @media (max-width: 1000px) {
    :global(body) {
      overflow: auto;
    }
    .stage {
      height: auto;
      overflow: visible;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 12px 12px 48px;
    }
    .nav,
    .dial-wrap,
    .screen,
    .right,
    .lanes,
    .status,
    .sec-head,
    .vert,
    .col-l,
    .col-r,
    .gallery,
    .console-tag {
      position: static;
      width: auto;
      height: auto;
      transform: none;
    }
    .dial-wrap,
    .stage:not(.overview) .dial-wrap {
      align-self: center;
      transform: none;
    }
    .dial-wrap :global(.bb-dial) {
      --size: min(88vw, 520px) !important;
    }
    .stage:not(.overview) .dial-wrap {
      display: none;
    }
    .screen {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .right {
      display: flex;
    }
    .status {
      min-height: 260px;
    }
  }
</style>
