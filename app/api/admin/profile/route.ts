import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateProfile } from "@/lib/server-data";

export async function PUT(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  await updateProfile(body.profile, body.socials, body.featuredLinks);
  return NextResponse.json({ ok: true });
}
