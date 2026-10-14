import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { labelTexture } from "./textures";
import { ramp, scrollState } from "./scroll-state";

const SHELL = { color: "#eef0f6", roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15 };
const JOINT = { color: "#2a2d3a", roughness: 0.4, metalness: 0.85 };

function Arm({ side, armRef }: { side: 1 | -1; armRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[0.4 * side, 0.55, 0]} ref={armRef}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      {/* upper arm, angled down-forward */}
      <group rotation={[-0.3, 0, 0.1 * side]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.28, 8, 16]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        <group position={[0, -0.4, 0]} rotation={[-1.5, 0, -0.1 * side]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
          <mesh position={[0, -0.19, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.24, 8, 16]} />
            <meshPhysicalMaterial {...SHELL} />
          </mesh>
          <mesh position={[0, -0.21, 0.068]}>
            <boxGeometry args={[0.02, 0.18, 0.004]} />
            <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          {/* hand */}
          <group position={[0, -0.4, 0]}>
            <RoundedBox args={[0.12, 0.1, 0.06]} radius={0.025} castShadow>
              <meshStandardMaterial {...JOINT} />
            </RoundedBox>
            {[-0.04, -0.013, 0.013, 0.04].map((x) => (
              <mesh key={x} position={[x, -0.07, 0]} rotation={[0.4, 0, 0]} castShadow>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <meshStandardMaterial color="#3a3d4c" metalness={0.8} roughness={0.35} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

export function Robot({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeMat = useRef<THREE.MeshStandardMaterial>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const label = useMemo(() => labelTexture("ZHINO"), []);

  useFrame((state, delta) => {
    const p = scrollState.progress;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const k = 1 - Math.exp(-4 * Math.min(delta, 0.05));
    if (torso.current) {
      const b = Math.sin(t * 1.4) * 0.012;
      torso.current.position.y = b;
      torso.current.scale.set(1 + b * 0.4, 1, 1 + b * 0.4);
    }
    if (head.current) {
      // Stage 1 reading → stage 2 looks at visitor → stage 3 looks at book
      const look = ramp(p, 0.08, 0.2) * (1 - ramp(p, 0.3, 0.42));
      const targetX = THREE.MathUtils.lerp(0.42, -0.08, look) + Math.sin(t * 0.5) * 0.04;
      const targetY = look * 0.25 + Math.sin(t * 0.33) * 0.08 * (1 - look);
      head.current.rotation.x += (targetX - head.current.rotation.x) * k;
      head.current.rotation.y += (targetY - head.current.rotation.y) * k;
    }
    if (eyeMat.current) {
      const blink = !reducedMotion && Math.sin(t * 0.9) > 0.985 ? 0.15 : 1;
      eyeMat.current.emissiveIntensity = (2.2 + ramp(p, 0.08, 0.2) * 2.5) * blink;
    }
    // Stage 3 gesture: right arm lifts toward the book
    const gesture = ramp(p, 0.3, 0.4) * (1 - ramp(p, 0.5, 0.58));
    if (armR.current) armR.current.rotation.x = -gesture * 0.5 + Math.sin(t * 0.8) * 0.02;
    if (armL.current) armL.current.rotation.x = Math.sin(t * 0.7 + 1) * 0.02;
    if (armR.current) armR.current.rotation.z = gesture * 0.25;
  });

  return (
    <group ref={root} position={[0, 0.55, -0.85]}>
      {/* chair */}
      <mesh position={[0, -0.08, -0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial color="#1b1f30" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.45, -0.38]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.06]} />
        <meshStandardMaterial color="#1b1f30" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.33, -0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>

      <group ref={torso}>
        {/* pelvis + torso */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.24, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <mesh position={[0, 0.3, 0]} scale={[1, 1.15, 0.8]} castShadow>
          <sphereGeometry args={[0.33, 48, 32]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        {/* chest light strip + label */}
        <mesh position={[0, 0.42, 0.262]} rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.22, 0.055]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.25, 0.27]}>
          <torusGeometry args={[0.05, 0.008, 12, 40]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} toneMapped={false} />
        </mesh>

        <Arm side={1} armRef={armR} />
        <Arm side={-1} armRef={armL} />

        {/* neck + head */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 20]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <group ref={head} position={[0, 0.88, 0]}>
          <RoundedBox args={[0.5, 0.38, 0.4]} radius={0.15} smoothness={6} castShadow>
            <meshPhysicalMaterial {...SHELL} />
          </RoundedBox>
          {/* visor */}
          <RoundedBox args={[0.42, 0.2, 0.06]} radius={0.06} position={[0, 0, 0.18]}>
            <meshPhysicalMaterial color="#05060d" roughness={0.05} metalness={0.6} clearcoat={1} />
          </RoundedBox>
          {[-0.09, 0.09].map((x) => (
            <mesh key={x} position={[x, 0.005, 0.215]} scale={[1, 0.7, 1]}>
              <circleGeometry args={[0.04, 32]} />
              <meshStandardMaterial
                ref={x < 0 ? eyeMat : null}
                color="#7dd3fc"
                emissive="#00d2ff"
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </mesh>
          ))}
          {/* ear modules */}
          {[-1, 1].map((s) => (
            <group key={s} position={[0.26 * s, 0, 0]} rotation={[0, 0, (Math.PI / 2) * s]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, 0.05, 28]} />
                <meshStandardMaterial {...JOINT} />
              </mesh>
              <mesh position={[0, 0.026 * -s, 0]}>
                <torusGeometry args={[0.05, 0.007, 8, 32]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.5} toneMapped={false} />
              </mesh>
            </group>
          ))}
          <mesh position={[0.12, 0.24, -0.05]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
          <mesh position={[0.135, 0.32, -0.05]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={3} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
