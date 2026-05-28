type Bucket = { hits: number[]; blockedUntil?: number; lastSeen: number };

const buckets = new Map<string, Bucket>();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_BUCKETS = 10_000;
let lastCleanup = 0;

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  /** 命中阈值后追加的封禁时长（毫秒）。默认等于 windowMs。 */
  blockMs?: number;
}

export function checkRateLimit(key: string, options: RateLimitOptions): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  cleanupBuckets(now);

  const bucket = buckets.get(key) ?? { hits: [], lastSeen: now };
  bucket.lastSeen = now;

  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    buckets.set(key, bucket);
    return { ok: false, retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }

  bucket.hits = bucket.hits.filter((ts) => ts > now - options.windowMs);
  bucket.hits.push(now);

  if (bucket.hits.length > options.max) {
    bucket.blockedUntil = now + (options.blockMs ?? options.windowMs);
    buckets.set(key, bucket);
    return { ok: false, retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }

  buckets.set(key, bucket);
  return { ok: true };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/**
 * 取请求方 IP，优先信任反向代理转发头。仅用于限流键，不做安全决策。
 */
export function clientIp(headers: Headers, fallback = "unknown") {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || fallback;
  }
  return headers.get("x-real-ip") || fallback;
}

function cleanupBuckets(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS && buckets.size <= MAX_BUCKETS) return;
  lastCleanup = now;

  for (const [key, bucket] of buckets) {
    const lastHit = bucket.hits[bucket.hits.length - 1] ?? bucket.lastSeen;
    const stillBlocked = bucket.blockedUntil && bucket.blockedUntil > now;
    if (!stillBlocked && now - lastHit > 60 * 60 * 1000) {
      buckets.delete(key);
    }
  }

  // 极端情况下仍超过上限时，按最后访问时间淘汰最旧的 bucket，避免内存无限增长。
  if (buckets.size > MAX_BUCKETS) {
    const overflow = buckets.size - MAX_BUCKETS;
    const oldestKeys = [...buckets.entries()]
      .sort((a, b) => a[1].lastSeen - b[1].lastSeen)
      .slice(0, overflow)
      .map(([key]) => key);
    for (const key of oldestKeys) buckets.delete(key);
  }
}
