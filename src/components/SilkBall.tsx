// The site mark: a small ball in the accent fill colour with a silky, flowing surface, turning slowly.
// One fragment shader on a raw WebGL canvas (no 3D library), so it costs a few KB.
// The ball is shaded per pixel: a sphere normal, bent by slow folds that rotate with
// the ball, lit with a soft wrap light, a satin highlight and a pale rim.
// Without WebGL it falls back to a CSS gradient ball; with reduced motion it holds still.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

type Props = { size?: number; paused?: boolean; className?: string }

const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a;gl_Position=vec4(a,0.,1.);}`

const FRAG = `precision highp float;
varying vec2 v;
uniform float uTime;
uniform float uPx;
uniform vec3 uPink;

// Turn around a slightly tilted vertical axis.
mat3 spin(float t){
  float c=cos(t),s=sin(t);
  mat3 y=mat3(c,0.,-s, 0.,1.,0., s,0.,c);
  float k=0.35; float ck=cos(k),sk=sin(k);
  mat3 x=mat3(1.,0.,0., 0.,ck,sk, 0.,-sk,ck);
  return x*y;
}

// Slow folds: two sets of soft, domain-warped ridges, like draped silk.
float folds(vec3 p){
  float t=uTime*0.15;
  p+=0.45*sin(p.yzx*1.9+vec3(0.,1.7,3.1)+t);
  p+=0.25*sin(p.zxy*3.1+vec3(2.1,0.4,1.3)-t*0.7);
  return 0.65*sin(dot(p,vec3(2.2,0.9,1.5)))+0.35*sin(dot(p,vec3(-1.1,2.4,0.6))*1.3);
}

void main(){
  float r=length(v);
  float edge=clamp((1.-r)/uPx,0.,1.);
  if(edge<=0.){gl_FragColor=vec4(0.);return;}

  vec3 n=vec3(v,sqrt(max(0.,1.-r*r)));
  mat3 R=spin(uTime*0.35);
  float e=0.02;
  float h=folds(R*n);
  vec3 g=vec3(folds(R*(n+vec3(e,0,0)))-h, folds(R*(n+vec3(0,e,0)))-h, folds(R*(n+vec3(0,0,e)))-h)/e;
  vec3 nb=normalize(n-0.32*(g-dot(g,n)*n));

  vec3 L=normalize(vec3(-0.55,0.65,0.75));
  vec3 H=normalize(L+vec3(0.,0.,1.));
  float diff=clamp((dot(nb,L)+0.3)/1.3,0.,1.);
  float satin=pow(clamp(dot(nb,H),0.,1.),9.);
  float spec=pow(clamp(dot(nb,H),0.,1.),60.);
  float rim=pow(1.-n.z,2.5);

  vec3 deep=uPink*0.45;
  vec3 col=mix(deep,uPink,smoothstep(0.,1.,diff));
  col=mix(col,mix(uPink,vec3(1.),0.35),satin*0.55);
  col+=spec*0.35;
  col=mix(col,uPink*1.08,rim*0.4);

  gl_FragColor=vec4(col*edge,edge);
}`

function pinkFromCss(el: Element): [number, number, number] {
  const hex = getComputedStyle(el).getPropertyValue('--accent-fill').trim().replace('#', '')
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16)
  if (Number.isNaN(n)) return [1, 0.31, 0.64]
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export default function SilkBall({ size = 56, paused = false, className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const gl = c.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true })
    if (!gl) {
      c.dataset.fallback = 'true'
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = c.height = Math.round(size * dpr)
    gl.viewport(0, 0, c.width, c.height)

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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      c.dataset.fallback = 'true'
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'uTime')
    gl.uniform1f(gl.getUniformLocation(prog, 'uPx'), 2 / c.width)
    gl.uniform3fv(gl.getUniformLocation(prog, 'uPink'), pinkFromCss(c))

    const draw = (t: number) => {
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Reduced motion: one still frame, at an angle that shows the folds well.
    if (reduced) {
      draw(4)
      return
    }

    let raf = 0
    let t = 4
    let last = performance.now()
    draw(t) // first frame now, not on the next animation frame
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!pausedRef.current && !document.hidden) {
        t += dt
        draw(t)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [size, reduced])

  return (
    <canvas
      ref={canvas}
      className={className ? `silk-ball ${className}` : 'silk-ball'}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
