/**
 * Shared WebGL2 plumbing for the full-screen shader backgrounds: compiles a
 * fragment shader over a single triangle, tracks size / visibility / theme /
 * motion changes and drives the frame loop. Each background only supplies
 * its shader and a per-frame uniform callback.
 */
import { reducedMotion } from '../motion/index.js';
import { fxBus } from './bus.js';

const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

/** Read a #rrggbb token from :root as [r,g,b] in 0..1. */
export function cssColor(name) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** True when the effective theme is dark. */
export function isDark() {
  const root = document.documentElement;
  const forced = root.getAttribute('data-theme');
  if (forced) return forced === 'dark';
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{
 *   fragment: string,
 *   uniforms: string[],
 *   scale: () => number,
 *   interactive: () => boolean,
 *   onTheme: (gl: WebGL2RenderingContext, u: Record<string, WebGLUniformLocation | null>) => void,
 *   onFrame: (gl: WebGL2RenderingContext, u: Record<string, WebGLUniformLocation | null>, s: FrameState) => void,
 * }} opts
 * @returns {(() => void) | null} cleanup, or null when WebGL2 / the shader is unavailable
 *
 * @typedef {{ time: number, width: number, height: number, ptr: number[], stir: number, surge: number }} FrameState
 */
export function runShader(canvas, opts) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return null;

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
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, opts.fragment));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  } catch (err) {
    console.warn('[bluebolt-ui] shader background disabled:', err);
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  /** @type {Record<string, WebGLUniformLocation | null>} */
  const u = {};
  for (const name of ['uRes', 'uTime', 'uPtr', 'uStir', 'uSurge', ...opts.uniforms]) u[name] = gl.getUniformLocation(prog, name);

  /** @type {FrameState} */
  const st = { time: 20, width: 1, height: 1, ptr: [0.5, 0.5], stir: 0, surge: 0 };
  let ptrTarget = [0.5, 0.5];
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let still = reducedMotion();

  function draw() {
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uTime, st.time);
    gl.uniform2f(u.uPtr, st.ptr[0] * (canvas.width / canvas.height), st.ptr[1]);
    gl.uniform1f(u.uStir, st.stir);
    gl.uniform1f(u.uSurge, st.surge);
    opts.onFrame(gl, u, st);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const s = Math.min(1, opts.scale() * Math.min(2, devicePixelRatio || 1));
    canvas.width = Math.max(1, Math.round(r.width * s));
    canvas.height = Math.max(1, Math.round(r.height * s));
    st.width = canvas.width;
    st.height = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (still) draw();
  }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden || still) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    st.surge = fxBus.surge;
    st.time += dt * (1 + st.surge * 5);
    st.ptr[0] += (ptrTarget[0] - st.ptr[0]) * 0.08;
    st.ptr[1] += (ptrTarget[1] - st.ptr[1]) * 0.08;
    st.stir *= 0.965;
    draw();
    raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && !still) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  /** @param {PointerEvent} e */
  function onMove(e) {
    if (!opts.interactive() || still) return;
    const r = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    st.stir = Math.min(1.6, st.stir + Math.hypot(nx - ptrTarget[0], ny - ptrTarget[1]) * 3);
    ptrTarget = [nx, ny];
  }

  function refresh() {
    still = reducedMotion();
    opts.onTheme(gl, u);
    if (still) draw();
    else kick();
  }

  opts.onTheme(gl, u);
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    kick();
  });
  io.observe(canvas);
  const mo = new MutationObserver(refresh);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
  const mqDark = matchMedia('(prefers-color-scheme: dark)');
  const mqMotion = matchMedia('(prefers-reduced-motion: reduce)');
  mqDark.addEventListener('change', refresh);
  mqMotion.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', kick);
  window.addEventListener('pointermove', onMove, { passive: true });
  if (still) draw();
  else kick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    mqDark.removeEventListener('change', refresh);
    mqMotion.removeEventListener('change', refresh);
    document.removeEventListener('visibilitychange', kick);
    window.removeEventListener('pointermove', onMove);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
