<!--
  Liquid-chrome background: a slowly churning metallic field with sharp
  reflective bands, translucent blue glass ribbons with bright edges, a faint
  yellow glow and film grain. Pointer stirs it; `surge()` (from bluebolt-ui/fx)
  makes it churn for a screen transition. WebGL2 with a CSS fallback;
  reduced motion renders one still frame.
-->
<script>
  import { onMount } from 'svelte';
  import { runShader, cssColor, isDark } from './gl.js';

  /**
   * @type {{ fixed?: boolean, scale?: number, interactive?: boolean, amount?: number, ribbons?: number, zoom?: number }}
   * amount: how much of the screen the chrome covers (0..1); ribbons: glass ribbon strength (0..1)
   */
  let { fixed = true, scale = 0.6, interactive = true, amount = 0.5, ribbons = 1, zoom = 1 } = $props();

  /** @type {HTMLCanvasElement | undefined} */
  let canvas = $state();
  let failed = $state(false);

  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPtr; uniform float uStir; uniform float uSurge;
uniform vec3 uPaper, uBlue, uYellow; uniform float uDark, uAmount, uRibbons, uZoom;
out vec4 o;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<4;i++){ s+=a*vn(p); p=m*p; a*=.5; } return s/.9375; }
vec2 rot(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }

vec2 warpUV(vec2 uv){
  vec2 d = uv - uPtr; float fall = exp(-dot(d,d)*5.);
  uv = uPtr + rot(d, uStir*fall*2.4);
  return uv;
}
float field(vec2 uv){
  float t = uTime;
  float w = 1.8 + uSurge*1.8;
  vec2 q = vec2(fbm(uv*.7 + vec2(0., t*.035)), fbm(uv*.7 + vec2(5.2, 1.3) - t*.03));
  vec2 r = vec2(fbm(uv*.8 + w*q + vec2(1.7, 9.2) + t*.045), fbm(uv*.8 + w*q + vec2(8.3, 2.8) - t*.025));
  return fbm(uv*.9 + w*r);
}
// distance-to-curve for a wavy ribbon crossing the screen
float ribbonD(vec2 uv, float seed, float ang, float off){
  vec2 p = rot(uv - vec2(.9, .5), ang);
  float y = off + .18*sin(p.x*1.7 + uTime*.18 + seed) + .1*sin(p.x*3.3 - uTime*.11 + seed*2.)
          + .12*(fbm(vec2(p.x*.8 + seed, uTime*.03)) - .5);
  return p.y - y;
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 c = uRes*.5;
  vec2 uv = (frag - c)/uRes.y;
  uv *= (1.0 - .12*uSurge) / uZoom;
  uv += c/uRes.y;
  uv = warpUV(uv);

  float e = 2./uRes.y;
  float h  = field(uv);
  float hx = field(uv + vec2(e,0.));
  float hy = field(uv + vec2(0.,e));
  vec2 grad = vec2(hx-h, hy-h)/e;
  vec3 n = normalize(vec3(-grad*.26, 1.));
  vec3 r = reflect(vec3(0.,0.,-1.), n);

  // chrome: big studio-sky gradient plus a couple of soft reflection bands
  float sky = smoothstep(-.3, .8, r.y + .35*r.x);
  float bands = .5 + .5*sin((r.x*1.6 + r.y*2.4)*4.2 + h*7.);
  bands = smoothstep(.38, .62, bands);
  float tone = mix(sky, bands, .8);
  float spec = pow(max(dot(n, normalize(vec3(-.35,.55,1.))), 0.), 80.);
  vec3 lo = mix(vec3(.07,.08,.11), vec3(.01,.02,.05), uDark);
  vec3 hi = mix(vec3(.98,.99,1.), vec3(.66,.74,.9), uDark);
  vec3 chrome = mix(lo, hi, tone) + spec;
  chrome *= mix(vec3(1.), vec3(.9,.94,1.08), .6); // cool tint

  float cover = mix(.66, .42, uAmount);
  // bias the metal toward centre-right where layouts usually leave room for it
  vec2 bc = (frag/uRes.y) - vec2(.6*uRes.x/uRes.y, .45);
  float bias = .16*exp(-dot(bc,bc)*2.2);
  float m = smoothstep(cover, cover+.025, h + bias + uSurge*.1);
  // soft contact shadow just outside the chrome
  float sh = smoothstep(cover-.1, cover, h) * (1.-m);
  vec3 col = uPaper * (1. - sh*mix(.18,.4,uDark));
  col = mix(col, chrome, m);

  // translucent blue glass ribbons with bright rims (two strips)
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    float d = ribbonD(uv, fk*4.1, mix(.55, -.35, fk), mix(-.05, .12, fk));
    float wdt = mix(.075, .045, fk);
    float inside = 1. - smoothstep(wdt - .004, wdt, abs(d));
    float rim = 1. - smoothstep(0., .0035, abs(abs(d) - wdt));
    float shade = .5 + .5*(d / wdt);              // across-ribbon shading
    vec3 tint = mix(uBlue, mix(uBlue, vec3(1.), .55), shade);
    vec3 glass = mix(col, tint, .62) + spec*.4;
    col = mix(col, glass, inside*uRibbons);
    col = mix(col, vec3(1.), rim*.85*uRibbons*(1.-uDark*.3));
  }

  // faint yellow glow pockets
  float glow = smoothstep(.62, .8, fbm(uv*.55 + vec2(3.1, -uTime*.015)));
  col = mix(col, uYellow, glow*.12*(1.-m));

  // film grain
  col += (h21(frag + fract(uTime*7.)*91.) - .5) * .045;
  o = vec4(col, 1.);
}`;

  onMount(() => {
    if (!canvas) return;
    const stop = runShader(canvas, {
      fragment: FS,
      uniforms: ['uPaper', 'uBlue', 'uYellow', 'uDark', 'uAmount', 'uRibbons', 'uZoom'],
      scale: () => scale,
      interactive: () => interactive,
      onTheme(gl, u) {
        gl.uniform3fv(u.uPaper, cssColor('--bb-paper'));
        gl.uniform3fv(u.uBlue, cssColor('--bb-blue'));
        gl.uniform3fv(u.uYellow, cssColor('--bb-yellow'));
        gl.uniform1f(u.uDark, isDark() ? 1 : 0);
      },
      onFrame(gl, u) {
        gl.uniform1f(u.uAmount, amount);
        gl.uniform1f(u.uRibbons, ribbons);
        gl.uniform1f(u.uZoom, zoom);
      },
    });
    if (!stop) failed = true;
    return () => stop?.();
  });
</script>

<div class="bb-chrome-bg" class:fixed aria-hidden="true">
  {#if failed}
    <div class="fallback"></div>
  {:else}
    <canvas bind:this={canvas}></canvas>
  {/if}
</div>

<style>
  .bb-chrome-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .bb-chrome-bg.fixed {
    position: fixed;
  }
  canvas,
  .fallback {
    display: block;
    width: 100%;
    height: 100%;
  }
  .fallback {
    background:
      linear-gradient(115deg, transparent 30%, color-mix(in srgb, var(--bb-blue) 30%, transparent) 38%, transparent 46%),
      radial-gradient(50% 60% at 70% 40%, color-mix(in srgb, var(--bb-ink) 18%, transparent), transparent 70%),
      var(--bb-paper);
  }
</style>
