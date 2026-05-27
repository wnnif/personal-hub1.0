import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateSettings } from "@/lib/server-data";

export async function PUT(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  await updateSettings(await request.json());
  return NextResponse.json({ ok: true });
}
