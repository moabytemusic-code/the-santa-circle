import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ProgressStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const exchangeId = searchParams.get("exchangeId");

    if (!exchangeId) {
      return NextResponse.json({ error: "Exchange ID is required." }, { status: 400 });
    }

    const progress = await prisma.giftProgress.findUnique({
      where: {
        exchangeId_giverId: {
          exchangeId,
          giverId: session.id,
        },
      },
    });

    return NextResponse.json({
      progress: progress || { status: "PLANNING", notes: "" },
    });
  } catch (err: unknown) {
    console.error("[Get Progress Error]:", err);
    return NextResponse.json({ error: "Failed to get progress." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { exchangeId, status, notes } = await req.json();

    if (!exchangeId || !status) {
      return NextResponse.json({ error: "Exchange ID and status are required." }, { status: 400 });
    }

    const updated = await prisma.giftProgress.upsert({
      where: {
        exchangeId_giverId: {
          exchangeId,
          giverId: session.id,
        },
      },
      update: {
        status: status as ProgressStatus,
        notes: notes !== undefined ? notes : undefined,
      },
      create: {
        exchangeId,
        giverId: session.id,
        status: status as ProgressStatus,
        notes,
      },
    });

    return NextResponse.json({ success: true, progress: updated });
  } catch (err: unknown) {
    console.error("[Update Progress Error]:", err);
    return NextResponse.json({ error: "Failed to update gift progress." }, { status: 500 });
  }
}
