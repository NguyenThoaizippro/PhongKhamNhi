import type { ChatMessage, LLMProvider } from "./types";

/**
 * Mock provider — dùng khi chưa có GEMINI_API_KEY.
 * Trả lời canned response để UI có thể test được.
 */
export const mockProvider: LLMProvider = {
  name: "mock",

  async *chat(messages: ChatMessage[]): AsyncIterable<string> {
    const last = messages[messages.length - 1]?.content ?? "";
    const lower = last.toLowerCase();

    let reply: string;

    if (/sốt|co giật|khó thở|cấp cứu|115/.test(lower)) {
      reply =
        "🚨 Nghe có vẻ là tình huống cần xử lý nhanh. Ba mẹ hãy gọi 115 hoặc đến phòng khám/bệnh viện gần nhất ngay. Hotline phòng khám: 0985.350.570.\n\n_(Demo mode — chưa cấu hình Gemini API key)_";
    } else if (/giờ|làm việc|mở|đóng cửa/.test(lower)) {
      reply =
        "Phòng khám mở cửa **16h30 – 20h30** mỗi ngày trong tuần.\nĐịa chỉ: 126 Liên khu 4-5, Bình Hưng Hoà B, Bình Tân, TP.HCM.\nHotline: 0985.350.570.\n\n_(Demo mode)_";
    } else if (/đặt lịch|đăng ký|book/.test(lower)) {
      reply =
        "Ba mẹ có thể đăng ký khám online tại **/dang-ky-kham** hoặc gọi 0985.350.570 để được hỗ trợ. Đây là thông tin tham khảo, không thay thế khám trực tiếp.\n\n_(Demo mode)_";
    } else {
      reply = `Xin chào ba mẹ! 🦗 Mình là trợ lý ảo của Phòng Khám Dế Mèn.\n\nMình đang ở chế độ **demo** vì chưa cấu hình GEMINI_API_KEY. Ba mẹ thử hỏi về:\n- Giờ làm việc\n- Đặt lịch khám\n- Triệu chứng bé (vd: "bé sốt")\n\nĐể trải nghiệm AI thật, vui lòng thêm key tại aistudio.google.com vào .env.local.`;
    }

    // Stream từng từ để giả lập typing
    for (const word of reply.split(/(\s+)/)) {
      yield word;
      await new Promise((r) => setTimeout(r, 25));
    }
  },
};
