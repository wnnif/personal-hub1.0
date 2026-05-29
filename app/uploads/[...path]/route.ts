import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif"
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const filename = parts.join("/");

  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const extension = path.extname(filename).toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(uploadDir, filename);
  if (!filePath.startsWith(uploadDir + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }

    const file = await readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
