import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { window4, scrollState } from "./scroll-state";

const PANELS: { label: string; sub: string; pos: [number, number, number]; at: number }[] = [
  { label: "آزمون‌های فصل‌به‌فصل", sub: "بر اساس درس و فصل", pos: [-0.95, 1.75, -0.6], at: 0.08 },
  { label: "آزمون‌های آزمایشی ماز و قلمچی", sub: "تمرین در شرایط شبیه کنکور", pos: [0.95, 1.85, -0.7], at: 0.11 },
  { label: "آزمون‌های مبحثی ژینوپلاس", sub: "تمرین متمرکز روی هر مبحث", pos: [-1.15, 1.25, -0.3], at: 0.14 },
  { label: "کارنامه عملکرد", sub: "درصد، درست، غلط، نزده", pos: [1.15, 1.3, -0.35], at: 0.17 },
  { label: "تحلیل نقاط قوت و ضعف", sub: "قدم بعدی را آگاهانه انتخاب کن", pos: [0, 2.2, -0.9], at: 0.2 },
];

export function Holograms() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useFrame(() => {
    const p = scrollState.progress;
    PANELS.forEach((panel, i) => {
      const el = refs.current[i];
      if (!el) return;
      const o = window4(p, panel.at, panel.at + 0.05, 0.3, 0.36);
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 14}px) scale(${0.94 + o * 0.06})`;
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    });
  });
  return (
    <>
      {PANELS.map((panel, i) => (
        <Html key={panel.label} position={panel.pos} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            dir="rtl"
            className="glass w-max max-w-56 rounded-xl px-4 py-2.5 text-right opacity-0 shadow-glow"
          >
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan" />
              <span className="text-sm font-bold text-foreground">{panel.label}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{panel.sub}</p>
          </div>
        </Html>
      ))}
    </>
  );
}
