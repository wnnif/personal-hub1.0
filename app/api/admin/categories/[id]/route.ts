import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { removeCategory } from "@/lib/server-data";

export async function DELETE(request: NextRequest, context: { params: Promise<unknown> }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = (await context.params) as { id: string };
  await removeCategory(id);
  return NextResponse.json({ ok: true });
}
