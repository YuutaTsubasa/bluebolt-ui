<!--
  Demo of the app layer: a roster (selection) screen with sort / compare / story /
  shop dialogs, and a settings screen.
-->
<script>
  import {
    Button,
    Modal,
    SectionBar,
    OptionGrid,
    DiamondRadio,
    SettingsShell,
    Tag,
    UnitCard,
    StatList,
    toast,
  } from 'bluebolt-ui';

  /** @type {{ section: 'roster' | 'system', onexit?: () => void }} */
  let { section, onexit } = $props();

  // ---------- roster ----------
  const units = [
    { id: 'u1', name: '藍翼', sub: 'Default', level: 12, stars: 1, attr: 'blue', role: '///' },
    { id: 'u2', name: '黃昏', sub: 'Default', level: 8, stars: 1, attr: 'yellow', role: '◇' },
    { id: 'u3', name: '夜航', sub: 'Default', level: 20, stars: 2, attr: 'ink', role: '✶' },
    { id: 'u4', name: '白鷺', sub: 'Default', level: 5, stars: 2, attr: 'white', role: '⟋' },
    { id: 'u5', name: '雷鳴', sub: 'Default', level: 33, stars: 3, attr: 'blue', role: '⟋' },
    { id: 'u6', name: '晴空', sub: 'Default', level: 1, stars: 2, attr: 'blue', role: '◈' },
    { id: 'u7', name: '燈塔', sub: 'Lighthouse', level: 1, stars: 1, attr: 'yellow', role: '◇' },
    { id: 'u8', name: '潮汐', sub: 'Default', level: 1, stars: 1, attr: 'ink', role: '◈' },
    { id: 'u9', name: '流星', sub: 'Meteor', level: 1, stars: 1, attr: 'white', role: '✶' },
    { id: 'u10', name: '極光', sub: 'Aurora', level: 1, stars: 1, attr: 'blue', role: '///', badge: '重複' },
  ];
  /** @type {string[]} */
  let party = $state(['u1', 'u2', 'u3', 'u4', 'u5', 'u6']);
  let focus = $state('u1');
  const cur = $derived(units.find((u) => u.id === focus) ?? units[0]);

  function toggle(id) {
    focus = id;
    if (party.includes(id)) party = party.filter((p) => p !== id);
    else if (party.length < 6) party = [...party, id];
    else toast({ title: '隊伍已滿（最多 6 人）', en: 'Party Full', tone: 'warn' });
  }

  let sortOpen = $state(false);
  let sortKey = $state('role');
  let filters = $state(['blue']);
  let compareOpen = $state(false);
  let storyOpen = $state(false);
  let shopOpen = $state(false);

  // ---------- settings ----------
  const navItems = [
    { id: 'general', label: '一般', icon: '⚙' },
    { id: 'sound', label: '音效', icon: '♪' },
    { id: 'story', label: '劇情', icon: '✎' },
    { id: 'notice', label: '通知', icon: '◔' },
    { id: 'account', label: '帳號', icon: '◍' },
    { id: 'support', label: '支援', icon: '?' },
  ];
  let nav = $state('story');
  let textSpeed = $state('normal');
  let pageSpeed = $state('normal');
  let voice = $state('on');
  let quality = $state('high');
  const speeds = [
    { value: 'slow', label: '慢' },
    { value: 'normal', label: '普通' },
    { value: 'fast', label: '快' },
  ];
</script>

{#snippet emblem()}
  <svg viewBox="0 0 200 200" fill="none" stroke="currentColor">
    <circle cx="100" cy="100" r="92" stroke-width="6" />
    <circle cx="100" cy="100" r="74" stroke-width="2" stroke-dasharray="6 6" />
    <circle cx="100" cy="100" r="56" stroke-width="10" />
    <path d="M108 38 L70 108 H98 L88 162 L132 86 H104 Z" fill="currentColor" stroke="none" />
    {#each { length: 12 } as _, i}
      <line x1="100" y1="2" x2="100" y2="18" stroke-width="5" transform="rotate({i * 30} 100 100)" />
    {/each}
  </svg>
{/snippet}

{#if section === 'roster'}
  <div class="roster">
    <aside class="info bb-on-dark">
      <div class="who">
        <span class="role">{cur.role}</span>
        <span class="stars">{'★'.repeat(cur.stars)}</span>
        <b class="nm">{cur.name}<small>《{cur.sub.toUpperCase()}》</small></b>
      </div>
      <div class="lvrow">
        <span class="lv">Lv.<b>{cur.level}</b></span>
        <Tag variant="blue">覺醒強化</Tag>
      </div>
      <StatList
        items={[
          { icon: '♥', label: 'HP', value: 198 + cur.level * 12 },
          { icon: '⚡', label: '攻擊速度', value: 'A+' },
          { icon: '⚔', label: '攻擊力', value: 157 + cur.level * 5 },
          { icon: '»', label: '抵抗力', value: 50 },
          { icon: '◆', label: '物理防禦', value: 0 },
          { icon: '©', label: '費用', value: 11 },
          { icon: '⬡', label: '特殊防禦', value: 0 },
          { icon: '↻', label: '再出擊', value: 35 },
        ]}
      />
      <div class="skill">
        <b>天穹流 鬼哭</b>
        <div><Tag size="sm">SKILL</Tag> Lv.1</div>
        <p>對前方造成攻擊力 <span class="bb-hl">16%</span> 的 <span class="bb-hl">5 段</span>物理傷害，共施放 <span class="bb-hl">1 次</span>。</p>
      </div>
      <Button shape="rect" block onclick={() => (compareOpen = true)}>完了</Button>
    </aside>

    <section class="grid-area">
      <div class="tools">
        <Button shape="rect" variant="ink" size="sm" onclick={() => (party = [])}>🗑 一括解除</Button>
        <span class="sp"></span>
        <Tag>推薦屬性 ◆</Tag>
        <span class="sortlbl">{({ role: '職業順', level: '等級順', rare: '稀有度' })[sortKey] ?? '排序'}</span>
        <Button shape="rect" variant="ink" size="sm" onclick={() => (sortOpen = true)}>☰ 排序</Button>
        <Button shape="rect" variant="ghost" size="sm" onclick={() => (storyOpen = true)}>劇情框</Button>
        <Button shape="rect" variant="ghost" size="sm" onclick={() => (shopOpen = true)}>商店框</Button>
      </div>
      <div class="cards">
        {#each units as u (u.id)}
          {@const n = party.indexOf(u.id)}
          <UnitCard {...u} num={n >= 0 ? n + 1 : ''} selected={n >= 0} onclick={() => toggle(u.id)} />
        {/each}
      </div>
    </section>
  </div>

  <Modal bind:open={sortOpen} title="排序與篩選" header="none" width="900px">
    {#snippet watermark()}{@render emblem()}{/snippet}
    <SectionBar title="排序" en="Sort" />
    <div class="pad">
      <OptionGrid
        label="排序方式"
        bind:value={sortKey}
        options={[
          { value: 'level', label: '等級順', icon: 'Lv.' },
          { value: 'rare', label: '稀有度', icon: '★' },
          { value: 'role', label: '職業順', icon: '♟' },
          { value: 'awake', label: '覺醒度', icon: '▽' },
          { value: 'get', label: '取得順', icon: '◷' },
          { value: 'name', label: '名稱順', icon: '≡' },
          { value: 'hp', label: 'HP', icon: '♥' },
          { value: 'atk', label: '攻擊力', icon: '⚔' },
        ]}
      />
    </div>
    <SectionBar title="篩選" en="Filter" />
    <div class="pad">
      <OptionGrid
        multiple
        label="屬性篩選"
        bind:values={filters}
        options={[
          { value: 'blue', label: '藍', icon: '◆' },
          { value: 'yellow', label: '黃', icon: '◆' },
          { value: 'ink', label: '黑', icon: '◆' },
          { value: 'white', label: '白', icon: '◇' },
        ]}
      />
    </div>
    {#snippet footer()}
      <Button shape="rect" variant="secondary" size="sm" onclick={() => { sortKey = 'role'; filters = []; }}>重設</Button>
      <span class="sp"></span>
      <Button shape="rect" variant="secondary" onclick={() => (sortOpen = false)}>返回</Button>
      <Button shape="rect" onclick={() => { sortOpen = false; toast({ title: '已套用排序', en: 'Sorted', tone: 'success' }); }}>排序</Button>
    {/snippet}
  </Modal>

  <Modal
    bind:open={compareOpen}
    tone="dark"
    header="none"
    title="更換武器"
    width="1000px"
    split
    actions={[
      { label: '取消', variant: 'secondary' },
      { label: 'OK', variant: 'primary', onclick: () => toast({ title: '已更換武器', en: 'Equipped', tone: 'success' }) },
    ]}
  >
    <div class="compare">
      {#each [{ n: '晴空之刃：SOL', hp: 100, main: '兩名以上破壞手出擊時，破壞手受到的傷害減少', v1: '1%', sub: '破壞手的 HP 提升', v2: '5%' }, { n: 'J E T', hp: 30, main: '出擊中的支援手 BLADE 量表累積量提升', v1: '2%', sub: '支援手的物理防禦提升', v2: '2.5' }] as w, i}
        <div class="wpn">
          <h3 class="serif">{w.n}</h3>
          <div class="erode">侵蝕率 <b>0</b>%</div>
          <div class="wl">Lv. <b>1</b></div>
          <div class="sh">狀態</div>
          <StatList columns={1} items={[{ icon: '♥', label: '命運 HP', value: '3,000' }, { icon: '♥', label: '騎士 HP', value: w.hp }]} />
          <div class="sh">主技能</div>
          <p>{w.main} <span class="bb-hl">{w.v1}</span>。</p>
          <div class="sh">副技能</div>
          <p><span class="bb-hl">{w.sub}</span> {w.v2}。<br /><span class="bb-hl-y">侵蝕率每 20%，上述效果提升 0.1</span></p>
        </div>
        {#if i === 0}<span class="arrow" aria-hidden="true">»</span>{/if}
      {/each}
    </div>
    <p class="ask">要更換武器嗎？</p>
  </Modal>

  <Modal
    bind:open={storyOpen}
    sub="第零章 第一話"
    title="像是魔王的東西－1"
    width="900px"
    actions={[
      { label: '返回', variant: 'secondary' },
      { label: '略過', variant: 'primary', onclick: () => toast({ title: '已略過劇情', en: 'Skip' }) },
    ]}
  >
    {#snippet watermark()}{@render emblem()}{/snippet}
    <p class="story">突然遭到神祕人物襲擊的少年，努力拼湊自己為何會落到這個地步的記憶。故事從這裡開始。這是一位魔王的故事——</p>
  </Modal>

  <Modal bind:open={shopOpen} header="none" title="兌換商品" width="760px">
    <div class="shop">
      <div class="item">
        <div class="pic" aria-hidden="true"><span class="cnt">13</span></div>
        <div class="own">持有數：0</div>
        <div class="price">單價 <s>1,980</s> <b>0</b> <Tag variant="yellow" size="sm">-100%</Tag></div>
      </div>
      <div class="desc">
        <b>攜帶型能量膠 ×13</b>
        <p>臨時用的有機能量膠。用於騎士的覺醒強化。</p>
      </div>
    </div>
    {#snippet footer()}
      <div class="shop-foot">
        <Tag>數量限定：1</Tag>
        <span class="lic">BLUEBOLT OFFICIAL SHOP-13th</span>
      </div>
      <div class="shop-foot r">
        <span class="cost">消費道具 <b>0</b></span>
        <Button shape="rect" block onclick={() => { shopOpen = false; toast({ title: '兌換完成', en: 'Exchanged', tone: 'success' }); }}>兌換</Button>
      </div>
    {/snippet}
  </Modal>
{:else}
  <SettingsShell items={navItems} bind:active={nav}>
    {#snippet topLeft()}
      <Button shape="rect" variant="ink" size="sm" onclick={onexit}>«</Button>
      <Button shape="rect" variant="ink" size="sm">≡</Button>
      <Button shape="rect" variant="ink" size="sm">ⓘ</Button>
    {/snippet}
    {#snippet topRight()}
      <Button shape="rect" variant="secondary" size="sm" onclick={onexit}>回到標題</Button>
      <Button shape="rect" size="sm" onclick={() => toast({ title: '設定已重設', en: 'Reset' })}>重設</Button>
    {/snippet}
    {#if nav === 'story'}
      <SectionBar title="劇情" en="Story" />
      <div class="preview" aria-hidden="true">
        <b>藍翼</b><span>// 藍翼的書房</span>
        <em>
          {#key textSpeed}
            <span class="type" style:--spd={({ slow: '3.2s', normal: '1.8s', fast: '0.8s' })[textSpeed]}>書頁翻動的聲音在房間裡迴盪……</span>
          {/key}
        </em>
      </div>
      <DiamondRadio label="文字顯示速度" options={speeds} bind:value={textSpeed} />
      <DiamondRadio label="翻頁速度" options={speeds} bind:value={pageSpeed} />
    {:else if nav === 'sound'}
      <SectionBar title="音效" en="Sound" />
      <div class="gap"></div>
      <DiamondRadio label="角色語音" options={[{ value: 'on', label: '開' }, { value: 'off', label: '關' }]} bind:value={voice} />
    {:else}
      <SectionBar title={navItems.find((n) => n.id === nav)?.label ?? ''} en="General" />
      <div class="gap"></div>
      <DiamondRadio label="畫質" options={[{ value: 'low', label: '低' }, { value: 'mid', label: '中' }, { value: 'high', label: '高' }]} bind:value={quality} />
    {/if}
    {#snippet navFoot()}
      <Button shape="rect" variant="ghost" block onclick={onexit}>回到標題</Button>
    {/snippet}
  </SettingsShell>
{/if}

<style>
  /* ---------- roster ---------- */
  .roster {
    display: grid;
    grid-template-columns: minmax(300px, 30%) 1fr;
    height: 100%;
    min-height: 0;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px 24px;
    background: linear-gradient(160deg, rgb(62 62 91 / 0.92), rgb(30 34 52 / 0.92));
    color: #ffffff;
    overflow: auto;
  }
  .who {
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 2px 10px;
  }
  .who .role {
    font: 900 1.6rem var(--bb-font-display);
  }
  .who .nm {
    grid-column: 1 / -1;
    padding: 4px 12px;
    background: linear-gradient(90deg, rgb(255 255 255 / 0.12), transparent);
    font-size: 1.3rem;
  }
  .who small {
    font-size: 0.8em;
  }
  .lvrow {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .lv {
    font-size: 1rem;
  }
  .lv b {
    font: 400 2.4rem var(--bb-font-display);
    margin-left: 4px;
  }
  .skill p {
    margin: 6px 0 0;
    line-height: 1.7;
    font-weight: 700;
  }
  .grid-area {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px 18px;
    min-width: 0;
    overflow: auto;
    background: color-mix(in srgb, var(--bb-sys-panel) 82%, transparent);
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .sp {
    flex: 1;
  }
  .sortlbl {
    padding: 0 10px 2px;
    border-bottom: 2px solid #0b0f1a;
    color: #0b0f1a;
    font-weight: 800;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  /* ---------- dialogs ---------- */
  .pad {
    padding: 16px 8px 22px;
  }
  .compare {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 20px;
    align-items: start;
  }
  .wpn .serif {
    margin: 0 0 8px;
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(255 255 255 / 0.1), transparent);
    font-family: var(--bb-font-serif);
    font-size: 1.4rem;
  }
  .erode {
    display: inline-block;
    padding: 0 10px;
    background: rgb(255 255 255 / 0.12);
    border-bottom: 3px solid rgb(255 255 255 / 0.6);
    width: 70%;
  }
  .erode b,
  .wl b {
    font: 400 1.6rem var(--bb-font-display);
  }
  .sh {
    margin: 10px 0 4px;
    font-weight: 900;
  }
  .wpn p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
  }
  .arrow {
    align-self: center;
    font-size: 3rem;
  }
  .ask {
    margin: 12px 0 0;
    text-align: center;
  }
  .story {
    margin: 0;
    font-size: 1.15rem;
  }
  .shop {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24px;
    align-items: center;
    margin: -24px -32px 0;
    padding: 24px 32px;
    background: linear-gradient(180deg, rgb(0 0 0 / 0.04), rgb(0 0 0 / 0.08));
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .pic {
    position: relative;
    width: 150px;
    height: 110px;
    background:
      radial-gradient(50% 40% at 50% 45%, var(--bb-yellow), transparent 70%),
      linear-gradient(150deg, #e9ecf3, #b9bfcc);
    transform: perspective(300px) rotateX(20deg) rotateZ(-8deg);
    box-shadow: 0 6px 10px rgb(0 0 0 / 0.25);
  }
  .cnt {
    position: absolute;
    right: -8px;
    bottom: -8px;
    padding: 2px 8px;
    background: #2a2d3a;
    color: #ffffff;
    font: 400 1.4rem var(--bb-font-display);
  }
  .own,
  .price {
    color: #555a6a;
  }
  .price b {
    font: 400 1.3rem var(--bb-font-display);
    color: #0b0f1a;
  }
  .desc b {
    font-size: 1.15rem;
  }
  .desc p {
    margin: 6px 0 0;
    color: #555a6a;
  }
  .shop-foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .shop-foot.r {
    align-items: stretch;
  }
  .lic {
    font: 600 10px var(--bb-font-cond);
    letter-spacing: 0.12em;
    color: #555a6a;
  }
  .cost {
    text-align: center;
    color: #555a6a;
  }
  .cost b {
    color: var(--bb-blue);
    font: 400 1.6rem var(--bb-font-display);
    margin-left: 8px;
  }

  /* ---------- settings ---------- */
  .preview {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 14px;
    margin: 28px 0 20px;
    padding: 22px 30px;
    background: linear-gradient(110deg, rgb(255 255 255 / 0.22), rgb(255 255 255 / 0.06));
  }
  .preview b {
    font-size: 1.5rem;
  }
  .preview span {
    grid-column: 1;
    font-size: 11px;
    opacity: 0.7;
  }
  .preview em {
    grid-row: 1 / 3;
    grid-column: 2;
    align-self: center;
    font-style: normal;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
  }
  .type {
    display: inline-block;
    animation: bb-type var(--spd) steps(18) both;
  }
  @keyframes bb-type {
    from {
      clip-path: inset(0 calc(100% * var(--bb-motion)) 0 0);
    }
    to {
      clip-path: inset(0);
    }
  }
  .gap {
    height: 20px;
  }

  @media (max-width: 1000px) {
    .roster {
      grid-template-columns: 1fr;
    }
    .compare {
      grid-template-columns: 1fr;
    }
    .arrow {
      display: none;
    }
    .shop {
      grid-template-columns: 1fr;
    }
  }
</style>
