/**
 * Test cho POST /api/booking — chatbot booking endpoint.
 * Mock Firestore + email notify để không cần credentials thật.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mock firebase-admin/firestore (FieldValue.serverTimestamp) ---
vi.mock("firebase-admin/firestore", () => ({
  FieldValue: {
    serverTimestamp: () => "SERVER_TS",
  },
}));

// --- Mock booking-emails (best-effort fire-and-forget) ---
const notifyMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/email/booking-emails", () => ({
  notifyBookingCreated: (...args: unknown[]) => notifyMock(...args),
}));

// --- Mock firebase admin DB ---
const addMock = vi.fn();
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: () => ({ add: addMock }),
  },
  adminAuth: {},
}));

const FUTURE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
})();

const VALID_PAYLOAD = {
  childName: "Bé An",
  childBirthDate: "2022-01-15",
  parentName: "Nguyễn Mẹ",
  parentPhone: "0985350570",
  parentEmail: "me@example.com",
  specialty: "ho-hap",
  preferredDate: FUTURE_DATE,
  preferredTimeSlot: "17h30-18h30",
  symptoms: "Bé sốt 38°C 2 ngày",
};

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear Firebase creds → ensure tests are deterministic
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    delete process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  });

  it("trả 400 khi body không phải JSON hợp lệ", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest("not-json{") as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/JSON/i);
  });

  it("trả 400 với fieldErrors khi thiếu field bắt buộc", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest({ childName: "X" }) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors).toBeDefined();
    expect(Object.keys(data.fieldErrors).length).toBeGreaterThan(0);
  });

  it("trả 400 khi SĐT VN sai format", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest({
      ...VALID_PAYLOAD,
      parentPhone: "123",
    }) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fieldErrors?.parentPhone).toMatch(/định dạng/i);
  });

  it("không có Firebase creds → trả dev bookingId (graceful degrade)", async () => {
    const { POST } = await import("./route");
    const req = jsonRequest(VALID_PAYLOAD) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.bookingId).toMatch(/^dev-/);
    expect(data.source).toBe("chatbot");
    expect(addMock).not.toHaveBeenCalled();
  });

  it("happy path: có Firebase creds → ghi Firestore + fire email", async () => {
    process.env.FIREBASE_ADMIN_PROJECT_ID = "p";
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL = "c@p.iam.gserviceaccount.com";
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = "k";

    addMock.mockResolvedValueOnce({ id: "booking-xyz" });

    const { POST } = await import("./route");
    const req = jsonRequest(VALID_PAYLOAD) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.bookingId).toBe("booking-xyz");
    expect(addMock).toHaveBeenCalledTimes(1);
    const writtenDoc = addMock.mock.calls[0][0];
    expect(writtenDoc.childName).toBe("Bé An");
    expect(writtenDoc.status).toBe("pending");
    expect(writtenDoc.source).toBe("chatbot");
    expect(writtenDoc.createdAt).toBe("SERVER_TS");
    // Email notify fired (best-effort, không await)
    expect(notifyMock).toHaveBeenCalledTimes(1);
  });

  it("Firestore throw → trả 500 với message thân thiện", async () => {
    process.env.FIREBASE_ADMIN_PROJECT_ID = "p";
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL = "c@p.iam.gserviceaccount.com";
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = "k";

    addMock.mockRejectedValueOnce(new Error("Firestore down"));

    const { POST } = await import("./route");
    const req = jsonRequest(VALID_PAYLOAD) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/0985\.350\.570/);
  });
});
