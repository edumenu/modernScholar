"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 5200;

const STAR_VERTEX = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.62 + 0.38 * sin(uTime * (0.5 + aPhase * 1.4) + aPhase * 6.2831);
    vTwinkle = twinkle;
    vColor = aColor;
    gl_PointSize = aScale * uPixelRatio * (30.0 / -mv.z) * (0.75 + 0.45 * twinkle);
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    glow *= glow;
    float alpha = glow * (0.5 + 0.5 * vTwinkle);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Warm white, starlight gold, faint blue — matched to the CSS palette.
const STAR_COLORS: [number, number, number][] = [
  [1.0, 0.96, 0.9],
  [0.94, 0.76, 0.36],
  [0.76, 0.83, 1.0],
];

// Hand-placed cluster right of center — the "your constellation" motif.
const CLUSTER: [number, number, number][] = [
  [3.2, 1.9, 0],
  [4.4, 2.6, 0.2],
  [5.5, 2.1, -0.1],
  [6.1, 0.9, 0.1],
  [5.3, -0.3, 0],
  [4.0, -0.9, 0.2],
  [2.9, 0.1, -0.2],
  [3.6, 0.9, 0.1],
];

const CLUSTER_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 0],
  [7, 0],
  [7, 4],
];

// Deterministic PRNG keeps the geometry pure across re-renders (and gives a
// stable sky between visits).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useReducedMotion() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
}

function StarField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pixelRatio = useThree((state) => state.gl.getPixelRatio());
  const reduced = useReducedMotion();

  const { positions, scales, phases, colors } = useMemo(() => {
    const rand = mulberry32(20260719);
    const positions = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);
    const colors = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Bias density toward the horizon band for a milky-way feel.
      const band = rand();
      positions[i * 3] = (rand() - 0.5) * 34;
      positions[i * 3 + 1] =
        (rand() - 0.5) * (band < 0.55 ? 7 : 16) + (band < 0.55 ? -1 : 0);
      positions[i * 3 + 2] = -2 - rand() * 9;

      const bright = rand();
      scales[i] = bright > 0.985 ? 2.4 + rand() : 0.5 + rand() * 1.1;
      phases[i] = rand();

      const roll = rand();
      const color = roll < 0.72 ? STAR_COLORS[0] : roll < 0.92 ? STAR_COLORS[1] : STAR_COLORS[2];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }
    return { positions, scales, phases, colors };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    }),
    [pixelRatio],
  );

  useFrame((state) => {
    if (!materialRef.current || reduced) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={STAR_VERTEX}
        fragmentShader={STAR_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ClusterConstellation() {
  const lineRef = useRef<THREE.LineBasicMaterial>(null);
  const pointsMatRef = useRef<THREE.ShaderMaterial>(null);
  const pixelRatio = useThree((state) => state.gl.getPixelRatio());
  const reduced = useReducedMotion();

  const { positions, scales, phases, colors, linePositions } = useMemo(() => {
    const positions = new Float32Array(CLUSTER.length * 3);
    const scales = new Float32Array(CLUSTER.length);
    const phases = new Float32Array(CLUSTER.length);
    const colors = new Float32Array(CLUSTER.length * 3);
    CLUSTER.forEach((p, i) => {
      positions.set(p, i * 3);
      scales[i] = 3.4;
      phases[i] = i / CLUSTER.length;
      colors.set(STAR_COLORS[1], i * 3);
    });
    const linePositions = new Float32Array(CLUSTER_LINKS.length * 6);
    CLUSTER_LINKS.forEach(([a, b], i) => {
      linePositions.set(CLUSTER[a], i * 6);
      linePositions.set(CLUSTER[b], i * 6 + 3);
    });
    return { positions, scales, phases, colors, linePositions };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    }),
    [pixelRatio],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Constellation lines draw themselves in after the hero copy lands.
    if (lineRef.current) {
      const reveal = THREE.MathUtils.clamp((t - 1.6) / 2.2, 0, 1);
      const pulse = reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 0.8);
      lineRef.current.opacity = 0.34 * reveal * pulse;
    }
    if (pointsMatRef.current && !reduced) {
      pointsMatRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMatRef}
          vertexShader={STAR_VERTEX}
          fragmentShader={STAR_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineRef}
          color="#f0c25c"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function SceneRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (reduced) return;

    const damp = 1 - Math.exp(-2.5 * delta);
    group.rotation.y += (state.pointer.x * 0.06 - group.rotation.y) * damp;
    group.rotation.x += (-state.pointer.y * 0.04 - group.rotation.x) * damp;

    // Gentle upward drift as the hero scrolls away, echoing "ascent".
    const scrolled = Math.min(window.scrollY / window.innerHeight, 1.2);
    group.position.y += (scrolled * 2.4 - group.position.y) * damp;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Constellation() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 55 }}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <SceneRig>
        <StarField />
        <ClusterConstellation />
      </SceneRig>
    </Canvas>
  );
}
