import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("render heading chính + slogan", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/DẾ MÈN/)).toBeInTheDocument();
    expect(screen.getByText(/Bác sĩ xinh/i)).toBeInTheDocument();
  });

  it("có CTA 'Đăng ký khám ngay' link tới /dang-ky-kham", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /đăng ký khám/i });
    expect(cta).toHaveAttribute("href", "/dang-ky-kham");
  });

  it("có link tel: cho hotline phòng khám", () => {
    render(<Hero />);
    const phoneLink = screen.getByRole("link", { name: /0985\.350\.570/ });
    expect(phoneLink).toHaveAttribute("href", "tel:0985350570");
  });

  it("hiển thị badge BS Đông — bác sĩ chính 6 chuyên khoa", () => {
    render(<Hero />);
    expect(screen.getByText(/bác sĩ chính · thạo cả 6 chuyên khoa nhi/i)).toBeInTheDocument();
  });

  it("hiển thị stat 6 chuyên khoa + giờ 16h30 + 7/7 ngày", () => {
    render(<Hero />);
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("16h30")).toBeInTheDocument();
    expect(screen.getByText("7/7")).toBeInTheDocument();
  });

  it("mascot image có alt mô tả", () => {
    render(<Hero />);
    const img = screen.getByAltText(/mascot.*dế mèn/i);
    expect(img).toBeInTheDocument();
  });
});
