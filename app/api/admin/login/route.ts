import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!verifyAdminCredentials(body.email ?? "", body.password ?? "")) {
    return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookie(response);
  return response;
}
