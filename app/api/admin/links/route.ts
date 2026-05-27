import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { upsertLink } from "@/lib/server-data";

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  await upsertLink(await request.json());
  return NextResponse.json({ ok: true });
}
