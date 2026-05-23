import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CLINIC, SPECIALTIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      id="lien-he"
      className="bg-[color:var(--color-primary-bg)] border-t-4 border-[color:var(--color-primary)] mt-20"
    >
      <Container as="div" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm font-medium text-[color:var(--color-text-soft)]">
                Phòng khám nhi đồng
              </span>
              <span className="text-2xl font-extrabold text-[color:var(--color-accent)]">
                DẾ MÈN
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-text-soft)] italic max-w-md">
              {CLINIC.slogan}
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <PhoneIcon />
                <a
                  href={`tel:${CLINIC.phone}`}
                  className="font-semibold text-[color:var(--color-primary-dark)] hover:underline"
                >
                  {CLINIC.phoneDisplay}
                </a>
              </div>
              <div className="flex gap-2">
                <LocationIcon />
                <span className="text-[color:var(--color-text)]">{CLINIC.address}</span>
              </div>
              <div className="flex gap-2">
                <ClockIcon />
                <span className="text-[color:var(--color-text)]">
                  <strong>{CLINIC.hours}</strong> tất cả ngày trong tuần
                </span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-bold mb-3 text-[color:var(--color-text)]">Chuyên khoa</h3>
            <ul className="space-y-2 text-sm">
              {SPECIALTIES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/#${s.slug}`}
                    className="text-[color:var(--color-text-soft)] hover:text-[color:var(--color-primary-dark)] transition"
                  >
                    {s.icon} {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold mb-3 text-[color:var(--color-text)]">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dang-ky-kham"
                  className="text-[color:var(--color-text-soft)] hover:text-[color:var(--color-primary-dark)] transition"
                >
                  Đăng ký khám
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[color:var(--color-text-soft)] hover:text-[color:var(--color-primary-dark)] transition"
                >
                  Blog y khoa nhi
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-[color:var(--color-text-soft)] hover:text-[color:var(--color-primary-dark)] transition"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <a
                  href={`tel:${CLINIC.emergency}`}
                  className="text-[color:var(--color-danger)] font-medium hover:underline"
                >
                  🚨 Cấp cứu: {CLINIC.emergency}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[color:var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[color:var(--color-text-soft)]">
          <p>
            © {new Date().getFullYear()} {CLINIC.name}. Mọi quyền được bảo lưu.
          </p>
          <p className="italic">
            Thông tin trên website mang tính tham khảo, không thay thế khám lâm sàng.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[color:var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[color:var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[color:var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
