import { Container } from "@/components/ui/Container";
import { CLINIC } from "@/lib/constants";

const REASONS = [
  {
    icon: "🩺",
    title: "Bác sĩ chuyên khoa nhi",
    desc: "Đội ngũ bác sĩ được đào tạo bài bản, có nhiều năm kinh nghiệm khám và điều trị bệnh trẻ em.",
  },
  {
    icon: "💊",
    title: "Thuốc đúng liều, đúng lứa tuổi",
    desc: "Kê đơn theo cân nặng và tuổi của bé, tránh lạm dụng kháng sinh, ưu tiên an toàn lâu dài.",
  },
  {
    icon: "🤖",
    title: "Tư vấn AI 24/7",
    desc: "Chatbot Dế Mèn trả lời câu hỏi phổ biến từ tài liệu bác sĩ soạn, hướng dẫn khi nào cần khám gấp.",
  },
  {
    icon: "📅",
    title: "Đặt lịch dễ dàng",
    desc: "Đăng ký online qua web hoặc nhắn cho chatbot. Giảm thời gian chờ tại phòng khám.",
  },
  {
    icon: "🔒",
    title: "Bảo mật thông tin trẻ em",
    desc: "Thông tin bé và phụ huynh được bảo mật theo quy chuẩn y khoa, không chia sẻ bên thứ ba.",
  },
  {
    icon: "📍",
    title: "Vị trí thuận tiện",
    desc: "Tại Bình Tân TP.HCM, mở cửa 16h30 – 20h30 tất cả ngày trong tuần, sau giờ làm việc.",
  },
] as const;

export function WhyUs() {
  return (
    <section
      className="py-16 sm:py-24 bg-[color:var(--color-primary-bg)]"
      aria-labelledby="why-us-title"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-sm font-bold uppercase tracking-wider text-[color:var(--color-accent)]">
            Vì sao phụ huynh chọn Dế Mèn
          </span>
          <h2
            id="why-us-title"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-[color:var(--color-text)]"
          >
            Bác sĩ xinh · Dùng thuốc xịn · Trẻ hết bệnh
          </h2>
          <p className="mt-4 text-[color:var(--color-text-soft)]">
            6 lý do giúp Dế Mèn trở thành lựa chọn của hàng nghìn gia đình tại Bình Tân.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[color:var(--color-border)] hover:shadow-md transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[color:var(--color-primary-bg)] text-2xl">
                {reason.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-[color:var(--color-text)]">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--color-text-soft)] leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency notice */}
        <div className="mt-12 rounded-2xl bg-white border-2 border-[color:var(--color-danger)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl flex-shrink-0">🚨</div>
          <div className="flex-1">
            <p className="font-bold text-[color:var(--color-danger)]">
              Trường hợp cấp cứu: sốt cao co giật, khó thở, mất ý thức
            </p>
            <p className="text-sm text-[color:var(--color-text)] mt-1">
              Vui lòng gọi <strong>115</strong> hoặc đến bệnh viện gần nhất ngay. Phòng
              khám chỉ hoạt động {CLINIC.hours}.
            </p>
          </div>
          <a
            href={`tel:${CLINIC.emergency}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[color:var(--color-danger)] text-white font-semibold text-sm hover:opacity-90 transition"
          >
            Gọi 115
          </a>
        </div>
      </Container>
    </section>
  );
}
