import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { pageTexture, woodTexture } from "./textures";
import { ramp, scrollState } from "./scroll-state";

const DESK_Y = 0.75;

/** Curved page surface: plane bent upward toward the spine like a real open book. */
function usePageGeometry(side: 1 | -1) {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(0.5, 0.66, 24, 1);
    const pos = g.attributes["position"]!;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + 0.25; // 0..0.5 from spine
      const lift = 0.05 * Math.exp(-x * 9) + 0.012 * Math.sin((x / 0.5) * Math.PI);
      pos.setXYZ(i, x * side, pos.getY(i), lift);
    }
    g.computeVertexNormals();
    return g;
  }, [side]);
}

function Book({ count }: { count: number }) {
  const texA = useMemo(() => pageTexture(0), []);
  const texB = useMemo(() => pageTexture(1), []);
  const leftGeo = usePageGeometry(-1);
  const rightGeo = usePageGeometry(1);
  const turning = useRef<THREE.Group>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const pageMatA = useRef<THREE.MeshStandardMaterial>(null);
  const pageMatB = useRef<THREE.MeshStandardMaterial>(null);
  const points = useRef<THREE.Points>(null);

  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.9;
      arr[i * 3 + 1] = Math.random() * 0.8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame((state, delta) => {
    const p = scrollState.progress;
    const alive = ramp(p, 0.4, 0.58);
    if (turning.current) {
      // pages turn as the camera approaches
      const turn = ((p - 0.42) / 0.06) % 1;
      turning.current.rotation.y = p > 0.42 ? -Math.PI * Math.max(0, Math.min(1, turn)) * 0.98 : 0;
      turning.current.visible = p > 0.42 && p < 0.62;
    }
    const intensity = 0.25 + alive * 1.6;
    if (pageMatA.current) pageMatA.current.emissiveIntensity = intensity;
    if (pageMatB.current) pageMatB.current.emissiveIntensity = intensity;
    if (glowMat.current) glowMat.current.opacity = 0.25 + alive * 0.6;
    if (points.current) {
      const pos = particleGeo.attributes["position"] as THREE.BufferAttribute;
      const speed = (0.03 + alive * 0.25) * Math.min(delta, 0.05);
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + speed * (0.5 + (i % 5) * 0.2);
        if (y > 0.8) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      (points.current.material as THREE.PointsMaterial).opacity = 0.35 + alive * 0.6;
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[0, DESK_Y + 0.012, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* cover */}
      <RoundedBox args={[1.08, 0.72, 0.02]} radius={0.008} position={[0, 0, -0.005]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a1550" roughness={0.55} metalness={0.2} />
      </RoundedBox>
      {/* page blocks (thickness) */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.26 * s, 0, 0.018]} castShadow>
          <boxGeometry args={[0.5, 0.66, 0.035]} />
          <meshStandardMaterial color="#e8e1d4" roughness={0.9} />
        </mesh>
      ))}
      <mesh geometry={leftGeo} position={[0, 0, 0.037]}>
        <meshStandardMaterial ref={pageMatA} map={texA} emissive="#a855f7" emissiveMap={texA} emissiveIntensity={0.25} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rightGeo} position={[0, 0, 0.037]}>
        <meshStandardMaterial ref={pageMatB} map={texB} emissive="#00d2ff" emissiveMap={texB} emissiveIntensity={0.25} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* turning page pivots on the spine */}
      <group ref={turning} position={[0, 0, 0.04]}>
        <mesh geometry={rightGeo}>
          <meshStandardMaterial map={texA} emissive="#d8b4fe" emissiveMap={texA} emissiveIntensity={1.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* edge glow */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshBasicMaterial ref={glowMat} color="#8a2be2" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <points ref={points} geometry={particleGeo} rotation={[Math.PI / 2, 0, 0]}>
        <pointsMaterial color="#c4b5fd" size={0.012} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
    </group>
  );
}

function Lamp() {
  const bulb = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (bulb.current) bulb.current.color.lerpColors(new THREE.Color("#ffd9b0"), new THREE.Color("#a855f7"), ramp(scrollState.progress, 0.42, 0.6));
  });
  return (
    <group position={[-0.95, DESK_Y, -0.3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.025, 32]} />
        <meshStandardMaterial color="#1c1f2c" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0.05, 0.25, 0]} rotation={[0, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 12]} />
        <meshStandardMaterial color="#b8bcc9" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.48, 0.05]} rotation={[0, 0, 1.0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.34, 12]} />
        <meshStandardMaterial color="#b8bcc9" metalness={1} roughness={0.2} />
      </mesh>
      <group position={[0.36, 0.38, 0.08]} rotation={[0.3, 0, -0.9]}>
        <mesh castShadow>
          <coneGeometry args={[0.1, 0.14, 32, 1, true]} />
          <meshStandardMaterial color="#1c1f2c" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#fff1dc" toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={bulb} position={[0.38, 0.3, 0.1]} intensity={2.2} distance={3} decay={1.6} color="#ffd9b0" castShadow shadow-mapSize={[512, 512]} />
    </group>
  );
}

export function Desk({ particleCount }: { particleCount: number }) {
  const wood = useMemo(() => woodTexture(), []);
  return (
    <group>
      {/* desk top + legs */}
      <RoundedBox args={[2.6, 0.06, 1.1]} radius={0.02} position={[0, DESK_Y - 0.03, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial map={wood} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
      </RoundedBox>
      <mesh position={[0, DESK_Y - 0.065, 0.552]}>
        <boxGeometry args={[2.58, 0.006, 0.006]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, (DESK_Y - 0.06) / 2, 0]} castShadow>
          <boxGeometry args={[0.06, DESK_Y - 0.06, 1.0]} />
          <meshStandardMaterial color="#1a1d2a" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}

      <Book count={particleCount} />
      <Lamp />

      {/* notebooks */}
      {[
        { c: "#3b2a6b", y: 0, r: 0.15 },
        { c: "#0e4f63", y: 0.022, r: 0.05 },
        { c: "#e9e4f5", y: 0.042, r: -0.08 },
      ].map((n, i) => (
        <RoundedBox key={i} args={[0.34, 0.02, 0.46]} radius={0.004} position={[0.92, DESK_Y + 0.012 + n.y, 0.1]} rotation={[0, n.r, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={n.c} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* mug */}
      <group position={[0.75, DESK_Y, -0.32]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.14, 32]} />
          <meshPhysicalMaterial color="#f4f2fb" roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh position={[0.06, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.032, 0.009, 10, 24, Math.PI]} />
          <meshPhysicalMaterial color="#f4f2fb" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0.052]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.018, 0.004, 8, 24]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
      {/* pen holder */}
      <group position={[1.1, DESK_Y, -0.35]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 24, 1, true]} />
          <meshStandardMaterial color="#20253a" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {[
          [0.012, 0.15, 0.1, "#00d2ff"],
          [-0.015, 0.17, -0.12, "#a855f7"],
          [0.005, 0.16, 0.02, "#e2e8f0"],
        ].map(([x, h, r, c], i) => (
          <mesh key={i} position={[x as number, 0.1 + (h as number) / 2 - 0.05, 0]} rotation={[0, 0, r as number]}>
            <cylinderGeometry args={[0.006, 0.006, h as number, 8]} />
            <meshStandardMaterial color={c as string} metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
