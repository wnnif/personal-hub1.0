import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { upsertLink } from "@/lib/server-data";
import { sanitizeLink } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  await upsertLink(sanitizeLink(body));
  return NextResponse.json({ ok: true });
}
