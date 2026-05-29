import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./auth-constants";

const COOKIE_NAME = ADMIN_COOKIE_NAME;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEV_FALLBACK_SECRET = "dev-insecure-session-secret";

export function adminEmail() {
  return authEnv().ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin";
}

export function verifyAdminCredentials(email: string, password: string) {
  if (email !== adminEmail()) {
    return false;
  }

  const env = authEnv();
  const passwordHash = env.ADMIN_PASSWORD_SHA256 || process.env.ADMIN_PASSWORD_SHA256;
  if (passwordHash) {
    return timingSafeEqual(sha256(password), passwordHash);
  }

  const expectedPassword = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "124";
  return timingSafeEqual(password, expectedPassword);
}

/**
 * 是否仍在使用默认弱口令（admin / 124）。
 * 用于在登录后强制提示用户修改默认密码。
 */
export function isUsingDefaultPassword() {
  const env = authEnv();
  return !env.ADMIN_PASSWORD_SHA256 && !process.env.ADMIN_PASSWORD_SHA256 && !env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD;
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
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email: string;
      exp: number;
      passwordFingerprint?: string;
    };
    return (
      session.email === adminEmail() &&
      session.exp > Date.now() &&
      session.passwordFingerprint === passwordFingerprint()
    );
  } catch {
    return false;
  }
}

export function setSessionCookie(response: NextResponse) {
  const payload = Buffer.from(
    JSON.stringify({
      email: adminEmail(),
      exp: Date.now() + SESSION_TTL_SECONDS * 1000,
      passwordFingerprint: passwordFingerprint()
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

/**
 * CSRF 防护：拒绝跨站发起的写请求。
 * - 必须带 Origin 或 Referer，且与请求 Host 同源。
 * - 缺失或不匹配时返回 403。
 *
 * 与 SameSite=Lax cookie 配合，构成纵深防御。
 */
export function requireSameOrigin(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) {
    return NextResponse.json({ error: "缺少 Host 头" }, { status: 400 });
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin ?? referer;
  if (!source) {
    return NextResponse.json({ error: "拒绝跨站请求" }, { status: 403 });
  }

  try {
    const sourceHost = new URL(source).host;
    if (sourceHost !== host) {
      return NextResponse.json({ error: "拒绝跨站请求" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "拒绝跨站请求" }, { status: 403 });
  }

  return null;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function sessionSecret() {
  const env = authEnv();
  const secret = env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) return secret;

  // 生产环境必须显式设置 secret，否则任何看过本仓库代码的人都能伪造管理员 session。
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET 未设置。请在 .env 中配置一个会话密钥后再启动生产环境。");
  }

  // 仅开发环境允许使用占位 secret，并在控制台打印明显警告。
  if (!warnedDevSecret) {
    warnedDevSecret = true;
    console.warn(
      "[auth] 警告: 当前使用开发环境占位 secret，生产环境请务必设置 ADMIN_SESSION_SECRET。"
    );
  }
  return DEV_FALLBACK_SECRET;
}

let warnedDevSecret = false;

function passwordFingerprint() {
  const env = authEnv();
  const passwordHash = env.ADMIN_PASSWORD_SHA256 || process.env.ADMIN_PASSWORD_SHA256;
  const source = passwordHash
    ? `sha256:${passwordHash}`
    : `plain:${env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "124"}`;
  return sha256(source);
}

function authEnv() {
  const envPath = path.join(process.cwd(), ".env");
  try {
    const stat = fs.statSync(envPath);
    if (cachedAuthEnv && cachedAuthEnvMtime === stat.mtimeMs) return cachedAuthEnv;
    const next: Record<string, string> = {};
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      next[key] = unquoteEnv(rest.join("="));
    }
    cachedAuthEnv = next;
    cachedAuthEnvMtime = stat.mtimeMs;
    return next;
  } catch {
    return {};
  }
}

let cachedAuthEnv: Record<string, string> | null = null;
let cachedAuthEnvMtime = 0;

function unquoteEnv(value: string) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
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
