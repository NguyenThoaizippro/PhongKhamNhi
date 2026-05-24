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
    authorName: "Bác sĩ Đồng",
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
    authorName: "Bác sĩ Đồng",
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
    authorName: "Bác sĩ Đồng",
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
  {
    slug: "tay-chan-mieng-cha-me-can-biet-gi",
    title: "Tay chân miệng: ba mẹ cần biết gì để phát hiện sớm",
    excerpt:
      "Tay chân miệng là bệnh truyền nhiễm phổ biến ở trẻ dưới 5 tuổi. Bác sĩ Đồng hướng dẫn cách nhận biết sớm và những dấu hiệu nguy hiểm cần đến viện ngay.",
    coverImage:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80&auto=format&fit=crop",
    authorName: "Bác sĩ Đồng",
    specialty: "truyen-nhiem" as const,
    tags: ["tay chân miệng", "truyền nhiễm", "phát ban"],
    publishedAt: "2025-12-02T09:00:00.000Z",
    content: `## Bệnh tay chân miệng là gì?

Bệnh truyền nhiễm do virus **EV71 / Coxsackie A16** gây ra, thường gặp ở trẻ **dưới 5 tuổi**. Lây qua đường hô hấp, dịch từ mụn nước, phân.

## Dấu hiệu sớm

- Sốt nhẹ 37.5 – 38.5°C trong 1-2 ngày
- Bé mệt, biếng ăn, đau họng
- **Mụn nước nhỏ** xuất hiện ở: lòng bàn tay, lòng bàn chân, mông, đầu gối
- **Loét miệng** đau — bé khó nuốt, chảy nước miếng

## 🚨 Dấu hiệu nặng — đưa bé đi viện NGAY

- Sốt cao **trên 39°C kéo dài 2 ngày**, không hạ với paracetamol
- Bé **giật mình lúc ngủ** (kể cả nhẹ) — dấu hiệu biến chứng thần kinh
- **Run tay chân**, đi lảo đảo
- Thở nhanh, thở mệt, da nổi vân tím
- Nôn nhiều, lừ đừ, ngủ li bì

## Chăm sóc tại nhà (trường hợp nhẹ)

1. Cho bé nghỉ học **7-10 ngày** để tránh lây
2. Vệ sinh miệng bằng nước muối sinh lý sau ăn
3. Ăn thức ăn lỏng, nguội, mềm — tránh chua cay
4. Hạ sốt bằng paracetamol khi sốt > 38.5°C
5. Cách ly đồ dùng cá nhân của bé với anh chị em

## Phòng ngừa

- Rửa tay xà phòng sau khi thay tã, trước khi ăn
- Khử khuẩn đồ chơi, sàn nhà bằng cloramin B
- Không cho trẻ bệnh tiếp xúc với trẻ khác

*Tay chân miệng có thể chuyển nặng rất nhanh. Khi có dấu hiệu nghi ngờ, đưa bé đến Phòng Khám Dế Mèn hoặc bệnh viện sớm — gọi 0985.350.570.*`,
  },
  {
    slug: "viem-da-co-dia-o-tre-cham-soc-the-nao",
    title: "Viêm da cơ địa ở trẻ: chăm sóc thế nào cho đỡ tái phát",
    excerpt:
      "Viêm da cơ địa là bệnh da liễu mạn tính rất hay tái phát. Bác sĩ Đồng chia sẻ cách giữ ẩm, tắm rửa và chọn quần áo giúp bé bớt ngứa, da khoẻ hơn.",
    coverImage:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=1200&q=80&auto=format&fit=crop",
    authorName: "Bác sĩ Đồng",
    specialty: "da-lieu" as const,
    tags: ["viêm da", "da liễu", "dưỡng ẩm"],
    publishedAt: "2025-12-10T07:30:00.000Z",
    content: `## Viêm da cơ địa là gì?

Bệnh **da liễu mạn tính**, không lây, thường khởi phát từ 3 tháng đến 2 tuổi. Da bé khô, ngứa, mẩn đỏ ở: má, khuỷu tay, khoeo chân, cổ tay.

## Nguyên tắc chăm sóc — 3 chữ "Đ"

### Đ1 — Dưỡng ẩm

- Bôi kem dưỡng ẩm **ngay sau khi tắm 3 phút** — khi da còn ẩm
- Bôi **2-3 lần/ngày**, kể cả khi không đợt cấp
- Chọn kem: Cetaphil, CeraVe, Bioderma, Eucerin — không hương liệu, không paraben

### Đ2 — Đúng cách tắm

- Tắm nước **ấm vừa** (không nóng), thời gian ≤ 10 phút
- Dùng sữa tắm dịu nhẹ pH ~5.5, không xà phòng kiềm
- Lau khô bằng khăn cotton, **chấm** chứ không chà

### Đ3 — Đồ chất liệu mềm

- Quần áo cotton 100%, tránh len, sợi tổng hợp
- Giặt riêng quần áo bé bằng bột giặt cho da nhạy cảm, không nước xả vải
- Không mặc quá ấm gây đổ mồ hôi

## 🚨 Khi nào cần thuốc?

- Vùng đỏ lan rộng, ngứa nhiều ảnh hưởng giấc ngủ → cần corticoid bôi (theo chỉ định bác sĩ)
- Da rỉ nước, mưng mủ → có thể bội nhiễm vi khuẩn, cần kháng sinh

**KHÔNG tự ý dùng corticoid mạnh kéo dài** — gây mỏng da, giãn mạch.

## Tránh kích ứng

- Không cho bé tiếp xúc bụi, lông động vật, phấn hoa nếu nghi ngờ
- Cắt móng tay ngắn, đeo bao tay ban đêm để bé khỏi gãi
- Theo dõi thực phẩm bé ăn — có thể dị ứng sữa bò, trứng, đậu phộng

*Đặt lịch khám da liễu trẻ em với Bác sĩ Đồng tại Phòng Khám Dế Mèn — 0985.350.570.*`,
  },
  {
    slug: "tre-so-sinh-trao-nguoc-co-nguy-hiem-khong",
    title: "Trẻ sơ sinh trào ngược: bình thường hay bệnh lý?",
    excerpt:
      "Hầu hết bé sơ sinh đều có trào ngược sinh lý ở mức độ nhẹ. Tuy nhiên có những dấu hiệu cảnh báo bệnh lý mà ba mẹ cần biết để đưa bé đi khám sớm.",
    coverImage:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&auto=format&fit=crop",
    authorName: "Bác sĩ Đồng",
    specialty: "so-sinh" as const,
    tags: ["sơ sinh", "trào ngược", "nôn trớ"],
    publishedAt: "2025-12-18T10:00:00.000Z",
    content: `## Trào ngược sinh lý là gì?

Cơ thắt tâm vị ở bé sơ sinh chưa hoàn thiện, nên **70% bé dưới 4 tháng** có trào ngược nhẹ — đặc biệt sau bú. Đây là **bình thường** nếu bé vẫn:

- Tăng cân đều
- Bú khoẻ
- Vui vẻ, chơi tốt
- Không khó thở

## 🚨 Khi nào là bệnh lý — cần khám

- Nôn vọt thành tia, **xa và mạnh**
- Bé **không tăng cân** hoặc sụt cân
- Bỏ bú, quấy khóc khi bú
- Nôn ra **dịch xanh, vàng, có máu**
- Khò khè, ho khan, viêm phổi tái diễn
- Cong người, ưỡn lưng khi bú (đau)

## Mẹo giảm trào ngược sinh lý

1. **Bế đứng bé 20-30 phút sau bú** — cho hơi thoát ra
2. Cho bé ợ hơi giữa và sau cữ bú
3. Bú **chia nhỏ nhiều cữ**, không bú quá no một lúc
4. Tránh ấn bụng, mặc tã quá chặt
5. Nâng đầu giường bé 30° khi ngủ (KHÔNG dùng gối — tăng nguy cơ SIDS)
6. Mẹ cho bú nên hạn chế: cà phê, sô cô la, đồ cay, hành tỏi nhiều

## Khi nào dùng thuốc?

Chỉ khi bác sĩ chẩn đoán **GERD bệnh lý**. **Không tự ý** dùng:
- Domperidone, metoclopramide — có tác dụng phụ thần kinh ở trẻ
- Omeprazole, ranitidine — chỉ dùng khi có chỉ định

## Trào ngược tự khỏi khi nào?

- **80% bé** hết trào ngược lúc **6 tháng** (khi tập ngồi)
- **95% bé** hết lúc **12 tháng**
- Nếu sau 1 tuổi vẫn còn → cần khám chuyên sâu

*Lo lắng về tình trạng nôn trớ của bé sơ sinh? Đặt lịch khám với Bác sĩ Đồng tại Phòng Khám Dế Mèn — 0985.350.570.*`,
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
