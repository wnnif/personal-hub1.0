import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { removeLink } from "@/lib/server-data";
import { sanitizeId } from "@/lib/sanitize";

export async function DELETE(request: NextRequest, context: { params: Promise<unknown> }) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = (await context.params) as { id: string };
  const safeId = sanitizeId(id);
  if (!safeId) return NextResponse.json({ error: "无效的 id" }, { status: 400 });
  await removeLink(safeId);
  return NextResponse.json({ ok: true });
}
