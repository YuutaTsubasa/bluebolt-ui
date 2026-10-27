<!--
  Optional animated background: domain-warped ink clouds in the theme's blues,
  printed as a halftone with thin yellow contour lines, stirred by the pointer.
  WebGL2 (works in WebView2 and WebKit); falls back to a CSS gradient.
  Reduced motion: renders a single still frame. Pauses when hidden or off-screen.
-->
<script>
  import { onMount } from 'svelte';
  import { reducedMotion } from '../motion/index.js';

  /**
   * @type {{ fixed?: boolean, intensity?: number, halftone?: boolean, interactive?: boolean, scale?: number }}
   */
  let { fixed = false, intensity = 1, halftone = true, interactive = true, scale = 0.5 } = $props();

  /** @type {HTMLCanvasElement | undefined} */
  let canvas = $state();
  let failed = $state(false);

  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPtr; uniform float uStir;
uniform vec3 uPaper, uSoft, uBlue, uYellow; uniform float uInt, uHalf, uDot;
out vec4 o;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*vn(p); p=m*p; a*=.5; } return s; }
vec2 rot(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }
float field(vec2 uv){
  float t = uTime;
  vec2 d = uv - uPtr; float fall = exp(-dot(d,d)*6.);
  uv = uPtr + rot(d, uStir*fall*2.2);
  vec2 q = vec2(fbm(uv*1.6 + vec2(0., t*.025)), fbm(uv*1.6 + vec2(5.2, 1.3) - t*.02));
  vec2 r = vec2(fbm(uv*1.8 + 3.5*q + vec2(1.7, 9.2) + t*.03), fbm(uv*1.8 + 3.5*q + vec2(8.3, 2.8)));
  return fbm(uv*2.2 + 3.*r);
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  float ar = uRes.x/uRes.y;
  // halftone: sample the field at the cell centre, draw a dot sized by density
  vec2 cell = uDot * vec2(1.);
  vec2 rf = rot(frag, .5);
  vec2 cc = (floor(rf/cell)+.5)*cell;
  vec2 cFrag = rot(cc, -.5);
  vec2 uvC = vec2(cFrag.x/uRes.y, cFrag.y/uRes.y);
  vec2 uvP = vec2(frag.x/uRes.y, frag.y/uRes.y);
  float fP = field(uvP);
  float dens = smoothstep(.42, .78, fP) * uInt;
  float fC = mix(fP, field(uvC), uHalf);
  float densC = smoothstep(.42, .78, fC) * uInt;
  float rad = sqrt(densC) * .62 * uDot;
  float dotMask = 1. - smoothstep(rad-.8, rad+.8, length(rf - cc));
  vec3 col = mix(uPaper, uSoft, smoothstep(.3, .6, fP) * uInt);
  col = mix(col, uBlue, mix(dens*.85, dotMask*.9, uHalf));
  // contour lines in yellow
  // distance (in contour units) to the nearest integer level, normalised by screen-space derivative
  float lv = fP*7.;
  float dist = abs(fract(lv + .5) - .5) / max(fwidth(lv), 1e-4);
  float line = (1. - smoothstep(.6, 1.6, dist)) * smoothstep(.5, .6, fP) * uInt;
  col = mix(col, uYellow, line);
  // grain
  col += (h21(frag + fract(uTime)*91.) - .5) * .05;
  o = vec4(col, 1.);
}`;

  function cssColor(name) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const m = v.match(/^#([0-9a-f]{6})$/i);
    if (!m) return [0, 0, 0];
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  onMount(() => {
    const gl = canvas?.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      failed = true;
      return;
    }
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
    } catch (err) {
      console.warn('[bluebolt-ui] InkBackground disabled:', err);
      failed = true;
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    const u = {
      res: U('uRes'), time: U('uTime'), ptr: U('uPtr'), stir: U('uStir'),
      paper: U('uPaper'), soft: U('uSoft'), blue: U('uBlue'), yellow: U('uYellow'),
      int: U('uInt'), half: U('uHalf'), dot: U('uDot'),
    };

    function setColors() {
      gl.uniform3fv(u.paper, cssColor('--bb-paper'));
      gl.uniform3fv(u.soft, cssColor('--bb-blue-soft'));
      gl.uniform3fv(u.blue, cssColor('--bb-blue'));
      gl.uniform3fv(u.yellow, cssColor('--bb-yellow'));
    }

    let ptr = [0.5, 0.5];
    let ptrTarget = [0.5, 0.5];
    let stir = 0;
    let visible = true;
    let raf = 0;
    let t0 = performance.now();
    let still = reducedMotion();

    function resize() {
      const r = canvas.getBoundingClientRect();
      const s = Math.min(1, scale * Math.min(2, devicePixelRatio || 1));
      canvas.width = Math.max(1, Math.round(r.width * s));
      canvas.height = Math.max(1, Math.round(r.height * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (still) draw(20);
    }

    function draw(time) {
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time);
      const ar = canvas.width / canvas.height;
      gl.uniform2f(u.ptr, ptr[0] * ar, ptr[1]);
      gl.uniform1f(u.stir, stir);
      gl.uniform1f(u.int, intensity);
      gl.uniform1f(u.half, halftone ? 1 : 0);
      gl.uniform1f(u.dot, Math.max(4, Math.round(9 * (canvas.height / 600))));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden || still) return;
      ptr[0] += (ptrTarget[0] - ptr[0]) * 0.08;
      ptr[1] += (ptrTarget[1] - ptr[1]) * 0.08;
      stir *= 0.965;
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(frame);
    }
    const kick = () => {
      if (!raf && !still) raf = requestAnimationFrame(frame);
    };

    /** @param {PointerEvent} e */
    function onMove(e) {
      if (!interactive || still) return;
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = 1 - (e.clientY - r.top) / r.height;
      const dx = nx - ptrTarget[0];
      const dy = ny - ptrTarget[1];
      stir = Math.min(1.6, stir + Math.hypot(dx, dy) * 3);
      ptrTarget = [nx, ny];
    }

    function refreshMode() {
      still = reducedMotion();
      setColors();
      if (still) draw(20);
      else kick();
    }

    setColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      kick();
    });
    io.observe(canvas);
    const mo = new MutationObserver(refreshMode);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
    const mqDark = matchMedia('(prefers-color-scheme: dark)');
    const mqMotion = matchMedia('(prefers-reduced-motion: reduce)');
    mqDark.addEventListener('change', refreshMode);
    mqMotion.addEventListener('change', refreshMode);
    document.addEventListener('visibilitychange', kick);
    window.addEventListener('pointermove', onMove, { passive: true });
    if (still) draw(20);
    else kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mqDark.removeEventListener('change', refreshMode);
      mqMotion.removeEventListener('change', refreshMode);
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  });
</script>

<div class="bb-ink-bg" class:fixed aria-hidden="true">
  {#if failed}
    <div class="fallback"></div>
  {:else}
    <canvas bind:this={canvas}></canvas>
  {/if}
</div>

<style>
  .bb-ink-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .bb-ink-bg.fixed {
    position: fixed;
  }
  canvas,
  .fallback {
    display: block;
    width: 100%;
    height: 100%;
  }
  canvas {
    image-rendering: auto;
  }
  .fallback {
    background:
      radial-gradient(60% 80% at 75% 30%, var(--bb-blue-soft), transparent 70%),
      radial-gradient(40% 50% at 20% 80%, color-mix(in srgb, var(--bb-blue) 35%, transparent), transparent 70%),
      var(--bb-paper);
  }
</style>
