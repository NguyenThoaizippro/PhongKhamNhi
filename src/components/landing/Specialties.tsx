import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SPECIALTIES } from "@/lib/constants";

export function Specialties() {
  return (
    <section
      id="chuyen-khoa"
      className="py-16 sm:py-24 bg-white"
      aria-labelledby="specialties-title"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
            Chuyên khoa
          </span>
          <h2
            id="specialties-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[color:var(--color-text)]"
          >
            6 chuyên khoa khám nhi tại{" "}
            <span className="text-[color:var(--color-accent)]">Dế Mèn</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[color:var(--color-text-soft)]">
            Mỗi chuyên khoa được phụ trách bởi bác sĩ chuyên môn, tư vấn kỹ và điều trị
            phù hợp với từng độ tuổi của bé.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SPECIALTIES.map((s, index) => (
            <SpecialtyCard key={s.slug} specialty={s} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[color:var(--color-text-soft)] mb-4">
            Chưa rõ bé thuộc chuyên khoa nào?
          </p>
          <Link
            href="/dang-ky-kham"
            className="inline-flex items-center gap-2 text-[color:var(--color-primary-dark)] font-semibold hover:underline"
          >
            Đăng ký khám và bác sĩ sẽ tư vấn miễn phí
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}

interface SpecialtyCardProps {
  specialty: (typeof SPECIALTIES)[number];
  index: number;
}

function SpecialtyCard({ specialty, index }: SpecialtyCardProps) {
  // Alternate accent border màu xanh-cam giống bảng banner gốc
  const isAccent = index % 2 === 1;
  const borderClass = isAccent
    ? "border-t-[color:var(--color-accent)]"
    : "border-t-[color:var(--color-primary)]";
  const headingClass = isAccent
    ? "text-[color:var(--color-accent)]"
    : "text-[color:var(--color-primary-dark)]";

  return (
    <article
      id={specialty.slug}
      className={`group relative bg-white rounded-2xl border border-[color:var(--color-border)] border-t-4 ${borderClass} p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl" aria-hidden>
          {specialty.icon}
        </span>
        <h3 className={`text-xl font-bold ${headingClass}`}>{specialty.name}</h3>
      </div>

      <ul className="space-y-1.5">
        {specialty.diseases.map((disease) => (
          <li
            key={disease}
            className="flex items-start gap-2 text-sm text-[color:var(--color-text)]"
          >
            <span
              className={`mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                isAccent ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-primary)]"
              }`}
              aria-hidden
            />
            <span>{disease}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
