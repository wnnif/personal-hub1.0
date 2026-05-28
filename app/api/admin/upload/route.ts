import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 4096;
type ImageExtension = "jpg" | "png" | "webp" | "gif";

/**
 * 通过 magic bytes（文件头）识别真实图片类型，避免仅信任客户端 Content-Type。
 * 返回安全的扩展名；不识别则返回 null。
 */
function detectImageExtension(bytes: Uint8Array): ImageExtension | null {
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

function readImageDimensions(bytes: Buffer, extension: ImageExtension): { width: number; height: number } | null {
  if (extension === "png" && bytes.length >= 24) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  if (extension === "gif" && bytes.length >= 10) {
    return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
  }

  if (extension === "webp" && bytes.length >= 30) {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8 " && bytes.length >= 30) {
      return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L" && bytes.length >= 25) {
      const b0 = bytes[21];
      const b1 = bytes[22];
      const b2 = bytes[23];
      const b3 = bytes[24];
      return { width: 1 + (((b1 & 0x3f) << 8) | b0), height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) };
    }
    if (chunk === "VP8X" && bytes.length >= 30) {
      const width = 1 + bytes.readUIntLE(24, 3);
      const height = 1 + bytes.readUIntLE(27, 3);
      return { width, height };
    }
  }

  if (extension === "jpg") {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2) return null;
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function isAllowedImageDimensions(dimensions: { width: number; height: number } | null) {
  return Boolean(
    dimensions &&
      dimensions.width > 0 &&
      dimensions.height > 0 &&
      dimensions.width <= MAX_IMAGE_DIMENSION &&
      dimensions.height <= MAX_IMAGE_DIMENSION
  );
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

  const dimensions = readImageDimensions(bytes, extension);
  if (!isAllowedImageDimensions(dimensions)) {
    return NextResponse.json(
      { error: `图片尺寸不能超过 ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}，且必须能读取宽高。` },
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
