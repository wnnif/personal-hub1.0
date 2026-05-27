import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { removeLink } from "@/lib/server-data";

export async function DELETE(request: NextRequest, context: { params: Promise<unknown> }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = (await context.params) as { id: string };
  await removeLink(id);
  return NextResponse.json({ ok: true });
}
