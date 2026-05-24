import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ChatbotMount } from "@/components/chatbot/ChatbotMount";
import { CLINIC } from "@/lib/constants";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://phongkhamdemen.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Phòng Khám Nhi Đồng Dế Mèn — Khám và chăm sóc sức khỏe trẻ em",
    template: "%s · Phòng Khám Nhi Đồng Dế Mèn",
  },
  description:
    "Phòng khám chuyên khoa nhi tại Bình Tân, TP.HCM. Khám 6 chuyên khoa: hô hấp, tiêu hoá, truyền nhiễm, sơ sinh, dinh dưỡng, da liễu. Giờ: 16h30 – 20h30. Hotline: 0985.350.570.",
  keywords: [
    "phòng khám nhi",
    "phòng khám nhi đồng",
    "Dế Mèn",
    "khám nhi Bình Tân",
    "bác sĩ nhi TP.HCM",
    "đặt lịch khám nhi online",
  ],
  authors: [{ name: "Phòng Khám Nhi Đồng Dế Mèn" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Phòng Khám Nhi Đồng Dế Mèn",
    description:
      "Bác sĩ xinh – Dùng thuốc xịn – Trẻ hết bệnh – Sáng thông minh",
    url: SITE_URL,
    siteName: "Phòng Khám Nhi Đồng Dế Mèn",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phòng Khám Nhi Đồng Dế Mèn",
    description: CLINIC.slogan,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC.name,
    description: CLINIC.slogan,
    telephone: `+84${CLINIC.phone.slice(1)}`,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "126 Liên khu 4-5",
      addressLocality: "Bình Tân",
      addressRegion: "TP.HCM",
      addressCountry: "VN",
    },
    medicalSpecialty: [
      "Pediatrics",
      "Respiratory",
      "Gastroenterology",
      "InfectiousDisease",
      "Neonatal",
      "Nutrition",
      "Dermatology",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "16:30",
      closes: "20:30",
    },
  };

  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[color:var(--color-text)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
