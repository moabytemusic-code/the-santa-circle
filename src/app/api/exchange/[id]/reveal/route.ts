import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in to reveal your recipient." }, { status: 401 });
    }

    const { id: exchangeId } = await params;

    // Fetch assignment strictly matching the logged in user as the GIVER
    const assignment = await prisma.giftAssignment.findUnique({
      where: {
        exchangeId_giverId: {
          exchangeId,
          giverId: session.id,
        },
      },
      include: {
        exchange: {
          select: {
            id: true,
            name: true,
            year: true,
            budget: true,
            currency: true,
            exchangeDate: true,
            instructions: true,
            status: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({
        error: "No assignment found. The names may not have been drawn yet, or you may not be a confirmed participant in this exchange.",
      }, { status: 404 });
    }

    // Mark revealedAt timestamp if first time unwrapping
    if (!assignment.revealedAt) {
      await prisma.giftAssignment.update({
        where: { id: assignment.id },
        data: { revealedAt: new Date() },
      });
    }

    // Fetch recipient's wish list
    const wishList = await prisma.wishList.findUnique({
      where: {
        exchangeId_userId: {
          exchangeId,
          userId: assignment.recipient.id,
        },
      },
      include: {
        items: {
          orderBy: { priority: "desc" },
        },
      },
    });

    // Fetch giver's personal gift progress checklist (Private to giver!)
    const progress = await prisma.giftProgress.findUnique({
      where: {
        exchangeId_giverId: {
          exchangeId,
          giverId: session.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      exchange: assignment.exchange,
      recipient: assignment.recipient,
      revealedAt: assignment.revealedAt || new Date(),
      wishList: wishList || {
        notes: null,
        favoriteColors: null,
        sizes: null,
        interests: null,
        items: [],
      },
      progress: progress || {
        status: "PLANNING",
        notes: null,
      },
    });
  } catch (err: unknown) {
    console.error("[Reveal API Error]:", err);
    return NextResponse.json({ error: "Failed to load assignment." }, { status: 500 });
  }
}
