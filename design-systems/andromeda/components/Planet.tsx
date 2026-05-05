// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Planet
// Particle-sphere rendered with Three.js — a slowly-rotating
// 3D sphere lit from one side. All particle colors are sourced
// from the Andromeda accent ramp (100 lit → 500 shadow), so the
// component automatically follows the system palette.
//
// Designed for "next destination" / "active body" widgets in the
// mission-control dashboard. The canvas is transparent — drop it
// inside a Card and the void shows through. Resize-observed.
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { tokens } from '../tokens';

/** Soft radial sprite. Multiplied by vertex color and blended additively
 *  so each particle reads as a tiny glow on the dark void. */
function makeSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  grad.addColorStop(0.20, 'rgba(255,255,255,0.78)');
  grad.addColorStop(0.55, 'rgba(255,255,255,0.22)');
  grad.addColorStop(1.00, 'rgba(255,255,255,0.00)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Planet({
  /** Number of surface particles. 6000 reads dense at 320–480px. */
  particleCount = 6000,
  /** Per-particle point size in world units. */
  particleSize = 0.028,
  /** Rotation speed (radians per frame, ~60fps assumed). */
  rotationSpeed = 0.0035,
  /** When true, the planet doesn't auto-rotate. */
  paused = false,
  className,
  style,
}: {
  particleCount?: number;
  particleSize?: number;
  rotationSpeed?: number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    const cHi  = new THREE.Color(tokens.color.accent[100]); // lit highlight
    const cLit = new THREE.Color(tokens.color.accent[200]); // lit body
    const cMid = new THREE.Color(tokens.color.accent[400]); // terminator
    const cShd = new THREE.Color(tokens.color.accent[500]); // shadow side

    // Light comes from the front-right, slightly above. Choose a direction
    // that's NOT axis-aligned so the rotating planet shows a moving terminator.
    const lightDir = new THREE.Vector3(0.55, 0.30, 0.78).normalize();

    // ── Buffer geometry: positions + per-vertex colors ──────────────────────
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

    const sprite = makeSprite();
    const mat = new THREE.PointsMaterial({
      size:         particleSize,
      map:          sprite,
      vertexColors: true,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(geo, mat);
    mesh.rotation.x = 0.22;
    mesh.rotation.z = 0.06;
    scene.add(mesh);

    // ── Resize handling ─────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth  || W;
      const nh = container.clientHeight || H;
      if (nw === W && nh === H) return;
      W = nw; H = nh;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // ── Animation loop ──────────────────────────────────────────────────────
    let raf = 0;
    let t = 0;
    let alive = true;
    function tick() {
      if (!alive) return;
      raf = requestAnimationFrame(tick);
      if (!paused) {
        t += rotationSpeed;
        mesh.rotation.y = t;
        // Gentle Z wobble — keeps the rotation from feeling mechanical.
        mesh.rotation.z = 0.06 + Math.sin(t * 0.4) * 0.035;
      }
      renderer.render(scene, camera);
    }
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, particleSize, rotationSpeed, paused]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
