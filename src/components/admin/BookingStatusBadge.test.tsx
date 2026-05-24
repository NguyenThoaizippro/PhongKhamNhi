import { describe, it, expect } from "vitest";
import {
  BookingStatusBadge,
  BOOKING_STATUS_OPTIONS,
} from "./BookingStatusBadge";
import { render, screen } from "@testing-library/react";

describe("BookingStatusBadge", () => {
  it.each([
    ["pending", "Chờ xác nhận"],
    ["confirmed", "Đã xác nhận"],
    ["completed", "Đã khám"],
    ["cancelled", "Đã huỷ"],
  ] as const)("render label đúng cho status '%s'", (status, label) => {
    render(<BookingStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("BOOKING_STATUS_OPTIONS có đủ 4 option", () => {
    expect(BOOKING_STATUS_OPTIONS).toHaveLength(4);
    expect(BOOKING_STATUS_OPTIONS.map((o) => o.value)).toEqual([
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ]);
  });
});
