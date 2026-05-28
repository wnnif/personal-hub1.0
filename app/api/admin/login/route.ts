import { NextRequest, NextResponse } from "next/server";
import { isUsingDefaultPassword, requireSameOrigin, setSessionCookie, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // 1. CSRF 防护：拒绝跨站发起的登录尝试。
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  // 2. 限流：每 IP 每 15 分钟内最多 10 次失败尝试，超出后封禁 15 分钟。
  const ip = clientIp(request.headers);
  const limit = checkRateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `登录尝试过于频繁，请 ${limit.retryAfter} 秒后再试。` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };

  if (!verifyAdminCredentials(body.email ?? "", body.password ?? "")) {
    return NextResponse.json({ error: "账号或密码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    // 提示前端在登录后引导用户立即修改默认密码。
    mustChangePassword: isUsingDefaultPassword()
  });
  setSessionCookie(response);
  return response;
}
