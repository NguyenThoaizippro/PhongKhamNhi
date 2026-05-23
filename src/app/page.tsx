export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center bg-[color:var(--color-primary-bg)]">
      <div className="max-w-2xl flex flex-col items-center gap-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[color:var(--color-primary-dark)] shadow-sm">
          🐛 Phòng Khám Nhi Đồng
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-[color:var(--color-text)]">Phòng khám </span>
          <span className="text-[color:var(--color-accent)]">DẾ MÈN</span>
        </h1>

        <p className="text-lg sm:text-xl text-[color:var(--color-text-soft)] max-w-xl">
          Bác sĩ xinh · Dùng thuốc xịn · Trẻ hết bệnh · Sáng thông minh
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href="/dang-ky-kham"
            className="rounded-full bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-dark)] text-white px-7 py-3 font-semibold shadow-md transition-colors"
          >
            Đăng ký khám
          </a>
          <a
            href="tel:0985350570"
            className="rounded-full border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary)] hover:text-white px-7 py-3 font-semibold transition-colors"
          >
            Gọi 0985.350.570
          </a>
        </div>

        <div className="mt-8 text-sm text-[color:var(--color-text-soft)]">
          <p>
            Giờ hoạt động: <strong>16h30 – 20h30</strong> tất cả ngày trong tuần
          </p>
          <p className="mt-1">
            126 Liên khu 4-5, Bình Hưng Hoà B, Bình Tân, TP.HCM
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-white/80 px-4 py-2 text-xs text-[color:var(--color-text-soft)] border border-[color:var(--color-border)]">
          🚧 Trang đang trong giai đoạn phát triển · Phase 1/13
        </div>
      </div>
    </main>
  );
}
