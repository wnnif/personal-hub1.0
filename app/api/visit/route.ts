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

  const body = (await request.json().catch(() => ({}))) as { date?: string };
  const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "") ? body.date! : todayKey();

  try {
    // DB 唯一索引 (date, ipHash) 做每日去重；多实例/重启后也不会重复计数。
    await recordVisit(date, ip);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, mode: "preview" });
  }
}
