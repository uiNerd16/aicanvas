// ============================================================
// COMPONENT: Planet
// Particle-sphere rendered with Three.js — a slowly-rotating
// 3D sphere lit from one side. A member of the Objects class, so
// its particles run a MONOCHROME ramp (text.primary lit → border.base
// shadow), never accent: an Object measures nothing, and accent is
// measurement. Reskinned from the accent ramp 2026-08-11 on the
// maintainer's ruling, when Objects became a named class. The ramp's two ends
// are the `color` / `shadowColor` props: monochrome tokens by default, so a
// template can recolour the body without the Object choosing a hue itself.
//
// Designed for "next destination" / "active body" widgets in the
// mission-control dashboard. The canvas is transparent — drop it
// inside a Card and the void shows through. Resize-observed.
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { tokens } from '../tokens';
import { useReducedMotion } from './lib/motion';
import { cn } from './lib/utils';
import { mq } from './lib/responsive';

/** Soft radial sprite. Multiplied by vertex color; each variant chooses the
 *  blend and depth behavior that makes its particle surfaces read correctly. */
function makeSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Planet particle sprite requires a 2D canvas context.');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  // andromeda-allow: an interpolated alpha ramp for the canvas particle sprite.
  // A gradient stop is texture math, not palette — no token can express one.
  grad.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  // andromeda-allow: same ramp.
  grad.addColorStop(0.20, 'rgba(255,255,255,0.78)');
  // andromeda-allow: same ramp.
  grad.addColorStop(0.55, 'rgba(255,255,255,0.22)');
  // andromeda-allow: same ramp.
  grad.addColorStop(1.00, 'rgba(255,255,255,0.00)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * @typedef {object} PlanetProps
 * @property {number} [particleCount=6000] Number of surface particles; 6000 reads dense at 320 to 480px.
 * @property {number} [particleSize=0.028] Per-particle point size in world units.
 * @property {number} [rotationSpeed=0.0035] Auto-rotation speed in radians per frame (assumes about 60fps).
 * @property {'shell' | 'mantle'} [variant='shell'] Surface construction; Mantle divides the particles between a porous shell and an eccentric inner body.
 * @property {boolean} [paused=false] When true, the planet does not auto-rotate.
 * @property {string} [color] Lit-body colour, any CSS colour syntax; defaults to `var(--andromeda-text-secondary, #A3A3A3)`. The terminator and the highlight specks are derived from this and `shadowColor`, so one value recolours the whole planet.
 * @property {string} [shadowColor] Unlit-side colour, any CSS colour syntax; defaults to `var(--andromeda-border-base, #3E3E3F)`.
 * @property {string} [className] Additional CSS classes applied to the root element.
 * @property {React.CSSProperties} [style] Inline styles applied to the root element.
 */
export function Planet({
  /** Number of surface particles. 6000 reads dense at 320 to 480px. */
  particleCount = 6000,
  /** Per-particle point size in world units. */
  particleSize = 0.028,
  /** Rotation speed (radians per frame, ~60fps assumed). */
  rotationSpeed = 0.0035,
  /** Surface construction. Shell remains the original Planet. */
  variant = 'shell',
  /** When true, the planet doesn't auto-rotate. */
  paused = false,
  /** Lit-body colour. The var default keeps the planet monochrome and
   *  token-driven out of the box; pass a string to recolour it. */
  color = `var(--andromeda-text-secondary, ${tokens.color.text.secondary})`,
  /** Unlit-side colour. */
  shadowColor = `var(--andromeda-border-base, ${tokens.color.border.base})`,
  className,
  style,
}: {
  particleCount?: number;
  particleSize?: number;
  rotationSpeed?: number;
  variant?: 'shell' | 'mantle';
  paused?: boolean;
  color?: string;
  shadowColor?: string;
  className?: string;
  style?: React.CSSProperties;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth  || 320;
    let H = container.clientHeight || 320;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Transparent canvas — let the parent (Card / void) show through.
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Andromeda palette → THREE.Color ─────────────────────────────────────
    // THREE.Color cannot parse var() any more than a 2D canvas can, so we never
    // parse a token ourselves — we let the browser do it: assign the prop to
    // `color` on the container (inert, the WebGL canvas never reads it), read
    // the computed value back, then clear it. Any syntax a caller or a retheme
    // uses resolves for free. Mount-time read only; var changes after mount
    // don't re-tint.
    const resolve = (value: string) => {
      container.style.color = value;
      const out = getComputedStyle(container).color;
      container.style.color = '';
      return new THREE.Color(out);
    };
    // Monochrome by class law: one grey, lit to shadow. The accent ramp this
    // used to read is reserved for measurement, and an Object measures nothing.
    // Only the two ends are props; the terminator and the highlight are derived
    // from them (never a second var) so recolouring with one value stays
    // coherent instead of half-recoloured. THREE works in linear space, so the
    // two constants below are linear-space factors: at the default tokens they
    // land on border.strong (#939393) and text.primary (#F5F5F5) — the exact
    // stops the four-token version read.
    const cLit = resolve(color);        // lit body
    const cShd = resolve(shadowColor);  // shadow side
    const cMid = cShd.clone().lerp(cLit, 0.77);         // terminator
    const cHi  = cLit.clone().multiplyScalar(2.49);     // lit highlight
    // Additive blending, so an over-1 channel would bloom out; clamp.
    cHi.setRGB(Math.min(cHi.r, 1), Math.min(cHi.g, 1), Math.min(cHi.b, 1));

    // Light comes from the front-right, slightly above. Choose a direction
    // that's NOT axis-aligned so the rotating planet shows a moving terminator.
    const lightDir = new THREE.Vector3(0.55, 0.30, 0.78).normalize();

    const sprite = makeSprite();
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.PointsMaterial[] = [];
    let renderPlanet: (time: number, moving: boolean) => void;

    if (variant === 'shell') {
      // ── Original shell: its distribution and paint remain untouched. ─────
      const positions = new Float32Array(particleCount * 3);
      const colors    = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // Uniform-on-sphere sampling
        const theta = Math.acos(2 * Math.random() - 1);
        const phi   = 2 * Math.PI * Math.random();
        // Tiny radius jitter so the surface reads as "atmosphere" not a hard shell.
        const r = 1.0 + (Math.random() - 0.5) * 0.06;

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.sin(phi);

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Lambert-style: dot(normal, lightDir) ∈ [-1, 1] → [0, 1]
        const dot = (x * lightDir.x + y * lightDir.y + z * lightDir.z) / r;
        const lit = (dot + 1) * 0.5;

        // Two-stop ramp: shadow → mid (lit ∈ [0, 0.5]), then mid → lit (lit ∈ [0.5, 1]).
        const c = new THREE.Color();
        if (lit < 0.5) c.lerpColors(cShd, cMid, lit * 2);
        else           c.lerpColors(cMid, cLit, (lit - 0.5) * 2);

        // Equator emphasis — particles near the equator ride a tiny bit brighter,
        // suggesting cloud bands without a literal texture.
        const equator = 1 - Math.abs(y / r) * 0.18;

        // 1% of well-lit particles become highlight specks — adds tiny "city
        // light" / atmospheric sparkle on the lit hemisphere.
        let cr = c.r * equator, cg = c.g * equator, cb = c.b * equator;
        if (Math.random() < 0.012 && lit > 0.62) {
          cr = cHi.r; cg = cHi.g; cb = cHi.b;
        }

        colors[i * 3]     = cr;
        colors[i * 3 + 1] = cg;
        colors[i * 3 + 2] = cb;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
      geometries.push(geo);

      const mat = new THREE.PointsMaterial({
        size:         particleSize,
        map:          sprite,
        vertexColors: true,
        transparent:  true,
        depthWrite:   false,
        blending:     THREE.AdditiveBlending,
      });
      materials.push(mat);

      const mesh = new THREE.Points(geo, mat);
      mesh.rotation.x = 0.22;
      mesh.rotation.z = 0.06;
      scene.add(mesh);

      renderPlanet = (time, moving) => {
        if (!moving) return;
        mesh.rotation.y = time;
        // Gentle Z wobble — keeps the rotation from feeling mechanical.
        mesh.rotation.z = 0.06 + Math.sin(time * 0.4) * 0.035;
      };
    } else {
      type MantleSurface = {
        points: THREE.Points;
        geometry: THREE.BufferGeometry;
        normals: Float32Array;
        colors: Float32Array;
      };

      // Most particles stay on the shell so its silhouette remains a body;
      // the smaller surface needs fewer to reach a comparable apparent density.
      const outerCount = Math.round(particleCount * 0.68);
      const innerCount = particleCount - outerCount;
      const outerAxis = new THREE.Vector3(0.18, 0.97, 0.12).normalize();
      const innerAxis = new THREE.Vector3(0.25, 0.95, 0.17).normalize();
      const outerStillAngle = -0.38;
      const innerStillAngle = 0.54;
      const outerStillQ = new THREE.Quaternion().setFromAxisAngle(outerAxis, outerStillAngle);
      const innerStillQ = new THREE.Quaternion().setFromAxisAngle(innerAxis, innerStillAngle);

      // Aim a soft, irregularly thinned patch toward the viewer in the composed
      // still. It is not a cut-out: every part retains particles, avoiding the
      // clean aperture that would turn Mantle into a technical cross-section.
      const apertureDir = new THREE.Vector3(0.10, -0.06, 1)
        .normalize()
        .applyQuaternion(outerStillQ.clone().invert());

      const makeSurface = (
        count: number,
        radius: number,
        porous: boolean,
      ): MantleSurface => {
        const positions = new Float32Array(count * 3);
        const normals = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        let i = 0;
        while (i < count) {
          const theta = Math.acos(2 * Math.random() - 1);
          const phi = 2 * Math.PI * Math.random();
          const nx = Math.sin(theta) * Math.cos(phi);
          const ny = Math.cos(theta);
          const nz = Math.sin(theta) * Math.sin(phi);

          if (porous) {
            const facing = Math.max(0, nx * apertureDir.x + ny * apertureDir.y + nz * apertureDir.z);
            const brokenEdge = 0.5 + 0.5 * Math.sin(nx * 8.3 + ny * 5.7 - nz * 6.1);
            const keep = 0.78 - Math.pow(facing, 2.4) * (0.28 + brokenEdge * 0.22);
            if (Math.random() > keep) continue;
          }

          // Independent radial jitter keeps the two surfaces bodily rather than
          // diagram-perfect, while leaving a real volume of empty space between.
          const r = radius + (Math.random() - 0.5) * (porous ? 0.06 : 0.045);
          positions[i * 3] = nx * r;
          positions[i * 3 + 1] = ny * r;
          positions[i * 3 + 2] = nz * r;
          normals[i * 3] = nx;
          normals[i * 3 + 1] = ny;
          normals[i * 3 + 2] = nz;
          i += 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometries.push(geometry);

        const points = new THREE.Points(geometry, mantleMaterial);
        scene.add(points);
        return { points, geometry, normals, colors };
      };

      // Normal blending plus a cutout threshold lets the depth buffer, rather
      // than additive accumulation, decide which surface is visible. That is
      // the guardrail against the inner body collapsing into a glowing orb.
      const mantleMaterial = new THREE.PointsMaterial({
        size: particleSize,
        map: sprite,
        vertexColors: true,
        transparent: true,
        alphaTest: 0.12,
        depthTest: true,
        depthWrite: true,
        blending: THREE.NormalBlending,
      });
      materials.push(mantleMaterial);

      const outer = makeSurface(outerCount, 1, true);
      const inner = makeSurface(innerCount, 0.64, false);
      // The offset is large enough to survive a frozen frame, but the inner
      // radius plus offset remains well inside the shell in every direction.
      inner.points.position.set(-0.10, 0.065, -0.055);

      const rotatedNormal = new THREE.Vector3();
      const paintSurface = (surface: MantleSurface) => {
        const q = surface.points.quaternion;
        for (let i = 0; i < surface.normals.length; i += 3) {
          rotatedNormal
            .set(surface.normals[i], surface.normals[i + 1], surface.normals[i + 2])
            .applyQuaternion(q);
          const lit = (rotatedNormal.dot(lightDir) + 1) * 0.5;
          const from = lit < 0.5 ? cShd : cMid;
          const to = lit < 0.5 ? cMid : cLit;
          const mix = lit < 0.5 ? lit * 2 : (lit - 0.5) * 2;
          surface.colors[i] = from.r + (to.r - from.r) * mix;
          surface.colors[i + 1] = from.g + (to.g - from.g) * mix;
          surface.colors[i + 2] = from.b + (to.b - from.b) * mix;
        }
        surface.geometry.attributes.color.needsUpdate = true;
      };

      renderPlanet = (time, moving) => {
        if (moving) {
          // Nearby axes and close speeds keep the layers related; their small
          // disagreement supplies parallax without reading as an exploded view.
          const outerAngle = outerStillAngle + time + Math.sin(time * 0.43) * 0.025;
          const innerAngle = innerStillAngle + time * 0.86 + Math.sin(time * 0.51 + 0.7) * 0.032;
          outer.points.quaternion.setFromAxisAngle(outerAxis, outerAngle);
          inner.points.quaternion.setFromAxisAngle(innerAxis, innerAngle);
        } else {
          outer.points.quaternion.copy(outerStillQ);
          inner.points.quaternion.copy(innerStillQ);
        }
        // Repaint after rotation so both surfaces meet one fixed world-space
        // side light instead of carrying a highlight painted onto local space.
        paintSurface(outer);
        paintSurface(inner);
      };
    }

    // ── Resize handling ─────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth  || W;
      const nh = container.clientHeight || H;
      if (nw === W && nh === H) return;
      W = nw; H = nh;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      // A frozen Planet has no RAF to repaint the resized drawing buffer.
      renderer.render(scene, camera);
    });
    ro.observe(container);

    // ── Animation loop ──────────────────────────────────────────────────────
    let raf = 0;
    let t = 0;
    let alive = true;
    let pageVisible = !document.hidden;
    let intersecting = true;

    function tick() {
      raf = 0;
      if (!alive || !pageVisible || !intersecting) return;
      const moving = !paused && !reducedMotion;
      if (moving) {
        t += rotationSpeed;
      }
      renderPlanet(t, moving);
      renderer.render(scene, camera);
      if (moving) raf = requestAnimationFrame(tick);
    }

    const wake = () => {
      if (!alive || raf || !pageVisible || !intersecting) return;
      raf = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        wake();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const io = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? true;
      if (!intersecting) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        wake();
      }
    });
    io.observe(container);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      sprite.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, particleSize, rotationSpeed, variant, paused, color, shadowColor, reducedMotion]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn('andromeda-planet', className)}
        style={{
          width: '100%',
          height: '100%',
          // Hero set-piece: never let the WebGL canvas push past the viewport.
          // The canvas sizes to clientWidth/clientHeight (ResizeObserver), so
          // capping the container here caps the render too. boxSizing keeps any
          // template padding inside the cap. 100% (not 100vw) avoids the
          // scrollbar-width page-scroll trap.
          maxWidth: '100%',
          boxSizing: 'border-box',
          ...style,
        }}
      />
      <style>{`
        /* On phones a hero Planet sized by a min-height parent can render a
           canvas taller than the viewport. Cap its height to the viewport's
           shorter side so a stacked hero panel never forces page scroll. The
           canvas stays square via its own aspect; this only sets the ceiling. */
        ${mq.md} {
          .andromeda-planet { max-height: 60vh !important; }
        }
      `}</style>
    </>
  );
}
