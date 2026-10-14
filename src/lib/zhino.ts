// ZHINO project configuration — verified links supplied by the project owner.
export const ZHINO = {
  brand: "ژینو",
  brandLatin: "ZHINO",
  telegramBot: "https://t.me/ZHIINOOO_bot",
  siteUrl: "https://zhino.rotbehland.ir/",
} as const;

/** Persian digits for display. */
export function faNum(value: number | string): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d).replace(/\./g, "٫");
}

/**
 * Konkur-style percentage with negative marking:
 * every 3 wrong answers cancel one correct answer.
 * percent = (3 * correct - wrong) / (3 * total) * 100
 */
export function konkurPercent(total: number, correct: number, wrong: number): number {
  if (total <= 0) return 0;
  const raw = ((3 * correct - wrong) / (3 * total)) * 100;
  return Math.round(raw * 10) / 10;
}
