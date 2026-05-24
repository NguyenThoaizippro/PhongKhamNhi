import { describe, it, expect } from "vitest";
import { formatKBForPrompt, type KBEntry } from "./kb";

describe("formatKBForPrompt", () => {
  it("returns empty string khi không có entries", () => {
    expect(formatKBForPrompt([])).toBe("");
  });

  it("format basic entry", () => {
    const entries: KBEntry[] = [
      { question: "Giờ làm việc?", answer: "16h30 – 20h30" },
    ];
    const out = formatKBForPrompt(entries);
    expect(out).toContain("KB #1");
    expect(out).toContain("Q: Giờ làm việc?");
    expect(out).toContain("A: 16h30 – 20h30");
  });

  it("includes specialty và tags khi có", () => {
    const entries: KBEntry[] = [
      {
        question: "Bé sốt 39°C",
        answer: "Đi khám ngay",
        specialty: "Hô hấp",
        tags: "sốt, cấp cứu",
      },
    ];
    const out = formatKBForPrompt(entries);
    expect(out).toContain("Chuyên khoa: Hô hấp");
    expect(out).toContain("[sốt, cấp cứu]");
  });

  it("đánh số liên tục cho nhiều entries", () => {
    const entries: KBEntry[] = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
      { question: "Q3", answer: "A3" },
    ];
    const out = formatKBForPrompt(entries);
    expect(out).toContain("KB #1");
    expect(out).toContain("KB #2");
    expect(out).toContain("KB #3");
  });

  it("separate entries bằng double newline", () => {
    const entries: KBEntry[] = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ];
    expect(formatKBForPrompt(entries)).toContain("\n\n");
  });
});
