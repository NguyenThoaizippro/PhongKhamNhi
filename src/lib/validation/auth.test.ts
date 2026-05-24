import { describe, it, expect } from "vitest";
import { adminLoginSchema } from "./auth";

describe("adminLoginSchema", () => {
  it("accepts valid credentials", () => {
    const r = adminLoginSchema.safeParse({
      email: "bacsi@demen.vn",
      password: "secret12",
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      adminLoginSchema.safeParse({
        email: "not-an-email",
        password: "secret12",
      }).success
    ).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    expect(
      adminLoginSchema.safeParse({
        email: "bacsi@demen.vn",
        password: "short",
      }).success
    ).toBe(false);
  });

  it("trims email", () => {
    const r = adminLoginSchema.safeParse({
      email: "  bacsi@demen.vn  ",
      password: "secret12",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("bacsi@demen.vn");
  });
});
