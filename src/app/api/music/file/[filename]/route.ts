import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { statSync, createReadStream } from "fs";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Sanitize filename to avoid path traversal
    const safeFilename = path.basename(filename);
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads", "music"));
    const fullPath = path.join(uploadDir, safeFilename);

    if (!fullPath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: "Audio file not found" }, { status: 404 });
    }

    const stat = statSync(fullPath);
    const fileSize = stat.size;

    // Detect MIME type by extension
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "audio/mpeg";
    if (ext === ".ogg") contentType = "audio/ogg";
    if (ext === ".wav") contentType = "audio/wav";

    const range = req.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = createReadStream(fullPath, { start, end });
      const webStream = Readable.toWeb(fileStream) as ReadableStream;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
        },
      });
    } else {
      const fileStream = createReadStream(fullPath);
      const webStream = Readable.toWeb(fileStream) as ReadableStream;

      return new NextResponse(webStream, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (err: unknown) {
    console.error("[Serve Audio Error]:", err);
    return NextResponse.json({ error: "Error streaming audio file" }, { status: 500 });
  }
}
