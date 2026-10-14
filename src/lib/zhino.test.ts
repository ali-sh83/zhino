import { describe, expect, it } from "vitest";
import { konkurPercent } from "./zhino";

describe("konkurPercent (negative marking)", () => {
  it("all correct is 100%", () => expect(konkurPercent(20, 20, 0)).toBe(100));
  it("three wrong cancel one correct", () => expect(konkurPercent(20, 1, 3)).toBe(0));
  it("13 correct, 4 wrong out of 20", () => expect(konkurPercent(20, 13, 4)).toBe(58.3));
  it("can go negative", () => expect(konkurPercent(10, 0, 3)).toBe(-10));
});
