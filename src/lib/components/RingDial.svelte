<!--
  Large HUD dial: section names run around the outer ring and the ring rotates so
  the active section sits at the top. Inner tick rings drift, a small sphere
  orbits. Anything passed as children is centred on top. Rotation and drift are
  scaled by --bb-motion (still under reduced motion).
-->
<script>
  /**
   * @type {{
   *   labels: string[], active?: number, size?: string, caption?: string,
   *   children?: import('svelte').Snippet
   * }}
   */
  let { labels, active = 0, size = 'min(78vh, 46vw)', caption = '', children } = $props();

  const uid = $props.id();
  const n = $derived(Math.max(1, labels.length));
  // keep rotating the short way round, accumulating turns
  let turn = $state(0);
  let prev = 0;
  $effect(() => {
    const step = 360 / n;
    let delta = (prev - active) * step;
    delta = ((delta + 540) % 360) - 180;
    turn += delta;
    prev = active;
  });
</script>

<div class="bb-dial" style:--size={size}>
  <div class="lens" aria-hidden="true"></div>
  <svg viewBox="-300 -300 600 600" aria-hidden="true">
    <defs>
      <path id="{uid}-txt" d="M 0 -262 A 262 262 0 1 1 -0.01 -262" />
      <radialGradient id="{uid}-orb" cx="35%" cy="30%" r="70%">
        <stop offset="0" stop-color="#fff" />
        <stop offset="0.45" stop-color="#c9d3e6" />
        <stop offset="1" stop-color="#1b2232" />
      </radialGradient>
    </defs>

    <!-- outer labelled ring -->
    <g class="labels" style:transform="rotate({turn - 180 / n}deg)">
      <circle r="244" class="thin" />
      <text class="ring-txt">
        {#each labels as l, i}
          <textPath
            href="#{uid}-txt"
            startOffset="{((i + 0.5) / n) * 100}%"
            text-anchor="middle"
            class:on={i === active}>{String(i + 1).padStart(2, '0')} {l}</textPath>
        {/each}
      </text>
    </g>
    <path class="marker" d="M -7 -292 L 7 -292 L 0 -280 Z" />

    <!-- tick ring, slowly drifting -->
    <g class="drift">
      {#each { length: 120 } as _, i}
        <line
          x1="0"
          y1={i % 10 === 0 ? -232 : -226}
          x2="0"
          y2="-220"
          transform="rotate({i * 3})"
          class={i % 10 === 0 ? 'tick major' : 'tick'}
        />
      {/each}
    </g>
    <circle r="214" class="dash" />
    <g class="drift-rev">
      <circle r="196" class="arc a1" pathLength="100" />
      <circle r="196" class="arc a2" pathLength="100" />
      <circle r="178" class="arc a3" pathLength="100" />
    </g>
    <circle r="150" class="thin" />
    <circle r="96" class="thin faint" />
    <line x1="-300" y1="0" x2="300" y2="0" class="thin faint" />
    <line x1="0" y1="-300" x2="0" y2="300" class="thin faint" />

    <!-- orbiting sphere -->
    <g class="orbit">
      <circle cx="0" cy="-196" r="15" fill="url(#{uid}-orb)" stroke="var(--bb-ink)" stroke-width="1" />
    </g>
  </svg>
  <div class="center">
    {@render children?.()}
  </div>
  {#if caption}<span class="caption">{caption}</span>{/if}
</div>

<style>
  .bb-dial {
    position: relative;
    width: var(--size);
    aspect-ratio: 1;
  }
  .lens {
    /* frosted glass globe so centre content stays readable over busy backgrounds */
    position: absolute;
    inset: 13%;
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 28%, rgb(255 255 255 / 0.85), transparent 45%),
      radial-gradient(circle, color-mix(in srgb, var(--bb-paper) 72%, transparent) 55%, color-mix(in srgb, var(--bb-blue-soft) 50%, transparent));
    backdrop-filter: blur(10px) saturate(1.3);
    -webkit-backdrop-filter: blur(10px) saturate(1.3);
    box-shadow:
      inset 0 0 0 1px var(--bb-glass-edge),
      inset -12px -18px 40px color-mix(in srgb, var(--bb-blue) 18%, transparent);
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .thin {
    fill: none;
    stroke: var(--bb-hud-line);
    stroke-width: 1;
  }
  .faint {
    stroke-opacity: 0.6;
  }
  .labels {
    transition: transform 1.1s var(--bb-ease);
  }
  .ring-txt {
    font-family: var(--bb-font-cond);
    font-weight: 700;
    font-size: 21px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    fill: var(--bb-ink);
  }
  .ring-txt :global(textPath.on) {
    fill: var(--bb-blue-text);
  }
  .marker {
    fill: var(--bb-yellow);
    stroke: var(--bb-ink);
    stroke-width: 1;
  }
  .tick {
    stroke: var(--bb-ink-3);
    stroke-width: 1;
  }
  .tick.major {
    stroke: var(--bb-ink);
    stroke-width: 2;
  }
  .dash {
    fill: none;
    stroke: var(--bb-ink);
    stroke-width: 2;
    stroke-dasharray: 2 10;
  }
  .arc {
    fill: none;
    stroke-linecap: butt;
  }
  .a1 {
    stroke: var(--bb-ink);
    stroke-width: 6;
    stroke-dasharray: 18 82;
  }
  .a2 {
    stroke: var(--bb-blue);
    stroke-width: 6;
    stroke-dasharray: 9 91;
    stroke-dashoffset: -52;
  }
  .a3 {
    stroke: var(--bb-hud-line);
    stroke-width: 10;
    stroke-dasharray: 3 2;
  }
  .drift,
  .drift-rev,
  .orbit {
    transform-origin: 0 0;
    animation: bb-dial-spin 90s linear infinite;
  }
  .drift-rev {
    animation-duration: 50s;
    animation-direction: reverse;
  }
  .orbit {
    animation-duration: 24s;
  }
  @keyframes bb-dial-spin {
    to {
      transform: rotate(calc(360deg * var(--bb-motion)));
    }
  }
  .center {
    position: absolute;
    inset: 22%;
    display: grid;
    place-items: center;
  }
  .caption {
    position: absolute;
    left: 50%;
    bottom: 9%;
    transform: translateX(-50%);
    font-family: var(--bb-font-script);
    font-size: clamp(1.6rem, 3vw, 2.6rem);
    color: var(--bb-blue-text);
    white-space: nowrap;
  }
</style>
