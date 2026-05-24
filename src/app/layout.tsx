import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ChatbotMount } from "@/components/chatbot/ChatbotMount";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phòng Khám Nhi Đồng Dế Mèn — Khám và chăm sóc sức khỏe trẻ em",
  description:
    "Phòng khám chuyên khoa nhi tại Bình Tân, TP.HCM. Khám 6 chuyên khoa: hô hấp, tiêu hoá, truyền nhiễm, sơ sinh, dinh dưỡng, da liễu. Giờ: 16h30 – 20h30. Hotline: 0985.350.570.",
  keywords: [
    "phòng khám nhi",
    "phòng khám nhi đồng",
    "Dế Mèn",
    "khám nhi Bình Tân",
    "bác sĩ nhi TP.HCM",
  ],
  openGraph: {
    title: "Phòng Khám Nhi Đồng Dế Mèn",
    description: "Bác sĩ xinh – Dùng thuốc xịn – Trẻ hết bệnh – Sáng thông minh",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[color:var(--color-text)]">
        <AuthProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          <ChatbotMount />
        </AuthProvider>
      </body>
    </html>
  );
}
