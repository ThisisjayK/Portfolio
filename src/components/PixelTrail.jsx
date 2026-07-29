/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';

import './PixelTrail.css';

const GooeyFilter = ({ id = 'goo-filter', strength = 10 }) => {
  return (
    <svg className="goo-filter-container">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new THREE.Color('#ffffff')
  },
  `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `
);

function Scene({ gridSize, trailSize, maxAge, interpolate, easingFunction, pixelColor }) {
  const size = useThree(s => s.size);
  const viewport = useThree(s => s.viewport);
  const gl = useThree(s => s.gl);

  const dotMaterial = useMemo(() => new DotMaterial(), []);
  // The material writes gl_FragColor straight out with no sRGB encoding, so a
  // plain THREE.Color (stored linear under three's colour management) renders
  // far too dark. Convert to sRGB first so the brand hex shows true on screen.
  dotMaterial.uniforms.pixelColor.value = new THREE.Color(pixelColor).convertLinearToSRGB();

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || (x => x)
  });

  if (trail) {
    trail.minFilter = THREE.NearestFilter;
    trail.magFilter = THREE.NearestFilter;
    trail.wrapS = THREE.ClampToEdgeWrapping;
    trail.wrapT = THREE.ClampToEdgeWrapping;
  }

  // This canvas is a fixed, full-page background with pointer-events:none, so the
  // mesh never receives its own pointer events. Drive the trail from a global
  // listener instead, and push the cursor through the SAME "cover" transform the
  // shader samples with, so the trail tracks the cursor on non-square viewports.
  useEffect(() => {
    const el = gl.domElement;
    const handle = e => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const m = Math.max(rect.width, rect.height);
      const sx = rect.width / m;
      const sy = rect.height / m;
      const u = e.clientX / rect.width; // 0..1 left -> right
      const v = 1 - e.clientY / rect.height; // 0..1 bottom -> up (matches gl_FragCoord)
      const uv = new THREE.Vector2((u - 0.5) * sx + 0.5, (v - 0.5) * sy + 0.5);
      onMove({ uv });
    };
    window.addEventListener('pointermove', handle);
    return () => window.removeEventListener('pointermove', handle);
  }, [gl, onMove]);

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  );
}

export default function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = x => x,
  canvasProps = {},
  glProps = {
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  },
  gooeyFilter,
  color = '#ffffff',
  className = ''
}) {
  return (
    <>
      {gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
      {/* Own the positioning here: r3f sets inline position/size on its <Canvas>
          container, which would override a CSS class, so the fixed full-viewport
          layer lives on this wrapper and the Canvas just fills it. */}
      <div
        className={`pixel-trail ${className}`}
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      >
        <Canvas {...canvasProps} gl={glProps} className="pixel-canvas">
          <Scene
            gridSize={gridSize}
            trailSize={trailSize}
            maxAge={maxAge}
            interpolate={interpolate}
            easingFunction={easingFunction}
            pixelColor={color}
          />
        </Canvas>
      </div>
    </>
  );
}
