import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, requireSameOrigin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
