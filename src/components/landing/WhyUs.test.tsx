import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhyUs } from "./WhyUs";

describe("WhyUs", () => {
  it("render heading + 6 lý do", () => {
    render(<WhyUs />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(6);
  });

  it("reference BS Đồng — bác sĩ chính", () => {
    render(<WhyUs />);
    // BS Đồng xuất hiện ở title card 1 + body card 3
    expect(screen.getAllByText(/bác sĩ đồng/i).length).toBeGreaterThanOrEqual(1);
  });

  it("nhắc cấp cứu 115", () => {
    render(<WhyUs />);
    expect(screen.getByText(/cấp cứu/i)).toBeInTheDocument();
    const phone115 = screen.getByRole("link", { name: /gọi 115/i });
    expect(phone115).toHaveAttribute("href", "tel:115");
  });

  it("nhắc 6 chuyên khoa", () => {
    render(<WhyUs />);
    expect(screen.getByText(/6 chuyên khoa/i)).toBeInTheDocument();
  });
});
