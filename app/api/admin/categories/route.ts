import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { upsertCategory } from "@/lib/server-data";
import { sanitizeCategory } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  await upsertCategory(sanitizeCategory(body));
  return NextResponse.json({ ok: true });
}
