import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MagicLinkForm } from "./MagicLinkForm";

const sendMock = vi.fn();
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>("firebase/auth");
  return {
    ...actual,
    sendSignInLinkToEmail: (...args: unknown[]) => sendMock(...args),
  };
});

beforeEach(() => {
  sendMock.mockReset();
  window.localStorage.clear();
});

describe("MagicLinkForm", () => {
  it("render email input + nút gửi", () => {
    render(<MagicLinkForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /gửi link/i })).toBeInTheDocument();
  });

  it("hiện lỗi khi email không hợp lệ", async () => {
    const user = userEvent.setup();
    render(<MagicLinkForm />);
    await user.type(screen.getByLabelText(/Email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /gửi link/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/không hợp lệ/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("gọi Firebase và hiện success state khi email hợp lệ", async () => {
    const user = userEvent.setup();
    sendMock.mockResolvedValueOnce(undefined);
    render(<MagicLinkForm redirectTo="/foo" />);
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /gửi link/i }));
    await screen.findByText(/Đã gửi link đăng nhập/i);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem("demen_emailForSignIn")).toBe("test@example.com");
    expect(window.localStorage.getItem("demen_redirectAfterSignIn")).toBe("/foo");
  });

  it("trim email trước khi validate + send", async () => {
    const user = userEvent.setup();
    sendMock.mockResolvedValueOnce(undefined);
    render(<MagicLinkForm />);
    await user.type(screen.getByLabelText(/Email/i), "  test@example.com  ");
    await user.click(screen.getByRole("button", { name: /gửi link/i }));
    await screen.findByText(/Đã gửi link/i);
    expect(sendMock.mock.calls[0][1]).toBe("test@example.com");
  });

  it("hiện error khi Firebase reject (unauthorized URI)", async () => {
    const user = userEvent.setup();
    sendMock.mockRejectedValueOnce(new Error("auth/unauthorized-continue-uri"));
    render(<MagicLinkForm />);
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /gửi link/i }));
    await screen.findByRole("alert");
    expect(screen.getByRole("alert")).toHaveTextContent(/domain chưa được phép/i);
  });

  it("nút 'Gửi cho email khác' đưa về idle state", async () => {
    const user = userEvent.setup();
    sendMock.mockResolvedValueOnce(undefined);
    render(<MagicLinkForm />);
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /gửi link/i }));
    await screen.findByText(/Đã gửi link/i);
    await user.click(screen.getByText(/gửi cho email khác/i));
    expect(screen.getByLabelText(/Email/i)).toHaveValue("");
  });
});
