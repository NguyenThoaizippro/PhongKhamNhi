import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CLINIC } from "@/lib/constants";

const mapsQuery = encodeURIComponent(CLINIC.address);
const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const mapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

export function ClinicInfo() {
  return (
    <section
      className="py-16 sm:py-24 bg-white"
      aria-labelledby="clinic-info-title"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Info */}
          <div>
            <span className="inline-block text-sm font-bold uppercase tracking-wider text-[color:var(--color-primary-dark)]">
              Thông tin phòng khám
            </span>
            <h2
              id="clinic-info-title"
              className="mt-2 text-3xl sm:text-4xl font-extrabold text-[color:var(--color-text)]"
            >
              Đến với <span className="text-[color:var(--color-accent)]">Dế Mèn</span> ngay
              hôm nay
            </h2>

            <dl className="mt-8 space-y-5">
              <InfoRow
                icon={<LocationIcon />}
                label="Địa chỉ"
                content={
                  <>
                    <p className="font-medium text-[color:var(--color-text)]">
                      {CLINIC.address}
                    </p>
                    <a
                      href={mapsDirectionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[color:var(--color-primary-dark)] hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      Chỉ đường →
                    </a>
                  </>
                }
              />

              <InfoRow
                icon={<ClockIcon />}
                label="Giờ hoạt động"
                content={
                  <>
                    <p className="font-medium text-[color:var(--color-text)]">
                      {CLINIC.hours}
                    </p>
                    <p className="text-sm text-[color:var(--color-text-soft)] mt-1">
                      Tất cả ngày trong tuần (Thứ 2 — Chủ nhật)
                    </p>
                  </>
                }
              />

              <InfoRow
                icon={<PhoneIcon />}
                label="Hotline"
                content={
                  <a
                    href={`tel:${CLINIC.phone}`}
                    className="font-semibold text-[color:var(--color-primary-dark)] hover:underline text-lg"
                  >
                    {CLINIC.phoneDisplay}
                  </a>
                }
              />
            </dl>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button href="/dang-ky-kham" size="md" variant="primary">
                Đăng ký khám
              </Button>
              <Button href={`tel:${CLINIC.phone}`} size="md" variant="outline">
                Gọi đặt lịch
              </Button>
            </div>

            <p className="mt-6 text-xs text-[color:var(--color-text-soft)] italic">
              💡 Khuyến nghị đặt lịch trước để giảm thời gian chờ. Nếu bé có triệu chứng cấp
              tính (sốt cao &gt; 39°C, co giật, khó thở), vui lòng gọi 115.
            </p>
          </div>

          {/* Map */}
          <div className="aspect-[4/3] lg:aspect-[5/6] rounded-2xl overflow-hidden shadow-xl ring-1 ring-[color:var(--color-border)]">
            <iframe
              src={mapsEmbedUrl}
              title="Bản đồ Phòng Khám Nhi Đồng Dế Mèn"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  content,
}: {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[color:var(--color-primary-bg)] flex items-center justify-center text-[color:var(--color-primary)]">
        {icon}
      </div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-soft)]">
          {label}
        </dt>
        <dd className="mt-1">{content}</dd>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
