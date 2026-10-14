// Shared, allocation-free scroll progress for the cinematic timeline (0..1).
export const scrollState = { progress: 0 };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 between a and b (eased). */
export const ramp = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
/** Fade in a→b, hold, fade out c→d. */
export const window4 = (p: number, a: number, b: number, c: number, d: number) =>
  Math.min(ramp(p, a, b), 1 - ramp(p, c, d));

/** Point where the camera crosses the page surface into the book world. */
export const PORTAL = 0.615;
