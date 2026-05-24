import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingConfirmCard } from "./BookingConfirmCard";
import type { BookingDraft } from "@/lib/llm/types";

const draft: BookingDraft = {
  childName: "Bé Mai",
  childBirthDate: "2022-06-15",
  parentName: "Mẹ Lan",
  parentPhone: "0985350570",
  specialty: "ho-hap",
  preferredDate: "2026-06-15",
  preferredTimeSlot: "17h30-18h30",
  symptoms: "Bé ho 2 ngày",
};

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

describe("BookingConfirmCard", () => {
  it("render đủ field prefilled từ draft", () => {
    render(<BookingConfirmCard draft={draft} onConfirmed={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByDisplayValue("Bé Mai")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mẹ Lan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0985350570")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bé ho 2 ngày")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2022-06-15")).toBeInTheDocument();
  });

  it("gọi onCancel khi click Huỷ", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<BookingConfirmCard draft={draft} onConfirmed={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: /huỷ/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("POST /api/booking với form data + gọi onConfirmed khi success", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ bookingId: "ABC123" }), { status: 200 })
    );
    const user = userEvent.setup();
    const onConfirmed = vi.fn();
    render(<BookingConfirmCard draft={draft} onConfirmed={onConfirmed} onCancel={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /xác nhận đặt lịch/i }));

    await screen.findByText(/đã ghi nhận đặt lịch/i);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/booking",
      expect.objectContaining({ method: "POST" })
    );
    expect(onConfirmed).toHaveBeenCalledWith("ABC123");
  });

  it("hiện error khi server trả 400 với fieldErrors", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "Vui lòng kiểm tra lại thông tin",
          fieldErrors: { parentPhone: "SĐT sai" },
        }),
        { status: 400 }
      )
    );
    const user = userEvent.setup();
    render(<BookingConfirmCard draft={draft} onConfirmed={vi.fn()} onCancel={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /xác nhận đặt lịch/i }));
    await screen.findByRole("alert");
    expect(screen.getByRole("alert")).toHaveTextContent(/kiểm tra lại/i);
    expect(screen.getByText("SĐT sai")).toBeInTheDocument();
  });

  it("hiện error khi fetch fail (network)", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network"));
    const user = userEvent.setup();
    render(<BookingConfirmCard draft={draft} onConfirmed={vi.fn()} onCancel={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /xác nhận đặt lịch/i }));
    await screen.findByRole("alert");
    expect(screen.getByRole("alert")).toHaveTextContent(/không kết nối/i);
  });

  it("cho phép user edit field trước khi submit", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ bookingId: "X1" }), { status: 200 })
    );
    const user = userEvent.setup();
    render(<BookingConfirmCard draft={draft} onConfirmed={vi.fn()} onCancel={vi.fn()} />);
    const phoneInput = screen.getByDisplayValue("0985350570");
    await user.clear(phoneInput);
    await user.type(phoneInput, "0912345678");
    await user.click(screen.getByRole("button", { name: /xác nhận đặt lịch/i }));
    await screen.findByText(/đã ghi nhận/i);
    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sentBody.parentPhone).toBe("0912345678");
  });
});
