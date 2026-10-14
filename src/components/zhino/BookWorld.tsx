import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { pageTexture } from "./textures";
import { scrollState } from "./scroll-state";

export const WORLD_Y = -40;
export const DEST = {
  chapters: new THREE.Vector3(-9, WORLD_Y, -6),
  mock: new THREE.Vector3(0, WORLD_Y, -18),
  plus: new THREE.Vector3(11, WORLD_Y, -26),
  emblem: new THREE.Vector3(0, WORLD_Y + 1.5, -36),
};

const glow = (c: string, i = 2.5) => ({ color: c, emissive: c, emissiveIntensity: i, toneMapped: false });

function FloatingPages({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tex = useMemo(() => pageTexture(1), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        p: new THREE.Vector3((Math.random() - 0.5) * 40, WORLD_Y + (Math.random() - 0.3) * 14, 8 - Math.random() * 50),
        r: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3),
        s: 0.6 + Math.random() * 0.8,
        sp: 0.2 + (i % 7) * 0.05,
      })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    if (!ref.current || scrollState.progress < 0.58) return;
    const t = state.clock.elapsedTime;
    data.forEach((d, i) => {
      dummy.position.set(d.p.x, d.p.y + Math.sin(t * d.sp + i) * 0.4, d.p.z);
      dummy.rotation.set(d.r.x + t * d.sp * 0.2, d.r.y + t * 0.1, d.r.z);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.7, 1]} />
      <meshStandardMaterial map={tex} emissive="#a855f7" emissiveMap={tex} emissiveIntensity={0.6} side={THREE.DoubleSide} transparent opacity={0.85} />
    </instancedMesh>
  );
}

/** Destination 1 — chapter-based exams: an arch of glowing textbook chapters. */
function Chapters() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * 0.15;
  });
  return (
    <group position={DEST.chapters}>
      <group ref={ref}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 3, Math.sin(i * 1.3) * 0.4, Math.sin(a) * 3]} rotation={[0, -a, 0]}>
              <mesh>
                <boxGeometry args={[0.25, 1.4, 1]} />
                <meshStandardMaterial color={i % 2 ? "#3b2a6b" : "#1e3a5f"} roughness={0.5} metalness={0.3} />
              </mesh>
              <mesh position={[0.13, 0, 0]}>
                <boxGeometry args={[0.01, 1.2, 0.04]} />
                <meshStandardMaterial {...glow(i % 2 ? "#a855f7" : "#00d2ff")} />
              </mesh>
            </group>
          );
        })}
      </group>
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial {...glow("#d8b4fe", 1.5)} wireframe />
      </mesh>
      <pointLight color="#a855f7" intensity={30} distance={12} />
    </group>
  );
}

/** Destination 2 — mock exams: an expansive answer-sheet hall. */
function MockHall() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cols = 14;
  const rows = 10;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame((state) => {
    if (!ref.current || scrollState.progress < 0.7) return;
    const t = state.clock.elapsedTime;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dummy.position.set((c - cols / 2) * 0.9, -1.5 + Math.sin(t * 1.2 + c * 0.4 + r * 0.6) * 0.08, (r - rows / 2) * 0.9);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
        const filled = (c * 7 + r * 3) % 4 === 0;
        ref.current.setColorAt(i, color.set(filled ? "#00d2ff" : "#2a2f4a"));
        i++;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });
  return (
    <group position={DEST.mock}>
      <instancedMesh ref={ref} args={[undefined, undefined, cols * rows]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 20]} />
        <meshStandardMaterial emissive="#0891b2" emissiveIntensity={0.6} roughness={0.4} />
      </instancedMesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 6.8, 1, 0]}>
          <boxGeometry args={[0.05, 5, 9]} />
          <meshStandardMaterial {...glow("#00d2ff", 1.2)} transparent opacity={0.4} />
        </mesh>
      ))}
      <pointLight color="#00d2ff" intensity={40} distance={16} position={[0, 2, 0]} />
    </group>
  );
}

/** Destination 3 — ZhinoPlus topic practice: precise orbiting focus rings. */
function PlusCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      c.rotation.x = t * (0.2 + i * 0.1);
      c.rotation.y = t * (0.15 + i * 0.07);
    });
  });
  return (
    <group position={DEST.plus}>
      <group ref={ref}>
        {[1.2, 1.7, 2.2, 2.7].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.02, 12, 120]} />
            <meshStandardMaterial {...glow(i % 2 ? "#a855f7" : "#00d2ff", 2)} />
          </mesh>
        ))}
      </group>
      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshPhysicalMaterial color="#c4b5fd" roughness={0.1} metalness={0.3} transmission={0.6} thickness={0.5} />
      </mesh>
      <pointLight color="#d8b4fe" intensity={30} distance={12} />
    </group>
  );
}

function Emblem() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
  });
  return (
    <group position={DEST.emblem} ref={ref}>
      <mesh>
        <torusGeometry args={[1.6, 0.06, 20, 160]} />
        <meshStandardMaterial {...glow("#a855f7", 3)} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.25, 0.025, 12, 4]} />
        <meshStandardMaterial {...glow("#00d2ff", 3)} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial color="#f5f3ff" roughness={0.05} metalness={0.4} clearcoat={1} />
      </mesh>
      <pointLight color="#a855f7" intensity={40} distance={14} />
    </group>
  );
}

export function BookWorld({ pages }: { pages: number }) {
  return (
    <group>
      <FloatingPages count={pages} />
      <Chapters />
      <MockHall />
      <PlusCore />
      <Emblem />
    </group>
  );
}
