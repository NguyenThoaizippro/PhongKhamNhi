# Google Sheets Knowledge Base — Setup Guide

Chatbot dùng Google Sheet làm Knowledge Base (KB). Bác sĩ điền câu hỏi + câu trả lời vào Sheet, chatbot tự động dùng làm context (NotebookLM-style grounded RAG).

**Mất khoảng 10 phút lần đầu setup.**

---

## 1. Tạo Sheet KB

1. Vào https://sheets.google.com → tạo Sheet mới tên `Phong Kham De Men - KB`
2. Row 1 là header, điền chính xác:

| A | B | C | D |
|---|---|---|---|
| Question | Answer | Specialty | Tags |

3. Bắt đầu điền từ row 2. Ví dụ:

| Question | Answer | Specialty | Tags |
|----------|--------|-----------|------|
| Bé sốt 38.5°C có sao không? | Sốt 38.5°C ở trẻ trên 3 tháng tuổi mà bé vẫn chơi, ăn uống được thì có thể chăm sóc tại nhà. Lau mát bằng nước ấm, uống nhiều nước, paracetamol 10-15mg/kg cách 4-6 giờ. Đi khám nếu sốt > 39°C, kéo dài > 3 ngày, hoặc bé li bì khó đánh thức. | ho-hap | sốt, cấp cứu |
| Giờ làm việc của phòng khám? | Phòng khám mở cửa 16h30 – 20h30 tất cả các ngày trong tuần. Hotline: 0985.350.570. | | giờ, liên hệ |

**Lưu ý cột Specialty:** dùng SLUG (ho-hap, tieu-hoa, truyen-nhiem, so-sinh, dinh-duong, da-lieu), để trống nếu chung.

4. Copy **Spreadsheet ID** từ URL:
   ```
   https://docs.google.com/spreadsheets/d/<<SPREADSHEET_ID>>/edit
   ```

---

## 2. Tạo Service Account

1. Vào https://console.cloud.google.com → tạo project mới (hoặc dùng project Firebase đã có)
2. Sidebar → **APIs & Services → Library** → search **"Google Sheets API"** → **Enable**
3. **APIs & Services → Credentials** → **Create Credentials → Service Account**
   - Name: `phong-kham-de-men-sheets`
   - Skip 2 bước Role + User access (không cần)
4. Click vào service account vừa tạo → tab **Keys** → **Add Key → Create new key → JSON** → tải về

---

## 3. Share Sheet cho Service Account

1. Mở file JSON vừa tải, copy giá trị `client_email` (dạng `xxx@xxx.iam.gserviceaccount.com`)
2. Quay lại Sheet KB → click **Share** (góc phải) → paste email service account → chọn **Editor** → **Send**

---

## 4. Paste credentials vào `.env.local`

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=phong-kham-de-men-sheets@xxx.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...nhiều dòng escape...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_KB_ID=<<SPREADSHEET_ID_TỪ_URL>>
```

> **QUAN TRỌNG:**
> - Giữ nguyên dấu ngoặc kép `"..."` quanh private key
> - Giữ nguyên `\n` literal (KHÔNG đổi thành xuống dòng thật)
> - Sau khi paste xong, **XOÁ FILE JSON** trên máy

---

## 5. Restart dev server

```bash
npm run dev
```

Mở chatbot, hỏi câu nào đã có trong Sheet → chatbot trả lời dựa trên đó.

---

## 6. Workflow self-learning

```
1. User hỏi chatbot → bot KHÔNG biết → trả lời "chưa có thông tin, gọi 0985.350.570"
2. Server tự ghi câu hỏi vào Firestore collection 'unanswered'
3. Bác sĩ vào /admin/unanswered → đọc → soạn câu trả lời → bấm "Lưu"
4. Bác sĩ copy câu hỏi + câu trả lời SANG Google Sheet KB (manual, 30 giây)
5. Bấm "Đánh dấu đã merge KB"
6. Cache KB tự reset sau 5 phút → chatbot tự động biết câu này từ lần sau
```

> Bước 4 thủ công bởi vì cho phép bác sĩ chỉnh câu trả lời gọn / chuẩn hơn trước khi đưa lên KB.

---

## Troubleshooting

**Chatbot không dùng KB?**
- Kiểm tra `.env.local` có đủ 3 biến `GOOGLE_SHEETS_*` không
- Header response `X-KB-Size` trong DevTools Network → nếu = 0 nghĩa là KB không fetch được
- Verify đã share Sheet cho service account email với quyền **Editor**

**Lỗi `PERMISSION_DENIED` trong terminal**
- Sheet chưa share, hoặc share sai email
- Hoặc Sheets API chưa enable trên Cloud Console

**Cache không reset sau khi sửa Sheet**
- Cache 5 phút trong memory. Đợi hoặc restart `npm run dev`.

---

## Cấu trúc khuyến nghị cho KB

Câu hỏi nên:
- Viết theo ngôn ngữ phụ huynh hay dùng (VD: "bé sốt", "bé biếng ăn") — KHÔNG dùng thuật ngữ y khoa
- 1 chủ đề / 1 row — đừng gộp nhiều câu hỏi vào 1 ô
- Trả lời ngắn (dưới 200 chữ), có cảnh báo cấp cứu nếu liên quan
- Luôn kết câu bằng "Đây là thông tin tham khảo, không thay thế khám trực tiếp." (chatbot tự thêm nhưng phòng trường hợp)

Khuyến nghị: bắt đầu với **30-50 câu hỏi** phổ biến nhất, mở rộng dần qua /admin/unanswered.
