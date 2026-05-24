import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatKBForPrompt, type KBEntry } from "./kb";

// Mock Sheets client để test getKBEntries không gọi network
const getMock = vi.fn();
vi.mock("./client", () => ({
  getSheetsClient: () => ({
    spreadsheets: {
      values: { get: getMock },
    },
  }),
}));

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

describe("getKBEntries", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    delete process.env.GOOGLE_SHEETS_KB_ID;
    // Reset module để clear in-memory cache giữa các test
    const mod = await import("./kb");
    mod.clearKBCache();
  });

  it("trả [] khi GOOGLE_SHEETS_KB_ID chưa set", async () => {
    const { getKBEntries } = await import("./kb");
    const entries = await getKBEntries();
    expect(entries).toEqual([]);
    expect(getMock).not.toHaveBeenCalled();
  });

  it("parse rows từ Sheet thành KBEntry[]", async () => {
    process.env.GOOGLE_SHEETS_KB_ID = "sheet-xyz";
    getMock.mockResolvedValueOnce({
      data: {
        values: [
          ["Giờ làm việc?", "16h30 – 20h30", "", ""],
          ["Bé sốt cao?", "Hạ sốt + đi khám", "Hô hấp", "sốt,cấp cứu"],
          ["", "Skip empty Q", "", ""],
          ["Có Q nhưng thiếu A", "", "", ""],
        ],
      },
    });
    const { getKBEntries } = await import("./kb");
    const entries = await getKBEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      question: "Giờ làm việc?",
      answer: "16h30 – 20h30",
      specialty: undefined,
      tags: undefined,
    });
    expect(entries[1]).toEqual({
      question: "Bé sốt cao?",
      answer: "Hạ sốt + đi khám",
      specialty: "Hô hấp",
      tags: "sốt,cấp cứu",
    });
  });

  it("trả [] khi Sheets API throw (silent fail)", async () => {
    process.env.GOOGLE_SHEETS_KB_ID = "sheet-xyz";
    getMock.mockRejectedValueOnce(new Error("quota exceeded"));
    const { getKBEntries } = await import("./kb");
    const entries = await getKBEntries();
    expect(entries).toEqual([]);
  });
});
