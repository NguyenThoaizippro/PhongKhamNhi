import "server-only";
import {
  sendEmail,
  specialtyName,
  formatVnDate,
  EMAIL_BRAND as B,
} from "./client";

/**
 * Email templates cho booking. HTML inline CSS — tương thích Gmail/Outlook/Apple Mail.
 * Phong cách thân thiện kiểu Dế Mèn, gam xanh y tế #7CB342 + cam #E53935.
 */

export interface BookingEmailData {
  bookingId: string;
  childName: string;
  childBirthDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  specialty: string;
  preferredDate: string;
  preferredTimeSlot: string;
  symptoms?: string;
}

/**
 * Email cho phụ huynh — confirm đã nhận đặt lịch.
 * Gửi nếu booking có parentEmail.
 */
export async function sendParentConfirmation(data: BookingEmailData): Promise<boolean> {
  if (!data.parentEmail) return false;

  const subject = `Đã ghi nhận đặt lịch khám cho bé ${data.childName} tại ${B.clinicName}`;
  const html = renderParentHtml(data);
  const text = renderParentText(data);

  return sendEmail({
    to: data.parentEmail,
    subject,
    html,
    text,
    replyTo: process.env.DOCTOR_EMAIL,
  });
}

/**
 * Email cho BS Đông — thông báo có booking mới + thông tin chi tiết.
 * Gửi tới DOCTOR_EMAIL.
 */
export async function sendDoctorNotification(data: BookingEmailData): Promise<boolean> {
  const doctorEmail = process.env.DOCTOR_EMAIL;
  if (!doctorEmail) {
    console.warn("[email] DOCTOR_EMAIL chưa set — skip notify BS Đông");
    return false;
  }

  const subject = `[Đặt lịch mới] Bé ${data.childName} · ${formatVnDate(data.preferredDate)} ${data.preferredTimeSlot}`;
  const html = renderDoctorHtml(data);
  const text = renderDoctorText(data);

  return sendEmail({
    to: doctorEmail,
    subject,
    html,
    text,
    replyTo: data.parentEmail,
  });
}

/**
 * Fire-and-forget: gửi cả 2 email song song, log kết quả.
 * Không throw — luôn trả Promise<void> để caller xài `void notifyBookingCreated(...)`.
 */
export async function notifyBookingCreated(data: BookingEmailData): Promise<void> {
  const [parentOk, doctorOk] = await Promise.all([
    sendParentConfirmation(data),
    sendDoctorNotification(data),
  ]);
  console.info(
    `[booking-email] id=${data.bookingId} parent=${parentOk ? "✓" : "skip"} doctor=${doctorOk ? "✓" : "skip"}`
  );
}

// ===== Templates =====

function commonWrapper(innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#333">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">
    <div style="background:linear-gradient(135deg,${B.primaryColor},${B.primaryDark});padding:24px;text-align:center">
      <div style="font-size:32px;line-height:1">🦗</div>
      <h1 style="margin:8px 0 0;color:#fff;font-size:18px;font-weight:700">${B.clinicName}</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:12px">Bác sĩ xinh · Dùng thuốc xịn · Trẻ hết bệnh · Sáng thông minh</p>
    </div>
    <div style="padding:28px 24px">${innerHtml}</div>
    <div style="background:#f1f8e9;padding:16px 24px;font-size:11px;color:#666;text-align:center;border-top:1px solid #e0e0e0">
      ${B.clinicName} · ${B.address}<br/>
      Hotline: <a href="tel:${B.phoneRaw}" style="color:${B.primaryDark};text-decoration:none;font-weight:600">${B.phone}</a> · Giờ làm việc: ${B.hours}<br/>
      <span style="color:#999">Đây là email tự động — vui lòng không trả lời.</span>
    </div>
  </div>
</body></html>`;
}

function renderParentHtml(d: BookingEmailData): string {
  const sp = specialtyName(d.specialty);
  const dateVn = formatVnDate(d.preferredDate);

  const inner = `
    <p style="font-size:16px;margin:0 0 12px">Chào <strong>${escapeHtml(d.parentName)}</strong>,</p>
    <p style="margin:0 0 16px;line-height:1.6">
      Cảm ơn ba mẹ đã tin tưởng đặt lịch khám cho bé <strong>${escapeHtml(d.childName)}</strong> tại
      ${B.clinicName}. Mình đã ghi nhận thông tin và <strong>${B.doctorName}</strong> sẽ trực tiếp khám cho bé.
    </p>
    <div style="background:#f1f8e9;border-left:4px solid ${B.primaryColor};border-radius:8px;padding:16px;margin:16px 0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Bé</td><td style="padding:6px 0;font-weight:600">${escapeHtml(d.childName)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Chuyên khoa</td><td style="padding:6px 0;font-weight:600">${escapeHtml(sp)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Ngày khám</td><td style="padding:6px 0;font-weight:600">${escapeHtml(dateVn)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Khung giờ</td><td style="padding:6px 0;font-weight:600">${escapeHtml(d.preferredTimeSlot.replace("-", " – "))}</td></tr>
        ${d.symptoms ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Triệu chứng</td><td style="padding:6px 0">${escapeHtml(d.symptoms)}</td></tr>` : ""}
      </table>
    </div>
    <p style="margin:16px 0;line-height:1.6">
      <strong>Phòng khám sẽ gọi xác nhận trong vòng 24 giờ</strong> qua số <strong>${escapeHtml(d.parentPhone)}</strong>.
      Nếu cần đổi lịch hoặc cần hỗ trợ gấp, ba mẹ vui lòng gọi
      <a href="tel:${B.phoneRaw}" style="color:${B.primaryDark};font-weight:600;text-decoration:none">${B.phone}</a>.
    </p>
    <div style="background:#fff3e0;border-left:4px solid ${B.accentColor};border-radius:8px;padding:12px 14px;margin:16px 0;font-size:13px;line-height:1.5">
      ⚠️ <strong>Cấp cứu</strong> (sốt cao co giật, khó thở, mất ý thức): gọi
      <a href="tel:115" style="color:${B.accentColor};font-weight:600;text-decoration:none">115</a> hoặc đến bệnh viện gần nhất ngay.
    </div>
    <p style="margin:20px 0 4px;font-size:13px;color:#666">Mã đặt lịch: <code style="background:#eee;padding:2px 6px;border-radius:4px;font-family:monospace">${escapeHtml(d.bookingId)}</code></p>
  `;
  return commonWrapper(inner);
}

function renderParentText(d: BookingEmailData): string {
  return `Chào ${d.parentName},

Đã ghi nhận đặt lịch khám cho bé ${d.childName} tại ${B.clinicName}.

- Chuyên khoa: ${specialtyName(d.specialty)}
- Ngày khám: ${formatVnDate(d.preferredDate)}
- Khung giờ: ${d.preferredTimeSlot}
${d.symptoms ? `- Triệu chứng: ${d.symptoms}\n` : ""}
Phòng khám sẽ gọi xác nhận trong 24h qua SĐT ${d.parentPhone}.

Hotline: ${B.phone}
Cấp cứu: 115

Mã đặt lịch: ${d.bookingId}
`;
}

function renderDoctorHtml(d: BookingEmailData): string {
  const sp = specialtyName(d.specialty);
  const dateVn = formatVnDate(d.preferredDate);
  const inner = `
    <p style="font-size:14px;margin:0 0 8px;color:#666">Thông báo đặt lịch mới</p>
    <h2 style="margin:0 0 16px;font-size:20px;color:${B.primaryDark}">Bé ${escapeHtml(d.childName)}</h2>
    <div style="background:#f1f8e9;border-radius:8px;padding:16px;margin:12px 0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:5px 0;color:#666;width:36%">Phụ huynh</td><td style="padding:5px 0;font-weight:600">${escapeHtml(d.parentName)}</td></tr>
        <tr><td style="padding:5px 0;color:#666">SĐT liên hệ</td><td style="padding:5px 0;font-weight:600"><a href="tel:${escapeHtml(d.parentPhone)}" style="color:${B.primaryDark};text-decoration:none">${escapeHtml(d.parentPhone)}</a></td></tr>
        ${d.parentEmail ? `<tr><td style="padding:5px 0;color:#666">Email PH</td><td style="padding:5px 0"><a href="mailto:${escapeHtml(d.parentEmail)}" style="color:${B.primaryDark};text-decoration:none">${escapeHtml(d.parentEmail)}</a></td></tr>` : ""}
        <tr><td style="padding:5px 0;color:#666">Ngày sinh bé</td><td style="padding:5px 0">${escapeHtml(formatVnDate(d.childBirthDate))}</td></tr>
        <tr><td style="padding:5px 0;color:#666">Chuyên khoa</td><td style="padding:5px 0;font-weight:600">${escapeHtml(sp)}</td></tr>
        <tr><td style="padding:5px 0;color:#666">Ngày khám</td><td style="padding:5px 0;font-weight:600">${escapeHtml(dateVn)}</td></tr>
        <tr><td style="padding:5px 0;color:#666">Khung giờ</td><td style="padding:5px 0;font-weight:600">${escapeHtml(d.preferredTimeSlot.replace("-", " – "))}</td></tr>
      </table>
    </div>
    ${
      d.symptoms
        ? `<div style="background:#fff8e1;border-left:4px solid #f9a825;border-radius:8px;padding:14px;margin:12px 0">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">Triệu chứng / Lý do khám</p>
            <p style="margin:0;line-height:1.6;font-size:14px">${escapeHtml(d.symptoms)}</p>
          </div>`
        : ""
    }
    <p style="margin:20px 0 4px;font-size:13px;color:#666">
      ID booking: <code style="background:#eee;padding:2px 6px;border-radius:4px;font-family:monospace">${escapeHtml(d.bookingId)}</code>
    </p>
    <p style="margin:8px 0;font-size:13px">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://phongkhamdemen.vn"}/admin/bookings"
         style="display:inline-block;background:${B.primaryColor};color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px">
        Xem danh sách booking
      </a>
    </p>
  `;
  return commonWrapper(inner);
}

function renderDoctorText(d: BookingEmailData): string {
  return `[Booking mới] Bé ${d.childName}

Phụ huynh: ${d.parentName}
SĐT: ${d.parentPhone}
${d.parentEmail ? `Email PH: ${d.parentEmail}\n` : ""}Ngày sinh bé: ${formatVnDate(d.childBirthDate)}
Chuyên khoa: ${specialtyName(d.specialty)}
Ngày khám: ${formatVnDate(d.preferredDate)}
Khung giờ: ${d.preferredTimeSlot}
${d.symptoms ? `\nTriệu chứng: ${d.symptoms}\n` : ""}
ID: ${d.bookingId}

Xem dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || "https://phongkhamdemen.vn"}/admin/bookings
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
