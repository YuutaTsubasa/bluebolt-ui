<!--
  Character / unit portrait card for selection grids: slot number in a cut
  corner, rarity stars, name, variant line, level and a small attribute badge.
  Pass artwork through the `portrait` snippet; without it a tinted placeholder
  with the initial is drawn. Selected cards get a blue frame and glow.
-->
<script>
  /**
   * @type {{
   *   name: string, sub?: string, level?: number, stars?: number, num?: number | string,
   *   role?: string, attr?: 'blue' | 'yellow' | 'ink' | 'white', selected?: boolean, badge?: string,
   *   onclick?: () => void, portrait?: import('svelte').Snippet
   * }}
   */
  let { name, sub = '', level = 1, stars = 1, num = '', role = '', attr = 'blue', selected = false, badge = '', onclick, portrait } = $props();
</script>

<button type="button" class="bb-unit" class:selected aria-pressed={selected} {onclick}>
  <span class="art" aria-hidden="true">
    {#if portrait}
      {@render portrait()}
    {:else}
      <span class="ph">{name.slice(0, 1)}</span>
    {/if}
  </span>
  {#if role}<span class="role" aria-hidden="true">{role}</span>{/if}
  {#if num !== ''}<span class="num">{num}</span>{/if}
  {#if badge}<span class="badge">{badge}</span>{/if}
  <span class="info">
    <span class="stars" aria-label="{stars} 星">{'★'.repeat(stars)}</span>
    <span class="nm">{name}</span>
    {#if sub}<span class="sub">{sub}</span>{/if}
    <span class="lv">Lv.<b>{level}</b></span>
  </span>
  <span class="attr a-{attr}" aria-hidden="true"></span>
</button>

<style>
  .bb-unit {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4.15;
    padding: 0;
    border: 0;
    overflow: hidden;
    background: #20232f;
    color: #ffffff;
    font: inherit;
    text-align: left;
    cursor: pointer;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);
    transition: transform var(--bb-dur-3) var(--bb-ease), filter var(--bb-dur-2);
  }
  .bb-unit:hover {
    transform: translateY(calc(-3px * var(--bb-motion)));
  }
  .art {
    position: absolute;
    inset: 0;
  }
  .art :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ph {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background:
      radial-gradient(70% 55% at 50% 38%, rgb(255 255 255 / 0.28), transparent 70%),
      linear-gradient(160deg, #3b4766, #161a28);
    font: 400 4.2rem var(--bb-font-serif);
    color: rgb(255 255 255 / 0.55);
  }
  .info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    padding: 30px 12px 10px;
    background: linear-gradient(transparent, rgb(8 10 18 / 0.9) 45%);
    line-height: 1.2;
  }
  .stars {
    font-size: 12px;
    letter-spacing: 1px;
  }
  .nm {
    font-weight: 900;
    font-size: 1rem;
  }
  .sub {
    font: 700 10px var(--bb-font-cond);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .lv {
    margin-top: 2px;
    font-size: 12px;
  }
  .lv b {
    font: italic 400 1.2rem var(--bb-font-display);
    margin-left: 2px;
  }
  .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 38px;
    height: 38px;
    padding: 2px 6px 0 0;
    box-sizing: border-box;
    text-align: right;
    background: var(--bb-yellow);
    clip-path: polygon(30% 0, 100% 0, 100% 100%);
    color: #0b0f1a;
    font: 400 1.3rem var(--bb-font-display);
  }
  /* bluebolt mark: tick ruler down the left edge */
  .bb-unit::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 40px;
    bottom: 70px;
    left: 0;
    width: 6px;
    background: repeating-linear-gradient(180deg, rgb(255 255 255 / 0.55) 0 1px, transparent 1px 8px);
    pointer-events: none;
  }
  .role {
    position: absolute;
    top: 6px;
    left: 8px;
    font: 900 1.1rem var(--bb-font-display);
    text-shadow: 0 1px 3px rgb(0 0 0 / 0.6);
  }
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 8px;
    background: rgb(11 15 26 / 0.85);
    font-size: 11px;
    font-weight: 800;
  }
  .attr {
    position: absolute;
    right: 8px;
    bottom: 10px;
    width: 18px;
    height: 18px;
    border: 1.5px solid rgb(255 255 255 / 0.8);
    transform: rotate(45deg);
  }
  .a-blue { background: var(--bb-blue); }
  .a-yellow { background: var(--bb-yellow); }
  .a-ink { background: #0b0f1a; }
  .a-white { background: #ffffff; }

  .selected {
    box-shadow:
      inset 0 0 0 3px #7fb6ff,
      inset 0 0 18px rgb(61 155 255 / 0.55);
  }
  .selected .art::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgb(61 155 255 / 0.25), rgb(24 61 214 / 0.35));
    mix-blend-mode: screen;
  }
  .bb-unit:focus-visible {
    outline: 3px solid var(--bb-yellow);
    outline-offset: 2px;
    box-shadow: none;
  }
</style>
