import { ImageResponse } from "next/og";
import { CLINIC } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Phòng Khám Nhi Đồng Dế Mèn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #F1F8E9 0%, #FFFFFF 55%, #FFF3E0 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 999,
              background: "#7CB342",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              boxShadow: "0 12px 32px rgba(124, 179, 66, 0.35)",
            }}
          >
            🩺
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#558B2F",
                letterSpacing: -0.5,
              }}
            >
              Phòng Khám Nhi Đồng
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#E53935",
                letterSpacing: -1,
              }}
            >
              DẾ MÈN
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#1F2937",
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Bác sĩ xinh · Dùng thuốc xịn
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#1F2937",
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Trẻ hết bệnh · Sáng thông minh
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#4B5563",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 30 }}>🕒</span>
              <span style={{ fontWeight: 600 }}>{CLINIC.hours}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 30 }}>📍</span>
              <span>Bình Tân, TP.HCM</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: 999,
              background: "#E53935",
              color: "white",
              fontWeight: 700,
              fontSize: 30,
            }}
          >
            ☎ {CLINIC.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
