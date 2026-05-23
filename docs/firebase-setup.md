# Firebase Setup Guide

Hướng dẫn từng bước tạo Firebase project cho Phòng Khám Nhi Đồng Dế Mèn.
Mất khoảng **15 phút** lần đầu.

## 1. Tạo Firebase Project

1. Vào https://console.firebase.google.com/
2. Click **"Add project"** → đặt tên `phong-kham-de-men` (hoặc tên bạn muốn)
3. Bật/tắt Google Analytics tuỳ ý (recommend BẬT cho production)
4. Chọn account analytics → **Create project**

## 2. Enable Authentication

1. Sidebar → **Build** → **Authentication** → **Get started**
2. Tab **"Sign-in method"** → enable các providers:
   - **Email/Password** — cho admin/bác sĩ
   - **Google** — cho phụ huynh sign-in nhanh
   - **Phone** — cho phụ huynh OTP

> **Lưu ý phone:** Firebase yêu cầu xác thực reCAPTCHA, miễn phí 10K verifications/tháng.

## 3. Enable Firestore Database

1. Sidebar → **Build** → **Firestore Database** → **Create database**
2. Chọn location: **asia-southeast1 (Singapore)** — gần TP.HCM, độ trễ thấp
3. Start in **production mode** (rules đã viết sẵn ở `firestore.rules`)

## 4. Enable Storage

1. Sidebar → **Build** → **Storage** → **Get started**
2. Chọn cùng location với Firestore: **asia-southeast1**

## 5. Deploy Firestore Security Rules

Sau khi cài Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # chọn project vừa tạo, dùng firestore.rules có sẵn
firebase deploy --only firestore:rules
```

## 6. Lấy Client Config (cho NEXT_PUBLIC_*)

1. Project Settings (icon bánh răng) → **General**
2. Cuộn xuống **"Your apps"** → click icon `</>` (Web)
3. Đặt nickname app (VD: `web-frontend`)
4. **KHÔNG** check "Firebase Hosting" (mình deploy Vercel)
5. Copy đoạn config JSON, paste vào `.env.local`:

```bash
# Từ firebaseConfig copy được sang:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phong-kham-de-men
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=12345...
NEXT_PUBLIC_FIREBASE_APP_ID=1:12345...
```

## 7. Lấy Admin Service Account (cho server-side)

1. Project Settings → tab **"Service accounts"**
2. Click **"Generate new private key"** → download JSON
3. Mở file JSON, copy 3 field vào `.env.local`:

```bash
FIREBASE_ADMIN_PROJECT_ID=phong-kham-de-men
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@phong-kham-de-men.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **QUAN TRỌNG:**
> - Giữ nguyên dấu ngoặc kép `"..."` quanh private key
> - Giữ nguyên `\n` (không đổi thành xuống dòng thật)
> - Sau khi copy xong, **XOÁ FILE JSON** trên máy (đừng để lộ)

## 8. Domain Restriction (sau khi có domain)

Để bảo vệ API key client, restrict domains:

1. Google Cloud Console → APIs & Services → Credentials
2. Tìm key `Browser key (auto created by Firebase)` → Edit
3. Application restrictions → **HTTP referrers** → thêm:
   - `localhost:3000/*`
   - `your-domain.vercel.app/*`
   - `your-custom-domain.com/*`

## 9. Test Connection

Sau khi setup xong, chạy:
```bash
npm run dev
```

Mở console browser ở http://localhost:3000 → nếu KHÔNG có lỗi `Firebase: Error (auth/...)` thì OK.

---

## Troubleshooting

**Lỗi `Missing or insufficient permissions`** → Firestore rules chưa deploy. Chạy `firebase deploy --only firestore:rules`.

**Lỗi `auth/configuration-not-found` khi phone OTP** → Phone provider chưa enable trong Authentication console.

**Lỗi `private_key` parse error trong production** → Vercel env var bị escape sai. Khi paste vào Vercel dashboard, paste nguyên xi từ JSON (kèm `\n`), không bỏ dấu ngoặc kép.
