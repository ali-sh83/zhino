import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ZHINO } from "@/lib/zhino";
import { PORTAL, ramp, scrollState, window4 } from "./scroll-state";

const ZhinoCanvas = lazy(() => import("./ZhinoCanvas"));

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static override getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(e: unknown) {
    console.warn("ZHINO 3D scene unavailable, showing fallback.", e);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Poster() {
  return (
    <div className="absolute inset-0 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,var(--violet-deep),transparent_60%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,var(--cyan),transparent_50%)] opacity-15" />
    </div>
  );
}

const STAGES = ["ورود", "ربات", "میز مطالعه", "کتاب", "دنیای ژینو", "شروع"];

export function Cinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [env, setEnv] = useState<{ ready: boolean; webgl: boolean; mobile: boolean; reduced: boolean }>({
    ready: false,
    webgl: true,
    mobile: false,
    reduced: false,
  });

  useEffect(() => {
    setEnv({
      ready: true,
      webgl: hasWebGL(),
      mobile: window.matchMedia("(max-width: 768px)").matches,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const v = Math.min(1, Math.max(0, -rect.top / total));
      scrollState.progress = v;
      setP(v);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const o1 = 1 - ramp(p, 0.04, 0.1);
  const o3 = window4(p, 0.33, 0.38, 0.46, 0.5);
  const portalGlow = window4(p, PORTAL - 0.04, PORTAL - 0.005, PORTAL + 0.005, PORTAL + 0.04);
  const d1 = window4(p, 0.66, 0.7, 0.76, 0.79);
  const d2 = window4(p, 0.78, 0.81, 0.85, 0.87);
  const d3 = window4(p, 0.87, 0.89, 0.92, 0.94);
  const o6 = ramp(p, 0.94, 0.98);
  const stage = p < 0.1 ? 0 : p < 0.3 ? 1 : p < 0.45 ? 2 : p < PORTAL ? 3 : p < 0.93 ? 4 : 5;

  const fade = (o: number) => ({ opacity: o, transform: `translateY(${(1 - o) * 24}px)`, visibility: o < 0.01 ? ("hidden" as const) : ("visible" as const) });

  return (
    <section ref={sectionRef} id="journey" aria-label="سفر سینمایی به دنیای ژینو" className="relative h-[700vh] md:h-[800vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {env.ready && env.webgl ? (
          <SceneBoundary fallback={<Poster />}>
            <Suspense fallback={<Poster />}>
              <div className="absolute inset-0">
                <ZhinoCanvas mobile={env.mobile} reducedMotion={env.reduced} />
              </div>
            </Suspense>
          </SceneBoundary>
        ) : (
          <Poster />
        )}

        {/* readable gradient for text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/85 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--lavender),var(--primary)_35%,transparent_70%)]" style={{ opacity: portalGlow * 0.95 }} />

        {/* Stage 1 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-16 md:pb-20" style={fade(o1)}>
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-medium tracking-wide text-cyan">ژینو · ZHINO</p>
            <h1 className="max-w-3xl text-4xl leading-[1.25] font-black text-balance text-foreground md:text-6xl">
              ژینو؛ همراه هوشمند تو در <span className="text-gradient">مسیر موفقیت</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">آزمون بده، پیشرفتت را بشناس و هوشمندانه‌تر برای کنکور آماده شو.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={ZHINO.telegramBot} target="_blank" rel="noopener noreferrer" className="btn-primary">
                شروع با بات تلگرام
              </a>
              <a href="#intro" className="btn-ghost">
                کشف دنیای ژینو
              </a>
            </div>
            <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-6 w-px animate-pulse bg-primary" /> برای شروع سفر اسکرول کن
            </p>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="pointer-events-none absolute inset-x-0 top-24 px-6 md:top-auto md:bottom-24 md:px-16" style={fade(o3)}>
          <div className="mx-auto max-w-6xl">
            <div className="glass max-w-md rounded-2xl p-6">
              <h2 className="text-2xl leading-10 font-bold text-foreground md:text-3xl">هر آزمون، یک قدم به شناخت بهتر خودت</h2>
              <p className="mt-2 leading-7 text-muted-foreground">با تحلیل عملکردت، مسیر پیشرفتت را دقیق‌تر پیدا کن.</p>
            </div>
          </div>
        </div>

        {/* Stage 5 destinations */}
        {[
          { o: d1, title: "آزمون‌های ژینو", text: "آزمون فصل‌به‌فصل بر اساس درس و فصل کتاب درسی؛ بعد از مطالعه، میزان تسلطت را بسنج.", tone: "text-primary" },
          { o: d2, title: "آزمون‌های آزمایشی", text: "آزمون‌های آزمایشی از منابع ماز و قلمچی برای تمرین در شرایطی شبیه جلسه کنکور.", tone: "text-cyan" },
          { o: d3, title: "ژینوپلاس", text: "آزمون‌های مبحثی برای تمرین متمرکز و پیدا کردن مباحثی که به کار بیشتری نیاز دارند.", tone: "text-lavender" },
        ].map((d) => (
          <div key={d.title} className="pointer-events-none absolute inset-x-0 bottom-16 px-6 md:bottom-24 md:px-16" style={fade(d.o)}>
            <div className="mx-auto max-w-6xl">
              <div className="glass max-w-md rounded-2xl p-6">
                <p className={`text-xs font-bold tracking-wider ${d.tone}`}>مقصد آموزشی</p>
                <h2 className="mt-1 text-3xl font-black text-foreground">{d.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{d.text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Stage 6 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 text-center md:pb-20" style={fade(o6)}>
          <h2 className="mx-auto max-w-3xl text-3xl leading-[1.35] font-black text-foreground md:text-5xl">
            مسیر پیشرفتت <span className="text-gradient">از اینجا</span> شروع می‌شود
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted-foreground">آزمون بده، نتیجه‌ات را تحلیل کن و با شناخت بهتر نقاط قوت و ضعف، قدم بعدی را آگاهانه انتخاب کن.</p>
          <a href={ZHINO.telegramBot} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
            ورود به بات تلگرام ژینو
          </a>
        </div>

        {/* progress rail */}
        <nav aria-label="مراحل سفر" className="absolute top-1/2 left-4 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {STAGES.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`h-px transition-all duration-500 ${i === stage ? "w-8 bg-cyan" : "w-3 bg-muted-foreground/40"}`} />
              <span className={`text-[11px] transition-opacity ${i === stage ? "text-foreground opacity-100" : "text-muted-foreground opacity-0"}`}>{s}</span>
            </div>
          ))}
        </nav>
        <a href="#intro" className="absolute top-20 left-4 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground md:top-24">
          رد شدن از سفر ←
        </a>
      </div>
    </section>
  );
}
