import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/server-data";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

/**
 * 每日访问去重：同一 IP 当天只算一次。简单内存 Set，单机够用，多实例需共享存储。
 */
const seenToday = new Set<string>();
let seenDate = "";
const MAX_SEEN_IPS_PER_DAY = 50_000;

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

  if (seenDate !== date) {
    seenToday.clear();
    seenDate = date;
  }

  const dedupeKey = `${date}:${ip}`;
  if (seenToday.has(dedupeKey)) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  // 防止大量伪造 IP 导致内存无限增长。超过上限后不再记录新 key，但仍允许真实访问走降级统计。
  if (seenToday.size < MAX_SEEN_IPS_PER_DAY) {
    seenToday.add(dedupeKey);
  }

  try {
    await recordVisit(date);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, mode: "preview" });
  }
}
