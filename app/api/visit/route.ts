import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/server-data";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { date?: string };
  const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "") ? body.date : undefined;

  await recordVisit(date);
  return NextResponse.json({ ok: true });
}
