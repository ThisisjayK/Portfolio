// The hero's backdrop: five layers of blue bloom out from the middle column as the visitor
// scrolls, on slightly grainy white. Each layer is drawn its own way:
//   mist        a feathered wash, the widest and palest
//   powder      contour ripples, like lines on a map
//   sky         a solid amoeba (the letters' blob shape, --bloom-sky)
//   cornflower  a halftone dot screen, dots biggest at its centre
//   cobalt      cut paper, printed slightly off register over a navy shadow (--accent)
// One fragment shader on a raw WebGL canvas, like SilkBall. Geometry (where each layer is and
// how big) is worked out here in JS and shared with Hero.tsx, which uses bloomCovers() to hide
// the letters the bloom passes over. Nothing moves unless the page scrolls; the grain is fixed.
import { useEffect, useRef } from 'react'
import type { MotionValue } from 'motion/react'

type Layer = {
  token: string
  from: number // scroll progress where the layer starts to grow
  to: number // and where it reaches full size
  size: number // full radius, as a fraction of the stage's longer side
  x: number // centre, as fractions of the stage
  y: number
  k: number // phase of the lumps, so no two layers share an outline
}

const LAYERS: Layer[] = [
  { token: '--bloom-mist', from: 0, to: 0.5, size: 0.62, x: 0.5, y: 0.52, k: 1.1 },
  { token: '--bloom-powder', from: 0.08, to: 0.58, size: 0.5, x: 0.46, y: 0.5, k: 2.3 },
  { token: '--bloom-sky', from: 0.16, to: 0.66, size: 0.4, x: 0.54, y: 0.55, k: 3.2 },
  { token: '--bloom-cornflower', from: 0.26, to: 0.74, size: 0.3, x: 0.47, y: 0.6, k: 4.4 },
  { token: '--accent', from: 0.36, to: 0.8, size: 0.18, x: 0.53, y: 0.46, k: 5.6 },
]
const SEED = 12 // px: the cobalt drop visible before any scroll, the page's focal point
const OFFSET = [5, 4] // px: how far the navy shadow sits off the cobalt layer

const easeOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - (1 - t) ** 3)

// Where each layer is at a given scroll progress, in CSS px of the stage.
function layersAt(p: number, w: number, h: number) {
  const unit = Math.max(w, h)
  return LAYERS.map((l, i) => {
    const r = easeOut((p - l.from) / (l.to - l.from)) * l.size * unit
    return { x: l.x * w, y: l.y * h, r: i === 4 ? Math.max(SEED, r) : r, k: l.k + p * 1.5 }
  })
}

// The lumpy outline (same formula as the shader's lump()).
const lump = (dx: number, dy: number, r: number, k: number) => {
  const t = Math.atan2(dy, dx)
  return r * (1 + 0.13 * Math.sin(3 * t + k) + 0.07 * Math.sin(5 * t + 2 * k))
}

// True when a point of the stage (CSS px) is under a layer dark enough to hide a letter.
// Mist doesn't count: it's pale enough for the blue letters to stay readable on it.
// Powder counts as solid inside its outer ripple, so letters don't peek between the lines.
export function bloomCovers(px: number, py: number, p: number, w: number, h: number) {
  const ls = layersAt(p, w, h)
  for (let i = 1; i < ls.length; i++) {
    const l = ls[i]
    if (l.r <= 0) continue
    const inside = (cx: number, cy: number) => Math.hypot(px - cx, py - cy) < lump(px - cx, py - cy, l.r, l.k)
    if (inside(l.x, l.y)) return true
    if (i === 4 && inside(l.x + OFFSET[0], l.y + OFFSET[1])) return true
  }
  return false
}

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uC[5];
uniform float uR[5];
uniform float uK[5];
uniform vec3 uCol[6];
uniform vec2 uOff;

float lump(vec2 d,float r,float k){
  float t=atan(d.y,d.x);
  return r*(1.+.13*sin(3.*t+k)+.07*sin(5.*t+2.*k));
}
// 1 inside the outline, 0 outside, with a one-pixel soft edge.
float fill(vec2 d,float r,float k){return clamp(lump(d,r,k)-length(d)+.5,0.,1.);}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}

void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
  vec3 col=vec3(1.);

  // Mist: solid to 70% of its radius, then feathers out.
  if(uR[0]>.5){
    vec2 d=p-uC[0];
    float q=length(d)/lump(d,uR[0]*1.15,uK[0]);
    col=mix(col,uCol[0],1.-smoothstep(.7,1.,q));
  }
  // Powder: seven nested ripples, each turned a little against the last.
  if(uR[1]>.5){
    vec2 d=p-uC[1];
    float L=length(d),a=0.;
    for(int j=0;j<7;j++){
      float fj=float(j);
      float rr=lump(d,uR[1]*(1.-fj*.13),uK[1]+fj*.15);
      a=max(a,clamp(2.-abs(L-rr),0.,1.));
    }
    col=mix(col,uCol[1],a);
  }
  // Sky: one clean amoeba.
  if(uR[2]>.5) col=mix(col,uCol[2],fill(p-uC[2],uR[2],uK[2]));
  // Cornflower: a fixed 9px dot screen, dots shrinking toward the layer's edge.
  if(uR[3]>.5){
    vec2 d=p-uC[3];
    float m=fill(d,uR[3],uK[3]);
    if(m>0.){
      vec2 g=(floor(p/9.)+.5)*9.;
      vec2 dg=g-uC[3];
      float q=length(dg)/lump(dg,uR[3],uK[3]);
      float s=max(.6,3.6*(1.-q*.75));
      col=mix(col,uCol[3],m*clamp(s-length(p-g)+.5,0.,1.));
    }
  }
  // Cobalt: cut paper over a navy shadow, printed off register.
  if(uR[4]>.5){
    col=mix(col,uCol[5],fill(p-uC[4]-uOff,uR[4],uK[4]));
    col=mix(col,uCol[4],fill(p-uC[4],uR[4],uK[4]));
  }
  // Grain: fixed per CSS pixel, so it never shimmers.
  col+=(hash(floor(p))-.5)*.09;
  gl_FragColor=vec4(col,1.);
}`

function colorFromCss(el: Element, token: string): [number, number, number] {
  const hex = getComputedStyle(el).getPropertyValue(token).trim().replace('#', '')
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16)
  if (Number.isNaN(n)) return [1, 1, 1]
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

type Props = {
  progress: MotionValue<number>
  className?: string
  // Called once: false when WebGL isn't available (the canvas stays plain --bg).
  onReady?: (ok: boolean) => void
}

export default function BlueBloom({ progress, className, onReady }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const ready = useRef(onReady)
  ready.current = onReady

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const gl = c.getContext('webgl', { antialias: false, alpha: false })
    const fail = () => {
      c.dataset.fallback = 'true'
      ready.current?.(false)
    }
    if (!gl) return fail()

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fail()
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(prog, name)
    const uRes = u('uRes')
    const uDpr = u('uDpr')
    const uC = u('uC')
    const uR = u('uR')
    const uK = u('uK')
    const colors = [...LAYERS.map((l) => l.token), '--bloom-navy'].flatMap((t) => colorFromCss(c, t))
    gl.uniform3fv(u('uCol'), colors)
    gl.uniform2fv(u('uOff'), OFFSET)

    let w = 0
    let h = 0
    let dpr = 1
    const draw = () => {
      if (!w || !h) return
      const ls = layersAt(progress.get(), w, h)
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uDpr, dpr)
      gl.uniform2fv(uC, ls.flatMap((l) => [l.x, l.y]))
      gl.uniform1fv(uR, ls.map((l) => l.r))
      gl.uniform1fv(uK, ls.map((l) => l.k))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Draw at most once per frame, and only when the scroll or the size changes.
    let raf = 0
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0
        draw()
      })
    }
    const resize = () => {
      const box = c.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = box.width
      h = box.height
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      gl.viewport(0, 0, c.width, c.height)
      draw()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    resize()
    const off = progress.on('change', schedule)
    ready.current?.(true)
    return () => {
      off()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [progress])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
}
