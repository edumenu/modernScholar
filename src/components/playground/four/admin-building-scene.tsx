"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const IVORY = "#eae5d8";
const BONE = "#f7f4ec";
const GRAPHITE = "#26272e";
const GLASS = "#1d1e24";
const ULTRAMARINE = "#2334f0";
const GROUND = "#ebe8df";

const ASSEMBLE = 0.85;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

type PartProps = {
  delay?: number;
  drop?: number;
  position?: [number, number, number];
  reduced: boolean;
  children: React.ReactNode;
};

/* A building fragment that falls into place from above (or pops in when
   drop is 0) once its delay has elapsed on the scene clock. */
function Part({ delay = 0, drop = 3, position = [0, 0, 0], reduced, children }: PartProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    if (reduced) {
      g.visible = true;
      g.position.set(position[0], position[1], position[2]);
      g.scale.setScalar(1);
      return;
    }
    const t = clock.getElapsedTime() - delay;
    if (t <= 0) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const e = easeOutCubic(Math.min(t / ASSEMBLE, 1));
    g.position.set(position[0], position[1] + (1 - e) * drop, position[2]);
    g.scale.setScalar(drop === 0 ? e : 0.86 + 0.14 * e);
  });

  return (
    <group ref={ref} position={position} visible={false}>
      {children}
    </group>
  );
}

function Pennant({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 2.4) * 0.22;
  });
  return (
    <mesh ref={ref} position={[0.02, 4.32, 0]} castShadow>
      <coneGeometry args={[0.13, 0.44, 4]} />
      <meshStandardMaterial color={ULTRAMARINE} roughness={0.8} />
    </mesh>
  );
}

const WING_WINDOW_COLS = [-0.6, 0, 0.6];
const WING_WINDOW_ROWS = [0.95, 1.6];
const COLUMN_XS = [-1.05, -0.35, 0.35, 1.05];

function Building({ reduced }: { reduced: boolean }) {
  const pediment = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.72, 0);
    shape.lineTo(1.72, 0);
    shape.lineTo(0, 0.92);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false });
  }, []);

  return (
    <group>
      {/* Ground plinth */}
      <Part delay={0.1} drop={2} position={[0, 0.15, 0]} reduced={reduced}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.8, 0.3, 3.6]} />
          <meshStandardMaterial color={BONE} roughness={0.95} />
        </mesh>
      </Part>

      {/* Front steps */}
      <Part delay={0.25} drop={2} position={[0, 0, 2.05]} reduced={reduced}>
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.18, 0.9]} />
          <meshStandardMaterial color={IVORY} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.26, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.16, 0.6]} />
          <meshStandardMaterial color={IVORY} roughness={0.95} />
        </mesh>
      </Part>

      {/* Central hall */}
      <Part delay={0.4} drop={3.4} position={[0, 1.65, 0]} reduced={reduced}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 2.7, 2.6]} />
          <meshStandardMaterial color={IVORY} roughness={0.9} />
        </mesh>
      </Part>

      {/* Wings */}
      <Part delay={0.58} drop={3} position={[-2.85, 1.25, 0]} reduced={reduced}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.9, 2.2]} />
          <meshStandardMaterial color={IVORY} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.01, 0]} castShadow>
          <boxGeometry args={[2.4, 0.12, 2.4]} />
          <meshStandardMaterial color={GRAPHITE} roughness={0.85} />
        </mesh>
      </Part>
      <Part delay={0.7} drop={3} position={[2.85, 1.25, 0]} reduced={reduced}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.9, 2.2]} />
          <meshStandardMaterial color={IVORY} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.01, 0]} castShadow>
          <boxGeometry args={[2.4, 0.12, 2.4]} />
          <meshStandardMaterial color={GRAPHITE} roughness={0.85} />
        </mesh>
      </Part>

      {/* Colonnade */}
      {COLUMN_XS.map((x, i) => (
        <Part key={x} delay={0.9 + i * 0.1} drop={2.6} position={[x, 1.25, 1.55]} reduced={reduced}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.13, 1.9, 20]} />
            <meshStandardMaterial color={BONE} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.92, 0]} castShadow>
            <boxGeometry args={[0.34, 0.1, 0.34]} />
            <meshStandardMaterial color={BONE} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[0.32, 0.1, 0.32]} />
            <meshStandardMaterial color={BONE} roughness={0.9} />
          </mesh>
        </Part>
      ))}

      {/* Entablature */}
      <Part delay={1.3} drop={2.4} position={[0, 2.38, 1.55]} reduced={reduced}>
        <mesh castShadow>
          <boxGeometry args={[3.1, 0.3, 0.55]} />
          <meshStandardMaterial color={IVORY} roughness={0.9} />
        </mesh>
      </Part>

      {/* Pediment */}
      <Part delay={1.45} drop={2.6} position={[0, 2.53, 1.05]} reduced={reduced}>
        <mesh geometry={pediment} castShadow>
          <meshStandardMaterial color={BONE} roughness={0.9} />
        </mesh>
      </Part>

      {/* Hall roof */}
      <Part delay={1.4} drop={2.8} position={[0, 3.06, 0]} reduced={reduced}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.14, 2.8]} />
          <meshStandardMaterial color={GRAPHITE} roughness={0.85} />
        </mesh>
      </Part>

      {/* Cupola drum, dome, spire */}
      <Part delay={1.6} drop={2.4} position={[0, 3.4, 0]} reduced={reduced}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.46, 0.55, 24]} />
          <meshStandardMaterial color={BONE} roughness={0.9} />
        </mesh>
      </Part>
      <Part delay={1.75} drop={2.2} position={[0, 3.66, 0]} reduced={reduced}>
        <mesh castShadow>
          <sphereGeometry args={[0.47, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={ULTRAMARINE} roughness={0.55} />
        </mesh>
      </Part>
      <Part delay={1.9} drop={1.6} position={[0, 0, 0]} reduced={reduced}>
        <mesh position={[0, 4.32, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.55, 8]} />
          <meshStandardMaterial color={GRAPHITE} roughness={0.8} />
        </mesh>
        <Pennant reduced={reduced} />
      </Part>

      {/* Door */}
      <Part delay={1.55} drop={0} position={[0, 0.9, 1.33]} reduced={reduced}>
        <mesh castShadow>
          <boxGeometry args={[0.54, 1.0, 0.08]} />
          <meshStandardMaterial color={ULTRAMARINE} roughness={0.7} />
        </mesh>
      </Part>

      {/* Hall windows flanking the door */}
      {[-0.95, 0.95].map((x, i) => (
        <Part key={x} delay={1.62 + i * 0.08} drop={0} position={[x, 1.45, 1.32]} reduced={reduced}>
          <mesh>
            <boxGeometry args={[0.36, 0.85, 0.06]} />
            <meshStandardMaterial color={GLASS} roughness={0.4} />
          </mesh>
        </Part>
      ))}

      {/* Wing windows */}
      {[-2.85, 2.85].map((wx, w) =>
        WING_WINDOW_ROWS.map((y, r) =>
          WING_WINDOW_COLS.map((cx, c) => (
            <Part
              key={`${wx}-${y}-${cx}`}
              delay={1.7 + w * 0.1 + r * 0.08 + c * 0.05}
              drop={0}
              position={[wx + cx, y, 1.13]}
              reduced={reduced}
            >
              <mesh>
                <boxGeometry args={[0.3, 0.46, 0.06]} />
                <meshStandardMaterial color={GLASS} roughness={0.4} />
              </mesh>
            </Part>
          )),
        ),
      )}
    </group>
  );
}

const BASE_ROTATION_Y = -0.32;

/* Orients the whole model: a resting three-quarter view with gentle
   pointer-driven parallax read from a window listener (the canvas itself
   is pointer-events: none so hero text stays selectable). */
function Rig({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const k = Math.min(delta * 2.2, 1);
    const targetY = BASE_ROTATION_Y + pointer.current.x * 0.16;
    const targetX = 0.02 + pointer.current.y * 0.05;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return (
    <group ref={ref} rotation={[0.02, BASE_ROTATION_Y, 0]}>
      {children}
    </group>
  );
}

export function AdminBuildingScene() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      flat
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [0, 2.6, 11.5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-label="A collegiate administration building assembling itself, piece by piece"
    >
      <ambientLight intensity={0.95} />
      <directionalLight
        position={[7, 12, 6]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} />

      <Rig reduced={reduced}>
        <group position={[0, -1.9, 0]}>
          {/* Ground disc + shadow catcher */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <circleGeometry args={[5.4, 64]} />
            <meshStandardMaterial color={GROUND} roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[5.4, 64]} />
            <shadowMaterial transparent opacity={0.1} />
          </mesh>
          <Building reduced={reduced} />
        </group>
      </Rig>
    </Canvas>
  );
}
