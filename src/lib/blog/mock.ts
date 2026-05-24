import type { BlogPostView } from "./types";
import { estimateReadingMinutes } from "./types";

/**
 * Mock posts — hiển thị khi Firestore chưa setup hoặc collection trống.
 * Giúp trang /blog không trống trơn lúc dev.
 */
const RAW = [
  {
    slug: "tre-sot-cao-khi-nao-can-di-kham",
    title: "Trẻ sốt cao: khi nào cần đi khám ngay?",
    excerpt:
      "Sốt là phản ứng tự nhiên của cơ thể bé khi chống lại nhiễm trùng. Nhưng có những dấu hiệu cha mẹ cần nhận biết để đưa bé đi khám kịp thời.",
    coverImage:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80&auto=format&fit=crop",
    authorName: "BS. Phòng Khám Dế Mèn",
    specialty: "ho-hap" as const,
    tags: ["sốt", "cấp cứu", "hô hấp"],
    publishedAt: "2025-11-15T10:00:00.000Z",
    content: `## Khi nào sốt là bình thường?

Sốt dưới **38.5°C** ở trẻ trên 3 tháng tuổi, bé vẫn chơi, ăn uống được — đa số là sốt virus, có thể chăm sóc tại nhà.

## 🚨 Dấu hiệu cần đưa bé đi khám NGAY

- Bé dưới **3 tháng** tuổi sốt từ **38°C** trở lên
- Sốt trên **39.5°C** mà không hạ sau 2 giờ dùng paracetamol đúng liều
- Bé **co giật**, **lừ đừ**, **ngủ li bì** khó đánh thức
- **Phát ban** xuất hiện cùng sốt
- Bé khó thở, thở rút lõm ngực, môi tím tái
- Sốt kéo dài **trên 3 ngày** không rõ nguyên nhân

> **Cấp cứu 115** nếu bé co giật, ngưng thở, tím tái.

## Chăm sóc tại nhà khi sốt nhẹ

1. Cho bé uống nhiều nước
2. Mặc thoáng, lau mát bằng nước ấm (không nước đá)
3. Paracetamol 10-15mg/kg, cách 4-6 giờ — KHÔNG dùng aspirin cho trẻ
4. Theo dõi nhiệt độ mỗi 4 giờ

*Bài viết tham khảo — không thay thế khám trực tiếp. Gọi 0985.350.570 để được bác sĩ tư vấn.*`,
  },
  {
    slug: "tieu-chay-cap-o-tre-cach-bu-nuoc-dien-giai",
    title: "Tiêu chảy cấp ở trẻ: cách bù nước điện giải đúng",
    excerpt:
      "Tiêu chảy không nguy hiểm bằng việc bé mất nước. Hướng dẫn pha và cho bé uống Oresol đúng cách — sai một bước có thể khiến bé mệt hơn.",
    coverImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80&auto=format&fit=crop",
    authorName: "BS. Phòng Khám Dế Mèn",
    specialty: "tieu-hoa" as const,
    tags: ["tiêu chảy", "mất nước", "oresol"],
    publishedAt: "2025-11-10T08:30:00.000Z",
    content: `## Tiêu chảy = đi ngoài phân lỏng từ 3 lần/ngày trở lên

Phần lớn do **virus rota / noro**, tự khỏi sau 5-7 ngày. Vấn đề thực sự là **mất nước**.

## Cách pha Oresol ĐÚNG

- Pha **đúng theo gói** (thường 1 gói cho 200ml hoặc 1 lít — đọc kỹ nhãn)
- Dùng **nước đun sôi để nguội**, KHÔNG pha với sữa / nước trái cây / nước canh
- Pha xong dùng trong **24 giờ**, để tủ lạnh nếu chưa hết

## Cho bé uống thế nào?

| Tuổi | Lượng uống sau mỗi lần đi ngoài |
|------|-------------------------------|
| < 2 tuổi | 50-100ml |
| 2-10 tuổi | 100-200ml |
| > 10 tuổi | Uống theo nhu cầu |

Cho bé uống **từng thìa nhỏ**, không uống ừng ực dễ nôn.

## 🚨 Đưa bé đi viện khi:

- Khô môi, mắt trũng, khóc không nước mắt
- Đi tiểu rất ít hoặc không đi tiểu **trên 6 giờ**
- Nôn liên tục, không giữ được nước
- Phân có máu hoặc nhầy
- Sốt cao kèm tiêu chảy

*Liên hệ Phòng Khám Dế Mèn 0985.350.570 nếu cần tư vấn.*`,
  },
  {
    slug: "tre-bieng-an-7-meo-tu-bac-si-dinh-duong",
    title: "Trẻ biếng ăn: 7 mẹo từ bác sĩ dinh dưỡng",
    excerpt:
      "Đừng ép bé ăn — đó là sai lầm khiến biếng ăn nặng hơn. Đây là 7 cách giúp bé tự ăn ngon, áp dụng được ngay tại bữa cơm gia đình.",
    coverImage:
      "https://images.unsplash.com/photo-1505253213348-cd54c92b37db?w=1200&q=80&auto=format&fit=crop",
    authorName: "BS. Phòng Khám Dế Mèn",
    specialty: "dinh-duong" as const,
    tags: ["biếng ăn", "dinh dưỡng", "trẻ em"],
    publishedAt: "2025-11-05T14:00:00.000Z",
    content: `## Vì sao bé biếng ăn?

- **Sinh lý:** mọc răng, sau ốm, đang khám phá thế giới
- **Tâm lý:** bị ép, ăn rong, vừa ăn vừa xem TV
- **Sai chế độ:** uống sữa quá nhiều, ăn vặt sát bữa
- **Bệnh lý:** thiếu vi chất (kẽm, sắt), nhiễm giun

## 7 mẹo áp dụng được ngay

1. **Không ép, không doạ** — bữa ăn nên vui vẻ
2. **Cố định giờ ăn** — 3 bữa chính + 2 bữa phụ, cách nhau 2-3 giờ
3. **Bữa ăn dưới 30 phút** — quá lâu bé chán
4. **Cho bé ngồi cùng bàn gia đình** — học theo người lớn
5. **Đẹp mắt, đa dạng màu sắc** — bé bị thu hút thị giác
6. **Để bé tự xúc** từ 12 tháng — rèn kỹ năng và hứng thú
7. **Không vừa ăn vừa xem điện thoại/TV**

## Khi nào cần gặp bác sĩ?

- Bé **không tăng cân 3 tháng** liền
- Đường cong tăng trưởng đi ngang hoặc đi xuống
- Bé mệt mỏi, da xanh, tóc thưa
- Biếng ăn kèm sốt, nôn, đau bụng

> Đặt lịch tư vấn dinh dưỡng tại Phòng Khám Dế Mèn — 0985.350.570`,
  },
] as const;

export const MOCK_POSTS: BlogPostView[] = RAW.map((p, i) => ({
  id: `mock-${i + 1}`,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  coverImage: p.coverImage,
  authorName: p.authorName,
  specialty: p.specialty,
  tags: [...p.tags],
  publishedAt: p.publishedAt,
  readingMinutes: estimateReadingMinutes(p.content),
}));
