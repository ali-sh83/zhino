import { useMemo } from "react";
import * as THREE from "three";
import { cityTexture, floorTexture } from "./textures";

const BOOK_COLORS = ["#3b2a6b", "#1e3a5f", "#5b21b6", "#0e4f63", "#d8b4fe", "#334155", "#7c3aed", "#155e75"];

function Bookshelf() {
  const books = useMemo(() => {
    const list: { x: number; y: number; w: number; h: number; c: string; tilt: number }[] = [];
    let seed = 5;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let shelf = 0; shelf < 4; shelf++) {
      let x = -0.55;
      while (x < 0.5) {
        const w = 0.04 + r() * 0.05;
        const h = 0.24 + r() * 0.12;
        if (r() > 0.12) list.push({ x: x + w / 2, y: 0.25 + shelf * 0.5 + h / 2, w, h, c: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)] ?? "#3b2a6b", tilt: r() > 0.9 ? 0.15 : 0 });
        x += w + 0.008;
      }
    }
    return list;
  }, []);
  return (
    <group position={[-2.9, 0, -1.4]} rotation={[0, Math.PI / 2.6, 0]}>
      <mesh position={[0, 1.1, -0.18]} receiveShadow>
        <boxGeometry args={[1.3, 2.2, 0.04]} />
        <meshStandardMaterial color="#121626" roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.22 + i * 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.03, 0.36]} />
          <meshStandardMaterial color="#1f2438" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.245 + i * 0.5, 0.17]}>
          <boxGeometry args={[1.28, 0.006, 0.006]} />
          <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, 0]} rotation={[0, 0, b.tilt]} castShadow>
          <boxGeometry args={[b.w, b.h, 0.26]} />
          <meshStandardMaterial color={b.c} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leaves = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ a: (i / 9) * Math.PI * 2, tilt: 0.5 + (i % 3) * 0.2, h: 0.35 + (i % 4) * 0.08 })),
    [],
  );
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.4, 32]} />
        <meshPhysicalMaterial color="#e7e5ef" roughness={0.3} clearcoat={0.6} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={[Math.cos(l.a) * 0.06, 0.4 + l.h / 2, Math.sin(l.a) * 0.06]} rotation={[Math.sin(l.a) * l.tilt, 0, -Math.cos(l.a) * l.tilt]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={i % 2 ? "#2f6b4f" : "#3f8a62"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function Room() {
  const city = useMemo(() => cityTexture(), []);
  const floor = useMemo(() => floorTexture(), []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={floor} roughness={0.35} metalness={0.4} />
      </mesh>
      {/* back wall with window opening */}
      <group position={[0, 0, -3]}>
        <mesh position={[-3.4, 2, 0]}>
          <boxGeometry args={[3.6, 4, 0.1]} />
          <meshStandardMaterial color="#10142a" roughness={0.9} />
        </mesh>
        <mesh position={[3.4, 2, 0]}>
          <boxGeometry args={[3.6, 4, 0.1]} />
          <meshStandardMaterial color="#10142a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[3.2, 0.7, 0.1]} />
          <meshStandardMaterial color="#10142a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 0]}>
          <boxGeometry args={[3.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#10142a" roughness={0.9} />
        </mesh>
        {/* city view */}
        <mesh position={[0, 2.0, -1.2]}>
          <planeGeometry args={[5.5, 2.75]} />
          <meshBasicMaterial map={city} toneMapped={false} />
        </mesh>
        {/* glass + frame */}
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[3.2, 2.5]} />
          <meshPhysicalMaterial color="#9fb8ff" transparent opacity={0.08} roughness={0.05} metalness={0.2} />
        </mesh>
        {[-1.6, 0, 1.6].map((x) => (
          <mesh key={x} position={[x, 2.1, 0.05]}>
            <boxGeometry args={[0.05, 2.5, 0.06]} />
            <meshStandardMaterial color="#1f2438" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.72, 0.1]}>
          <boxGeometry args={[3.3, 0.04, 0.3]} />
          <meshStandardMaterial color="#1f2438" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      {/* architectural light strips */}
      <mesh position={[0, 3.95, -2.9]}>
        <boxGeometry args={[10, 0.02, 0.02]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[3.5, 0.02, -1]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 0.01, 0.02]} />
        <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* volumetric moonlight shaft through the window */}
      <mesh position={[0.6, 1.6, -1.6]} rotation={[0.9, 0, -0.25]}>
        <coneGeometry args={[1.4, 3.6, 32, 1, true]} />
        <meshBasicMaterial color="#6d5bd0" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Bookshelf />
      <Plant position={[2.4, 0, -2.2]} scale={1.6} />
      <Plant position={[-1.9, 0, -2.5]} scale={1.1} />
    </group>
  );
}
