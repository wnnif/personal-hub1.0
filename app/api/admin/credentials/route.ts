import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { clearSessionCookie, requireAdmin, requireSameOrigin, verifyAdminCredentials } from "@/lib/auth";

const ENV_PATH = path.join(process.cwd(), ".env");

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  const currentPassword = String(body.currentPassword ?? "");
  const email = String(body.email ?? "").trim();
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  if (!verifyAdminCredentials(process.env.ADMIN_EMAIL || "admin", currentPassword)) {
    return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "账号不能为空" }, { status: 400 });
  }

  if (email.length > 80) {
    return NextResponse.json({ error: "账号不能超过 80 个字符" }, { status: 400 });
  }

  if (!/^[^\s"'`]+$/.test(email)) {
    return NextResponse.json({ error: "账号不能包含空格或引号" }, { status: 400 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
  }

  if (newPassword.length > 200) {
    return NextResponse.json({ error: "新密码过长" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "两次输入的新密码不一致" }, { status: 400 });
  }

  const envText = await fs.readFile(ENV_PATH, "utf8");
  const nextEnv = upsertEnv(upsertEnv(removeEnv(envText, "ADMIN_PASSWORD_SHA256"), "ADMIN_EMAIL", email), "ADMIN_PASSWORD", newPassword);
  await fs.writeFile(ENV_PATH, nextEnv);

  const response = NextResponse.json({ ok: true, restartRequired: true });
  clearSessionCookie(response);
  return response;
}

function removeEnv(text: string, key: string) {
  return text
    .split(/\r?\n/)
    .filter((line) => !line.startsWith(`${key}=`))
    .join("\n");
}

function upsertEnv(text: string, key: string, value: string) {
  const line = `${key}=${quoteEnv(value)}`;
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((item) => item.startsWith(`${key}=`));
  if (index >= 0) {
    lines[index] = line;
  } else {
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    lines.push(line);
  }
  return `${lines.join("\n")}\n`;
}

function quoteEnv(value: string) {
  return JSON.stringify(value);
}
