// Not in use (removed from the hero 2026-10-16, placement to be redesigned).
// Jayanth's interests as paper notes around the silhouette. While the head turns, each
// note pops in as a crumpled paper ball and unfolds flat; as the camera starts pushing
// into the lens they crumple back up and vanish. Scroll drives it both ways.
//
// Our own take on the "crumpled paper reveal" idea (the Framer component isn't licensed
// for reuse): one WebGL canvas, a subdivided sheet per note whose vertices are blended
// between flat and a creased ball, lit per pixel. The doodle is painted into the paper's
// texture so it crumples too; the words are real HTML on top and fade in once the paper
// is flat. Without WebGL, or with reduced motion, the notes are plain flat HTML cards.
import { useEffect, useRef, useState } from 'react'
import { motionValue, useMotionValueEvent, type MotionValue } from 'motion/react'
import { interests } from '../content/interests'
import './CrumpleNotes.css'

type Props = { progress?: MotionValue<number>; still?: boolean }
type Slot = { x: number; y: number; w: number; h: number; rot: number }

// Where each note sits, as fractions of the stage, plus a tilt in degrees. The silhouette
// stands just right of centre; the menu takes the top-left.
const WIDE: [number, number, number][] = [
  [0.13, 0.46, -6], [0.29, 0.63, 5], [0.14, 0.8, 3],
  [0.79, 0.3, -4], [0.9, 0.55, 6], [0.78, 0.79, -5],
]
// On phones the silhouette fills the screen, so the notes stay below the goggles.
const NARROW: [number, number, number][] = [
  [0.21, 0.57, -6], [0.23, 0.72, 4], [0.21, 0.87, 6],
  [0.79, 0.55, 5], [0.78, 0.7, -5], [0.8, 0.85, -4],
]
// They arrive alternating left and right.
const ORDER = [0, 3, 1, 4, 2, 5]

// useMotionValueEvent needs a MotionValue even when there's no scroll (the still version).
const fakeProgress = motionValue(0)

function layout(w: number, h: number): Slot[] {
  const narrow = w < 760
  const cw = narrow ? Math.min(100, w * 0.27, h * 0.12) : Math.max(120, Math.min(w * 0.12, h * 0.2, 176))
  const ch = cw * 1.2
  return (narrow ? NARROW : WIDE).map(([fx, fy, rot]) => ({ x: fx * w, y: fy * h, w: cw, h: ch, rot }))
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

// For note i at hero progress p: crumple amount k (1 = ball, 0 = flat) and scale.
function stateAt(i: number, p: number) {
  const o = ORDER.indexOf(i)
  const appear = 0.03 + o * 0.035
  const unfold = appear + 0.025
  const leave = 0.43 + o * 0.012
  let scale = smooth((p - appear) / 0.025)
  let k = 1 - smooth((p - unfold) / 0.09)
  k = Math.max(k, smooth((p - leave) / 0.05))
  scale *= 1 - smooth((p - leave - 0.04) / 0.035)
  return { k, scale }
}

const VERT = `
attribute vec2 aUV;
uniform vec2 uView, uCenter, uSize;
uniform float uRot, uK, uScale, uSeed;
varying vec2 vUV;
varying vec3 vN;
varying float vCrease;
const float PI = 3.14159265;

// Ridged folds: a few sharp creases in random directions.
float crease(vec2 q) {
  float s = 0.;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float a = uSeed * 7.13 + fi * 2.39;
    s += abs(sin(dot(q, vec2(cos(a), sin(a))) * (2.5 + fi * 1.7) + uSeed * 3.1 + fi)) / (1. + fi * .5);
  }
  return s;
}

mat3 axisAngle(vec3 ax, float a) {
  float c = cos(a), s = sin(a), t = 1. - c;
  return mat3(t*ax.x*ax.x + c, t*ax.x*ax.y + s*ax.z, t*ax.x*ax.z - s*ax.y,
              t*ax.x*ax.y - s*ax.z, t*ax.y*ax.y + c, t*ax.y*ax.z + s*ax.x,
              t*ax.x*ax.z + s*ax.y, t*ax.y*ax.z - s*ax.x, t*ax.z*ax.z + c);
}

vec3 shape(vec2 uv) {
  vec2 q = (uv - .5) * 2.;
  float c = crease(q);
  vec3 sheet = vec3((uv - .5) * uSize, 0.);
  sheet.z += (c - 1.4) * uSize.x * .07 * sin(uK * PI);
  float R = min(uSize.x, uSize.y) * .3;
  float th = q.x * PI * .95, ph = q.y * PI * .48;
  vec3 ball = vec3(sin(th) * cos(ph), sin(ph), cos(th) * cos(ph)) * R * (1. + .2 * (c - 1.4));
  float k = uK * uK * (3. - 2. * uK);
  return mix(sheet, ball, k);
}

void main() {
  float e = 1. / 28.;
  vec3 p = shape(aUV);
  vec3 n = cross(shape(aUV + vec2(e, 0.)) - p, shape(aUV + vec2(0., e)) - p);
  mat3 tumble = axisAngle(normalize(vec3(sin(uSeed * 5.), cos(uSeed * 3.), .6)), uK * (2. + uSeed));
  float c = cos(radians(uRot)), s = sin(radians(uRot));
  mat3 tilt = mat3(c, s, 0., -s, c, 0., 0., 0., 1.);
  p = tilt * tumble * p * uScale;
  vN = tilt * tumble * n;
  vUV = aUV;
  vCrease = crease((aUV - .5) * 2.);
  float persp = 900. / (900. - p.z);
  vec2 xy = uCenter + p.xy * persp;
  gl_Position = vec4(xy.x / uView.x * 2. - 1., 1. - xy.y / uView.y * 2., -p.z / 2000., 1.);
}`

// Same precision as the vertex shader: they share uniforms. Devices without high precision
// in fragment shaders fail to link and get the flat HTML notes instead.
const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uK;
varying vec2 vUV;
varying vec3 vN;
varying float vCrease;
void main() {
  vec3 n = normalize(vN);
  if (n.z < 0.) n = -n; // light whichever side faces the viewer
  vec3 L = normalize(vec3(-.35, -.55, 1.));
  float shade = .62 + .42 * max(dot(n, L), 0.);
  shade *= 1. - .045 * (vCrease - 1.4) * (1. - uK);
  vec3 col = texture2D(uTex, vUV).rgb * shade;
  gl_FragColor = vec4(col, 1.);
}`

// A soft shadow under each note, so off-white paper reads on the white page.
const SHADOW_VERT = `
attribute vec2 aUV;
uniform vec2 uView, uCenter, uSize;
uniform float uRot;
varying vec2 vQ;
void main() {
  vec2 q = (aUV - .5) * 2.;
  vQ = q;
  float c = cos(radians(uRot)), s = sin(radians(uRot));
  vec2 p = mat2(c, s, -s, c) * (q * (uSize * .5 + 18.));
  vec2 xy = uCenter + p + vec2(0., 10.);
  gl_Position = vec4(xy.x / uView.x * 2. - 1., 1. - xy.y / uView.y * 2., .9, 1.);
}`

const SHADOW_FRAG = `
precision highp float;
uniform vec2 uSize;
uniform float uAlpha, uRound;
varying vec2 vQ;
void main() {
  // A rounded rectangle that becomes a circle as the paper balls up.
  vec2 half_ = uSize * .5 + 18.;
  float r = mix(6., min(uSize.x, uSize.y) * .5, uRound);
  vec2 d = abs(vQ) * half_ - uSize * .5 + r;
  float dist = length(max(d, 0.)) - r + 6.;
  float a = (1. - smoothstep(0., 22., dist)) * uAlpha;
  gl_FragColor = vec4(0., 0., 0., a);
}`

function paintTexture(img: HTMLImageElement, paper: string) {
  const c = document.createElement('canvas')
  c.width = 320
  c.height = 384
  const g = c.getContext('2d')!
  g.fillStyle = paper
  g.fillRect(0, 0, c.width, c.height)
  // The doodle sits in the top part; the words go below it (HTML, on top).
  const boxW = c.width * 0.66
  const boxH = c.height * 0.5
  const s = Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight)
  const w = img.naturalWidth * s
  const h = img.naturalHeight * s
  g.drawImage(img, (c.width - w) / 2, c.height * 0.08 + (boxH - h) / 2, w, h)
  return c
}

export default function CrumpleNotes({ progress, still = false }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const texts = useRef<(HTMLDivElement | null)[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [gl, setGl] = useState<'pending' | 'on' | 'off'>(still ? 'off' : 'pending')
  const drawRef = useRef<(() => void) | null>(null)
  const queued = useRef(false)

  // Lay the notes out for the stage size, and again on resize.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(() => setSlots(layout(el.clientWidth, el.clientHeight)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Set up WebGL once: two programs, one shared sheet mesh, one texture per note.
  useEffect(() => {
    if (still) return
    const c = canvas.current
    const ctx = c?.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })
    if (!c || !ctx) {
      setGl('off')
      return
    }
    const g = ctx
    const program = (vs: string, fs: string) => {
      const p = g.createProgram()!
      for (const [type, src] of [[g.VERTEX_SHADER, vs], [g.FRAGMENT_SHADER, fs]] as const) {
        const s = g.createShader(type)!
        g.shaderSource(s, src)
        g.compileShader(s)
        g.attachShader(p, s)
      }
      g.linkProgram(p)
      if (g.getProgramParameter(p, g.LINK_STATUS)) return p
      if (import.meta.env.DEV) console.warn('CrumpleNotes shader:', g.getProgramInfoLog(p), g.getAttachedShaders(p)?.map((s) => g.getShaderInfoLog(s)))
      return null
    }
    const paperProg = program(VERT, FRAG)
    const shadowProg = program(SHADOW_VERT, SHADOW_FRAG)
    if (!paperProg || !shadowProg) {
      setGl('off')
      return
    }

    // A 28×28 sheet of triangles over uv 0..1.
    const N = 28
    const uv: number[] = []
    for (let y = 0; y <= N; y++) for (let x = 0; x <= N; x++) uv.push(x / N, y / N)
    const idx: number[] = []
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const a = y * (N + 1) + x
        idx.push(a, a + 1, a + N + 1, a + 1, a + N + 2, a + N + 1)
      }
    const sheetBuf = g.createBuffer()
    g.bindBuffer(g.ARRAY_BUFFER, sheetBuf)
    g.bufferData(g.ARRAY_BUFFER, new Float32Array(uv), g.STATIC_DRAW)
    const idxBuf = g.createBuffer()
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, idxBuf)
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), g.STATIC_DRAW)
    const quadBuf = g.createBuffer()
    g.bindBuffer(g.ARRAY_BUFFER, quadBuf)
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), g.STATIC_DRAW)

    const loc = (p: WebGLProgram, n: string) => g.getUniformLocation(p, n)
    const paperAttr = g.getAttribLocation(paperProg, 'aUV')
    const shadowAttr = g.getAttribLocation(shadowProg, 'aUV')

    const paper = getComputedStyle(c).getPropertyValue('--paper').trim() || '#fbfaf8'
    const textures: (WebGLTexture | null)[] = interests.map(() => null)
    interests.forEach((it, i) => {
      const img = new Image()
      img.onload = () => {
        const t = g.createTexture()
        g.bindTexture(g.TEXTURE_2D, t)
        g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, paintTexture(img, paper))
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
        textures[i] = t
        drawRef.current?.()
      }
      img.src = it.doodle
    })

    let current: Slot[] = []
    let viewW = 0
    let viewH = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      viewW = c.clientWidth
      viewH = c.clientHeight
      c.width = Math.round(viewW * dpr)
      c.height = Math.round(viewH * dpr)
      g.viewport(0, 0, c.width, c.height)
    }

    const draw = () => {
      queued.current = false
      const p = progress?.get() ?? 0
      if (c.clientWidth !== viewW || c.clientHeight !== viewH) resize()
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
      const states = interests.map((_, i) => stateAt(i, p))
      states.forEach(({ k, scale }, i) => {
        const el = texts.current[i]
        if (el) el.style.opacity = String(Math.max(0, 1 - k / 0.1) * scale)
      })
      if (p < 0.02 || p > 0.62 || !current.length) return

      g.enable(g.BLEND)
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA)

      // Shadows first, under everything.
      g.disable(g.DEPTH_TEST)
      g.useProgram(shadowProg)
      g.bindBuffer(g.ARRAY_BUFFER, quadBuf)
      g.enableVertexAttribArray(shadowAttr)
      g.vertexAttribPointer(shadowAttr, 2, g.FLOAT, false, 0, 0)
      g.uniform2f(loc(shadowProg, 'uView'), viewW, viewH)
      states.forEach(({ k, scale }, i) => {
        const s = current[i]
        if (!s || scale <= 0) return
        const shrink = scale * (1 - 0.62 * k)
        g.uniform2f(loc(shadowProg, 'uCenter'), s.x, s.y)
        g.uniform2f(loc(shadowProg, 'uSize'), s.w * shrink, s.h * shrink)
        g.uniform1f(loc(shadowProg, 'uRot'), s.rot)
        g.uniform1f(loc(shadowProg, 'uAlpha'), (0.16 - 0.06 * k) * scale)
        g.uniform1f(loc(shadowProg, 'uRound'), k)
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4)
      })

      // Then the paper.
      g.enable(g.DEPTH_TEST)
      g.depthFunc(g.LEQUAL)
      g.useProgram(paperProg)
      g.bindBuffer(g.ARRAY_BUFFER, sheetBuf)
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, idxBuf)
      g.enableVertexAttribArray(paperAttr)
      g.vertexAttribPointer(paperAttr, 2, g.FLOAT, false, 0, 0)
      g.uniform2f(loc(paperProg, 'uView'), viewW, viewH)
      states.forEach(({ k, scale }, i) => {
        const s = current[i]
        const t = textures[i]
        if (!s || !t || scale <= 0) return
        g.bindTexture(g.TEXTURE_2D, t)
        g.uniform2f(loc(paperProg, 'uCenter'), s.x, s.y)
        g.uniform2f(loc(paperProg, 'uSize'), s.w, s.h)
        g.uniform1f(loc(paperProg, 'uRot'), s.rot)
        g.uniform1f(loc(paperProg, 'uK'), k)
        g.uniform1f(loc(paperProg, 'uScale'), scale)
        g.uniform1f(loc(paperProg, 'uSeed'), 0.37 + i * 0.61)
        g.drawElements(g.TRIANGLES, idx.length, g.UNSIGNED_SHORT, 0)
      })
    }

    drawRef.current = () => {
      current = layoutRef.current
      if (!queued.current) {
        queued.current = true
        requestAnimationFrame(draw)
      }
    }
    setGl('on')
    drawRef.current()
    return () => {
      drawRef.current = null
    }
  }, [still, progress])

  const layoutRef = useRef<Slot[]>([])
  layoutRef.current = slots
  useEffect(() => drawRef.current?.(), [slots])

  // Redraw on scroll (at most once a frame). Without WebGL, just fade the flat cards.
  const fallback = gl === 'off'
  useMotionValueEvent(progress ?? fakeProgress, 'change', (p) => {
    if (fallback && !still) {
      interests.forEach((_, i) => {
        const { k, scale } = stateAt(i, p)
        const el = texts.current[i]
        if (el) el.style.opacity = String(Math.max(0, 1 - k) * scale)
      })
    } else drawRef.current?.()
  })

  return (
    <div ref={stage} className="crumple">
      {/* For screen readers: the interests as a plain list, whatever the animation does. */}
      <h2 className="visually-hidden">Outside work</h2>
      <ul className="visually-hidden">
        {interests.map((it) => (
          <li key={it.label}>{it.label}: {it.note}</li>
        ))}
      </ul>
      {!fallback && <canvas ref={canvas} className="crumple-canvas" aria-hidden="true" />}
      {slots.map((s, i) => (
        <div
          key={interests[i].label}
          ref={(el) => {
            texts.current[i] = el
          }}
          className={fallback ? 'crumple-note crumple-note--flat' : 'crumple-note'}
          style={{ left: s.x - s.w / 2, top: s.y - s.h / 2, width: s.w, height: s.h, rotate: `${s.rot}deg`, opacity: still ? 1 : 0 }}
          aria-hidden="true"
        >
          {fallback && <img src={interests[i].doodle} alt="" />}
          <span className="mono">{interests[i].label}</span>
          <span className="crumple-line">{interests[i].note}</span>
        </div>
      ))}
    </div>
  )
}
