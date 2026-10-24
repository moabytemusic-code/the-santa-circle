import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { saveAudioTrack, deleteAudioTrack } from "@/lib/music/storage";
import { MusicCategory } from "@prisma/client";

// GET all active tracks
export async function GET() {
  try {
    const tracks = await prisma.musicTrack.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        artist: true,
        category: true,
        source: true,
        filePath: true,
        duration: true,
        sortOrder: true,
      },
    });

    return NextResponse.json(tracks);
  } catch (err: unknown) {
    console.error("[Get Music Error]:", err);
    return NextResponse.json({ error: "Failed to load music tracks." }, { status: 500 });
  }
}

// POST upload new track (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can upload music." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const artist = formData.get("artist") as string | null;
    const category = (formData.get("category") as string | null) || "FESTIVE";
    const isDefault = formData.get("isDefault") === "true";

    if (!file || !title) {
      return NextResponse.json({ error: "Audio file and title are required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate and save to persistent storage
    const { filePath, relativePath, mimeType } = await saveAudioTrack(buffer, file.name);

    if (isDefault) {
      // Reset any previous default track
      await prisma.musicTrack.updateMany({
        data: { sortOrder: 0 },
      });
    }

    const track = await prisma.musicTrack.create({
      data: {
        title: title.trim(),
        artist: artist?.trim() || "Uploaded Holiday Music",
        category: (category as MusicCategory) || "FESTIVE",
        source: "UPLOADED",
        filePath: relativePath, // API route for playback
        mimeType,
        uploadedById: session.id,
        sortOrder: isDefault ? -1 : 0,
      },
    });

    return NextResponse.json({ success: true, track });
  } catch (err: unknown) {
    console.error("[Upload Music Error]:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed." }, { status: 500 });
  }
}

// PATCH toggle or set default track (Admin only)
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can configure music settings." }, { status: 403 });
    }

    const body = await req.json();
    const { id, isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: "Track ID is required." }, { status: 400 });
    }

    if (isDefault) {
      // Set this track as default (sortOrder: -1) and reset others to 0
      await prisma.$transaction([
        prisma.musicTrack.updateMany({
          data: { sortOrder: 0 },
        }),
        prisma.musicTrack.update({
          where: { id },
          data: { sortOrder: -1 },
        }),
      ]);
    } else {
      await prisma.musicTrack.update({
        where: { id },
        data: { sortOrder: 0 },
      });
    }

    return NextResponse.json({ success: true, message: "Default track updated successfully." });
  } catch (err: unknown) {
    console.error("[Update Music Error]:", err);
    return NextResponse.json({ error: "Failed to update default track." }, { status: 500 });
  }
}

// DELETE track (Admin only)
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Track ID is required." }, { status: 400 });

    const track = await prisma.musicTrack.findUnique({
      where: { id },
    });

    if (!track) return NextResponse.json({ error: "Track not found." }, { status: 404 });

    // If custom uploaded, remove file from disk
    if (track.source === "UPLOADED" && track.filePath) {
      const filename = track.filePath.split("/").pop();
      if (filename) {
        const fullDiskPath = `${process.env.UPLOAD_DIR || "./uploads/music"}/${filename}`;
        await deleteAudioTrack(fullDiskPath);
      }
    }

    await prisma.musicTrack.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[Delete Music Error]:", err);
    return NextResponse.json({ error: "Failed to delete track." }, { status: 500 });
  }
}
