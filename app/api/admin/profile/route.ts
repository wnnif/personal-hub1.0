import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { updateProfile } from "@/lib/server-data";
import { sanitizeProfilePayload } from "@/lib/sanitize";

export async function PUT(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const { profile, socials, featuredLinks } = sanitizeProfilePayload(body);
  await updateProfile(profile, socials, featuredLinks);
  return NextResponse.json({ ok: true });
}
