import { describe, it, expect } from "vitest";
import { isUnanswered } from "./save";

describe("isUnanswered", () => {
  it.each([
    ["Tôi chưa có thông tin chi tiết về việc này. Ba mẹ vui lòng gọi 0985.350.570", true],
    ["Mình chưa có thông tin về thuốc này", true],
    ["Không có thông tin về vấn đề này trong dữ liệu", true],
    ["Vui lòng gọi 0985.350.570 để gặp bác sĩ tư vấn", true],
    ["Vui lòng gọi 0985350570 để gặp bác sĩ tư vấn", true],
  ])("phát hiện unanswered: '%s'", (text, expected) => {
    expect(isUnanswered(text)).toBe(expected);
  });

  it.each([
    ["Phòng khám mở 16h30-20h30 tất cả ngày trong tuần", false],
    ["Bé sốt cao thì uống paracetamol 10mg/kg, đi khám nếu sốt kéo dài", false],
    ["Sốt xuất huyết là bệnh do muỗi truyền", false],
  ])("KHÔNG flag câu trả lời có nội dung: '%s'", (text, expected) => {
    expect(isUnanswered(text)).toBe(expected);
  });

  it("trả false khi reply ngắn dưới 20 ký tự", () => {
    expect(isUnanswered("OK")).toBe(false);
    expect(isUnanswered("")).toBe(false);
  });

  it("trả false khi reply là null/undefined-coerced empty string", () => {
    expect(isUnanswered("")).toBe(false);
  });
});
