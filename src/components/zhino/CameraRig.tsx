import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { DEST, WORLD_Y } from "./BookWorld";
import { PORTAL, ramp, scrollState, smooth } from "./scroll-state";

type Key = { t: number; pos: [number, number, number]; target: [number, number, number]; fov: number };

const W = WORLD_Y;
// Room segment (0 → PORTAL): establishing → robot → desk → book → into the page.
const ROOM: Key[] = [
  { t: 0.0, pos: [0, 1.85, 4.6], target: [0, 1.1, -0.6], fov: 45 },
  { t: 0.18, pos: [1.0, 1.55, 2.3], target: [0, 1.35, -0.8], fov: 40 },
  { t: 0.34, pos: [-0.9, 1.2, 1.3], target: [0.1, 0.82, -0.1], fov: 42 },
  { t: 0.5, pos: [0.05, 1.42, 0.75], target: [0, 0.78, 0.05], fov: 40 },
  { t: PORTAL, pos: [0, 0.86, 0.2], target: [0, 0.7, 0.0], fov: 55 },
];
// Book world (PORTAL → 1): three destinations then the emblem.
const WORLD: Key[] = [
  { t: PORTAL, pos: [0, W + 6, 10], target: [0, W, 0], fov: 60 },
  { t: 0.72, pos: [-4, W + 1.2, 1.5], target: [DEST.chapters.x, W, DEST.chapters.z], fov: 50 },
  { t: 0.82, pos: [2.5, W + 2.5, -9], target: [DEST.mock.x, W - 1, DEST.mock.z], fov: 50 },
  { t: 0.9, pos: [6.5, W + 0.6, -20], target: [DEST.plus.x, W, DEST.plus.z], fov: 48 },
  { t: 1.0, pos: [0, W + 1.6, -29], target: [DEST.emblem.x, DEST.emblem.y, DEST.emblem.z], fov: 45 },
];

function build(keys: Key[]) {
  return {
    keys,
    pos: new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal"),
    tgt: new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.target)), false, "centripetal"),
  };
}

function sample(seg: ReturnType<typeof build>, p: number, outPos: THREE.Vector3, outTgt: THREE.Vector3) {
  const keys = seg.keys as Required<Key>[] & { [i: number]: Key };
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1]!.t) i++;
  const local = smooth(Math.min(1, Math.max(0, (p - keys[i]!.t) / (keys[i + 1]!.t - keys[i]!.t))));
  const u = (i + local) / (keys.length - 1);
  seg.pos.getPoint(u, outPos);
  seg.tgt.getPoint(u, outTgt);
  return THREE.MathUtils.lerp(keys[i]!.fov, keys[i + 1]!.fov, local);
}

const BG_ROOM = new THREE.Color("#080b16");
const BG_WORLD = new THREE.Color("#120a2a");

export function CameraRig({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  const { camera, scene, pointer } = useThree();
  const room = useMemo(() => build(ROOM), []);
  const world = useMemo(() => build(WORLD), []);
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredTgt = useMemo(() => new THREE.Vector3(), []);
  const curTgt = useMemo(() => new THREE.Vector3(0, 1.1, -0.6), []);
  const bg = useMemo(() => new THREE.Color(), []);
  const state = useMemo(() => ({ lastSide: 0 }), []);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const p = scrollState.progress;
    const side = p < PORTAL ? 0 : 1;
    let fov = side === 0 ? sample(room, p, desiredPos, desiredTgt) : sample(world, p, desiredPos, desiredTgt);
    if (mobile) {
      // pull back a little on narrow screens so robot + book stay framed
      desiredPos.addScaledVector(desiredPos.clone().sub(desiredTgt).normalize(), side === 0 ? 0.6 * (1 - ramp(p, 0.4, 0.6)) : 2);
      fov += 8;
    }
    if (!reducedMotion) {
      desiredPos.x += pointer.x * 0.08;
      desiredPos.y += pointer.y * 0.04;
    }
    // crossing the portal: snap (hidden behind the page-glow transition), otherwise damp
    const snap = reducedMotion || side !== state.lastSide;
    state.lastSide = side;
    const k = snap ? 1 : 1 - Math.exp(-6 * dt);
    camera.position.lerp(desiredPos, k);
    curTgt.lerp(desiredTgt, k);
    camera.lookAt(curTgt);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov += (fov - cam.fov) * k;
    cam.updateProjectionMatrix();

    // room light shifts toward the book's light, then world palette
    const shift = side === 0 ? ramp(p, 0.45, PORTAL) * 0.5 : 1;
    bg.lerpColors(BG_ROOM, BG_WORLD, shift);
    if (scene.background instanceof THREE.Color) scene.background.copy(bg);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg);
    if (scene.fog) {
      (scene.fog as THREE.Fog).near = side === 0 ? 6 : 8;
      (scene.fog as THREE.Fog).far = side === 0 ? 16 : 45;
    }
  });
  return null;
}
