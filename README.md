# bluebolt-ui

藍・白・黃・黑的遊戲 HUD 風格 UI 套件，給 Svelte 5（含 Tauri v2）專案直接引用。

- **設計 token**：純 CSS 變數，淺色／深色兩套，任何框架都能用。
- **動態**：一條共用曲線 `cubic-bezier(.2,.9,.2,1)`、斜切進場、擦入、掃光、波紋；全部跟著「減少動態」設定。
- **元件**：Svelte 5（runes）元件，原始碼直接隨套件發佈，由使用端的 Vite 編譯。
- **HUD 版面元件**：巨大階梯選單、會旋轉到目前區段的圓環、毛玻璃面板、巨大外框數字、直排大字、日期卡、底部跑馬燈，組起來就是滿版遊戲／直播控制台畫面。
- **特效（可選）**：WebGL2 液態金屬背景 `ChromeBackground`（藍色玻璃緞帶、滑鼠攪動、切畫面時 `surge()` 翻攪）與墨水網點 `InkBackground`，不支援時退回 CSS 漸層。

![總覽（淺色）](docs/screenshots/overview-light.jpg)

| 深色 | 直播畫面 | 手機 |
| --- | --- | --- |
| ![](docs/screenshots/overview-dark.jpg) | ![](docs/screenshots/stream-light.jpg) | ![](docs/screenshots/mobile.jpg) |

風格參考 [MatchaChoco010 的 HTML-in-Canvas demo](https://matchachoco010.github.io/demo-html-in-canvas-bot-dashboard/)（該 repo 沒有授權條款，這裡只參考視覺語言，沒有使用它的任何程式碼或素材）。

## 在其他專案引用

這個 repo 是私人的，用 git 相依並以 tag 固定版本：

```bash
npm install github:YuutaTsubasa/bluebolt-ui#v0.2.0
```

私人 repo 要讓 npm 能用 HTTPS 抓，這台電腦先跑過一次（`gh` 已登入即可）：

```bash
gh auth setup-git
```

CI 上要另外給有 repo 讀取權限的 token（例如 `git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "https://github.com/"`）。

需求：`svelte@^5`（peer）與 `@sveltejs/vite-plugin-svelte`。Svelte 元件以原始碼發佈，`vite-plugin-svelte` 會自動編譯 `node_modules` 裡帶 `svelte` 匯出條件的套件，不用額外設定。

### 1. 載入樣式（app 進入點一次）

```js
import 'bluebolt-ui/styles.css'; // = fonts.css + tokens.css + base.css
```

不想載網頁字型（例如 app 自己帶字型）就分開載：

```js
import 'bluebolt-ui/tokens.css';
import 'bluebolt-ui/base.css';
```

### 2. 用元件

```svelte
<script>
  import { Button, GameMenu, Plate, StatTile, Toaster, toast } from 'bluebolt-ui';
  import { InkBackground } from 'bluebolt-ui/fx'; // 可選，不用就不會載入 shader

  const items = [
    { id: 'start', title: '開始遊戲', en: 'Start' },
    { id: 'options', title: '設定', en: 'Options' },
  ];
  let selected = $state(0);
</script>

<GameMenu {items} bind:selected onchoose={(it) => toast({ title: it.title })} />
<Button en="Play" onclick={() => toast({ title: '開始！' })}>開始</Button>
<Toaster />
```

### 3. 主題與動態

```js
import { setTheme, setMotion } from 'bluebolt-ui';

setTheme('dark');     // 'auto' | 'light' | 'dark'，auto 跟系統
setMotion('reduce');  // 'auto' | 'full' | 'reduce'，auto 跟系統「減少動態」
```

也可以直接在 `<html>` 上寫 `data-theme="dark"`、`data-motion="reduce"`。遊戲的設定選單可以把「動態效果」接到 `setMotion`。

## 內容

### Token（`tokens.css`）

| 變數 | 淺色 | 深色 | 用途 |
| --- | --- | --- | --- |
| `--bb-paper` | `#f3f6fd` | `#060b1a` | 頁面底色 |
| `--bb-surface` | `#ffffff` | `#0d1530` | 卡片、色板 |
| `--bb-ink` / `-2` / `-3` | `#0b0f1a` … | `#eef2fa` … | 文字 |
| `--bb-blue` | `#0040e0` | `#0a4ff0` | 主色（上面放白字，AA） |
| `--bb-blue-text` | `#0040e0` | `#4d86ff` | 藍色文字（AA） |
| `--bb-blue-soft` | `#c4d6ff` | `#0a2466` | 淡藍色板 |
| `--bb-yellow` | `#ffd21f` | `#ffd84a` | 訊號色：焦點、LIVE、警示；上面一律放 `--bb-on-yellow`（黑） |
| `--bb-panel-ink` | `#0b0f1a` | `#05070c` | 兩種主題都維持深色的面板 |

另有玻璃與 HUD 線條（`--bb-glass`、`--bb-glass-edge`、`--bb-hud-line`、`--bb-strip`）、字型（`--bb-font-zh`、`-display`、`-cond`、`-mono`、`-serif` 直排明朝、`-script` 草書點綴）、字級、間距、`--bb-skew`（-12°）、`--bb-ease`、`--bb-dur-1…5`。

對比度：所有文字配色都過 WCAG AA（4.5:1），在建置時用腳本驗過。

### 動態與減少動態

`--bb-motion` 在一般情況是 `1`，系統開「減少動態」或 `data-motion="reduce"` 時是 `0`。所有位移、斜切、遮罩揭露都乘上它，所以減少動態時只剩 120ms 的淡入；波紋、掃光、等待中的小動畫會停；`InkBackground` 只畫一張靜態畫面。

| Action（`bluebolt-ui` 匯出） | 效果 |
| --- | --- |
| `use:wipe={{ delay }}` | 捲進畫面時從左擦入，帶黃色前緣線 |
| `use:sheen` | hover 時斜光掃過 |
| `use:ripple` | 按下時從指標位置擴散；畫進第一個 `[data-ripple]` 子元素 |
| `use:inView={cb}` | 第一次可見時呼叫 |

CSS class：`.bb-shout`（巨大斜體狀態字）、`.bb-script`、`.bb-label`、`.bb-num`、`.bb-mono`、`.bb-hazard`、`.bb-brackets`、`.bb-grain`、`.bb-sr-only`。

### 元件

| 元件 | 說明 |
| --- | --- |
| `Button` | 斜切色板按鈕（`primary`／`accent`／`ink`／`ghost`），hover 浮起＋硬陰影、掃光、波紋；有 `href` 時是 `<a>` |
| `KineticText` | 逐字斜切升起；改 `play` 重播 |
| `KineticHeading` | 黃色編號＋英文小標＋中文大標（`size="hero"` 會自帶底色，適合放在特效背景上） |
| `Plate` | 切角卡片，`tone` 有 surface／blue／soft／ink／yellow，可加角框、紙紋、footer |
| `GameMenu` | 編號遊戲選單：↑↓／W／S／Enter／Esc、滑鼠、手把（十字鍵、左搖桿、A／B） |
| `CutIn` | 全螢幕斜向橫幅（關卡開始、過關），`bind:show` 後自動收起 |
| `StatTile` / `Sparkline` | KPI 數字跳動＋變化量＋自己畫出來的折線 |
| `Gauge` | 分段斜切量表，超過 `warnAt` 變黃 |
| `StatusLamp` | ok／live（脈動）／warn（警示斜紋）／off |
| `Segmented` | 分段切換，斜切指示塊滑動 |
| `Chip` | 可切換的篩選標籤 |
| `Toaster` + `toast()` | 票券造型通知 |
| `ConfirmDialog` | `<dialog>` 確認框，`danger` 有警示帶，`timer` 秒數到自動取消 |
| `HazardStripe` / `Ruler` / `Barcode` | 裝飾：警示帶、尺規刻度、裝飾條碼 |
| `StairMenu` | 滿版用的巨大階梯導覽（窄體大寫＋中文小標＋編號），`compact` 縮成側欄；數字鍵 1–9 切換 |
| `RingDial` | 大型 HUD 圓環：區段名沿圓周排列，切換時轉到正上方；刻度環漂移、小球繞軌；中央是毛玻璃鏡片，可放任何內容 |
| `Panel` | 毛玻璃面板：虹彩邊、黑色斜切標題帶＋黃色編號、右側連結；`from` 決定飛入方向，`delay` 錯開 |
| `ScreenTitle` | 畫面標題：巨大外框數字＋黑底英文標籤＋大標題＋說明 |
| `DisplayWord` | 兩行巨字（上外框、下實心），逐字落下 |
| `VerticalText` | 直排明朝大字＋日期說明 |
| `DateCard` | 會走的日期時間卡＋小統計 |
| `LaneList` | 斜切資料列（代碼、名稱、備註、計數、負載條、大數值），階梯錯位進場 |
| `HudBackdrop` | 點格紙、十字準星、邊緣座標字母、直式尺規 |
| `Ticker` | 底部狀態列：警示條、建置字樣、條碼、跑馬燈 log、按鍵提示，可塞自訂控制項 |
| `ChromeBackground`（`bluebolt-ui/fx`） | WebGL2 液態金屬＋藍色玻璃緞帶背景；`amount` 金屬覆蓋量、`ribbons` 緞帶強度；搭配 `surge()` 做切畫面轉場 |
| `InkBackground`（`bluebolt-ui/fx`） | WebGL2 墨水網點＋黃色等高線背景，滑鼠攪動；不可見時暫停 |

切畫面的做法（demo 的 `src/demo/App.svelte` 就是範例）：`StairMenu` 的 `onchange` 呼叫 `surge()`，內容包在 `{#key screen}` 裡重新掛載，`Panel` 們會依 `delay` 依序飛入，`RingDial` 會自己轉到新區段。

手把輸入也可以單獨用：`onGamepadIntent((intent) => …)`，intent 是 `up`／`down`／`left`／`right`／`confirm`／`back`。

## 開發

```bash
npm install
npm run dev      # demo：http://localhost:5178
npm run build    # 建置 demo 到 dist/（確認元件都能編譯）
```

- `src/lib/`：套件本體（就是發佈出去的內容）。
- `src/demo/`：展示頁，用套件名稱 `bluebolt-ui` 匯入，跟使用端的寫法一樣。`App.svelte` 是滿版 HUD 控制台（數字鍵 1–6 切畫面），`Gallery.svelte` 是各元件的展示區塊。

### 發新版

1. 改 `package.json` 的 `version`。
2. `git tag v0.x.y && git push --tags`。
3. 使用端把相依的 `#v0.x.y` 換成新 tag。

## 為什麼不用 HTML-in-Canvas

參考頁用 Chrome 實驗中的 HTML-in-Canvas（`<canvas layoutsubtree>`＋把 DOM 畫成 WebGPU 貼圖），整頁再用 shader 後製。這個 API 還在 origin trial，Tauri 在 macOS／Linux 用的 WebKit 完全不支援，所以這裡以一般 DOM＋CSS 為主，canvas 只當可選的背景層。之後 API 穩定了，可以再加一個「把整頁畫進 canvas 後製」的進階層。

## 授權

私人專案，未授權（`UNLICENSED`）。字型為 SIL Open Font License（Fontsource）。
