import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ZHINO } from "@/lib/zhino";

const LINKS = [
  ["#intro", "معرفی"],
  ["#services", "خدمات"],
  ["#demo", "پیش‌نمایش"],
  ["#report", "کارنامه"],
  ["#faq", "پرسش‌ها"],
  ["#contact", "تماس"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <a href="#journey" className="flex items-center gap-2" aria-label="ژینو — بازگشت به ابتدا">
          <span className="grid size-8 place-items-center rounded-full bg-brand text-sm font-black text-primary-foreground">ژ</span>
          <span className="font-black text-foreground">ژینو</span>
        </a>
        <nav aria-label="ناوبری اصلی" className="hidden gap-6 md:flex">
          {LINKS.map(([h, l]) => (
            <a key={h} href={h} className="text-sm text-muted-foreground transition hover:text-foreground">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={ZHINO.telegramBot} target="_blank" rel="noopener noreferrer" className="btn-primary hidden !px-4 !py-2 !text-sm sm:inline-flex">ورود به بات</a>
          <button className="grid size-10 place-items-center rounded-full text-foreground md:hidden" aria-label={open ? "بستن منو" : "باز کردن منو"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="منوی موبایل" className="glass mx-auto mt-2 flex max-w-6xl flex-col rounded-3xl p-3 md:hidden">
          {LINKS.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-foreground hover:bg-card">{l}</a>
          ))}
          <a href={ZHINO.telegramBot} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2">ورود به بات تلگرام ژینو</a>
        </nav>
      )}
    </header>
  );
}
