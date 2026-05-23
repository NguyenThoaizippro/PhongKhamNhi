import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Placeholder cho Phase 4 — Section 6 chuyên khoa */}
      <section
        id="chuyen-khoa"
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="specialties-title"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-[color:var(--color-text-soft)] uppercase tracking-wider">
            Đang phát triển
          </p>
          <h2
            id="specialties-title"
            className="mt-2 text-3xl sm:text-4xl font-bold text-[color:var(--color-text)]"
          >
            6 Chuyên khoa khám nhi
          </h2>
          <p className="mt-4 text-[color:var(--color-text-soft)]">
            Section này sẽ được hoàn thiện ở Phase 4 — hiển thị Hô hấp, Tiêu hoá, Truyền nhiễm,
            Sơ sinh, Dinh dưỡng, Da liễu.
          </p>
        </div>
      </section>
    </main>
  );
}
