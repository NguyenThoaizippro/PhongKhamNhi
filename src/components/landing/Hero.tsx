import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CLINIC, DOCTOR } from "@/lib/constants";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[color:var(--color-primary-bg)] via-white to-amber-50"
      aria-labelledby="hero-title"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[color:var(--color-primary-soft)] opacity-30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[color:var(--color-accent-soft)] opacity-40 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-12 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[color:var(--color-primary-dark)] shadow-sm ring-1 ring-[color:var(--color-primary-soft)]">
              🐛 Phòng khám nhi đồng tại Bình Tân
            </span>

            <h1
              id="hero-title"
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            >
              <span className="block text-[color:var(--color-text)]">Cho con khoẻ mạnh,</span>
              <span className="block">
                khám tại{" "}
                <span className="text-[color:var(--color-accent)] relative inline-block">
                  DẾ MÈN
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 5 Q 50 0 100 4 T 198 3"
                      stroke="var(--color-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[color:var(--color-text-soft)] max-w-xl mx-auto lg:mx-0 italic">
              {CLINIC.slogan}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button href="/dang-ky-kham" size="lg" variant="primary">
                <CalendarIcon />
                Đăng ký khám ngay
              </Button>
              <Button href={`tel:${CLINIC.phone}`} size="lg" variant="outline">
                <PhoneIcon />
                {CLINIC.phoneDisplay}
              </Button>
            </div>

            {/* Trust strip */}
            <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
              <Stat value="6" label="Chuyên khoa" />
              <Stat value="16h30" label="Mở cửa" />
              <Stat value="7/7" label="Ngày trong tuần" />
            </dl>
          </div>

          {/* Mascot image */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[color:var(--color-primary-soft)] to-[color:var(--color-accent-soft)] opacity-50" />
              <div className="absolute inset-2 rounded-full bg-white shadow-2xl shadow-green-900/10" />

              <Image
                src="/images/mascot/de-men-pointing.png"
                alt="Mascot chú Dế Mèn mặc áo blouse trắng cầm bút chỉ vào biển hiệu phòng khám"
                fill
                className="object-contain p-4 relative"
                priority
                sizes="(max-width: 1024px) 80vw, 40vw"
              />

              {/* Floating badges */}
              <div className="absolute -top-2 -right-2 sm:top-4 sm:right-0 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs sm:text-sm font-semibold ring-1 ring-[color:var(--color-border)] rotate-3">
                <span className="text-[color:var(--color-primary)]">●</span> Đang nhận khám
              </div>
              <div className="absolute -bottom-2 -left-2 sm:bottom-8 sm:-left-4 bg-[color:var(--color-accent)] text-white rounded-2xl shadow-lg px-3 py-2 text-xs sm:text-sm font-bold -rotate-3">
                🩺 {DOCTOR.shortBio}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-primary-dark)]">
        {value}
      </dd>
      <dd className="text-xs sm:text-sm text-[color:var(--color-text-soft)] mt-1">{label}</dd>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
