import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 通过 magic bytes（文件头）识别真实图片类型，避免仅信任客户端 Content-Type。
 * 返回安全的扩展名；不识别则返回 null。
 */
function detectImageExtension(bytes: Uint8Array): "jpg" | "png" | "webp" | "gif" | null {
  if (bytes.length < 12) return null;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  // GIF: "GIF87a" or "GIF89a"
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "gif";
  // WEBP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  // 上传也限流，避免管理员被盗号后被批量灌满磁盘。
  const ip = clientIp(request.headers);
  const limit = checkRateLimit(`upload:${ip}`, { windowMs: 60 * 1000, max: 30 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `上传过于频繁，请 ${limit.retryAfter} 秒后再试。` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择要上传的图片文件。" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "图片不能超过 5MB。" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = detectImageExtension(bytes);
  if (!extension) {
    return NextResponse.json(
      { error: "仅支持 JPG、PNG、WebP、GIF 图片，且必须是真实图片文件。" },
      { status: 400 }
    );
  }

  // 文件名仅使用随机后缀，避免基于客户端输入的路径注入。
  const filename = `avatar-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, filename);

  // 双重保险：确认目标路径仍在 uploadDir 之内。
  if (!uploadPath.startsWith(uploadDir + path.sep)) {
    return NextResponse.json({ error: "非法文件名。" }, { status: 400 });
  }

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, bytes);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    path: `public/uploads/${filename}`,
    filename
  });
}
