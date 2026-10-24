import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

// GET wish list (own or assigned recipient's)
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const exchangeId = searchParams.get("exchangeId");
    const targetUserId = searchParams.get("userId") || session.id;

    if (!exchangeId) {
      return NextResponse.json({ error: "Exchange ID is required." }, { status: 400 });
    }

    // Authorization: If viewing someone else's wish list, verify that user is our assigned recipient
    // or that both users belong to the same family exchange
    if (targetUserId !== session.id) {
      const assignment = await prisma.giftAssignment.findUnique({
        where: {
          exchangeId_giverId: {
            exchangeId,
            giverId: session.id,
          },
        },
      });

      // Also allow members of the same exchange to view wish lists if exchange rules permit,
      // but primarily authorized for the assigned Secret Santa!
      const isParticipant = await prisma.exchangeParticipant.findUnique({
        where: {
          exchangeId_userId: { exchangeId, userId: session.id },
        },
      });

      if (!isParticipant) {
        return NextResponse.json({ error: "Unauthorized to view this wish list." }, { status: 403 });
      }
    }

    const wishList = await prisma.wishList.findUnique({
      where: {
        exchangeId_userId: { exchangeId, userId: targetUserId },
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      wishList: wishList || {
        notes: "",
        favoriteColors: "",
        sizes: "",
        interests: "",
        items: [],
      },
    });
  } catch (err: unknown) {
    console.error("[Get Wishlist Error]:", err);
    return NextResponse.json({ error: "Failed to load wish list." }, { status: 500 });
  }
}

// POST update own wish list profile preferences
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { exchangeId, notes, favoriteColors, sizes, interests } = await req.json();

    if (!exchangeId) {
      return NextResponse.json({ error: "Exchange ID is required." }, { status: 400 });
    }

    const updated = await prisma.wishList.upsert({
      where: {
        exchangeId_userId: { exchangeId, userId: session.id },
      },
      update: {
        notes: notes?.trim(),
        favoriteColors: favoriteColors?.trim(),
        sizes: sizes?.trim(),
        interests: interests?.trim(),
      },
      create: {
        exchangeId,
        userId: session.id,
        notes: notes?.trim(),
        favoriteColors: favoriteColors?.trim(),
        sizes: sizes?.trim(),
        interests: interests?.trim(),
      },
    });

    return NextResponse.json({ success: true, wishList: updated });
  } catch (err: unknown) {
    console.error("[Update Wishlist Profile Error]:", err);
    return NextResponse.json({ error: "Failed to update wish list." }, { status: 500 });
  }
}
