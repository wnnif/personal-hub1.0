import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { updateSettings } from "@/lib/server-data";
import { sanitizeSettings } from "@/lib/sanitize";

export async function PUT(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  await updateSettings(sanitizeSettings(body));
  return NextResponse.json({ ok: true });
}
