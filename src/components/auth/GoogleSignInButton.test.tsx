import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleSignInButton } from "./GoogleSignInButton";

// Mock signInWithPopup
const signInMock = vi.fn();
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>("firebase/auth");
  return {
    ...actual,
    GoogleAuthProvider: class {
      setCustomParameters = vi.fn();
    },
    signInWithPopup: (...args: unknown[]) => signInMock(...args),
  };
});

beforeEach(() => {
  signInMock.mockReset();
});

describe("GoogleSignInButton", () => {
  it("render nút 'Tiếp tục với Google'", () => {
    render(<GoogleSignInButton />);
    expect(screen.getByRole("button", { name: /tiếp tục với Google/i })).toBeInTheDocument();
  });

  it("hiển thị 'Đang xử lý...' khi đang sign in", async () => {
    const user = userEvent.setup();
    signInMock.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<GoogleSignInButton />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent(/đang xử lý/i);
  });

  it("không hiện lỗi khi user tự đóng popup", async () => {
    const user = userEvent.setup();
    signInMock.mockRejectedValueOnce({ code: "auth/popup-closed-by-user" });
    render(<GoogleSignInButton />);
    await user.click(screen.getByRole("button"));
    // Đợi rerender
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("hiện message rõ khi auth/operation-not-allowed", async () => {
    const user = userEvent.setup();
    signInMock.mockRejectedValueOnce({ code: "auth/operation-not-allowed" });
    render(<GoogleSignInButton />);
    await user.click(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole("alert")).toHaveTextContent(/chưa được bật/i);
  });

  it("hiện message khi popup bị chặn", async () => {
    const user = userEvent.setup();
    signInMock.mockRejectedValueOnce({ code: "auth/popup-blocked" });
    render(<GoogleSignInButton />);
    await user.click(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole("alert")).toHaveTextContent(/chặn popup/i);
  });

  it("hiện message với code khi error code không biết", async () => {
    const user = userEvent.setup();
    signInMock.mockRejectedValueOnce({ code: "auth/strange-unknown-error" });
    render(<GoogleSignInButton />);
    await user.click(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole("alert")).toHaveTextContent(/auth\/strange-unknown-error/);
  });
});
