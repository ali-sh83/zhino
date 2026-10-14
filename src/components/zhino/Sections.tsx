import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ZHINO, faNum, konkurPercent } from "@/lib/zhino";

const tg = { href: ZHINO.telegramBot, target: "_blank", rel: "noopener noreferrer" } as const;

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold text-cyan">{eyebrow}</p>
      <h2 className="mt-2 text-3xl leading-[1.4] font-black text-balance text-foreground md:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-8 text-muted-foreground">{text}</p>}
    </div>
  );
}

export function Intro() {
  return (
    <section id="intro" className="relative scroll-mt-20 overflow-hidden px-6 py-28 md:px-16">
      <div className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-violet-deep/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-bold text-cyan">ژینو · بات تلگرام آموزشی</p>
          <h2 className="mt-3 text-3xl leading-[1.4] font-black text-foreground md:text-5xl md:leading-[1.35]">
            ژینو؛ بات تلگرام آزمون <span className="text-gradient">فصل‌به‌فصل و آزمایشی</span> کنکور
          </h2>
          <p className="mt-6 max-w-xl leading-8 text-muted-foreground">
            آزمون فصل‌به‌فصل، آزمون‌های آزمایشی ماز و قلمچی و آزمون‌های مبحثی ژینوپلاس؛ همراه با محاسبه درصد، کارنامه عملکرد و گزارش به مشاور کنکور.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a {...tg} className="btn-primary">ورود به بات تلگرام ژینو</a>
            <a href="#services" className="btn-ghost">آشنایی با امکانات</a>
          </div>
        </div>
        <SubjectOrbit />
      </div>
    </section>
  );
}

const SUBJECTS = [
  { name: "ریاضی", glyph: "∫", tone: "text-primary" },
  { name: "فیزیک", glyph: "⚛", tone: "text-cyan" },
  { name: "شیمی", glyph: "⌬", tone: "text-lavender" },
  { name: "زیست‌شناسی", glyph: "🧬", tone: "text-chart-4" },
];

function SubjectOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm" aria-label="درس‌های پشتیبانی‌شده">
      <div className="absolute inset-6 rounded-full border border-border" />
      <div className="absolute inset-20 rounded-full border border-dashed border-cyan/30" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-28 place-items-center rounded-full bg-brand text-3xl font-black text-primary-foreground shadow-glow">ژینو</div>
      </div>
      {SUBJECTS.map((s, i) => {
        const a = (i / SUBJECTS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div key={s.name} className="glass absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl py-3" style={{ left: `${50 + Math.cos(a) * 42}%`, top: `${50 + Math.sin(a) * 42}%` }}>
            <span className={`text-2xl ${s.tone}`} aria-hidden>{s.glyph}</span>
            <span className="mt-1 text-sm font-bold text-foreground">{s.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChapterVisual() {
  return (
    <div className="flex h-36 items-end gap-2" aria-hidden>
      {[5, 7, 4, 8, 6, 9].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md border border-primary/40 bg-gradient-to-t from-primary/10 to-primary/40 transition-all duration-500 group-hover:to-primary/70" style={{ height: `${h * 10}%` }}>
          <span className="block pt-1 text-center text-[10px] text-lavender">فصل {faNum(i + 1)}</span>
        </div>
      ))}
    </div>
  );
}
function MockVisual() {
  return (
    <div className="grid h-36 grid-cols-8 content-center gap-2" aria-hidden>
      {Array.from({ length: 32 }, (_, i) => (
        <span key={i} className={`aspect-square rounded-full border ${(i * 7) % 5 === 0 ? "border-cyan bg-cyan/70" : "border-muted-foreground/30"} transition-transform duration-300 group-hover:scale-110`} />
      ))}
    </div>
  );
}
function PlusVisual() {
  return (
    <div className="relative grid h-36 place-items-center" aria-hidden>
      {[1, 0.72, 0.44].map((s, i) => (
        <span key={i} className="absolute rounded-full border border-lavender/50 transition-transform duration-700 group-hover:rotate-45" style={{ width: `${s * 9}rem`, height: `${s * 9}rem`, borderStyle: i === 1 ? "dashed" : "solid" }} />
      ))}
      <span className="size-4 rounded-full bg-lavender shadow-glow" />
    </div>
  );
}

export function Services() {
  const items = [
    { title: "آزمون‌های ژینو", tag: "فصل‌به‌فصل", text: "آزمون‌های فصل‌به‌فصل بر اساس درس‌ها و فصل‌های کتاب درسی؛ تا بعد از مطالعه هر فصل، میزان درک و تسلطت را بسنجی.", visual: <ChapterVisual /> },
    { title: "آزمون‌های آزمایشی", tag: "ماز و قلمچی", text: "آزمون‌های آزمایشی از منابع موجود ماز و قلمچی؛ برای تمرین در شرایطی شبیه به جلسه آزمون.", visual: <MockVisual /> },
    { title: "ژینوپلاس", tag: "مبحثی", text: "آزمون‌های مبحثی برای تمرین متمرکز روی هر مبحث و شناسایی بخش‌هایی که به کار بیشتری نیاز دارند.", visual: <PlusVisual /> },
  ];
  return (
    <section id="services" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="خدمات آموزشی" title="سه مسیر برای سنجیدن خودت" text="هر نوع آزمون برای یک مرحله از آماده‌شدن طراحی شده است؛ از مرور فصل تا شبیه‌سازی کنکور." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <article key={it.title} className="group glass relative overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/60">
              <span className="absolute top-5 left-6 text-6xl font-black text-foreground/5">{faNum(i + 1)}</span>
              {it.visual}
              <p className="mt-6 text-xs font-bold text-cyan">{it.tag}</p>
              <h3 className="mt-1 text-2xl font-black text-foreground">{it.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const JOURNEY = ["ورود به بات تلگرام", "انتخاب پایه و رشته", "انتخاب نوع آزمون", "شرکت در آزمون", "دریافت نتیجه و کارنامه", "بررسی عملکرد و ارسال گزارش به مشاور"];

export function Journey() {
  return (
    <section id="journey-steps" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="مسیر دانش‌آموز" title="از ورود تا گزارش، در شش قدم" />
        <ol className="relative mt-14 grid gap-4 md:grid-cols-6">
          <div className="absolute top-6 right-6 left-6 hidden h-px bg-gradient-to-l from-primary via-cyan to-transparent md:block" aria-hidden />
          {JOURNEY.map((s, i) => (
            <li key={s} className="relative flex gap-4 md:flex-col md:gap-3">
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-primary/50 bg-card font-black text-lavender">{faNum(i + 1)}</span>
              <span className="pt-3 text-sm leading-7 font-semibold text-foreground md:pt-0">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Msg = { from: "bot" | "user"; text: string };
const BOT_FLOW: Record<string, Msg[]> = {
  "آزمون فصل‌به‌فصل": [
    { from: "bot", text: "درس و فصل موردنظرت را انتخاب کن." },
    { from: "bot", text: "مثلاً: فیزیک · پایه دوازدهم · فصل ۱" },
  ],
  "آزمون آزمایشی": [{ from: "bot", text: "منبع آزمون را انتخاب کن: ماز یا قلمچی." }],
  "ژینوپلاس": [{ from: "bot", text: "مبحث موردنظرت را انتخاب کن تا آزمون مبحثی شروع شود." }],
};

export function PhoneDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "سلام! به ژینو خوش آمدی 👋 نوع آزمون را انتخاب کن:" }]);
  const choose = (k: string) => setMsgs([...msgs.slice(0, 1), { from: "user", text: k }, ...BOT_FLOW[k]]);
  return (
    <section id="demo" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <SectionHead eyebrow="پیش‌نمایش تعاملی" title="کار با ژینو، داخل همان تلگرامی که هر روز باز می‌کنی" text="یکی از گزینه‌ها را در گوشی بزن تا ببینی گفتگو با بات چطور پیش می‌رود. این یک نمایش ساده است و گفتگوی واقعی داخل بات انجام می‌شود." />
          <a {...tg} className="btn-primary mt-8">امتحان در بات واقعی</a>
        </div>
        <div className="mx-auto w-72 rounded-[2.6rem] border border-border bg-card p-3 shadow-glow">
          <div className="overflow-hidden rounded-[2rem] bg-background-2">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-brand text-xs font-black text-primary-foreground">ژ</span>
              <div>
                <p className="text-sm font-bold text-foreground">ژینو</p>
                <p className="text-[11px] text-cyan">بات</p>
              </div>
            </div>
            <div className="flex h-80 flex-col gap-2 overflow-y-auto p-3" aria-live="polite">
              {msgs.map((m, i) => (
                <p key={i} className={`max-w-[85%] animate-in fade-in slide-in-from-bottom-2 rounded-2xl px-3 py-2 text-xs leading-6 ${m.from === "bot" ? "self-start bg-card text-foreground" : "self-end bg-primary text-primary-foreground"}`}>
                  {m.text}
                </p>
              ))}
            </div>
            <div className="grid gap-1.5 border-t border-border p-3">
              {Object.keys(BOT_FLOW).map((k) => (
                <button key={k} onClick={() => choose(k)} className="rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition hover:border-cyan hover:bg-cyan/10 active:scale-95">
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SAMPLE = {
  ریاضی: { grade: "دوازدهم", topic: "فصل ۲ · مشتق", total: 20, correct: 13, wrong: 4 },
  فیزیک: { grade: "دوازدهم", topic: "فصل ۱ · حرکت", total: 20, correct: 11, wrong: 6 },
  شیمی: { grade: "یازدهم", topic: "فصل ۱ · قدر هدایای زمینی", total: 25, correct: 17, wrong: 3 },
  "زیست‌شناسی": { grade: "دهم", topic: "فصل ۲ · گوارش", total: 30, correct: 21, wrong: 5 },
} as const;
type Subject = keyof typeof SAMPLE;

export function Report() {
  const [subject, setSubject] = useState<Subject>("ریاضی");
  const [tab, setTab] = useState<"report" | "pulse" | "key">("report");
  const d = SAMPLE[subject];
  const blank = d.total - d.correct - d.wrong;
  const pct = konkurPercent(d.total, d.correct, d.wrong);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <section id="report" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="کارنامه عملکرد" title="نتیجه‌ات را ببین، نه فقط یک عدد" text="نمونه‌ای از اطلاعاتی که بعد از هر آزمون دریافت می‌کنی. درصد با احتساب نمره منفی (هر سه غلط، یک درست را خنثی می‌کند) محاسبه می‌شود." />
        <div className="glass mt-12 rounded-3xl p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" aria-label="انتخاب درس" className="flex flex-wrap gap-2">
              {(Object.keys(SAMPLE) as Subject[]).map((s) => (
                <button key={s} role="tab" aria-selected={s === subject} onClick={() => setSubject(s)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${s === subject ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
            <span className="rounded-full border border-cyan/40 px-3 py-1 text-xs text-cyan">داده نمونه — فقط برای نمایش</span>
          </div>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <div className="relative mx-auto size-44">
              <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle cx="60" cy="60" r={R} fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle cx="60" cy="60" r={R} fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.max(0, pct) / 100)} className="transition-all duration-700" />
                <defs>
                  <linearGradient id="g">
                    <stop offset="0" stopColor="var(--primary)" />
                    <stop offset="1" stopColor="var(--cyan)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-3xl font-black text-foreground">٪{faNum(pct)}</p>
                  <p className="text-xs text-muted-foreground">درصد عملکرد</p>
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["نام درس", subject],
                ["پایه تحصیلی", d.grade],
                ["فصل یا مبحث", d.topic],
                ["تعداد کل سؤال‌ها", faNum(d.total)],
                ["پاسخ‌های درست", faNum(d.correct)],
                ["پاسخ‌های غلط", faNum(d.wrong)],
                ["سؤال‌های بدون پاسخ", faNum(blank)],
                ["درصد عملکرد", `٪${faNum(pct)}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-border bg-background/40 p-4">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex flex-wrap gap-2">
              {[
                ["report", "کارنامه عملکرد"],
                ["pulse", "نبض تغییرات"],
                ["key", "کلید آزمون"],
              ].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k as typeof tab)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === k ? "bg-cyan/15 text-cyan" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 min-h-28">
              {tab === "report" && (
                <div className="flex h-6 overflow-hidden rounded-full">
                  <span className="bg-chart-4 transition-all" style={{ width: `${(d.correct / d.total) * 100}%` }} title="درست" />
                  <span className="bg-destructive transition-all" style={{ width: `${(d.wrong / d.total) * 100}%` }} title="غلط" />
                  <span className="flex-1 bg-muted" title="بدون پاسخ" />
                </div>
              )}
              {tab === "report" && (
                <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
                  <span>● <span className="text-chart-4">درست</span></span>
                  <span>● <span className="text-destructive">غلط</span></span>
                  <span>● بدون پاسخ</span>
                </div>
              )}
              {tab === "pulse" && (
                <div className="flex h-28 items-end gap-3" aria-label="نمونه روند نمرات آزمون‌های قبلی">
                  {[0.4, 0.5, 0.45, 0.6, 0.66, pct / 100].map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-primary/30 to-cyan transition-all duration-700" style={{ height: `${Math.max(4, v * 100)}px` }} />
                      <span className="text-[10px] text-muted-foreground">آزمون {faNum(i + 1)}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "key" && (
                <div className="grid grid-cols-5 gap-2 text-xs md:grid-cols-10">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} className="rounded-lg border border-border px-2 py-1.5 text-center text-muted-foreground">
                      {faNum(i + 1)}: <b className="text-foreground">{faNum(((i * 3) % 4) + 1)}</b>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const f = [
    ["محاسبه خودکار درصد", "درصد هر آزمون با احتساب پاسخ‌های غلط محاسبه می‌شود."],
    ["کارنامه عملکرد", "تعداد درست، غلط و بدون پاسخ را برای هر آزمون ببین."],
    ["نبض تغییرات", "روند نتیجه‌هایت را در آزمون‌های مختلف دنبال کن."],
    ["کلید آزمون", "پاسخ درست سؤال‌ها را بعد از آزمون مرور کن."],
    ["گزارش به مشاور", "گزارش عملکردت را برای مشاور کنکورت بفرست."],
    ["داخل تلگرام", "بدون نصب برنامه جدید، از همان تلگرام استفاده کن."],
  ];
  return (
    <section id="features" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="امکانات" title="همه چیز برای شناخت بهتر خودت" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {f.map(([t, d], i) => (
            <div key={t} className="bg-background p-7 transition hover:bg-card">
              <span className="text-sm font-black text-primary">{faNum(String(i + 1).padStart(2, "0"))}</span>
              <h3 className="mt-3 text-lg font-bold text-foreground">{t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const qs = [
    ["ژینو چیست؟", "ژینو یک بات تلگرام آموزشی برای آمادگی کنکور است که آزمون فصل‌به‌فصل، آزمون‌های آزمایشی ماز و قلمچی و آزمون‌های مبحثی ژینوپلاس را ارائه می‌کند."],
    ["چطور شروع کنم؟", "روی دکمه «ورود به بات تلگرام ژینو» بزن، بات را در تلگرام باز کن و پایه، رشته و نوع آزمون را انتخاب کن."],
    ["درصد چطور محاسبه می‌شود؟", "درصد با احتساب نمره منفی محاسبه می‌شود؛ یعنی هر سه پاسخ غلط، اثر یک پاسخ درست را خنثی می‌کند."],
    ["آیا می‌توانم نتیجه را به مشاورم بفرستم؟", "بله، امکان ارسال گزارش عملکرد به مشاور کنکور در بات وجود دارد."],
    ["کدام درس‌ها پوشش داده می‌شوند؟", "درس‌های ریاضی، فیزیک، شیمی و زیست‌شناسی؛ برای جزئیات هر پایه و رشته، فهرست داخل بات را ببین."],
  ];
  return (
    <section id="faq" className="scroll-mt-20 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="پرسش‌های پرتکرار" title="سؤالی داری؟" />
        <Accordion type="single" collapsible className="mt-10">
          {qs.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="border-border">
              <AccordionTrigger className="text-right text-base font-bold text-foreground hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="leading-8 text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="px-6 py-24 md:px-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card px-8 py-16 text-center md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--violet-deep),transparent_65%)] opacity-50" />
        <div className="relative">
          <h2 className="text-3xl leading-[1.4] font-black text-foreground md:text-5xl">آماده‌ای قدم بعدی را برداری؟</h2>
          <p className="mx-auto mt-4 max-w-xl leading-8 text-muted-foreground">اولین آزمونت را همین حالا در بات تلگرام ژینو شروع کن.</p>
          <a {...tg} className="btn-primary mt-8">ورود به بات تلگرام ژینو</a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-2xl font-black text-gradient">ژینو</p>
          <p className="mt-2 max-w-xs text-sm leading-7 text-muted-foreground">بات تلگرام آزمون فصل‌به‌فصل و آزمایشی کنکور.</p>
        </div>
        <nav aria-label="پیوندهای پایانی" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <a href="#services" className="text-muted-foreground hover:text-foreground">خدمات</a>
          <a href="#report" className="text-muted-foreground hover:text-foreground">کارنامه</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground">پرسش‌ها</a>
          <a {...tg} className="text-muted-foreground hover:text-foreground">پشتیبانی در تلگرام</a>
          <a href={ZHINO.siteUrl} className="text-muted-foreground hover:text-foreground">zhino.rotbehland.ir</a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground">© {faNum(new Date().getFullYear())} ZHINO · ژینو</p>
    </footer>
  );
}
