import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wnn_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export function adminEmail() {
  return process.env.ADMIN_EMAIL || "admin";
}

export function verifyAdminCredentials(email: string, password: string) {
  if (email !== adminEmail()) {
    return false;
  }

  const passwordHash = process.env.ADMIN_PASSWORD_SHA256;
  if (passwordHash) {
    return timingSafeEqual(sha256(password), passwordHash);
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || "124";
  return timingSafeEqual(password, expectedPassword);
}

export function isAuthenticated(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return false;
  }

  const [payload, signature] = cookie.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload);
  if (!timingSafeEqual(signature, expected)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; exp: number };
    return session.email === adminEmail() && session.exp > Date.now();
  } catch {
    return false;
  }
}

export function setSessionCookie(response: NextResponse) {
  const payload = Buffer.from(
    JSON.stringify({
      email: adminEmail(),
      exp: Date.now() + SESSION_TTL_SECONDS * 1000
    })
  ).toString("base64url");

  response.cookies.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function requireAdmin(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  return null;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "dev-insecure-session-secret";
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
