/**
 * Firebase Admin SDK — CHỈ dùng server-side (API routes, Server Actions).
 * Service account credentials BẢO MẬT, không bao giờ expose ra client.
 * KHÔNG import file này từ Client Component.
 *
 * Lazy init: chỉ khởi tạo khi caller thật sự dùng (tránh build-time crash
 * khi env vars chưa được set trên CI).
 */
import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Thiếu biến môi trường Firebase Admin. Kiểm tra .env.local: " +
        "FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY"
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let _auth: Auth | undefined;
let _db: Firestore | undefined;

function authInstance(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}

function dbInstance(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}

// Proxy: chỉ touch instance khi consumer thực sự gọi (giữ API cũ `adminDb.collection(...)`).
// LƯU Ý: trả về `undefined` cho các property mà JS dùng để probe (vd `then` khi await,
// `Symbol.toPrimitive`...) — tránh trigger init prematurely và crash trong async wrapping.
function isProbe(prop: PropertyKey): boolean {
  return prop === "then" || prop === "catch" || prop === "finally" || typeof prop === "symbol";
}

export const adminAuth = new Proxy({} as Auth, {
  get(_t, prop) {
    if (isProbe(prop)) return undefined;
    const inst = authInstance() as unknown as Record<PropertyKey, unknown>;
    const v = inst[prop];
    return typeof v === "function" ? (v as (...args: unknown[]) => unknown).bind(inst) : v;
  },
}) as Auth;

export const adminDb = new Proxy({} as Firestore, {
  get(_t, prop) {
    if (isProbe(prop)) return undefined;
    const inst = dbInstance() as unknown as Record<PropertyKey, unknown>;
    const v = inst[prop];
    return typeof v === "function" ? (v as (...args: unknown[]) => unknown).bind(inst) : v;
  },
}) as Firestore;
