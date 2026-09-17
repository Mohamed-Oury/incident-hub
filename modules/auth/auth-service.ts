import { cookies } from "next/headers";
import crypto from "crypto";
import { SessionUser, DEMO_USERS } from "./types";

export * from "./types";

const SESSION_COOKIE = "payway_session";
const SECRET = process.env.AUTH_SECRET || "payway-secret-default-key-2026";

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const digest = hmac.digest("hex");
  return `${payload}.${digest}`;
}

function verify(cookieValue: string): string | null {
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = cookieValue.slice(0, lastDot);
  const signature = cookieValue.slice(lastDot + 1);

  const expectedHmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  if (expectedHmac === signature) {
    return payload;
  }
  return null;
}

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();
  const rawPayload = JSON.stringify(user);
  const signedToken = sign(Buffer.from(rawPayload).toString("base64url"));

  cookieStore.set(SESSION_COOKIE, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return null;
  }

  const payload = verify(sessionCookie.value);
  if (!payload) return null;

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded) as SessionUser;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
