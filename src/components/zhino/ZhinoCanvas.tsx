import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Room } from "./Room";
import { Robot } from "./Robot";
import { Desk } from "./Desk";
import { BookWorld } from "./BookWorld";
import { CameraRig } from "./CameraRig";
import { Holograms } from "./Holograms";

export default function ZhinoCanvas({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  return (
    <Canvas
      shadows
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.85, 4.6], fov: 45, near: 0.05, far: 120 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={["#080b16"]} />
      <fog attach="fog" args={["#080b16", 6, 16]} />
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={0.35} color="#8b8bd8" />
      <directionalLight position={[-3, 5, 3]} intensity={1.2} color="#e9e4ff" castShadow shadow-mapSize={[mobile ? 1024 : 2048, mobile ? 1024 : 2048]} shadow-bias={-0.0004} />
      <pointLight position={[2.5, 2, 1]} intensity={6} distance={8} color="#00d2ff" />
      <pointLight position={[-2.5, 2.4, -1]} intensity={6} distance={8} color="#a855f7" />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={2.5} color="#a855f7" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1.5, 1]} />
        <Lightformer intensity={2.5} color="#00d2ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1.5, 1]} />
      </Environment>

      <Room />
      <Desk particleCount={mobile ? 60 : 180} />
      <Robot reducedMotion={reducedMotion} />
      <ContactShadows position={[0, 0.005, 0]} opacity={0.6} scale={8} blur={2.4} far={2} />
      <Holograms />
      <BookWorld pages={mobile ? 20 : 50} />
      <CameraRig reducedMotion={reducedMotion} mobile={mobile} />

      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.8} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
