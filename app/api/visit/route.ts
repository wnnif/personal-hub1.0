import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/server-data";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);

  // 软限流：同 IP 每分钟最多 30 次访问上报，防止脚本批量刷量。
  const limit = checkRateLimit(`visit:${ip}`, { windowMs: 60 * 1000, max: 30 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  await request.json().catch(() => ({}));

  try {
    // 使用服务器日期，避免客户端伪造 date 刷历史统计。
    await recordVisit(todayKey(), ip);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, mode: "preview" });
  }
}
